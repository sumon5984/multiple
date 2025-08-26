
const { plugin, mode } = require('../lib');
const axios = require('axios');

plugin({
  pattern: 'koyel',
  desc: 'Displays the command menu',
  type: 'vatari 🥵',
  fromMe: mode
}, async (message) => {
  try {
    const link = [
      "https://files.catbox.moe/j0k1xy.mp4",
      "https://files.catbox.moe/pa8zlh.mp4",
      "https://files.catbox.moe/gjd5pu.mp4",
      "https://files.catbox.moe/vpdtcn.mp4",
      "https://files.catbox.moe/42jgg3.mp4",
      "https://files.catbox.moe/8d4l6u.mp4",
      "https://files.catbox.moe/j2mjac.mp4",
      "https://files.catbox.moe/xqtogv.mp4",
      "https://files.catbox.moe/ht7y1t.mp4",
      "https://files.catbox.moe/grbiei.mp4",
      "https://files.catbox.moe/xxxrbx.mp4",
      "https://files.catbox.moe/b12ee5.mp4"
    ];
    
    const getlink = () => link[Math.floor(Math.random() * link.length)];
    const selectedVideo = getlink();
    
    await message.client.sendMessage(message.jid, {
      video: { url: selectedVideo },
      mimetype: 'video/mp4',
      caption: '> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*',
      mentions: message.mention || []
    }, { quoted: message.data });
    
  } catch (error) {
    console.error("❌ Error in koyel command:", error);
    await message.send(`❌ *Error in koyel command:*\n\`\`\`${error.message}\`\`\``);
  }
});
