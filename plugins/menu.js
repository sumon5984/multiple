const { plugin, commands, mode } = require('../lib');
const { BOT_INFO, PREFIX } = require('../config');
const { version } = require('../package.json');
const { isUrls, fancy } = require('../lib/extra'); // ✅ make sure fancy is exported from extra.js
const os = require('os');
const path = require('path');
const fs = require('fs');

const runtime = secs => {
  const pad = s => s.toString().padStart(2, '0');
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
};

const readMore = String.fromCharCode(8206).repeat(4001);

function externalMenuPreview(profileImageBuffer, options = {}) {
  return {
    showAdAttribution: true,
    title: options.title || 'KAISEN-MD',
    body: options.body || 'Command Menu',
    thumbnail: profileImageBuffer, // ✅ buffer, not url
    sourceUrl: options.sourceUrl || 'https://whatsapp.com/channel/0029VaAKCMO1noz22UaRdB1Q',
    mediaType: 1,
    renderLargerThumbnail: true
  };
}

plugin({
  pattern: 'menu|list',
  desc: 'Displays the command menu',
  type: 'whatsapp',
  fromMe: mode
}, async (message) => {
  const [botName] = BOT_INFO.split(';');
  const userName = message.pushName || 'User';
  const usedGB = ((os.totalmem() - os.freemem()) / 1073741824).toFixed(2);
  const totGB = (os.totalmem() / 1073741824).toFixed(2);
  const ram = `${usedGB} / ${totGB} GB`;

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
const text = menuText;
  try {
    const menuImagePath = path.join(__dirname, "../media/tools/menu1.jpg");
    if (fs.existsSync(menuImagePath)) {
      const buffer = fs.readFileSync(menuImagePath);
      await message.client.sendMessage(message.jid, {
        text,
        contextInfo: {
          externalAdReply: externalMenuPreview(buffer)
        }
      });
    } else {
      await message.send(menuText + `\n\n⚠️ *Menu image not found, sending text only.*`);
    }
  } catch (err) {
    console.error('❌ Menu send error:', err);
    await message.send(menuText + `\n\n⚠️ *Media failed to load, sending text only.*`);
  }
});