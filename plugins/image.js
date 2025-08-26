const {
    plugin,
    mode,
    linkPreview
} = require('../lib');
const { CMD_NAME } = require('../config');
 const axios = require('axios');


   plugin({
                            pattern: "img ?(.*)",
                                react: "🖼",
                                    fromMe: mode,
                                        type: "search",
                                            desc: "Search and download image(s)",
                                            }, async (message, match) => {
                                                if (!match) {
                                                        return await message.send('_Please provide a search keyword_\n*example*: img jujutsu kaisen', { linkPreview: linkPreview() });
                                                            }
   
                                                               if ((match.toLowerCase()) && !message.isCreator) 
                                                                    {
                                                                        return await message.send('_Invalid attempt detected_', { linkPreview: linkPreview() });
                                                                            }

                                                                                let [text, count] = match.split(/[;,|]/);
                                                                                    if (!text) text = match;
                                                                                        count = parseInt(count) || 1;

                                                                                            if (count > 5 && !message.isCreator) {
                                                                                                    return await message.send('_Too many images requested (max 5)_', { linkPreview: linkPreview() });
                                                                                                        }

                                                                                                            try {
                                                                                                                    const res = await axios.get(`https://apis.davidcyriltech.my.id/googleimage`, {
                                                                                                                                params: { query: text }
                                                                                                                                        });

                                                                                                                                                const { success, results } = res.data;

                                                                                                                                                        if (!success || !results || results.length === 0) {
                                                                                                                                                                    return await message.send(`❌ No images found for *"${text}"*. Try another search.`);
                                                                                                                                                                            }

                                                                                                                                                                                    const max = Math.min(results.length, count);
                                                                                                                                                                                            for (let i = 0; i < max; i++) {
                                                                                                                                                                                                        await message.sendReply(results[i], {
                                                                                                                                                                                                                        caption: `🖼️ *Search:* ${text}\n\n> *${CMD_NAME}*`,
                                                                                                                                                                                                                                    }, 'image');
                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                } catch (err) {
                                                                                                                                                                                                                                                        console.error("Image search error:", err);
                                                                                                                                                                                                                                                                return await message.send(`❌ *Error while fetching images. Please try again later.*`);
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                    });
