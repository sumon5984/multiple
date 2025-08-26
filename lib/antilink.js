const { groupDB } = require('./index'); // Adjust if needed
const { getGroupMetadata } = require('./group-cache'); // ✅ Caching group metadata

module.exports = async function handleAntilink(conn, msg) {
    // 1️⃣ Basic validation
    if (!msg.message || !msg.key.remoteJid.endsWith('@g.us')) return;

    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    // 2️⃣ Get cached group metadata & admins
    let meta;
    try {
        meta = await getGroupMetadata(conn, jid); // ✅ Uses cache
    } catch (e) {
        console.error('❌ Failed to get group metadata:', e.message);
        return;
    }

    const admins = meta.participants.filter(p => p.admin !== null).map(p => p.id);
    const botNumber = conn.user?.id;

    // 3️⃣ Skip if sender is bot, admin, or owner
    const isAdminOrOwner =
        sender === botNumber ||
        admins.includes(sender) ||
        sender.split('@')[0] === botNumber?.split('@')[0];

    if (isAdminOrOwner) return;

    // 4️⃣ Load antilink settings from DB
    const data = await groupDB(['link'], { jid }, 'get');
    const antilink = data?.link;
    if (!antilink || antilink.status !== 'true') return;

    // 5️⃣ Extract text from message
    const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '';

    // 6️⃣ Detect links
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const links = text.match(urlRegex);
    if (!links) return;

    const filtered = links.filter(u => !(antilink.not_del || []).includes(u));
    if (!filtered.length) return;

    const action = antilink.action || 'null'; // null / warn / kick
    const warns = antilink.warns || {};
    const maxWarn = antilink.warn_count || 3;
    const warnCount = warns[sender] || 0;

    // 🔧 Delete offending message
    const deleteMsg = async () => {
        try {
            await conn.sendMessage(jid, { delete: msg.key });
        } catch (e) {
            console.error('❌ Delete message failed:', e.message);
        }
    };

    // 7️⃣ Action: null → just delete
    if (action === 'null') {
        await deleteMsg();
        return;
    }

    // 8️⃣ Action: warn → delete + warn + kick if limit exceeded
    if (action === 'warn') {
        await deleteMsg();

        const newWarn = warnCount + 1;
        warns[sender] = newWarn;

        // Save updated warns to DB
        await groupDB(['link'], { jid, content: { ...antilink, warns } }, 'set');

        if (newWarn >= maxWarn) {
            try {
                await conn.groupParticipantsUpdate(jid, [sender], 'remove');
                await conn.sendMessage(jid, {
                    text: `❌ @${sender.split('@')[0]} removed after ${maxWarn} warnings.`,
                    mentions: [sender]
                });
            } catch (e) {
                await conn.sendMessage(jid, {
                    text: `⚠️ Tried to remove @${sender.split('@')[0]} but failed.`,
                    mentions: [sender]
                });
            }

            // Reset warn count
            delete warns[sender];
            await groupDB(['link'], { jid, content: { ...antilink, warns } }, 'set');
        } else {
            await conn.sendMessage(jid, {
                text: `⚠️ @${sender.split('@')[0]}, sharing links is not allowed.\nWarning ${newWarn}/${maxWarn}`,
                mentions: [sender]
            });
        }
        return;
    }

    // 9️⃣ Action: kick → delete + remove immediately
    if (action === 'kick') {
        await deleteMsg();
        try {
            await conn.groupParticipantsUpdate(jid, [sender], 'remove');
            await conn.sendMessage(jid, {
                text: `❌ @${sender.split('@')[0]} removed for sharing a link.`,
                mentions: [sender]
            });
        } catch (e) {
            await conn.sendMessage(jid, {
                text: `⚠️ Tried to remove @${sender.split('@')[0]} but failed.`,
                mentions: [sender]
            });
        }
    }
};