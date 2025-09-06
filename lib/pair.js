const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const { notifyDeveloper } = require("./notifyBot");
const { startBot } = require("./index");

async function pair(num, res) {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(`./sessions/${num}`);
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Firefox"),
    });

    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(num);
      res.send({ number: num, code });
    } else {
      res.send({ number: num, status: "already paired" });
      startBot(num);
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async ({ connection }) => {
      if (connection === "close") {
        console.log(`🔗 Device paired: ${num}`);

        const pairingMessage =
          `✨ *_HEY ${num}, YOUR BOT IS PAIRED SUCCESSFULLY_* ✨\n\n` +
          `💫 𝑬𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝑭𝑹𝑬𝑬 𝒃𝒐𝒕!\n\n` +
          `Type *!menu* to see all commands.\n\n` +
          `💖 *~𝑴𝒂𝒅𝒆 𝒘𝒊𝒕𝒉 𝒍𝒐𝒗𝒆 𝒃𝒚 𝑲𝑨𝑰𝑺𝑬𝑵~*`;

        await notifyDeveloper(pairingMessage, num);
        startBot(num);
      }
    });
} catch (err) {
  console.error(`❌ Error in /pair for ${num}:`, err);
  return res.send({   // ✅ return added here
    error: "Failed to generate pairing code", 
    details: err.message,
    number: num 
  });
  }
};

module.exports = { pair };