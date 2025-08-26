const { plugin, personalDB, mode, isBot } = require('../lib');
const config = require('../config');

plugin({
  pattern: 'chatbot ?(.*)',
  fromMe: mode,
  desc: '🤖 Manage chatbot settings',
  type: 'owner'
}, async (message, match) => {
    if (!await isBot(message)) {
		return await message.send('*_Only bot owner can use this command_*');
    }
    if (!config.GEMINI_API_KEY) { return await message.reply(`*_Please provide Gemini API key in config.js_*\n*_Get API key_* https://aistudio.google.com/apikey`)};
  if (!message) return;
  const raw = (match || '').trim();
  const lower = raw.toLowerCase();
   let current = {
    status: 'true',
    scope: 'only_group', // all | only_pm | only_group
    typingMs: 800,
    systemPrompt: 'You are a human being, your name is kaisen, you will answer in whatever language you are spoken to, and never say that you are a bot or AI, you will talk to everyone as a girl friend, if someone asks you who you are, you will say I am kaisen.',
    temperature: 0.7,
    maxTokens: 800,
    excludeJids: []
  };
 try {
    const data = await personalDB(['chatbot'], {}, 'get');
    if (data && data.chatbot) {
      current = typeof data.chatbot === 'object'
        ? data.chatbot
        : JSON.parse(data.chatbot || '{}');
    }
  } catch {
    // ignore errors
  }
  if (!raw) {
    return await message.reply(
      `*Chatbot Settings*\n` +
      `• Status: ${current.status === 'true' ? '✅ ON' : '❌ OFF'}\n` +
      `• Mood: ${current.scope}\n` +
      `• Typing Delay (ms): ${current.typingMs}\n` +
      `• Temp: ${current.temperature}\n` +
      `• Max Tokens: ${current.maxTokens}\n` +
      `• System Prompt: ${current.systemPrompt ? current.systemPrompt.slice(0,120) + (current.systemPrompt.length > 120 ? '...' : '') : '(empty)'}\n` +
      `*Commands:*\n` +
      `• chatbot on/off\n` +
      `• chatbot only_pm / only_group / all\n` +
      `• chatbot typing <ms>\n` +
      `• chatbot temp <0.0-1.0>\n` +
      `• chatbot maxtoken <number>\n` +
      `• chatbot prompt <text>\n` +
      `• chatbot not_bot <jid>\n` +
      `• chatbot reset`
    );
  }
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
  } else if (lower.startsWith('temp')) {
    const v = parseFloat(raw.replace(/temp/i, '').trim());
    if (isNaN(v) || v < 0 || v > 1) return await message.send('Provide temp between 0 and 1');
    current.temperature = v;
  } else if (lower.startsWith('maxtoken')) {
    const v = parseInt(raw.replace(/maxtoken/i, '').trim());
    if (isNaN(v) || v < 10) return await message.send('Provide valid token count');
    current.maxTokens = v;
  } else if (lower.startsWith('prompt')) {
    const p = raw.replace(/prompt/i, '').trim();
    current.systemPrompt = p;
  } else if (lower.startsWith('not_bot')) {
    const j = raw.replace(/not_bot/i, '').trim();
    if (!j) return await message.send('Provide a JID to exclude.');
    if (!current.excludeJids.includes(j)) current.excludeJids.push(j);
  } else if (lower === 'reset') {
    current = {
      status: 'true',
      scope: 'only_group',
      typingMs: 800,
      systemPrompt: 'You are a human being, your name is kaisen, you will answer in whatever language you are spoken to, and never say that you are a bot or AI, you will talk to everyone as a girl friend, if someone asks you who you are, you will say I am kaisen.',
      temperature: 0.7,
      maxTokens: 800,
      excludeJids: []
    };
  } else {
    return await message.send('*_Invalid command. Type `chatbot` to see help._*');
  }
  await personalDB(['chatbot'], { content: current }, 'set');
  return await message.send('*_Chatbot settings updated._*');
});