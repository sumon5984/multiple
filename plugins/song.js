/* ====== SONG DOWNLOADER PLUGIN ======
   Créditos A Quien Corresponda
   Play Traido y Editado por Cuervo-Team-Supreme
   Modified for plugin system
===================================== */

const { plugin, mode } = require('../lib');
const songCommand = require('../lib/ytdl'); // put your big songCommand code in lib/song-command.js

plugin({
  pattern: 'song ?(.*)',
  desc: 'Download YouTube songs as MP3',
  react: '🎵',
  fromMe: mode,
  type: 'download'
}, async (message, match) => {
  try {
    const query = (match && match.trim()) || (message.reply_text && message.reply_text.trim());
    if (!query) {
      return await message.reply('❌ Please provide a song name or YouTube link.\n\nExample: `.song despacito`');
    }

    // Call your main song downloader logic
    await songCommand(message.client, message.chat, message);

  } catch (err) {
    console.error('[PLUGIN SONG] Error:', err?.message || err);
    await message.reply('⚠️ Song download failed. Please try again later.');
  }
});