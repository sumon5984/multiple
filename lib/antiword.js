const { groupDB } = require('./index');
const { getGroupMetadata } = require('./group-cache');

// 🧩 Default banned words (if no custom words added)
const defaultWords = ['sex', 'porn', 'xxx', 'xvideo', 'cum4k', 'randi', 'chuda', 'fuck', 'nude', 'bobs', 'vagina'];

module.exports = async function handleAntiword(conn, msg) {
    if (!msg.message || !msg.key?.remoteJid?.endsWith('@g.us')) return;

    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    // 📥 Group metadata
    let meta;
    try {
        meta = await getGroupMetadata(conn, jid);
    } catch {
        return;
    }

    const admins = meta.participants.filter(p => p.admin !== null).map(p => p.id);
    const botNumber = conn.user?.id;
    const isAdminOrOwner =
        sender === botNumber ||
        admins.includes(sender) ||
        sender.split('@')[0] === botNumber?.split('@')[0];

    if (isAdminOrOwner) return; // ✅ Admins and bot itself are ignored

    // ⚙️ Load word settings
    let data;
    try {
        data = await groupDB(['word'], { jid }, 'get');
    } catch (e) {
        console.error('❌ Error reading groupDB:', e.message);
        return;
    }

    const settings = data?.word;
    if (!settings || settings.status !== 'true') return;

    // 🧠 Banned words = custom if exists, else default
    const bannedWords =
        Array.isArray(settings.words) && settings.words.length > 0
            ? settings.words
            : defaultWords;

    // 📩 Extract message text (safely)
    const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '';

    if (!text || typeof text !== 'string') return;

    const lowered = text.toLowerCase();
    const found = bannedWords.find(word => lowered.includes(word));
    if (!found) return;

    // 🧹 Delete message function
    const deleteMsg = async () => {
        try {
            await conn.sendMessage(jid, { delete: msg.key });
        } catch {}
    };

    const action = settings.action || 'null';
    const warns = settings.warns || {};
    const maxWarn = settings.warn_count || 3;
    const warnCount = warns[sender] || 0;

    if (action === 'null') {
        await deleteMsg();
        return;
    }

    if (action === 'warn') {
        await deleteMsg();

        const newWarn = warnCount + 1;
        warns[sender] = newWarn;

        await groupDB(['word'], { jid, content: { ...settings, warns } }, 'set');

        if (newWarn >= maxWarn) {
            try {
                await conn.groupParticipantsUpdate(jid, [sender], 'remove');
                await conn.sendMessage(jid, {
                    text: `❌ @${sender.split('@')[0]} removed after ${maxWarn} warnings.`,
                    mentions: [sender]
                });
            } catch {
                await conn.sendMessage(jid, {
                    text: `⚠️ Tried to remove @${sender.split('@')[0]} but failed.`,
                    mentions: [sender]
                });
            }

            delete warns[sender];
            await groupDB(['word'], { jid, content: { ...settings, warns } }, 'set');
        } else {
            await conn.sendMessage(jid, {
                text: `⚠️ @${sender.split('@')[0]}, that word is not allowed.\nWarning ${newWarn}/${maxWarn}`,
                mentions: [sender]
            });
        }

        return;
    }

    if (action === 'kick') {
        await deleteMsg();
        try {
            await conn.groupParticipantsUpdate(jid, [sender], 'remove');
            await conn.sendMessage(jid, {
                text: `❌ @${sender.split('@')[0]} removed for using banned word.`,
                mentions: [sender]
            });
        } catch {
            await conn.sendMessage(jid, {
                text: `⚠️ Tried to remove @${sender.split('@')[0]} but failed.`,
                mentions: [sender]
            });
        }
    }
};