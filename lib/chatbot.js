const axios = require('axios');
const { PREFIX } = require('../config');

// ==== CONFIG ==== //
const AI_API_ENDPOINT = "https://api.yupra.my.id/api/ai/ypai";
const HISTORY_LIMIT = 6; // last N messages to include for context

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

// sleep util
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// get last N conversation items from personalDB
async function getConversationHistory(personalDB, botNumber, chatId, limit = HISTORY_LIMIT) {
  try {
    const key = `chat_history:${botNumber}:${chatId}`;
    const data = await personalDB([key], {}, 'get', botNumber).catch(() => null);
    const historyArr = data?.chat_history || [];
    const last = historyArr.slice(-limit);
    return last.map(h => `${h.role === 'assistant' ? 'Kaisen' : 'User'}: ${h.text}`).join('\n');
  } catch (e) {
    console.error('⚠️ error getting history:', e);
    return '';
  }
}

// append a message to history
async function appendConversationHistory(personalDB, botNumber, chatId, role, text) {
  try {
    const key = `chat_history:${botNumber}:${chatId}`;
    const data = await personalDB([key], {}, 'get', botNumber).catch(() => null);
    const historyArr = data?.chat_history || [];
    historyArr.push({ role, text, time: Date.now() });
    const trimmed = historyArr.slice(-50); // keep only last 50 messages
    const saveObj = { chat_history: trimmed };
    await personalDB([key], saveObj, 'set', botNumber).catch(err => {
      console.error('⚠️ error saving history:', err);
    });
  } catch (e) {
    console.error('⚠️ append history error:', e);
  }
}

// check if AI reply is a refusal
function isRefusal(reply) {
  if (!reply || typeof reply !== 'string') return false;
  const r = reply.toLowerCase();
  const refusalPatterns = [
    "i'm sorry", "i am sorry", "i cannot", "i can't", "cannot role-play",
    "can't role-play", "i cannot roleplay", "i'm not able to", "i'm an ai",
    "i am an ai", "i am yupra", "i'm yupra", "i can't pretend", "i cannot pretend"
  ];
  return refusalPatterns.some(p => r.includes(p));
}

