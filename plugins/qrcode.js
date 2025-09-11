
const { plugin, mode } = require('../lib');
const axios = require('axios');

plugin({
    pattern: 'qr ?(.*)',
    fromMe: mode,
    desc: 'Generate QR code for text or URL',
    type: 'utility',
    react: '📱'
}, async (message, match) => {
    try {
        const text = match || message.reply_message?.text;
        
        if (!text) {
            return await message.send('*Please provide text to generate QR code*\n\n*Example:* .qr Hello World');
        }

        if (text.length > 500) {
            return await message.send('*Text is too long!*\nPlease keep it under 500 characters.');
        }

        // Using QR Server API (free)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
        
        await message.send({
            image: { url: qrUrl },
            caption: `*QR Code Generated*\n\n*Text:* ${text}\n\n> © ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀`
        });

    } catch (error) {
        console.error('QR Code error:', error);
        await message.send('*Failed to generate QR code*\nPlease try again later.');
    }
});

plugin({
    pattern: 'readqr',
    fromMe: mode,
    desc: 'Read QR code from image',
    type: 'utility',
    react: '👁️'
}, async (message, match) => {
    try {
        if (!message.reply_message?.image) {
            return await message.send('*Please reply to an image containing a QR code*');
        }

        const media = await message.reply_message.download();
        
        // Using QR Server decode API
        const formData = new FormData();
        formData.append('file', media, 'qrcode.jpg');
        
        const response = await axios.post('https://api.qrserver.com/v1/read-qr-code/', formData, {
            headers: formData.getHeaders()
        });

        const result = response.data[0];
        
        if (result.symbol[0].error) {
            return await message.send('*No QR code found in the image*\nPlease make sure the image contains a clear QR code.');
        }

        const qrData = result.symbol[0].data;
        
        await message.send(`*QR Code Content:*\n\n${qrData}`);

    } catch (error) {
        console.error('QR Read error:', error);
        await message.send('*Failed to read QR code*\nPlease make sure the image contains a valid QR code.');
    }
});
