
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { plugin } = require('../lib');
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

plugin({
    pattern: 'vv ?(.*)',
    desc: 'Unlock ViewOnce media',
    type: 'tools'
}, async (message) => {
    const quoted = message.reply_message;
   if (!quoted || !quoted.image) {
     return await message.reply("😟 please reply to a view-onece media.");
    }
    const reply = message.reply_message;
    if (!reply) return await message.send('Reply to a view-once image/video/audio.');
    let raw = reply.message;
    while (raw?.ephemeralMessage || raw?.viewOnceMessage) {
        raw = raw.ephemeralMessage?.message || raw.viewOnceMessage?.message || raw;
    }
    if (!raw) return await message.send('No view-once content found.');
    const mediaType = Object.keys(raw)[0];
    const supported = ['imageMessage', 'videoMessage', 'audioMessage'];
    if (!supported.includes(mediaType)) {
        return await message.send('⚠️ Unsupported or missing view-once media.');
    }
    try {
        const buffer = await downloadMediaMessage(
            { message: raw, key: reply.key },
            'buffer',
            {},
            { logger: message.client.logger }
        );
      const ext = mediaType === 'imageMessage' ? 'jpg' :
        mediaType === 'videoMessage' ? 'mp4' : 'mp3';
        const tempFile = path.join(__dirname, `../temp/unlocked_${Date.now()}.${ext}`);
        fs.writeFileSync(tempFile, buffer);
        const media = fs.readFileSync(tempFile);
        await message.client.sendMessage(
            message.chat,
            {
                [mediaType.replace('Message', '')]: media
            }
        );
      fs.unlinkSync(tempFile);
    } catch (err) {
        console.error(err);
        await message.send('Failed to unlock or send media.');
    }
});


plugin({
    pattern: '🙂 ?(.*)',
    desc: 'Unlock view-once media and send to bot number',
    type: 'tools'
}, async (message) => {
    const botNumber = message.client.user?.id || message.client.user?.jid;
    const quoted = message.reply_message;
    if (!quoted || !quoted.image) {
      if  (!botNumber) return await message.reply("😟 please reply to a view-onece media.");
    }

    let raw = quoted.message;
    while (raw?.ephemeralMessage || raw?.viewOnceMessage) {
        raw = raw.ephemeralMessage?.message || raw.viewOnceMessage?.message || raw;
    }

    if (!raw) return //await message.send('❌ No view-once content found.');

    const mediaType = Object.keys(raw)[0];
    const supported = ['imageMessage', 'videoMessage', 'audioMessage'];
    if (!supported.includes(mediaType)) {
     if (!botNumber) return await message.send('⚠️ Unsupported or missing view-once media.');
    }
    try {
        const buffer = await downloadMediaMessage(
            { message: raw, key: quoted.key },
            'buffer',
            {},
            { logger: message.client.logger }
        );

        const ext = mediaType === 'imageMessage' ? 'jpg' :
          mediaType === 'videoMessage' ? 'mp4' : 'mp3';
       const tempFile = path.join(tempDir, `unlocked_${Date.now()}.${ext}`);
        fs.writeFileSync(tempFile, buffer);
       const media = fs.readFileSync(tempFile);
      if (!botNumber) return await message.send('⚠️ Failed to detect bot number.');

        await message.client.sendMessage(botNumber, {
            [mediaType.replace('Message', '')]: media
        });

        fs.unlinkSync(tempFile);

    } catch (err) {
        console.error(err);
    }
});