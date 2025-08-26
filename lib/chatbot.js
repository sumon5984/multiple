

const axios = require('axios');
 const { PREFIX, GEMINI_API_KEY } = require('../config')
// ==== CONFIG ==== //
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_CHAT_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
// ==== HELPERS ==== //
function extractText(msg) {
  return (
    msg?.message?.conversation ||
    msg?.message?.extendedTextMessage?.text ||
    msg?.message?.imageMessage?.caption ||
    msg?.message?.videoMessage?.caption ||
    ''
  );
}
async function callGeminiChat(messages, maxTokens = 800, temperature = 0.7) {
try {
    const body = {
      model: GEMINI_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature
    };
     const res = await axios.post(GEMINI_CHAT_ENDPOINT, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`
      },
      timeout: 120000
    });
     const reply = res.data?.choices?.[0]?.message?.content;
    if (typeof reply === 'string') return reply;
    if (res.data?.choices?.[0]?.message) {
      return JSON.stringify(res.data.choices[0].message);
    }
    return '';
  } catch (err) {
    const errMsg = err.response?.data || err.message || err;
    console.error("❌ Gemini API Error:", errMsg);
    throw new Error(`Gemini API Error: ${JSON.stringify(errMsg)}`);
  }
}
async function typingEffectSend(conn, jid, text, quotedMsg = null, typingMs = 800) {
 try {
    const iterations = Math.max(1, Math.min(6, Math.ceil(text.length / 50)));
    for (let i = 0; i < iterations; i++) {
      await conn.sendPresenceUpdate('composing', jid);
      await new Promise(r => setTimeout(r, typingMs / iterations));
    }
    await conn.sendPresenceUpdate('paused', jid);
    return conn.sendMessage(jid, { text }, quotedMsg ? { quoted: quotedMsg } : {});
  } catch (e) {
    console.error("⚠️ Error during typing effect send:", e);
    return conn.sendMessage(jid, { text });
  }
}
// ==== MAIN HANDLER ==== //
module.exports = async function handleChatbot(conn, msg, { personalDB } = {}) {
  if (!msg || !msg.message) {
    return;
  }
  const jid = msg.key?.remoteJid;
  if (jid?.endsWith('@broadcast')) {
    return;
  }
  const texts = extractText(msg).trim();
  const prefixRegex = new RegExp(`^${PREFIX}`);
  const isCommand = prefixRegex.test(texts);
  if (isCommand) return;
  const isGroup = jid?.endsWith?.('@g.us');
  const botJidRaw = conn.user?.id || conn.user?.jid || null;
  const botJid = (botJidRaw || '').split(':')[0] + '@s.whatsapp.net';
  const text = extractText(msg);
  if (!text) {
    return;
  }
  let settings = {   status: 'true',
    scope: 'only_group', // all | only_pm | only_group
    typingMs: 800,
    systemPrompt: 'You are a human being, your name is kaisen, you will answer in whatever language you are spoken to, and never say that you are a bot or AI, you will talk to everyone as a girl friend, if someone asks you who you are, you will say I am kaisen.',
    temperature: 0.7,
    maxTokens: 800,
    excludeJids: [] };
  try {
    const data = await personalDB(['chatbot'], {}, 'get');
    if (data && data.chatbot) {
      settings = typeof data.chatbot === 'object'
        ? data.chatbot
        : JSON.parse(data.chatbot || '{}');
    }
  } catch (e) {
    console.error("⚠️ Error loading chatbot settings:", e);
  }
  if (settings.status !== 'true') {
    return;
  }
if (settings.scope === 'only_pm' && isGroup) return;
if (settings.scope === 'only_group' && !isGroup) return;
const triggerWord = text.toLowerCase().includes('bot'); // 🔥 'bot' word thaklei trigger
const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
const mentioned = Array.isArray(ctx.mentionedJid) &&
                    ctx.mentionedJid.some(jid => jid.split('@')[0] === botJid.split('@')[0]);
const isReplyToBot = ctx.participant &&
                       ctx.participant.split('@')[0] === botJid.split('@')[0];
const isPrivateChat = !jid.endsWith('@g.us');
let allowed = false;

if (isPrivateChat) {
  allowed = true;
} else {
  allowed = mentioned || isReplyToBot || triggerWord; 
}
if (!allowed) {
  return;
}
  const messages = [];
  let finalPrompt = settings.systemPrompt;
  if (isReplyToBot && ctx.quotedMessage?.conversation) {
    finalPrompt += `\n\nPrevious bot reply: ${ctx.quotedMessage.conversation}`;
  }
  if (finalPrompt) messages.push({ role: 'system', content: finalPrompt });
  messages.push({ role: 'user', content: text });
  try {
    const reply = await callGeminiChat(messages, settings.maxTokens || 800, settings.temperature || 0.7);
    if (!reply) {
      return;
    }
    await typingEffectSend(conn, jid, reply, msg, settings.typingMs || 800);
  } catch (err) {
    console.error('❌ Chatbot generation error:', err.message || err);
  }
};