/*const { initSessions, saveSession, getAllSessions, deleteSession } = require("./lib");
const express = require("express");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const config = require('./config');
const { 
  makeWASocket, 
  useMultiFileAuthState, 
  Browsers, 
  delay,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const dev = '917439489057'

const { WhatsApp } = require("./lib/client");
const { notifyDeveloper, sendConnectionNotification, sendDisconnectionNotification, initializeNotificationConnection } = require("./lib/notifyBot");
const app = express();
const PORT = process.env.PORT || 8000;
const sessions = {};

async function startBot(number) {
  try { 
  
    const sessionDir = path.join(__dirname, "sessions", number);

    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    
    const bot = new WhatsApp(number);
    const conn = await bot.connect();
    sessions[number] = conn;
    console.log(`✅ Bot started for ${number}`);
    const credPath = path.join(sessionDir, "creds.json");
      if (fs.existsSync(credPath)) {
        const creds = fs.readJSONSync(credPath);
        await saveSession(number, creds);
      }

    if (conn && conn.user) {
      await sendConnectionNotification(number, conn);
    }
    
    return conn;
  } catch (e) {
    console.error(`❌ Failed to start bot for ${number}:`, e);
    
    // Send error notification
    const errorMessage = `🚨 *BOT START FAILED*\n\n` +
      `👤 *User:* ${number}\n` +
      `❌ *Error:* ${e.message}\n` +
      `🕐 *Time:* ${new Date().toLocaleString()}\n\n` +
      `_Bot failed to start, user may need assistance_`;
    await notifyDeveloper(errorMessage, dev);
  }
}



async function restoreSessions() {
  try {
     console.log("🌱 Syncing Database");
    await config.DATABASE.sync();
    const all = await getAllSessions(); // fetch all from DB
    if (!all || all.length === 0) {
      console.log("⚠️ No sessions found in DB to restore.");
      return;
    }

    console.log(`♻️ Restoring ${all.length} sessions from DB at ${new Date().toLocaleString()}...`);

    for (const s of all) {
      try {
        const sessionDir = path.join(__dirname, "sessions", s.number);
        await fs.ensureDir(sessionDir);

        // write creds.json back to local dir
        const credPath = path.join(sessionDir, "creds.json");
        await fs.writeJSON(credPath, s.creds, { spaces: 2 });

        console.log(`🔄 Restoring session for ${s.number}...`);
        await startBot(s.number);
      } catch (err) {
        console.error(`❌ Failed restoring session for ${s.number}:`, err);
      }
    }
  } catch (err) {
    console.error("❌ restoreSessions() failed:", err);
  }
}

// 🔹 Route: Generate pairing code
app.get("/pair", async (req, res) => {
  let num = req.query.number;
  if (!num) return res.send({ error: "Please provide ?number=XXXXXXXXXX" });

  num = num.replace(/[^0-9]/g, ""); // clean number

  try {
    const { state, saveCreds } = await useMultiFileAuthState(`./sessions/${num}`);
    let sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
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
      startBot(num); // start bot if already paired
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async ({ connection }) => {
      if (connection === "close") {
        console.log(`🔗 Device paired: ${num}`);

      const pairingMessage = `✨ *_HEY ${num}, YOUR BOT IS PAIRED SUCCESSFULLY_* ✨\n\n` +
  `💫 𝑬𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝑭𝑹𝑬𝑬 𝒃𝒐𝒕!\n\n` +
  `Type *!menu* to see all commands.\n\n` +
  `💖 *~𝑴𝒂𝒅𝒆 𝒘𝒊𝒕𝒉 𝒍𝒐𝒗𝒆 𝒃𝒚 𝑲𝑨𝑰𝑺𝑬𝑵~*`;
        await notifyDeveloper(pairingMessage, num);
        
        startBot(num);
      }
    });

  } catch (err) {
    console.error("Error in /pair:", err);
    res.send({ error: "Failed to generate pairing code" });
  }
});

// 🔹 Route: List active sessions
app.get("/sessions", (req, res) => {
  const sessionStatus = {};
  for (const [num, conn] of Object.entries(sessions)) {
    sessionStatus[num] = {
      connected: conn && conn.user ? true : false,
      user: conn?.user?.id || 'unknown'
    };
  }
  res.send({ 
    active: Object.keys(sessions),
    status: sessionStatus 
  });
});

// 🔹 Route: Delete session folder only (without logout)
app.get("/delete", async (req, res) => {
  let num = req.query.number;
  if (!num) return res.send({ error: "Please provide ?number=XXXXXXXXXX" });
  num = num.replace(/[^0-9]/g, "");

  try {
    const sessionPath = path.join(__dirname, "sessions", num);
    if (fs.existsSync(sessionPath)) {
      // Send deletion notification before removing
      const deletionMessage = `🙂 your bot logout remove\n\n` +

        `_session ${num} has been removed system_`;
      await notifyDeveloper(deletionMessage, num);
      
      // Remove from active sessions
       await deleteSession(num);
      delete sessions[num];
      
      fs.removeSync(sessionPath);
      res.send({ status: "success", message: `Deleted session folder for ${num}` });

       setTimeout(() => {
        process.exit(0);
      }, 5000);
      
    } else {
      res.send({ status: "error", message: "No session found for this number" });
    }
  } catch (err) {
    console.error(`❌ Failed to delete session for ${num}:`, err);
    res.send({ status: "error", message: "Failed to delete session" });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initializeNotificationConnection();

  await initSessions();       // ensure sessions table exists
  await restoreSessions();    // restore from DB
});

const { notifysend } = require("./lib/notifyBot");
module.exports = { notifysend };

*/


