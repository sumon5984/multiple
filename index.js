const express = require("express");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const { db } = require("./lib/blockDB");
const { ref, set, get, remove, child } = require("firebase/database");
const config = require("./config");
const NodeCache = require("node-cache");
const { Mutex } = require("async-mutex");
const mutex = new Mutex();
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
const manager = require("./lib/manager");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var session;
const msgRetryCounterCache = new NodeCache();

async function isBlocked(number) {
  try {
    const snapshot = await get(child(ref(db), `blocked/${number}`));
    return snapshot.exists();
  } catch (err) {
    console.error("Error checking block status:", err);
    return false;
  }
}

async function connector(Num, res) {
  const sessionDir = path.join(__dirname, "sessions", Num);
  await fs.ensureDir(sessionDir);
  var { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  session = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino({ level: "fatal" }).child({ level: "fatal" })
      ),
    },
    logger: pino({ level: "fatal" }).child({ level: "fatal" }),
    browser: Browsers.macOS("Safari"),
    markOnlineOnConnect: false,
    msgRetryCounterCache,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: false,
  });
  if (!session.authState.creds.registered) {
    await delay(1500);
    Num = Num.replace(/[^0-9]/g, "");
    var code = await session.requestPairingCode(Num);
    console.log(`📱 Pairing code for ${Num}: ${code}`);
    res.send({
      status: "success",
      code: code?.match(/.{1,4}/g)?.join("-"),
      number: Num,
      message: "Enter this code in WhatsApp: Link a Device",
    });
  }
  session.ev.on("creds.update", async () => {
    try {
      await saveCreds();
    } catch (err) {
      console.error(`❌ Failed to save credentials file for ${Num}:`, err);
    }
  });
  session.ev.on("connection.update", async (update) => {
    var { connection, lastDisconnect } = update;
    if (connection === "open") {
      const release = await mutex.acquire();
      try {
        if (manager.isConnected(Num) || manager.isConnecting(Num)) {
          return;
        }

        await delay(3000);
        if (session) {
          session.end();
          session = null;
        }
        await delay(5000);
        await startBot(Num);
      } catch (err) {
        console.error(`❌ Failed to start bot for ${Num}:`, err.message);
        console.error(err.stack);
      } finally {
        release();
      }
    } else if (connection === "close") {
      var reason = lastDisconnect?.error?.output?.statusCode;
      reconn(reason, Num, res);
    }
  });
}
function reconn(reason, Num, res) {
  if (
    [
      DisconnectReason.connectionLost,
      DisconnectReason.connectionClosed,
      DisconnectReason.restartRequired,
    ].includes(reason)
  ) {
    connector(Num, res);
  } else {
    if (session) {
      session.end();
      session = null;
    }
  }
}

/**
 * Start a bot instance for a given number
 */
async function startBot(number) {
  try {
    const sessionDir = path.join(__dirname, "sessions", number);
    await fs.ensureDir(sessionDir);
    const bot = new WhatsApp(number);
    const conn = await bot.connect();
    const credPath = path.join(sessionDir, "creds.json");
    if (fs.existsSync(credPath)) {
      const creds = fs.readJSONSync(credPath);
      await saveSession(number, creds);
    }
    return conn;
  } catch (err) {
    console.error(`❌ Failed to start bot for ${number}:`, err);
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
        const sessionDir = path.join(baseDir, number);
        await fs.ensureDir(sessionDir);
        const credPath = path.join(sessionDir, "creds.json");
        let creds;
        if (fs.existsSync(credPath)) {
          creds = await fs.readJSON(credPath);
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
          await deleteSession(number);
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

app.get("/", (req, res) => {
  res.json({
    status: "online",
  });
});
// 🔹 Block user and delete session
app.get("/block", async (req, res) => {
  let num = req.query.number;
  if (!num)
    return res.status(400).send({ error: "Please provide ?number=XXXXXXXXXX" });

  num = num.replace(/[^0-9]/g, "");
  try {
    // 🔹 Mark user as blocked in DB
    await set(ref(db, "blocked/" + num), { blocked: true });

    // 🔹 Check if session folder exists
    const sessionPath = path.join(__dirname, "sessions", num);
    if (fs.existsSync(sessionPath)) {
      if (sessions[num]) delete sessions[num];
      await deleteSession(num).catch(() => {}); // ignore if already deleted
      await fs.remove(sessionPath);
      manager.removeConnection(num);
      manager.removeConnecting(num);

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
  var Num = req.query.code;
  if (!Num) {
    return res.status(418).json({
      status: "error",
      message: "Phone number is required. Use: /pair?code=1234567890",
    });
  }

  // Sanitize number
  Num = Num.replace(/[^0-9]/g, "");

  if (!Num || Num.length < 10) {
    return res.status(400).json({
      status: "error",
      message: "Invalid phone number format",
    });
  }

  // Check if already blocked
  try {
    const blocked = await isBlocked(Num);
    if (blocked) {
      return res.status(403).json({
        status: "error",
        message: "This number is blocked",
      });
    }
  } catch (err) {
    console.error(`Error checking block status for ${Num}:`, err);
  }

  // Check if already connected
  if (manager.isConnected(Num)) {
    return res.status(409).json({
      status: "error",
      message: "This number is already connected",
      connected: true,
    });
  }

  // Check if already connecting
  if (manager.isConnecting(Num)) {
    return res.status(409).json({
      status: "error",
      message: "This number is already in pairing process",
      connecting: true,
    });
  }

  var release = await mutex.acquire();
  try {
    await connector(Num, res);
  } catch (error) {
    console.error(`❌ Pairing error for ${Num}:`, error);
    res.status(500).json({
      status: "error",
      error: "Failed to connect",
      details: error.message,
    });
  } finally {
    release();
  }
});

/**
 * Route: List active sessions
 */
// List active sessions
app.get("/sessions", (req, res) => {
  const sessions = {};
  for (const [num, conn] of manager.connections) {
    sessions[num] = {
      connected: !!conn?.user,
      user: conn?.user?.id || "unknown",
      jid: conn?.user?.id || null,
    };
  }
  res.json({
    total: manager.connections.size,
    sessions,
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
    await deleteSession(num);
    delete sessions[num];
    await fs.remove(sessionPath);
    manager.removeConnection(num);
    manager.removeConnecting(num);

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
// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    available_routes: [
      "GET /",
      "GET /pair?code=NUMBER",
      "GET /sessions",
      "GET /delete?number=NUMBER",
      "GET /block?number=NUMBER",
      "GET /unblock?number=NUMBER",
      "GET /blocklist",
    ],
  });
});

// ==================== GRACEFUL SHUTDOWN ====================
async function shutdown() {
  console.log("\n👋 Shutting down gracefully...");

  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

// ==================== START SERVER ====================
app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Multi-User WhatsApp Bot Server   ║
║   🌐 Port: ${PORT.toString().padEnd(28)}║
║   📅 ${new Date().toLocaleString().padEnd(34)}║
╚═══════════════════════════════════════╝
  `);

  // Restore all sessions
  await restoreSessions();
  await initSessions();

  console.log(`
✅ Server ready!
📊 Active sessions: ${manager.connections.size}
🔗 Endpoints:
   - GET  /                         (Health check)
   - GET  /pair?code=NUM             (Get pairing code)
   - GET  /sessions                  (List active sessions)
   - GET  /delete?number=NUM         (Delete session)
   - GET  /block?number=NUM          (Block user)
   - GET  /unblock?number=NUM        (Unblock user)
   - GET  /blocklist                 (View blocked users)
  `);
});
