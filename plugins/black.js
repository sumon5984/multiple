const ff = require('fluent-ffmpeg');
const {
   plugin,
   mode,
   getBuffer,
   extractUrlsFromString
} = require('../lib');
const {
   read
} = require('jimp');
const fs = require('fs');
const {
   fromBuffer
} = require('file-type');

plugin({
   pattern: 'black ? (.*)',
   fromMe: mode,
   desc: 'mix image and audio to video',
   type: "media"
}, async (message, match) => {
   try {
      if (!message.reply_message.audio) return await message.send("_reply to audio message_");
      const ffmpeg = ff();
      let file = './media/tools/black.jpg';
      if (match && message.isMediaURL(match)) {
         const buff = await getBuffer(extractUrlsFromString(match)[0])
         const readed = await read(buff);
         if (readed.getWidth() != readed.getHeight()) return await message.send('_givened image width and height must be same_');
              const {
                        mime
                } = await fromBuffer(buff);
              if (!['jpg', 'jpeg', 'png'].includes(mime.split('/')[1])) return await message.send("_please provide a url,thet must be an image url_");
              file = './media/' + mime.replace('/', '.');
              fs.writeFileSync(file, buff);
      }
      const audioFile = './media/audio.mp3'
      fs.writeFileSync(audioFile, await message.reply_message.download());
      ffmpeg.input(file);
      ffmpeg.input(audioFile);
      ffmpeg.output('./media/videoMixed.mp4');
      ffmpeg.on('end', async () => {
         await message.send(fs.readFileSync('./media/videoMixed.mp4'), {}, 'video');
      });
      ffmpeg.on('error', async (err) => {
         await message.reply(err);
      });
      ffmpeg.run();
   } catch (e) {
      return message.send(e);
   }
});



// channel-jid.js

const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'channel_jids.json'); // adjust path if needed
function loadDB(){
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '{}'); }
    catch(e){ return {}; }
}
function saveDB(db){
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// deep search for forwardedNewsletterMessageInfo
function deepFindNewsletterInfo(obj) {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.forwardedNewsletterMessageInfo) {
        return obj.forwardedNewsletterMessageInfo;
    }
    for (const k of Object.keys(obj)) {
        try {
            const child = obj[k];
            if (child && typeof child === 'object') {
                const found = deepFindNewsletterInfo(child);
                if (found) return found;
            }
        } catch (e) { /* ignore */ }
    }
    return null;
}

/**
 * .channeljid <link>  -> try resolving invite (if query exists)
 * Reply to forwarded channel post with .channeljid -> extract JID directly
 * .savechannel [name] -> when used as reply saves current forwarded post's jid under name (or default)
 * .getchannels        -> list saved jids
 */
