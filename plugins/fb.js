const { plugin, mode } = require('../lib');
const facebookCommand = require('./client/fbdl'); // put your big songCommand code in lib/song-command.js

plugin({
  pattern: 'fb ?(.*)',
  desc: 'Download FB video',
  react: '🎵',
  fromMe: mode,
  type: 'download'
}, async (message, match) => {
  try {
    const query = (match && match.trim()) || (message.reply_text && message.reply_text.trim());
    if (!query) {
      return await message.reply('❌ Please provide a fb link.');
    }

    // Call your main song downloader logic
    await facebookCommand(message.client, message.chat, message);

  } catch (err) {
    console.error('[PLUGIN FB] Error:', err?.message || err);
    await message.reply('⚠️ fd download failed. Please try again later.');
  }
});

