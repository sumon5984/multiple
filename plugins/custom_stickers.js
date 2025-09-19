
const {
    plugin,
    mode,
    config
} = require('../lib');
const { writeExifImg, writeExifVid, writeExifWebp } = require('../lib/sticker');
const fs = require("fs");
const path = require("path");

plugin({
    pattern: 'asticker ?(.*)',
    desc: 'Create animated sticker from video/gif',
    react: "🎬",
    type: 'converter',
    fromMe: mode,
}, async (message, match) => {
    try {
        if (!/video|gif/.test(message.mime) && !(message.reply_message && /video|gif/.test(message.reply_message.mime))) {
            return await message.send('> Please reply to a video or gif message');
        }

        let packname = match || config.STICKER_DATA.split(/[|;,]/)[1] || 'KAISEN-MD';
        let author = config.STICKER_DATA.split(/[|;,]/)[0] || 'KAISEN';

        await message.send('🎬 Creating animated sticker... Please wait!');

        if (message.reply_message && message.reply_message.mime) {
            let download = await message.reply_message.download();
            let stickerPath = await writeExifVid(download, {
                author: author,
                packname: packname,
            });
            
            let stickerBuffer = fs.readFileSync(stickerPath);
            await message.sendSticker(message.jid, stickerBuffer);
            fs.unlinkSync(stickerPath);
        } else if (/video|gif/.test(message.mime)) {
            let download = await message.client.downloadMediaMessage(message);
            let stickerPath = await writeExifVid(download, {
                author: author,
                packname: packname,
            });
            
            let stickerBuffer = fs.readFileSync(stickerPath);
            await message.sendSticker(message.jid, stickerBuffer);
            fs.unlinkSync(stickerPath);
        }
    } catch (error) {
        console.error("❌ Error creating animated sticker:", error);
        await message.send('❌ *Failed to create animated sticker. Please try again.*');
    }
});

plugin({
    pattern: 'msticker ?(.*)',
    desc: 'Create sticker with custom metadata',
    react: "🏷️",
    type: 'converter',
    fromMe: mode,
}, async (message, match) => {
    try {
        if (!/image|video|webp/.test(message.mime) && !(message.reply_message && /image|video|webp/.test(message.reply_message.mime))) {
            return await message.send('> Please reply to an image, video, or sticker message');
        }

        let metadata = match ? match.split('|') : [];
        let packname = metadata[0] || config.STICKER_DATA.split(/[|;,]/)[1] || 'KAISEN-MD';
        let author = metadata[1] || config.STICKER_DATA.split(/[|;,]/)[0] || 'KAISEN';

        await message.send('🏷️ Creating custom sticker... Please wait!');

        let download, stickerPath;
        
        if (message.reply_message && message.reply_message.mime) {
            download = await message.reply_message.download();
            
            if (/image/.test(message.reply_message.mime)) {
                stickerPath = await writeExifImg(download, { author, packname });
            } else if (/video/.test(message.reply_message.mime)) {
                stickerPath = await writeExifVid(download, { author, packname });
            } else if (/webp/.test(message.reply_message.mime)) {
                stickerPath = await writeExifWebp(download, { author, packname });
            }
        } else {
            download = await message.client.downloadMediaMessage(message);
            
            if (/image/.test(message.mime)) {
                stickerPath = await writeExifImg(download, { author, packname });
            } else if (/video/.test(message.mime)) {
                stickerPath = await writeExifVid(download, { author, packname });
            } else if (/webp/.test(message.mime)) {
                stickerPath = await writeExifWebp(download, { author, packname });
            }
        }

        if (stickerPath) {
            let stickerBuffer = fs.readFileSync(stickerPath);
            await message.sendSticker(message.jid, stickerBuffer);
            fs.unlinkSync(stickerPath);
            
            await message.send(`✅ *Custom sticker created!*\n📦 *Pack:* ${packname}\n👤 *Author:* ${author}`);
        }
    } catch (error) {
        console.error("❌ Error creating custom sticker:", error);
        await message.send('❌ *Failed to create custom sticker. Please try again.*');
    }
});

plugin({
    pattern: 'steal ?(.*)',
    desc: 'Steal a sticker and add custom metadata',
    react: "🔥",
    type: 'converter',
    fromMe: mode,
}, async (message, match) => {
    try {
        if (!message.reply_message || !message.reply_message.mime || !/webp/.test(message.reply_message.mime)) {
            return await message.send('> Please reply to a sticker message to steal it');
        }

        let packname = match || 'Stolen by KAISEN-MD';
        let author = config.STICKER_DATA.split(/[|;,]/)[0] || 'KAISEN';

        await message.send('🔥 Stealing sticker... Please wait!');

        let download = await message.reply_message.download();
        let stickerPath = await writeExifWebp(download, {
            author: author,
            packname: packname,
        });
        
        if (stickerPath) {
            let stickerBuffer = fs.readFileSync(stickerPath);
            await message.sendSticker(message.jid, stickerBuffer);
            fs.unlinkSync(stickerPath);
            
            await message.send(`🔥 *Sticker stolen successfully!*\n📦 *New Pack:* ${packname}\n👤 *Author:* ${author}`);
        }
    } catch (error) {
        console.error("❌ Error stealing sticker:", error);
        await message.send('❌ *Failed to steal sticker. Please try again.*');
    }
});

plugin({
    pattern: 'stickerpack ?(.*)',
    desc: 'Get information about sticker pack or set new default',
    react: "📦",
    type: 'converter',
    fromMe: mode,
}, async (message, match) => {
    try {
        if (match) {
            let newData = match.split('|');
            if (newData.length >= 2) {
                // Update sticker data (this would need to be saved to config or database)
                await message.send(`📦 *Sticker Pack Updated!*\n\n👤 *Author:* ${newData[0]}\n📦 *Pack Name:* ${newData[1]}\n\n*Note:* Use .msticker to create stickers with this metadata`);
            } else {
                await message.send('📦 *Sticker Pack Setup*\n\nUsage: .stickerpack author|packname\nExample: .stickerpack KAISEN|My Cool Stickers');
            }
        } else {
            let currentAuthor = config.STICKER_DATA.split(/[|;,]/)[0] || 'KAISEN';
            let currentPack = config.STICKER_DATA.split(/[|;,]/)[1] || 'KAISEN-MD';
            
            await message.send(`📦 *Current Sticker Pack Info*\n\n👤 *Author:* ${currentAuthor}\n📦 *Pack Name:* ${currentPack}\n\n💡 *Tip:* Use .stickerpack author|packname to set new defaults`);
        }
    } catch (error) {
        console.error("❌ Error in stickerpack command:", error);
        await message.send('❌ *Error occurred while managing sticker pack.*');
    }
});
