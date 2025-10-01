const fs = require("fs");
const path = require("path");
const os = require("os");
const pino = require("pino");
const axios = require("axios");
const { sleep } = require("i-nrl");
const ffmpeg = require("fluent-ffmpeg");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  jidNormalizedUser,
  normalizeMessageContent,
  fetchLatestBaileysVersion,
  DisconnectReason,
  getContentType,
  proto,
  Browsers,
  getAggregateVotesInPollMessage,
  getKeyAuthor,
  decryptPollVote,
} = require("@whiskeysockets/baileys");

const { platforms } = require("./base");
const { notifyDeveloper } = require("./notifyBot");
const { commands, serialize, WAConnection } = require("./main");
const {
  isAdmin,
  isBotAdmin,
  parsedJid,
  extractUrlsFromString,
} = require("./handler");
const config = require("../config");
const { GenListMessage } = require("./youtube");
const { groupDB, personalDB, deleteSession } = require("./database");

// ============= CONSTANTS =============
const DEVELOPER = "917439489057";
const REACT_EMOJIS = [
  "🤍",
  "🍓",
  "🍄",
  "🎐",
  "🌸",
  "🍁",
  "🪼",
  "😅",
  "😎",
  "😂",
  "🥰",
  "🔥",
  "💖",
  "🤖",
];
const AUTO_REACT_EMOJIS = [
  "🍉",
  "❤️‍🩹",
  "💔",
  "🥰",
  "💀",
  "👻",
  "🎉",
  "🍂",
  "🍄",
  "🌾",
  "🌸",
  "🌱",
  "🍀",
  "🪴",
];
const STATUS_REACT_EMOJIS = [
  "🍉",
  "❤️‍🩹",
  "💔",
  "🥰",
  "💀",
  "👻",
  "🎉",
  "🍂",
  "🍄",
  "🌾",
  "🌸",
  "🌱",
  "🍀",
  "🪴",
];

// ============= GLOBAL STATE =============
const donPm = new Set();
const set_of_filters = new Set();
const sentGoodbye = new Set();
let spam_block = { run: false };
let ext_plugins = 0;

const store = {
  poll_message: { message: [] },
  contacts: {},
};

// Cache for database queries (reduces DB calls)
const dbCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

// ============= PERFORMANCE UTILITIES =============
function setupFFmpeg() {
  const optionalDeps = {
    "@ffmpeg-installer/darwin-arm64": "4.1.5",
    "@ffmpeg-installer/darwin-x64": "4.1.0",
    "@ffmpeg-installer/linux-arm": "4.1.3",
    "@ffmpeg-installer/linux-arm64": "4.1.4",
    "@ffmpeg-installer/linux-ia32": "4.1.0",
    "@ffmpeg-installer/linux-x64": "4.1.0",
    "@ffmpeg-installer/win32-ia32": "4.1.0",
    "@ffmpeg-installer/win32-x64": "4.1.0",
  };

  const platform = `${os.platform()}-${os.arch()}`;
  const packageName = `@ffmpeg-installer/${platform}`;

  if (optionalDeps[packageName]) {
    try {
      const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
      ffmpeg.setFfmpegPath(ffmpegPath);
    } catch (err) {
      console.warn("⚠️ FFmpeg setup failed:", err.message);
    }
  }
}

String.prototype.format = function () {
  let i = 0;
  const args = arguments;
  return this.replace(/{}/g, () =>
    typeof args[i] !== "undefined" ? args[i++] : ""
  );
};

function insertSudo() {
  if (!config.SUDO || config.SUDO === "null" || config.SUDO === "false")
    return [];
  return config.SUDO.replace(/\s/g, "").split(/[;,|]/).filter(Boolean);
}

function toMessage(msg) {
  return msg && msg !== "null" && msg !== "false" && msg !== "off"
    ? msg
    : false;
}

