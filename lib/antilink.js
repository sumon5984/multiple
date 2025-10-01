const { groupDB } = require("./index");
const { getGroupMetadata } = require("./group-cache");

/**
 * Normalize JID to standard format
 */
function jidNormalizedUser(jid) {
  if (!jid) return null;
  const number = jid.split("@")[0].split(":")[0];
  return `${number}@s.whatsapp.net`;
}

/**
 * Check if user is admin in the group
 */
function isUserAdmin(userId, participants) {
  const normalizedUserId = jidNormalizedUser(userId);
  const participant = participants.find(
    (p) => jidNormalizedUser(p.id) === normalizedUserId
  );
  return participant?.admin === "admin" || participant?.admin === "superadmin";
}

/**
 * Check if bot is admin in the group
 */
function isBotAdmin(botUser, participants) {
  const botJids = [botUser?.id, botUser?.lid]
    .filter(Boolean)
    .map((jid) => jidNormalizedUser(jid));

  const botParticipant = participants.find((p) =>
    botJids.includes(jidNormalizedUser(p.id))
  );

  return (
    botParticipant?.admin === "admin" || botParticipant?.admin === "superadmin"
  );
}

/**
 * Comprehensive link detection patterns
 */
const LINK_PATTERNS = [
  // HTTP/HTTPS URLs
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,

  // WhatsApp links
  /chat\.whatsapp\.com\/[a-zA-Z0-9_-]+/gi,
  /wa\.me\/[0-9]+/gi,
  /whatsapp\.com\/channel\/[a-zA-Z0-9_-]+/gi,

  // Common domains without protocol
  /(?:^|\s)(www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi,

  // Telegram links
  /t\.me\/[a-zA-Z0-9_]+/gi,
  /telegram\.me\/[a-zA-Z0-9_]+/gi,

  // Discord links
  /discord\.gg\/[a-zA-Z0-9]+/gi,
  /discord\.com\/invite\/[a-zA-Z0-9]+/gi,

  // YouTube links
  /youtu\.be\/[a-zA-Z0-9_-]+/gi,
  /youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/gi,

  // TikTok links
  /tiktok\.com\/@?[a-zA-Z0-9._]+/gi,
  /vm\.tiktok\.com\/[a-zA-Z0-9]+/gi,

  // Instagram links
  /instagram\.com\/[a-zA-Z0-9._]+/gi,

  // Twitter/X links
  /(?:twitter|x)\.com\/[a-zA-Z0-9_]+/gi,

  // Generic short URLs
  /bit\.ly\/[a-zA-Z0-9]+/gi,
  /tinyurl\.com\/[a-zA-Z0-9]+/gi,
  /goo\.gl\/[a-zA-Z0-9]+/gi,

  // Domain patterns (catches most URLs without protocol)
  /(?:^|\s)([a-zA-Z0-9-]+\.(?:com|net|org|io|co|me|tv|gg|xyz|info|biz|online|site|club|top|pro|vip|app)(?:\/[^\s]*)?)/gi,
];

/**
 * Extract all links from text
 */
function extractLinks(text) {
  if (!text) return [];

  const links = new Set();

  LINK_PATTERNS.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((link) => links.add(link.trim()));
    }
  });

  return Array.from(links);
}

/**
 * Default banned words
 */
const defaultWords = [
  "sex",
  "porn",
  "xxx",
  "xvideo",
  "cum4k",
  "randi",
  "chuda",
  "fuck",
  "nude",
  "bobs",
  "vagina",
];

/**
 * Main anti handler - combines antilink and antiword
 */
