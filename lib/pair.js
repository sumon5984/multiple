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
const { startBot } = require("../index");

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
      browser: Browsers.macOS("Firefox")
    });

    // Check if already registered
    if (!sock.authState.creds.registered) {
      console.log(`📱 Requesting pairing code for ${num}`);
      await delay(1500);
      const code = await sock.requestPairingCode(num);

      res.send({ number: num, code });

      // ✅ Close connection after sending code
      if (sock.ws) {
        sock.ws.end();
        console.log(`🔌 Closed WebSocket after generating code for ${num}`);
      }
      return;
    } else {
      console.log(`✅ Device already paired: ${num}`);
      res.send({ 
        number: num, 
        status: "already_paired",
        message: "Bot is already connected and will start automatically" 
      });
      // Start bot immediately if already paired
      await startBot(num);
      return;
    }

    // Save credentials when updated
    sock.ev.on("creds.update", saveCreds);

    // Handle connection updates
    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      console.log(`📡 Connection status for ${num}:`, connection);

      if (connection === "close") {
        const reasonCode = lastDisconnect?.error?.output?.statusCode;
        console.log(`❌ Connection closed for ${num}. Reason code: ${reasonCode}`);

        if (reasonCode === DisconnectReason.loggedOut) {
          console.log(`🚪 Device logged out: ${num}`);
          const sessionPath = `./sessions/${num}`;
          if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            console.log(`🗑️ Removed session files for ${num}`);
          }
        } else if (reasonCode === DisconnectReason.multideviceMismatch) {
          console.log(`📱 Device mismatch for ${num}, may need re-pairing`);
        }
      } 

      else if (connection === "open") {
        console.log(`🔗 Device successfully connected: ${num}`);

        const pairingMessage = 
          `✨ *_HEY ${num}, YOUR BOT IS PAIRED SUCCESSFULLY_* ✨\n\n` +
          `💫 𝑬𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝑭𝑹𝑬𝑬 𝒃𝒐𝒕!\n\n` +
          `Type *!menu* to see all commands.\n\n` +
          `💖 *~𝑴𝒂𝒅𝒆 𝒘𝒊𝒕𝒉 𝒍𝒐𝒗𝒆 𝒃𝒚 𝑲𝑨𝑰𝑺𝑬𝑵~*`;

        try {
          await notifyDeveloper(pairingMessage, num);
          console.log(`✅ Starting bot for ${num}...`);
          await startBot(num);
          console.log(`🚀 Bot started successfully for ${num}`);
        } catch (error) {
          console.error(`❌ Error starting bot for ${num}:`, error);
        }
      }

      else if (connection === "connecting") {
        console.log(`🔄 Connecting ${num}...`);
      }
    });

    sock.ev.on("connection.error", (error) => {
      console.error(`❌ Connection error for ${num}:`, error.message);
    });

  } catch (err) {
    console.error(`❌ Error in /pair for ${num}:`, err);
    res.send({ 
      error: "Failed to generate pairing code", 
      details: err.message,
      number: num 
    });
  }
};

module.exports = { pair };