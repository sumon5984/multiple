const { plugin, mode } = require('../lib');
const videoCommand= require('./client/ytmp4'); // put your big songCommand code in lib/song-command.js

plugin({
  pattern: 'video ?(.*)',
  desc: 'Download YouTube songs as MP4',
  react: '🎵',
  fromMe: mode,
  type: 'download'
}, async (message, match) => {
  try {
    const query = (match && match.trim()) || (message.reply_text && message.reply_text.trim());
    if (!query) {
      return await message.reply('❌ Please provide a song name or YouTube link.\n\nExample: `.video despacito`');
    }

    // Call your main song downloader logic
    await videoCommand(message.client, message.chat, message);

  } catch (err) {
    console.error('[PLUGIN SONG] Error:', err?.message || err);
    await message.reply('⚠️ Song download failed. Please try again later.');
  }
});