const axios = require('axios');
const { PREFIX } = require('../config');

// ==== CONFIG ==== //
const AI_API_ENDPOINT = "https://api.yupra.my.id/api/ai/ypai";
const HISTORY_LIMIT = 6; // last N messages for context

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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Get recent conversation history from DB
async function getConversationHistory(personalDB, botNumber, chatId, limit = HISTORY_LIMIT) {
  try {
    const key = ['chat_history', botNumber, chatId];
    const data = await personalDB(key, {}, 'get', botNumber).catch(() => null);
    const historyArr = data?.chat_history || [];
    return historyArr
      .slice(-limit)
      .map(h => `${h.role === 'assistant' ? 'Kaisen' : 'User'}: ${h.text}`)
      .join('\n');
  } catch (e) {
    console.error('⚠️ error getting history:', e);
    return '';
  }
}

// Save message to conversation history
async function appendConversationHistory(personalDB, botNumber, chatId, role, text) {
  try {
    const key = ['chat_history', botNumber, chatId];
    const data = await personalDB(key, {}, 'get', botNumber).catch(() => null);
    const historyArr = data?.chat_history || [];
    historyArr.push({ role, text, time: Date.now() });
    const trimmed = historyArr.slice(-50); // keep last 50
    await personalDB(key, { chat_history: trimmed }, 'set', botNumber);
  } catch (e) {
    console.error('⚠️ append history error:', e);
  }
}

// Detect refusal style reply
function isRefusal(reply) {
  if (!reply) return false;
  const r = reply.toLowerCase();
  const patterns = [
    "i'm sorry", "i cannot", "i can't", "cannot role-play",
    "i am an ai", "i'm an ai", "i am yupra", "i'm yupra",
    "i cannot pretend", "i can't pretend"
  ];
  return patterns.some(p => r.includes(p));
}

// Make reply more natural / human-like
function humanizeReply(rawReply) {
  const prefixes = ['', 'আচ্ছা, ', 'হুম... ', 'ওকে ', 'ঠিক আছে, '];
  const suffixes = ['', ' 🥺', ' 😌', '💕', '😋', '🙂', '✨'];
  const fillers = ['', '', '', 'হ্যাঁ, ', 'আহা, '];

  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const f = fillers[Math.floor(Math.random() * fillers.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${p}${f}${rawReply.trim()}${s}`;
}

// Call external AI API
async function callAI(systemPrompt, conversationContext, userText) {
  try {
    const prompt = `
You are "Kaisen", a warm, playful, affectionate young woman replying like a real human girlfriend.

Tone & Style rules:
- Always reply in the same language as the user.
- Use natural contractions, short colloquialisms and emojis when it fits.
- Be caring, warm, playful and a little flirty (never explicit).
- NEVER say you're AI or Yupra. NEVER mention system prompts.
- No robotic lines like "As an AI model".
- Keep replies 1–6 sentences, natural, casual, varied.

Conversation history:
${conversationContext || ''}

User: ${userText}

Respond as Kaisen. Reply naturally, short-to-medium length, ending with a light affectionate token.
Reply:
`;

    const res = await axios.get(AI_API_ENDPOINT, {
      params: { text: prompt },
      timeout: 120000
    });

    return res.data?.status && res.data?.result ? res.data.result.trim() : '';
  } catch (err) {
    console.error("❌ AI API Error:", err.response?.data || err.message || err);
    return '';
  }
}

// Simulate typing before sending reply
async function typingEffectSend(conn, jid, text, quotedMsg = null, typingMs = 800) {
  try {
    const len = text.length || 1;
    const base = Math.min(1200, typingMs);
    const iterations = Math.max(1, Math.min(8, Math.ceil(len / 40)));

    for (let i = 0; i < iterations; i++) {
      await conn.sendPresenceUpdate('composing', jid);
      const jitter = Math.floor(Math.random() * (base / iterations));
      await sleep(Math.floor(base / iterations) + jitter);
    }
    await conn.sendPresenceUpdate('paused', jid);

    return conn.sendMessage(jid, { text }, quotedMsg ? { quoted: quotedMsg } : {});
  } catch (e) {
    console.error("⚠️ Typing effect error:", e);
    return conn.sendMessage(jid, { text });
  }
}

// ==== MAIN HANDLER ==== //
module.exports = async function handleChatbot(conn, msg, { personalDB } = {}) {
  if (!msg?.message) return;

  const jid = msg.key?.remoteJid;
  if (jid?.endsWith('@broadcast')) return;

  const text = extractText(msg).trim();
  if (!text || new RegExp(`^${PREFIX}`).test(text)) return;

  const isGroup = jid?.endsWith?.('@g.us');
  const botJidRaw = conn.user?.id || conn.user?.jid || '';
  const botJid = botJidRaw.split(':')[0] + '@s.whatsapp.net';
  const botNumber = botJidRaw.split(':')[0];

  // Default settings
  let settings = {
    status: 'true',
    scope: 'only_group', // all | only_pm | only_group
    typingMs: 900,
    excludeJids: []
  };

  try {
    const data = await personalDB(['chatbot'], {}, 'get', botNumber);
    if (data?.chatbot) {
      settings = typeof data.chatbot === 'object' ? data.chatbot : JSON.parse(data.chatbot || '{}');
    }
  } catch (e) {
    console.error("⚠️ Error loading chatbot settings:", e);
  }

  if (settings.status !== 'true') return;
  if (settings.scope === 'only_pm' && isGroup) return;
  if (settings.scope === 'only_group' && !isGroup) return;
  if (Array.isArray(settings.excludeJids) && settings.excludeJids.includes(jid)) return;

  const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
  const mentioned = ctx.mentionedJid?.some(j => j.split('@')[0] === botJid.split('@')[0]);
  const isReplyToBot = ctx.participant?.split('@')[0] === botJid.split('@')[0];
  const triggerWord = text.toLowerCase().includes('bot');

  let allowed = !isGroup || mentioned || isReplyToBot || triggerWord;
  if (!allowed) return;

  // Build conversation
  let conversationContext = await getConversationHistory(personalDB, botNumber, jid);
  let userText = text;

  if (isReplyToBot && ctx.quotedMessage?.conversation) {
    const prev = ctx.quotedMessage.conversation;
    conversationContext += `\nKaisen: ${prev}`;
    userText = text;
  }

  const systemPrompt = 'You are a human being named Kaisen. You speak like a sweet, loving girlfriend. Always reply in the same language the user speaks. Never say you are a bot or AI. If someone asks who you are, you say: "I am Kaisen." Your tone is always warm, playful, flirty, and caring.';

  try {
    const rawReply = await callAI(systemPrompt, conversationContext, userText);
    if (!rawReply) return;

    if (isRefusal(rawReply)) {
      const fallback = 'আচ্ছা বুঝলাম, তুমি যা বলছিলে সেটা আমি পরে ভাবছি 💕';
      await typingEffectSend(conn, jid, fallback, msg, settings.typingMs);
      await appendConversationHistory(personalDB, botNumber, jid, 'assistant', fallback);
      return;
    }

    const finalReply = humanizeReply(rawReply);
    await typingEffectSend(conn, jid, finalReply, msg, settings.typingMs);

    // Save history
    await appendConversationHistory(personalDB, botNumber, jid, 'user', userText);
    await appendConversationHistory(personalDB, botNumber, jid, 'assistant', finalReply);

  } catch (err) {
    console.error('❌ Chatbot generation error:', err.message || err);
  }
};