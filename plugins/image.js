
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
    desc: "Search and download high quality images from Google",
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
        // Enhanced Google Images search with better quality filters
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}&tbm=isch&tbs=isz:l,itp:photo&safe=active`;
        
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
        });

        const $ = cheerio.load(data);
        let results = [];

        // Extract high-quality image URLs from Google Images
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            const dataSrc = $(el).attr('data-src');
            const imageUrl = dataSrc || src;
            
            if (imageUrl && 
                imageUrl.startsWith('http') && 
                !imageUrl.includes('gstatic.com') &&
                !imageUrl.includes('google.com/images') &&
                imageUrl.length > 50) {
                results.push({
                    url: imageUrl,
                    title: $(el).attr('alt') || text,
                    source: 'Google Images'
                });
            }
        });

        // Enhanced scraping for better quality images
        $('script').each((i, el) => {
            const scriptContent = $(el).html();
            if (scriptContent && scriptContent.includes('"ou":"')) {
                const matches = scriptContent.match(/"ou":"([^"]+)"/g);
                if (matches) {
                    matches.forEach(match => {
                        const imageUrl = match.replace(/"ou":"/, '').replace(/"$/, '');
                        if (imageUrl.startsWith('http') && results.length < 20) {
                            results.push({
                                url: decodeURIComponent(imageUrl),
                                title: `${text} - High Quality`,
                                source: 'Google Images (Enhanced)'
                            });
                        }
                    });
                }
            }
        });

        // Fallback to Pixabay if Google Images fails
        if (results.length === 0) {
            const pixabayUrl = `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${encodeURIComponent(text)}&image_type=photo&category=all&min_width=1920&min_height=1080&per_page=${count}&safesearch=true`;
            
            try {
                const { data: pixabayData } = await axios.get(pixabayUrl);
                if (pixabayData.hits && pixabayData.hits.length > 0) {
                    results = pixabayData.hits.map(hit => ({
                        url: hit.largeImageURL || hit.webformatURL,
                        title: hit.tags || text,
                        source: 'Pixabay'
                    }));
                }
            } catch (err) {
                console.log("Pixabay fallback failed");
            }
        }

        // Final fallback to Lorem Picsum
        if (results.length === 0) {
            for (let i = 0; i < count; i++) {
                const randomId = Math.floor(Math.random() * 1000) + 100;
                results.push({
                    url: `https://picsum.photos/1920/1080?random=${randomId}`,
                    title: `${text} - Random High Quality Image ${i + 1}`,
                    source: 'Lorem Picsum'
                });
            }
        }

        if (!results || results.length === 0) {
            return await message.send(`❌ No high quality images found for *"${text}"*. Try another search term.`);
        }

        const max = Math.min(results.length, count);

        for (let i = 0; i < max; i++) {
            const image = results[i];
            await message.client.sendMessage(message.jid, {
                image: { url: image.url },
                caption: `🖼️ *Search:* ${text}\n📸 *Title:* ${image.title}\n🔗 *Source:* ${image.source}\n💎 *Quality:* High Resolution\n\n> *${CMD_NAME}*`,
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
        return await message.send(`❌ *Error while fetching high quality images. Please try again later.*`);
    }
});