plugin({
    pattern: 'channeljid ?(.*)',
    fromMe: mode,
    desc: 'Resolve channel link OR reply to forwarded channel post to get JID',
    react: "📡",
    type: "general"
}, async (message, match) => {
    try {
        const arg = (match || '').trim();
        // 1) If user replied to a forwarded channel message -> extract JID
        if (message.reply_message) {
            const raw = message.reply_message.data || message.reply_message.message || message.reply_message;
            const info = deepFindNewsletterInfo(raw);
            if (info && info.newsletterJid) {
                return await message.send(`✅ Channel JID (from forwarded post):\n\`${info.newsletterJid}\`\nName: ${info.newsletterName || 'unknown'}\nServerMessageId: ${info.serverMessageId || 'n/a'}`);
            }
        }

        // 2) If user provided a link, try to resolve via query (only if available)
        if (arg) {
            // normalize link -> get invite code
            let code = arg.split('/').pop().split('?')[0];
            if (!code) return await message.send("❌ Invalid link. Example: `.channeljid https://whatsapp.com/channel/0029VaXYZabcDEF`");

            const client = message.client;
            if (!client || typeof client.query !== 'function') {
                return await message.send("❌ Low-level `query` not available in this bot wrapper. Forward any post from the channel and reply to it with `.channeljid` — the bot will extract the channel JID automatically.");
            }

            // try multiple xml namespaces (some servers respond differently)
            const tries = [
                { xmlns: 'w:newsletters', to: '@newsletter' },
                { xmlns: 'w:g2', to: '@g.us' },      // alternate
                { xmlns: 'w:g', to: '@g.us' }        // fallback
            ];

            let finalJid = null;
            for (const t of tries) {
                try {
                    const result = await client.query({
                        tag: "iq",
                        attrs: { type: "get", xmlns: t.xmlns, to: t.to },
                        content: [{ tag: "invite", attrs: { code } }]
                    });
                    // look for JID in several possible places
                    const jidFromAttrs = result?.content?.[0]?.attrs?.jid;
                    const jidFromContent = result?.content?.[0]?.content?.[0]?.attrs?.jid;
                    finalJid = jidFromAttrs || jidFromContent || finalJid;
                    if (finalJid) break;
                } catch (e) {
                    // ignore and try next
                }
            }

            if (finalJid) {
                return await message.send(`✅ Channel JID:\n\`${finalJid}\``);
            } else {
                return await message.send("❌ Could not resolve the invite via `query`. Your bot wrapper might block low-level queries. Please forward a post from the channel and reply to it with `.channeljid` to extract the JID.");
            }
        }

        // 3) No arg and not a reply
        return await message.send("Usage:\n• Reply to a forwarded channel post with `.channeljid` (recommended), or\n• `.channeljid https://whatsapp.com/channel/0029VaXYZabcDEF` (works only if your bot exposes low-level `query`).");
    } catch (e) {
        console.error('channeljid error', e);
        await message.send("⚠️ Error while attempting to get channel JID. Check logs.");
    }
});


// Save extracted jid to local JSON: usage -> reply to forwarded post with `.savechannel name`
// or `.savechannel` (saves as 'default')
plugin({
    pattern: 'savechannel ?(.*)',
    fromMe: mode,
    desc: 'Save channel JID (reply to forwarded channel post)',
    react: "💾",
    type: "general"
}, async (message, match) => {
    try {
        const name = (match || 'default').trim();
        if (!message.reply_message) return await message.send("❌ Reply to a forwarded channel post with `.savechannel <name>` to save its JID.");

        const raw = message.reply_message.data || message.reply_message.message || message.reply_message;
        const info = deepFindNewsletterInfo(raw);
        if (!info || !info.newsletterJid) return await message.send("❌ The replied message doesn't look like a forwarded channel post (no forwardedNewsletterMessageInfo). Forward a channel post into this chat and try again.");

        const db = loadDB();
        db[name] = { jid: info.newsletterJid, name: info.newsletterName || null, savedAt: new Date().toISOString() };
        saveDB(db);

        await message.send(`✅ Saved channel JID under *${name}*:\n\`${info.newsletterJid}\``);
    } catch (e) {
        console.error('savechannel error', e);
        await message.send("⚠️ Error while saving channel JID.");
    }
});


// List saved channels
plugin({
    pattern: 'getchannels ?(.*)',
    fromMe: mode,
    desc: 'List saved channel JIDs',
    react: "📂",
    type: "general"
}, async (message) => {
    try {
        const db = loadDB();
        const keys = Object.keys(db);
        if (!keys.length) return await message.send("No saved channel JIDs found. Save one with `.savechannel <name>` (reply to channel post).");

        let out = "Saved channel JIDs:\n\n";
        for (const k of keys) {
            out += `• ${k}: \`${db[k].jid}\` (${db[k].name || 'no name'}) — saved ${db[k].savedAt}\n`;
        }
        await message.send(out);
    } catch (e) {
        console.error('getchannels error', e);
        await message.send("⚠️ Error while reading saved channels.");
    }
});