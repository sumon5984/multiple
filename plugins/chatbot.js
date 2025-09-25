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
  const input = match.trim().toLowerCase();

  // --- CHATBOT ON ---
  if (input === 'on') {
    await personalDB(['chatbot'], { content: { status: 'on', language: 'bengali', scope: 'all' } }, 'set', botNumber);
    return await message.send('✅ *Chatbot enabled*\n🌐 Language: Bengali (default)\n📍 Scope: All chats');
  }

  // --- CHATBOT OFF ---
  if (input === 'off') {
    await personalDB(['chatbot'], { content: { status: 'off' } }, 'set', botNumber);
    return await message.send('🚫 *Chatbot disabled*');
  }

  // --- CHATBOT LANGUAGE ---
  if (input.startsWith('ln ')) {
    const lang = input.split(' ')[1];
    if (!['bengali', 'english'].includes(lang)) {
      return await message.send('⚠️ *Invalid language!*\nUse: `bengali` or `english`');
    }
    await personalDB(['chatbot'], { content: { language: lang } }, 'set', botNumber);
    return await message.send(`🌐 *Chatbot language set to:* ${lang}`);
  }

  // --- CHATBOT SCOPE ---
  if (input.startsWith('scope ')) {
    const scope = input.split(' ')[1];
    if (!['all', 'only_pm', 'only_group'].includes(scope)) {
      return await message.send('⚠️ *Invalid scope!*\nUse: `all`, `only_pm`, or `only_group`');
    }
    await personalDB(['chatbot'], { content: { scope } }, 'set', botNumber);
    return await message.send(`📍 *Chatbot scope set to:* ${scope}`);
  }

  // --- SHOW SETTINGS ---
  const settings = await personalDB(['chatbot'], {}, 'get', botNumber);
  return await message.send(
    `⚙️ *Chatbot Settings*\n` +
    `> Status: ${settings.chatbot?.status === 'on' ? '✅ ON' : '❌ OFF'}\n` +
    `> Language: ${settings.chatbot?.language || 'bengali'}\n` +
    `> Scope: ${settings.chatbot?.scope || 'all'}`
  );
});