function getRandomEmoji(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Cached DB query with TTL
async function getCachedDB(keys, defaults, action, identifier) {
  const cacheKey = `${identifier}_${keys.join("_")}`;
  const cached = dbCache.get(cacheKey);

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const data = await personalDB(keys, defaults, action, identifier);
  dbCache.set(cacheKey, { data, time: Date.now() });
  return data;
}

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of dbCache.entries()) {
    if (now - value.time > CACHE_TTL) {
      dbCache.delete(key);
    }
  }
}, 60000); // Every minute

// ============= PLUGIN LOADER =============
async function loadExternalPlugins(botNumber) {
  const { plugins = {} } =
    (await getCachedDB(["plugins"], {}, "get", botNumber)) || {};

  const promises = Object.entries(plugins).map(async ([p, url]) => {
    try {
      const { data } = await axios(url + "/raw", { timeout: 5000 });
      fs.writeFileSync(`./plugins/${p}.js`, data);
      require(`./plugins/${p}.js`);
      ext_plugins++;
    } catch (e) {
      await personalDB(
        ["plugins"],
        { content: { id: p } },
        "delete",
        botNumber
      );
      console.error(`❌ Plugin ${p} failed`);
    }
  });

  await Promise.allSettled(promises);
  console.log(`🎀 ${ext_plugins} external plugins loaded`);
}

function loadLocalPlugins() {
  const pluginDir = "./plugins";
  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
  }

  fs.readdirSync(pluginDir).forEach((plugin) => {
    if (path.extname(plugin).toLowerCase() === ".js") {
      try {
        require(`../plugins/${plugin}`);
      } catch (e) {
        console.error(`❌ ${plugin}:`, e.message);
        fs.unlinkSync(path.join(pluginDir, plugin));
      }
    }
  });
  console.log("🏓 Local plugins loaded");
}

// ============= CONNECTION HANDLER =============
async function handleDisconnect(statusCode, file_path) {
  const credsPath = path.join(__dirname, "sessions", file_path, "creds.json");

  switch (statusCode) {
    case DisconnectReason.connectionClosed:
    case DisconnectReason.connectionLost:
    case DisconnectReason.restartRequired:
    case DisconnectReason.timedOut:
      if (fs.existsSync(credsPath)) {
        setTimeout(() => connect(file_path), 2000); // Faster reconnect
      } else {
        setTimeout(() => process.exit(0), 2000);
      }
      break;

    case DisconnectReason.connectionReplaced:
    case DisconnectReason.loggedOut:
    case 403:
      await cleanupSession(file_path);
      break;

    default:
      setTimeout(() => connect(file_path), 3000);
  }
}

async function cleanupSession(file_path) {
  const sessionDir = path.resolve(process.cwd(), "sessions", file_path);

  try {
    await deleteSession(file_path);
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("❌ Cleanup error:", err);
  }
}

// ============= MESSAGE HANDLERS =============
const handleAnti = require("./antilink");
const { mention } = require("./mention");

// Optimized auto features - parallel execution
async function handleAutoFeatures(msg, botNumber, conn) {
  const jid = msg.key.remoteJid;

  // Fetch all settings in parallel
  const [readData, autoRecord, autoTyping, reactSettings] = await Promise.all([
    getCachedDB(["autoread"], {}, "get", botNumber),
    getCachedDB(["autorecord"], {}, "get", botNumber),
    getCachedDB(["autotyping"], {}, "get", botNumber),
    getCachedDB(["autoreact"], {}, "get", botNumber),
  ]);

  // Execute actions in parallel (non-blocking)
  const actions = [];

  if (readData?.autoread === "true") {
    actions.push(conn.readMessages([msg.key]));
  }

  if (autoRecord?.autorecord === "true") {
    actions.push(
      conn
        .sendPresenceUpdate("recording", jid)
        .then(() =>
          setTimeout(() => conn.sendPresenceUpdate("paused", jid), 3000)
        )
    );
  }

  if (autoTyping?.autotyping === "true") {
    actions.push(
      conn
        .sendPresenceUpdate("composing", jid)
        .then(() =>
          setTimeout(() => conn.sendPresenceUpdate("paused", jid), 3000)
        )
    );
  }

  if (reactSettings?.autoreact === "true" && jid !== "status@broadcast") {
    actions.push(
      conn
        .sendMessage(jid, {
          react: { text: getRandomEmoji(AUTO_REACT_EMOJIS), key: msg.key },
        })
        .then(() => sleep(100))
    );
  }

  // Don't wait for completion
  Promise.allSettled(actions).catch(() => {});
}

