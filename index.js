const express = require("express");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const { db } = require("./lib/blockDB");
const { ref, set, get, remove, child } = require("firebase/database");
const config = require("./config");
const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  delay,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

const {
  initSessions,
  saveSession,
  getAllSessions,
  deleteSession,
} = require("./lib");
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
    // ✅ Prevent duplicate start
    if (sessions[number]) {
      console.log(`⚠️ Bot for ${number} is already running. Skipping...`);
      return sessions[number];
    }

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
      //   await sendConnectionNotification(number, conn);
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

    // await notifyDeveloper(errorMessage, DEV_NUMBER);
  }
}

/**
 * Restore all sessions from DB + local
 */
async function restoreSessions() {
  try {
    console.log("🌱 Syncing Database");
    await config.DATABASE.sync();

    const baseDir = path.join(__dirname, "sessions");
    await fs.ensureDir(baseDir);

    // 1️⃣ Get sessions from DB
    const dbSessions = await getAllSessions();
    const dbNumbers = dbSessions.map((s) => s.number);

    // 2️⃣ Get sessions from local folder
    const folderNumbers = (await fs.readdir(baseDir)).filter((f) =>
      fs.existsSync(path.join(baseDir, f, "creds.json"))
    );

    // 3️⃣ Merge DB + Folder (avoid duplicates)
    const allNumbers = [...new Set([...dbNumbers, ...folderNumbers])];

    if (!allNumbers.length) {
      console.log("⚠️ No sessions found in DB or local folders.");
      return;
    }

    console.log(
      `♻️ Restoring ${
        allNumbers.length
      } sessions at ${new Date().toLocaleString()}...`
    );

    for (const number of allNumbers) {
      try {
        // ✅ Skip if already running
        if (sessions[number]) {
          console.log(
            `⚠️ Session for ${number} is already active, skipping...`
          );
          continue;
        }

        const sessionDir = path.join(baseDir, number);
        await fs.ensureDir(sessionDir);
        const credPath = path.join(sessionDir, "creds.json");

        let creds;

        // 4️⃣ If folder has creds.json → use it
        if (fs.existsSync(credPath)) {
          creds = await fs.readJSON(credPath);
          // Update DB copy
          await saveSession(number, creds);
        }
        // 5️⃣ Else if DB has creds → write it to folder
        else {
          const dbSession = dbSessions.find((s) => s.number === number);
          if (dbSession?.creds) {
            creds = dbSession.creds;
            await fs.writeJSON(credPath, creds, { spaces: 2 });
          }
        }

        // 6️⃣ Start the bot
        if (creds) {
          console.log(`🔄 Restoring session for ${number}...`);
          await startBot(number);
        } else {
          console.log(`⚠️ No creds found for ${number}, skipping...`);
        }
      } catch (err) {
        console.error(`❌ Failed restoring session for ${number}:`, err);
      }
    }
  } catch (err) {
    console.error("❌ restoreSessions() failed:", err);
  }
}

// 🔹 Block user
// 🔹 Block user and delete session
app.get("/block", async (req, res) => {
  let num = req.query.number;
  if (!num)
    return res.status(400).send({ error: "Please provide ?number=XXXXXXXXXX" });

  num = num.replace(/[^0-9]/g, ""); // sanitize

  try {
    // 🔹 Mark user as blocked in DB
    await set(ref(db, "blocked/" + num), { blocked: true });

    // 🔹 Check if session folder exists
    const sessionPath = path.join(__dirname, "sessions", num);
    if (fs.existsSync(sessionPath)) {
      // Notify developer (optional)
      const deletionMessage = `Your bot has been logged out and removed.\n\n_session ${num} has been removed from the system_`;
      // await notifyDeveloper(deletionMessage, num);

      // Delete session from memory and filesystem
      if (sessions[num]) delete sessions[num];
      await deleteSession(num).catch(() => {}); // ignore if already deleted
      await fs.remove(sessionPath);

      return res.send({
        status: "success",
        message: `${num} blocked & session deleted`,
      });
    } else {
      // If no session folder found
      return res.send({
        status: "success",
        message: `${num} blocked (no session folder found)`,
      });
    }
  } catch (err) {
    console.error(`❌ Failed to block/delete session for ${num}:`, err);
    return res.status(500).send({
      status: "error",
      message: "Failed to block/delete session",
      error: err.message,
    });
  }
});

// 🔹 Unblock user
app.get("/unblock", async (req, res) => {
  let num = req.query.number;
  if (!num) return res.send({ error: "Please provide ?number=XXXXXXXXXX" });

  num = num.replace(/[^0-9]/g, "");
  try {
    await remove(ref(db, "blocked/" + num));
    res.send({ success: true, message: `${num} unblocked` });
  } catch (err) {
    res.send({ error: err.message });
  }
});

// 🔹 Get blocklist
app.get("/blocklist", async (req, res) => {
  try {
    const snapshot = await get(ref(db, "blocked"));
    if (snapshot.exists()) {
      res.send(snapshot.val());
    } else {
      res.send({});
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});
// 🔹 Get pairing code
app.get("/pair", async (req, res) => {
  let num = req.query.number;
  if (!num) return res.send({ error: "Please provide ?number=XXXXXXXXXX" });

  num = num.replace(/[^0-9]/g, ""); // clean number

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "blocked/" + num));
    if (snapshot.exists()) {
      return res.send({ error: `User ${num} is ban` });
    }

    const { state, saveCreds } = await useMultiFileAuthState(
      `./sessions/${num}`
    );
    let sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "silent" })
        ),
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
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async ({ connection }) => {
      if (connection === "close") {
        console.log(`🔗 Device paired: ${num}`);
        await delay(1500);

        try {
          // await notifyDeveloper(pairingMessage, num);
          startBot(num);
        } catch (error) {
          console.error(`❌ Failed to start bot for ${num}:`, error.message);
        }
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
      return res.send({
        status: "error",
        message: "No session found for this number",
      });
    }

    const deletionMessage = `Your bot has been logged out and removed.\n\n_session ${num} has been removed from the system_`;
    //  await notifyDeveloper(deletionMessage, num);

    await deleteSession(num);
    delete sessions[num];
    await fs.remove(sessionPath);

    res.send({
      status: "success",
      message: `Deleted session folder for ${num}`,
    });

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

  //  await initializeNotificationConnection();
  await restoreSessions();
  await initSessions();
});

module.exports = { notifysend };
