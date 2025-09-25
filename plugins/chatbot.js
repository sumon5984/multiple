const { plugin, personalDB, mode, isBot } = require('../lib');

plugin({
  pattern: 'chatbot ?(.*)',
  fromMe: mode,
  desc: '🤖 Manage chatbot settings',
  type: 'owner'
}, async (message, match) => {
  if (!await isBot(message)) {
    return await message.send('*_Only bot owner can use this command_*');
  }

  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];
  const raw = (match || '').trim();
  const lower = raw.toLowerCase();

  // Default settings
  let current = {
    status: 'true',
    scope: 'only_group', // all | only_pm | only_group
    typingMs: 800,
    excludeJids: []
  };

  // Load saved settings if present
  try {
    const data = await personalDB(['chatbot'], {}, 'get', botNumber);
    if (data?.chatbot) {
      current = typeof data.chatbot === 'object'
        ? data.chatbot
        : JSON.parse(data.chatbot || '{}');
    }
  } catch {
    // ignore errors
  }

  // Show help / current settings
  if (!raw) {
    return await message.reply(`
*Chatbot Settings*
• Status: ${current.status === 'true' ? '✅ ON' : '❌ OFF'}
• Scope: ${current.scope}
• Typing Delay (ms): ${current.typingMs}

*Commands:*
• chatbot on/off
• chatbot only_pm / only_group / all
• chatbot typing <ms>
• chatbot not_bot <jid>
• chatbot reset
`);
  }

  // Handle commands
  if (lower === 'on') {
    current.status = 'true';
  } else if (lower === 'off') {
    current.status = 'false';
  } else if (['only_pm', 'only_group', 'all'].includes(lower)) {
    current.scope = lower;
  } else if (lower.startsWith('typing')) {
    const n = parseInt(raw.replace(/typing/i, '').trim());
    if (isNaN(n) || n < 100) return await message.send('Provide typing ms (e.g., 800)');
    current.typingMs = n;
  } else if (lower.startsWith('not_bot')) {
    const j = raw.replace(/not_bot/i, '').trim();
    if (!j) return await message.send('Provide a JID to exclude.');
    if (!current.excludeJids.includes(j)) current.excludeJids.push(j);
  } else if (lower === 'reset') {
    current = {
      status: 'true',
      scope: 'only_group',
      typingMs: 800,
      excludeJids: []
    };
  } else {
    return await message.send('*_Invalid command. Type `chatbot` to see help._*');
  }

  // Save updated settings
  await personalDB(['chatbot'], { chatbot: current }, 'set', botNumber);
  return await message.send('*_Chatbot settings updated._*');
});