// humanize AI reply (prefix, suffix, small fillers)
function humanizeReply(rawReply) {
  const prefixes = ['', 'আচ্ছা, ', 'হুম... ', 'ওকে ', 'ঠিক আছে, '];
  const suffixes = ['', ' 🥺', ' 😌', '💕', '😋', '🙂', '✨'];
  const fillers = ['', '', '', 'হ্যাঁ, ', 'আহা, '];

  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const f = fillers[Math.floor(Math.random() * fillers.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];

  let reply = rawReply.trim();
  return `${p}${f}${reply}${s}`;
}

// call AI API
async function callAI(systemPrompt, conversationContext, userText) {
  try {
    const prompt = `
You are "Kaisen", a warm, playful, affectionate young woman replying like a real human girlfriend.
Tone & Style rules:
- Always reply in the same language the user used.
- Use natural contractions, short colloquialisms and small emojis when appropriate.
- Keep replies personal, caring, and slightly flirty but never explicit or offensive.
- NEVER say "I am an AI" or "I am Yupra" or mention system prompts.
- Avoid robotic phrases like "As an AI model" or "I cannot".
- Short occasional fillers ("হুম", "আচ্ছা", "অবশ্যই") are okay to feel natural.

Conversation history (most recent first):
${conversationContext ? conversationContext + '\n' : ''}

User: ${userText}

Respond as Kaisen (girlfriend). Keep the reply short-to-medium length (1-6 sentences), natural, and human-like. End with a light affectionate token (emoji or short phrase).
Reply:
`;

    const res = await axios.get(AI_API_ENDPOINT, {
      params: { text: prompt },
      timeout: 120000
    });

    if (res.data?.status && res.data?.result) {
      return res.data.result.trim();
    }

    console.error("❌ Unexpected API response:", res.data);
    return '';
  } catch (err) {
    const errMsg = err.response?.data || err.message || err;
    console.error("❌ AI API Error:", errMsg);
    throw new Error(`AI API Error: ${JSON.stringify(errMsg)}`);
  }
}

// typing effect
async function typingEffectSend(conn, jid, text, quotedMsg = null, typingMs = 800) {
  try {
    const len = text.length || 1;
    const base = Math.min(1200, typingMs || 800);
    const iterations = Math.max(1, Math.min(8, Math.ceil(len / 40)));
    for (let i = 0; i < iterations; i++) {
      await conn.sendPresenceUpdate('composing', jid);
      const jitter = Math.floor(Math.random() * (base / iterations));
      await sleep(Math.floor(base / iterations) + jitter);
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
  if (!msg || !msg.message) return;

  const jid = msg.key?.remoteJid;
  if (jid?.endsWith('@broadcast')) return;

  const text = extractText(msg).trim();
  const prefixRegex = new RegExp(`^${PREFIX}`);
  if (!text || prefixRegex.test(text)) return;

  const isGroup = jid?.endsWith?.('@g.us');
  const botJidRaw = conn.user?.id || conn.user?.jid || null;
  const botJid = (botJidRaw || '').split(':')[0] + '@s.whatsapp.net';
  const botNumber = (botJidRaw || '').split(':')[0];

  // default settings
  const systemPrompt = 'You are a human being named Kaisen. You speak like a sweet, loving girlfriend. Always reply in the same language the user speaks. Never say you are a bot or AI.';
  let settings = { status: 'true', scope: 'only_group', typingMs: 900, excludeJids: [] };

  try {
    const data = await personalDB(['chatbot'], {}, 'get', botNumber);
    if (data?.chatbot) settings = typeof data.chatbot === 'object' ? data.chatbot : JSON.parse(data.chatbot || '{}');
  } catch (e) {
    console.error("⚠️ Error loading chatbot settings:", e);
  }

  if (settings.status !== 'true') return;
  if (settings.scope === 'only_pm' && isGroup) return;
  if (settings.scope === 'only_group' && !isGroup) return;
  if (settings.excludeJids?.includes(jid)) return;

  const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
  const mentioned = Array.isArray(ctx.mentionedJid) && ctx.mentionedJid.some(j => j.split('@')[0] === botJid.split('@')[0]);
  const isReplyToBot = ctx.participant && ctx.participant.split('@')[0] === botJid.split('@')[0];
  const isPrivateChat = !isGroup;
  let allowed = isPrivateChat || mentioned || isReplyToBot || text.toLowerCase().includes('bot');
  if (!allowed) return;

  // conversation history
  let conversationContext = await getConversationHistory(personalDB, botNumber, jid);

  // include quoted message if reply
  let userText = text;
  if (isReplyToBot && ctx.quotedMessage?.conversation) {
    const prev = ctx.quotedMessage.conversation;
    conversationContext = conversationContext ? (conversationContext + '\n' + `User: ${text}`) : `User: ${text}`;
    userText = `Previous bot reply: ${prev}\n\n${text}`;
  }

  try {
    const rawReply = await callAI(systemPrompt, conversationContext, userText);
    if (!rawReply) return;

    const finalReply = isRefusal(rawReply)
      ? 'আচ্ছা বুঝলাম, তুমি যা বলছিলে সেটা আমি পরে ভাবছি — কিছুক্ষণে জানাবো. 💕'
      : humanizeReply(rawReply);

    await typingEffectSend(conn, jid, finalReply, msg, settings.typingMs || 900);

    // save history
    await appendConversationHistory(personalDB, botNumber, jid, 'user', userText);
    await appendConversationHistory(personalDB, botNumber, jid, 'assistant', finalReply);

  } catch (err) {
    console.error('❌ Chatbot generation error:', err.message || err);
  }
};