const express = require("express");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const config = require("./config");
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const { initSessions, saveSession, getAllSessions, deleteSession } = require("./lib");
const { WhatsApp } = require("./lib/client");
const {
  notifyDeveloper,
  sendConnectionNotification,
  initializeNotificationConnection,
  notifysend,
} = require("./lib/notifyBot");

const app = express();
const PORT = process.env.PORT || 8000;
const sessions = {};
const DEV_NUMBER = "917439489057";

/**
 * Start a bot instance for a given number
 */
async function startBot(number) {
  try {
    const sessionDir = path.join(__dirname, "sessions", number);
    await fs.ensureDir(sessionDir);

    const bot = new WhatsApp(number);
    const conn = await bot.connect();
    sessions[number] = conn;

    console.log(`✅ Bot started for ${number}`);

    // Save session to DB if creds.json exists
    const credPath = path.join(sessionDir, "creds.json");
    if (fs.existsSync(credPath)) {
      const creds = fs.readJSONSync(credPath);
      await saveSession(number, creds);
    }

    if (conn?.user) {
      await sendConnectionNotification(number, conn);
    }

    return conn;
  } catch (err) {
    console.error(`❌ Failed to start bot for ${number}:`, err);

    const errorMessage =
      `🚨 *BOT START FAILED*\n\n` +
      `👤 *User:* ${number}\n` +
      `❌ *Error:* ${err.message}\n` +
      `🕐 *Time:* ${new Date().toLocaleString()}\n\n` +
      `_Bot failed to start, user may need assistance_`;

    await notifyDeveloper(errorMessage, DEV_NUMBER);
  }
}

/**
 * Restore all sessions from DB
 */
async function restoreSessions() {
  try {
    console.log("🌱 Syncing Database");
    await config.DATABASE.sync();

    const all = await getAllSessions();
    if (!all?.length) {
      console.log("⚠️ No sessions found in DB to restore.");
      return;
    }

    console.log(`♻️ Restoring ${all.length} sessions from DB at ${new Date().toLocaleString()}...`);

    for (const s of all) {
      try {
        const sessionDir = path.join(__dirname, "sessions", s.number);
        await fs.ensureDir(sessionDir);

        // Write creds.json locally
        const credPath = path.join(sessionDir, "creds.json");
        await fs.writeJSON(credPath, s.creds, { spaces: 2 });

        console.log(`🔄 Restoring session for ${s.number}...`);
        await startBot(s.number);
      } catch (err) {
        console.error(`❌ Failed restoring session for ${s.number}:`, err);
      }
    }
  } catch (err) {
    console.error("❌ restoreSessions() failed:", err);
  }
}

/**
 * Route: Generate pairing code
 */
app.get("/pair", async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g, "");
  if (!num) return res.send({ error: "Please provide ?number=XXXXXXXXXX" });

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
    console.error("Error in /pair:", err);
    res.send({ error: "Failed to generate pairing code" });
  }
});

/**
 * Route: List active sessions
 */
app.get("/sessions", (req, res) => {
  const sessionStatus = {};
  for (const [num, conn] of Object.entries(sessions)) {
    sessionStatus[num] = {
      connected: !!conn?.user,
      user: conn?.user?.id || "unknown",
    };
  }
  res.send({
    active: Object.keys(sessions),
    status: sessionStatus,
  });
});

/**
 * Route: Delete session
 */
app.get("/delete", async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g, "");
  if (!num) return res.send({ error: "Please provide ?number=XXXXXXXXXX" });

  try {
    const sessionPath = path.join(__dirname, "sessions", num);

    if (!fs.existsSync(sessionPath)) {
      return res.send({ status: "error", message: "No session found for this number" });
    }

    const deletionMessage = `🙂 Your bot has been logged out and removed.\n\n_session ${num} has been removed from the system_`;
    await notifyDeveloper(deletionMessage, num);

    await deleteSession(num);
    delete sessions[num];
    await fs.remove(sessionPath);

    res.send({ status: "success", message: `Deleted session folder for ${num}` });

    setTimeout(() => process.exit(0), 5000);
  } catch (err) {
    console.error(`❌ Failed to delete session for ${num}:`, err);
    res.send({ status: "error", message: "Failed to delete session" });
  }
});

/**
 * Start Express server
 */
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  await initializeNotificationConnection();
  await initSessions();
  await restoreSessions();
});

module.exports = { notifysend };