module.exports = async function handleAnti(conn, msg) {
  try {
    // 1️⃣ Basic validation
    if (!msg.message || !msg.key?.remoteJid?.endsWith("@g.us")) return;

    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    // 2️⃣ Get cached group metadata
    let meta;
    try {
      meta = await getGroupMetadata(conn, jid);
    } catch (e) {
      console.error("❌ Failed to get group metadata:", e.message);
      return;
    }

    if (!meta || !meta.participants) return;

    // 3️⃣ Check if sender is admin (properly normalize JIDs)
    const senderIsAdmin = isUserAdmin(sender, meta.participants);

    // 4️⃣ Check if sender is bot (check both .id and .lid)
    const botJids = [conn.user?.id, conn.user?.lid]
      .filter(Boolean)
      .map((jid) => jidNormalizedUser(jid));

    const senderNormalized = jidNormalizedUser(sender);
    const senderIsBot = botJids.includes(senderNormalized);

    // 5️⃣ Skip if sender is bot or admin
    if (senderIsBot || senderIsAdmin) return;

    // 6️⃣ Check if bot is admin (required to delete messages and kick users)
    const botIsAdmin = isBotAdmin(conn.user, meta.participants);

    // 7️⃣ Extract text from message
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";

    if (!text || typeof text !== "string") return;

    // 8️⃣ Load both antilink and antiword settings
    let linkData, wordData;
    try {
      [linkData, wordData] = await Promise.all([
        groupDB(["link"], { jid }, "get"),
        groupDB(["word"], { jid }, "get"),
      ]);
    } catch (e) {
      console.error("❌ Error reading groupDB:", e.message);
      return;
    }

    const antilink = linkData?.link;
    const antiword = wordData?.word;

    // 9️⃣ Check ANTILINK first (higher priority)
    if (antilink && antilink.status === "true") {
      const links = extractLinks(text);

      if (links.length > 0) {
        // Filter out whitelisted links
        const whitelist = antilink.not_del || [];
        const filtered = links.filter((link) => {
          return !whitelist.some((whitelisted) =>
            link.toLowerCase().includes(whitelisted.toLowerCase())
          );
        });

        if (filtered.length > 0) {
          // Bot must be admin to take action
          if (!botIsAdmin) {
            console.log("⚠️ Bot is not admin, cannot take action on antilink");
            return;
          }

          await handleViolation(
            conn,
            msg,
            jid,
            sender,
            antilink,
            "link",
            `🔗 Link: ${filtered[0]}`,
            "sharing links"
          );
          return; // Stop processing after antilink violation
        }
      }
    }

    // 🔟 Check ANTIWORD (if no link violation)
    if (antiword && antiword.status === "true") {
      const bannedWords =
        Array.isArray(antiword.words) && antiword.words.length > 0
          ? antiword.words
          : defaultWords;

      const lowered = text.toLowerCase();
      const foundWord = bannedWords.find((word) => lowered.includes(word));

      if (foundWord) {
        // Bot must be admin to take action
        if (!botIsAdmin) {
          console.log("⚠️ Bot is not admin, cannot take action on antiword");
          return;
        }

        await handleViolation(
          conn,
          msg,
          jid,
          sender,
          antiword,
          "word",
          `🚫 Banned word detected`,
          "using banned words"
        );
      }
    }
  } catch (error) {
    console.error("❌ Anti handler error:", error);
  }
};

/**
 * Handle violation (link or word) with warn/kick actions
 */
async function handleViolation(
  conn,
  msg,
  jid,
  sender,
  settings,
  type,
  extraInfo,
  reason
) {
  // Delete offending message
  const deleteMsg = async () => {
    try {
      await conn.sendMessage(jid, { delete: msg.key });
    } catch (e) {
      console.error("❌ Delete message failed:", e.message);
    }
  };

  const action = settings.action || "null";
  const warns = settings.warns || {};
  const maxWarn = settings.warn_count || 3;
  const warnCount = warns[sender] || 0;

  // Action: null → just delete
  if (action === "null") {
    await deleteMsg();
    return;
  }

  // Action: warn → delete + warn + kick if limit exceeded
  if (action === "warn") {
    await deleteMsg();

    const newWarn = warnCount + 1;
    warns[sender] = newWarn;

    // Save updated warns to DB
    await groupDB([type], { jid, content: { ...settings, warns } }, "set");

    if (newWarn >= maxWarn) {
      try {
        await conn.groupParticipantsUpdate(jid, [sender], "remove");
        await conn.sendMessage(jid, {
          text: `❌ @${
            sender.split("@")[0]
          } removed after ${maxWarn} warnings for ${reason}.\n\n${extraInfo}`,
          mentions: [sender],
        });

        // Reset warn count after kick
        delete warns[sender];
        await groupDB([type], { jid, content: { ...settings, warns } }, "set");
      } catch (e) {
        console.error("❌ Failed to remove user:", e.message);
        await conn.sendMessage(jid, {
          text: `⚠️ Cannot remove @${
            sender.split("@")[0]
          }. Bot needs admin privileges.`,
          mentions: [sender],
        });
      }
    } else {
      await conn.sendMessage(jid, {
        text: `⚠️ @${
          sender.split("@")[0]
        }, ${reason} is not allowed!\n\n⚠️ Warning ${newWarn}/${maxWarn}\n${extraInfo}`,
        mentions: [sender],
      });
    }
    return;
  }

  // Action: kick → delete + remove immediately
  if (action === "kick") {
    await deleteMsg();
    try {
      await conn.groupParticipantsUpdate(jid, [sender], "remove");
      await conn.sendMessage(jid, {
        text: `❌ @${
          sender.split("@")[0]
        } removed for ${reason}.\n\n${extraInfo}`,
        mentions: [sender],
      });
    } catch (e) {
      console.error("❌ Failed to remove user:", e.message);
      await conn.sendMessage(jid, {
        text: `⚠️ Cannot remove @${
          sender.split("@")[0]
        }. Bot needs admin privileges.`,
        mentions: [sender],
      });
    }
  }
}