// Optimized mention handler
async function handleMention(msg, botNumber, conn) {
  const mentionedJids =
    msg.message.extendedTextMessage?.contextInfo?.mentionedJid ||
    msg.message.imageMessage?.contextInfo?.mentionedJid ||
    msg.message.videoMessage?.contextInfo?.mentionedJid ||
    [];

  const botJid = `${botNumber}@s.whatsapp.net`;

  if (!mentionedJids.includes(botJid)) return;

  const { mention: mentionData } = await getCachedDB(
    ["mention"],
    { content: {} },
    "get",
    botNumber
  );

  if (mentionData?.status === "true" && mentionData.message) {
    const mentionMsg = {
      client: conn,
      jid: msg.key.remoteJid,
      sender: msg.key.participant || msg.key.remoteJid,
      number: (msg.key.participant || msg.key.remoteJid).split("@")[0],
    };

    mention(mentionMsg, mentionData.message).catch(() => {});
  }
}

// Optimized welcome/goodbye
async function handleWelcomeGoodbye(update, conn) {
  const { id: groupJid, participants, action } = update;

  if (action === "add") {
    const { welcome } =
      (await groupDB(["welcome"], { jid: groupJid, content: {} }, "get")) || {};

    if (welcome?.status !== "true") return;

    const groupMetadata = await conn.groupMetadata(groupJid).catch(() => ({}));
    const groupName = groupMetadata?.subject || "Group";
    const groupSize = groupMetadata?.participants?.length || "Unknown";

    // Send all welcome messages in parallel
    const promises = participants.map(async (user) => {
      const mentionTag = `@${user.split("@")[0]}`;
      let profileImage;

      try {
        profileImage = await conn.profilePictureUrl(user, "image");
      } catch {
        profileImage = "https://i.imgur.com/U6d9F1v.png";
      }

      const text = (welcome.message || "")
        .replace(/&mention/g, mentionTag)
        .replace(/&size/g, groupSize)
        .replace(/&name/g, groupName)
        .replace(/&pp/g, "");

      const messageOpts = { text, mentions: [user] };

      if (welcome.message?.includes("&pp")) {
        messageOpts.contextInfo = {
          externalAdReply: {
            title: "🌸 Welcome!",
            body: "Glad to have you",
            thumbnailUrl: profileImage,
            sourceUrl: "https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        };
      }

      return conn.sendMessage(groupJid, messageOpts);
    });

    await Promise.allSettled(promises);
  }

  if (action === "remove") {
    const { exit } =
      (await groupDB(["exit"], { jid: groupJid, content: {} }, "get")) || {};

    if (exit?.status !== "true") return;

    const groupMetadata = await conn.groupMetadata(groupJid).catch(() => ({}));
    const groupName = groupMetadata?.subject || "Group";
    const groupSize = groupMetadata?.participants?.length || "Unknown";

    const promises = participants.map(async (user) => {
      const key = `${groupJid}_${user}`;

      if (sentGoodbye.has(key)) return;

      sentGoodbye.add(key);
      setTimeout(() => sentGoodbye.delete(key), 10000);

      const mentionTag = `@${user.split("@")[0]}`;
      let profileImage;

      try {
        profileImage = await conn.profilePictureUrl(user, "image");
      } catch {
        profileImage = "https://i.imgur.com/U6d9F1v.png";
      }

      const text = (exit.message || "Goodbye &mention!")
        .replace(/&mention/g, mentionTag)
        .replace(/&size/g, groupSize)
        .replace(/&name/g, groupName)
        .replace(/&pp/g, "");

      const messageOpts = { text, mentions: [user] };

      if (exit.message?.includes("&pp")) {
        messageOpts.contextInfo = {
          externalAdReply: {
            title: "👋 Goodbye!",
            body: "Hope to see you again",
            thumbnailUrl: profileImage,
            sourceUrl: "https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        };
      }

      return conn.sendMessage(groupJid, messageOpts);
    });

    await Promise.allSettled(promises);
  }
}

// Optimized anti-call
async function handleAntiCall(callData, botNumber, conn) {
  const anticallData = await getCachedDB(["anticall"], {}, "get", botNumber);
  if (anticallData?.anticall !== "true") return;

  const calls = Array.isArray(callData) ? callData : [callData];

  const promises = calls.map(async (call) => {
    if (call.isOffer || call.status === "offer") {
      const from = call.from || call.chatId;

      await conn.sendMessage(from, {
        text: "❌ Please don't call me. I'm a bot.",
      });

      if (conn.rejectCall) {
        await conn.rejectCall(call.id, from);
      } else if (conn.updateCallStatus) {
        await conn.updateCallStatus(call.id, "reject");
      }
    }
  });

  await Promise.allSettled(promises);
}

// ============= MAIN CONNECTION =============
const connect = async (file_path) => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      `./sessions/${file_path}`
    );
    const { version } = await fetchLatestBaileysVersion();

    let conn = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Firefox"),
      printQRInTerminal: false,
      auth: state,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false, // Faster startup
      getMessage: async (key) => {},
    });

    conn.ev.on("creds.update", saveCreds);

    if (!conn.wcg) conn.wcg = {};
    conn = new WAConnection(conn);

    conn.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode || 0;
        await handleDisconnect(statusCode, file_path);
      } else if (connection === "open") {
        await handleConnectionOpen(conn, file_path);
      }
    });

    conn.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        const id = conn.decodeJid(contact.id);
        if (store.contacts) {
          store.contacts[id] = { id, name: contact.notify };
        }
      }
    });

    conn.ev.on("messages.upsert", async (m) => {
      if (m.type !== "notify") return;

      const botNumber = conn.user.id.split(":")[0];

      // Process messages in parallel
      const promises = m.messages.map(async (msg) => {
        if (!msg?.message || msg.key.fromMe) return;

        // Fire and forget non-critical handlers
        handleAnti(conn, msg).catch(() => {});
        handleMention(msg, botNumber, conn).catch(() => {});
        handleAutoFeatures(msg, botNumber, conn).catch(() => {});

        if (msg.key.remoteJid === "status@broadcast") {
          handleStatusBroadcast(msg, botNumber, conn).catch(() => {});
        }
      });

      await Promise.allSettled(promises);
    });

    conn.ev.on("group-participants.update", async (update) => {
      handleWelcomeGoodbye(update, conn).catch(() => {});
    });

    const callEvents = ["call", "CB:call", "calls.upsert", "calls.update"];
    callEvents.forEach((eventName) => {
      conn.ev.on(eventName, async (callData) => {
        const botNumber = conn.user.id.split(":")[0];
        handleAntiCall(callData, botNumber, conn).catch(() => {});
      });
    });

    return conn;
  } catch (err) {
    console.error("❌ Connection error:", err);
    throw err;
  }
};

