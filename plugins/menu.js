

const { plugin, commands, mode } = require('../lib');
const { BOT_INFO, PREFIX }  = require('../config');
const { version }   = require('../package.json');
const { isUrls }    = require('../lib/extra');
const os            = require('os');

const runtime = secs => {
  const pad = s => s.toString().padStart(2, '0');
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
};

const readMore = String.fromCharCode(8206).repeat(4001);

plugin({
  pattern: 'menu|list',
  desc: 'Displays the command menu',
  type: 'whatsapp',
  fromMe: mode
}, async (message) => {
  const [botName, rawMediaUrl] = BOT_INFO.split(';');
  const mediaUrl = rawMediaUrl?.replace(/&gif/g, '');
  const isGif = rawMediaUrl?.includes('&gif');
  const userName = message.pushName || 'User';
  const usedGB = ((os.totalmem() - os.freemem()) / 1073741824).toFixed(2);
  const totGB  = (os.totalmem() / 1073741824).toFixed(2);
  const ram    = `${usedGB} / ${totGB} GB`;

  let menuText = `
*╭══〘〘 ${botName} 〙〙*
*┃❍ ʀᴜɴ     :* ${runtime(process.uptime())}
*┃❍ ᴍᴏᴅᴇ    :* ${mode ? 'Private' : 'Public'}
*┃❍ ᴘʀᴇғɪx  :* ${PREFIX}
*┃❍ ʀᴀᴍ     :* ${ram}
*┃❍ ᴠᴇʀsɪᴏɴ :* v${version}
*┃❍ ᴜsᴇʀ    :* ${userName}
*╰═════════════════⊷*
${readMore}
*♡︎•━━━━━━☻︎━━━━━━•♡︎*
`;

  let cmnd = [], category = [];

  for (const command of commands) {
    const cmd = command.pattern?.toString().match(/(\W*)([A-Za-züşiğöç1234567890]*)/)?.[2];
    if (!command.dontAddCommandList && cmd) {
      const type = (command.type || "misc").toUpperCase();
      cmnd.push({ cmd, type });
      if (!category.includes(type)) category.push(type);
    }
  }

  const BOT_INFO_FONT = process.env.BOT_INFO_FONT || '0;0';
  const [typFont, ptrnFont] = BOT_INFO_FONT.split(';').map(f => isNaN(f) || parseInt(f) > 35 ? null : f);

  for (const cat of category.sort()) {
    const typeTitle = typFont && typFont !== '0'
      ? await fancy(cat, parseInt(typFont))
      : `${cat}`;
    menuText += `\n *╭────❒ ${typeTitle} ❒⁠⁠⁠⁠*\n`;

    for (const { cmd, type } of cmnd.filter(c => c.type === cat)) {
      const styled = ptrnFont && ptrnFont !== '0'
        ? await fancy(cmd.trim(), parseInt(ptrnFont))
        : `*├◈ ${cmd}*`;
      menuText += ` ${styled}\n`;
    }
    menuText += ` *┕──────────────────❒*\n`;
  }

  menuText += `\n💖 *~_Made with love by KAISEN_~*`;

 try {
  if (mediaUrl && isUrls(mediaUrl)) {
    const opts = {
      video: { url: mediaUrl },
      gifPlayback: true, // this makes the video behave like a GIF
      caption: menuText,
      mimetype: 'video/mp4' // required for WhatsApp
    };

    await message.client.sendMessage(message.jid, opts, { quoted: message });
  } else {
    await message.send(menuText);
  }
} catch (err) {
  console.error('❌ Menu send error:', err);
  await message.send(
    menuText + `\n\n⚠️ *Media failed to load, sending text only.*`
  );
 }
});