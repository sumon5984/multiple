const {
    plugin,
    mode
} = require('../lib');
const { CMD_NAME } = require('../config');
const axios = require('axios');
const cheerio = require('cheerio');

plugin({
    pattern: "img ?(.*)",
    react: "🖼",
    fromMe: mode,
    type: "search",
    desc: "Search and download image(s)",
}, async (message, match) => {
    if (!match) {
        return await message.send(
            '_Please provide a search keyword_\n*Example:* .img anime & anime,5'
        );
    }

    let [text, count] = match.split(/[;,|]/);
    if (!text) text = match.trim();

    count = parseInt(count) || 5; 

    try {
        // 🔍 Google Images search
        const url = `https://www.google.com/search?hl=en&tbm=isch&q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        // 📑 Parse HTML for image URLs
        const $ = cheerio.load(data);
        let results = [];
        $("img").each((i, el) => {
            let src = $(el).attr("src");
            if (src && src.startsWith("http")) results.push(src);
        });

        if (!results || results.length === 0) {
            return await message.send(`❌ No images found for *"${text}"*. Try another search.`);
        }

        const max = Math.min(results.length, count);

        for (let i = 0; i < max; i++) {
            await message.client.sendMessage(message.jid, {
                image: { url: results[i] },
                caption: `🖼️ *Search:* ${text}\n> *${CMD_NAME}*`,
                contextInfo: { 
                    mentionedJid: [message.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '',
                        newsletterName: '',
                        serverMessageId: 143
                    }
                }
            }, { quoted: message.data });
        }

    } catch (err) {
        console.error("Image search error:", err);
        return await message.send(`❌ *Error while fetching images. Please try again later.*`);
    }
});