async function handleConnectionOpen(conn, file_path) {
  const botNumber = conn.user.id.split(":")[0];

  // Load settings and plugins in parallel
  const [settings] = await Promise.all([
    getCachedDB(
      ["ban", "toggle", "sticker_cmd", "plugins", "shutoff", "login"],
      {},
      "get",
      botNumber
    ),
    loadExternalPlugins(botNumber).catch(() => {}),
  ]);

  loadLocalPlugins();

  const { ban, plugins, toggle, sticker_cmd, shutoff, login } = settings || {};

  if (login !== "true" && shutoff !== "true") {
    await personalDB(["login"], { content: "true" }, "set", botNumber);

    const { version } = require("../package.json");
    const startMsg = `
*╭━━━〔🍓FREE 𝗕𝗢𝗧 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃〕━━━✦*
*┃🌱 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 : ${botNumber}*
*┃👻 𝐏𝐑𝐄𝐅𝐈𝐗        : ${config.PREFIX}*
*┃🔮 𝐌𝐎𝐃𝐄        : ${config.WORKTYPE}*
*┃☁️ 𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌    : ${platforms()}*
*┃🍉 PLUGINS      : ${commands.length}*
*┃🎐 𝐕𝐄𝐑𝐒𝐈𝐎𝐍      : ${version}*
*╰━━━━━━━━━━━━━━━━━━╯*

*╭━━━〔🛠️ 𝗧𝗜𝗣𝗦〕━━━━✦*
*┃✧ 𝐓𝐘𝐏𝐄 .menu 𝐓𝐎 𝐕𝐈𝐄𝐖 𝐀𝐋𝐋*
*┃✧ 𝐈𝐍𝐂𝐋𝐔𝐃𝐄𝐒 𝐅𝐔𝐍, 𝐆𝐀𝐌𝐄, 𝐒𝐓𝐘𝐋𝐄*
*╰━━━━━━━━━━━━━━━━━╯*
`;

    // Send messages in parallel (don't wait)
    Promise.all([
      conn.sendMessage(conn.user.id, {
        audio: { url: "https://files.catbox.moe/c92scg.mp3" },
        mimetype: "audio/mpeg",
        ptt: true,
        waveform: [100, 0, 100, 0, 100, 0, 100],
        fileName: "shizo",
        contextInfo: {
          mentionedJid: [conn.user.id],
          externalAdReply: {
            title: "𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐂𝐇𝐎𝐎𝐒𝐈𝐍𝐆 KAISEN MD FREE BOT",
            body: "",
            thumbnailUrl: "https://files.catbox.moe/9whky8.jpg",
            sourceUrl: "https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      }),
      conn.sendMessage(conn.user.id, { text: startMsg }),
    ]).catch(() => {});
  } else if (shutoff !== "true") {
    conn
      .sendMessage(conn.user.id, { text: "_🌱 Bot restarted~_" })
      .catch(() => {});
  }
}

async function handleStatusBroadcast(msg, botNumber, conn) {
  const [statusViewData, saveStatusData] = await Promise.all([
    getCachedDB(["status_view"], {}, "get", botNumber),
    getCachedDB(["save_status"], {}, "get", botNumber),
  ]);

  const actions = [];

  if (statusViewData?.status_view === "true") {
    actions.push(
      conn.readMessages([msg.key]),
      conn.sendMessage("status@broadcast", {
        react: { text: getRandomEmoji(STATUS_REACT_EMOJIS), key: msg.key },
      })
    );
  }

  if (saveStatusData?.save_status === "true" && !msg.message.protocolMessage) {
    const m = new serialize(conn, msg, insertSudo(), store);
    actions.push(
      m.forwardMessage(conn.user.id, m.message, {
        caption: m.caption,
        linkPreview: {
          title: "status saver",
          body: `from: ${m.pushName || ""}, ${m.number}`,
        },
      })
    );
  }

  await Promise.allSettled(actions);
}

class WhatsApp {
  constructor(fp) {
    this.path = fp;
    this.conn = null;
  }

  async connect() {
    this.conn = await connect(this.path);
    return this.conn;
  }
}

setupFFmpeg();
console.log("🤍 Initializing bot...");

module.exports = { WhatsApp, connect };
