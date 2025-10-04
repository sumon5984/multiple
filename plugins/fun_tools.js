const { plugin, mode } = require("../lib");

// ==================== COIN FLIP ====================
plugin(
  {
    pattern: "flip ?(.*)",
    desc: "Flip a coin (Heads or Tails)",
    react: "🪙",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      const flipAnimation = ["🪙", "🔄", "🪙", "🔄", "🪙"];
      let msg = await message.send(`${flipAnimation[0]} *Flipping coin...*`);

      // Animation effect
      for (let i = 1; i < flipAnimation.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await message.send(`${flipAnimation[i]} *Flipping...*`, {
          edit: msg.key,
        });
      }

      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      const emoji = result === "Heads" ? "🟡" : "⚫";

      await message.send(
        `╭━━━『 🪙 *COIN FLIP* 🪙 』━━━╮\n\n` +
          `${emoji} *Result:* **${result}** ${emoji}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`,
        { edit: msg.key }
      );
    } catch (error) {
      console.error("❌ Error in .flip command:", error);
      await message.send("❌ *Error occurred while flipping coin.*");
    }
  }
);

// ==================== FORTUNE ====================
plugin(
  {
    pattern: "fortune ?(.*)",
    desc: "Get your daily fortune",
    react: "🔮",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      const fortunes = [
        {
          text: "Today will bring unexpected joy!",
          emoji: "✨",
          luck: "Excellent",
        },
        {
          text: "A surprise awaits around the corner",
          emoji: "🎁",
          luck: "Very Good",
        },
        {
          text: "Your creativity will shine brightly",
          emoji: "🌟",
          luck: "Excellent",
        },
        {
          text: "Someone will make you smile today",
          emoji: "😊",
          luck: "Good",
        },
        {
          text: "Good things come to those who wait",
          emoji: "🍀",
          luck: "Fair",
        },
        {
          text: "Today is perfect for new beginnings",
          emoji: "🌱",
          luck: "Very Good",
        },
        {
          text: "Your positive energy attracts good luck",
          emoji: "🧿",
          luck: "Excellent",
        },
        {
          text: "A message from afar will brighten your day",
          emoji: "💌",
          luck: "Good",
        },
        {
          text: "You'll discover something amazing",
          emoji: "🔍",
          luck: "Very Good",
        },
        {
          text: "Your kindness returns tenfold",
          emoji: "💖",
          luck: "Excellent",
        },
        {
          text: "Adventure is calling your name",
          emoji: "🗺️",
          luck: "Very Good",
        },
        {
          text: "Today brings opportunities for growth",
          emoji: "📈",
          luck: "Good",
        },
        {
          text: "You'll find wisdom in unexpected places",
          emoji: "📚",
          luck: "Very Good",
        },
        {
          text: "Your dreams feel closer than ever",
          emoji: "🌙",
          luck: "Excellent",
        },
        { text: "A moment of clarity awaits you", emoji: "💡", luck: "Good" },
        {
          text: "Your hard work will soon pay off",
          emoji: "🏆",
          luck: "Very Good",
        },
        {
          text: "Love surrounds you in unexpected ways",
          emoji: "💕",
          luck: "Excellent",
        },
        {
          text: "Today you'll make an important connection",
          emoji: "🤝",
          luck: "Very Good",
        },
      ];

      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      const sender = `@${message.sender.split("@")[0]}`;
      const luckyNumber = Math.floor(Math.random() * 99) + 1;

      await message.send(
        `╭━━━『 🔮 *FORTUNE COOKIE* 🔮 』━━━╮\n\n` +
          `👤 *For:* ${sender}\n\n` +
          `${fortune.emoji} "${fortune.text}"\n\n` +
          `🍀 *Luck Level:* ${fortune.luck}\n` +
          `🎰 *Lucky Number:* ${luckyNumber}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`,
        { mentions: [message.sender] }
      );
    } catch (error) {
      console.error("❌ Error in .fortune command:", error);
      await message.send("❌ *Error occurred while reading fortune.*");
    }
  }
);

// ==================== MAGIC 8-BALL ====================
plugin(
  {
    pattern: "magic8 ?(.*)",
    desc: "Ask the magic 8-ball a question",
    react: "🎱",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      if (!match) {
        return await message.send(
          `╭━━━『 🎱 *MAGIC 8-BALL* 🎱 』━━━╮\n\n` +
            `Please ask a yes/no question!\n\n` +
            `📝 *Example:*\n.magic8 Will I be successful?\n\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );
      }

      const responses = [
        { answer: "It is certain", emoji: "✅", type: "Positive" },
        { answer: "It is decidedly so", emoji: "✅", type: "Positive" },
        { answer: "Without a doubt", emoji: "✅", type: "Positive" },
        { answer: "Yes definitely", emoji: "✅", type: "Positive" },
        { answer: "You may rely on it", emoji: "✅", type: "Positive" },
        { answer: "As I see it, yes", emoji: "✅", type: "Positive" },
        { answer: "Most likely", emoji: "✅", type: "Positive" },
        { answer: "Outlook good", emoji: "✅", type: "Positive" },
        { answer: "Yes", emoji: "✅", type: "Positive" },
        { answer: "Signs point to yes", emoji: "✅", type: "Positive" },
        { answer: "Reply hazy, try again", emoji: "🔄", type: "Uncertain" },
        { answer: "Ask again later", emoji: "🔄", type: "Uncertain" },
        { answer: "Better not tell you now", emoji: "🔄", type: "Uncertain" },
        { answer: "Cannot predict now", emoji: "🔄", type: "Uncertain" },
        { answer: "Concentrate and ask again", emoji: "🔄", type: "Uncertain" },
        { answer: "Don't count on it", emoji: "❌", type: "Negative" },
        { answer: "My reply is no", emoji: "❌", type: "Negative" },
        { answer: "My sources say no", emoji: "❌", type: "Negative" },
        { answer: "Outlook not so good", emoji: "❌", type: "Negative" },
        { answer: "Very doubtful", emoji: "❌", type: "Negative" },
      ];

      await message.send(`🎱 *Shaking the magic 8-ball...*`);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = responses[Math.floor(Math.random() * responses.length)];

      await message.send(
        `╭━━━『 🎱 *MAGIC 8-BALL* 🎱 』━━━╮\n\n` +
          `❓ *Question:*\n${match}\n\n` +
          `${response.emoji} *Answer:*\n${response.answer}\n\n` +
          `📊 *Type:* ${response.type}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`
      );
    } catch (error) {
      console.error("❌ Error in .magic8 command:", error);
      await message.send("❌ *The magic 8-ball is cloudy, try again later.*");
    }
  }
);

// ==================== CHOICE MAKER ====================
plugin(
  {
    pattern: "choose ?(.*)",
    desc: "Let the bot choose between options",
    react: "🤔",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      if (!match) {
        return await message.send(
          `╭━━━『 🤔 *CHOICE MAKER* 🤔 』━━━╮\n\n` +
            `Please provide options!\n\n` +
            `📝 *Format:* .choose option1, option2, option3\n\n` +
            `💡 *Example:*\n.choose pizza, burger, pasta\n\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );
      }

      const options = match
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);

      if (options.length < 2) {
        return await message.send(
          `❌ Please provide at least 2 options separated by commas!`
        );
      }

      if (options.length > 10) {
        return await message.send(
          `❌ Maximum 10 options allowed! You provided ${options.length}.`
        );
      }

      await message.send(`🤔 *Analyzing options...*`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const choice = options[Math.floor(Math.random() * options.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%

      await message.send(
        `╭━━━『 🤔 *CHOICE MAKER* 🤔 』━━━╮\n\n` +
          `📋 *Options:*\n${options
            .map((opt, i) => `${i + 1}. ${opt}`)
            .join("\n")}\n\n` +
          `🎯 *My Choice:* **${choice}**\n` +
          `📊 *Confidence:* ${confidence}%\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`
      );
    } catch (error) {
      console.error("❌ Error in .choose command:", error);
      await message.send("❌ *Error occurred while making choice.*");
    }
  }
);

// ==================== COMPLIMENT ====================
plugin(
  {
    pattern: "compliment ?(.*)",
    desc: "Give someone a heartfelt compliment",
    react: "🌟",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      const mentionedUser =
        message.mention?.[0] || message.reply_message?.sender;
      const sender = `@${message.sender.split("@")[0]}`;

      const compliments = [
        {
          text: "You're absolutely amazing!",
          emoji: "✨",
          category: "General",
        },
        {
          text: "You light up every room you enter!",
          emoji: "🌟",
          category: "Presence",
        },
        {
          text: "Your smile is contagious!",
          emoji: "😊",
          category: "Happiness",
        },
        {
          text: "You're incredibly talented!",
          emoji: "🎯",
          category: "Skills",
        },
        {
          text: "You have such a kind heart!",
          emoji: "💖",
          category: "Character",
        },
        { text: "You're really inspiring!", emoji: "🌈", category: "Impact" },
        { text: "You're one of a kind!", emoji: "🦄", category: "Uniqueness" },
        {
          text: "You make everything better!",
          emoji: "☀️",
          category: "Positivity",
        },
        { text: "You're simply wonderful!", emoji: "🌸", category: "General" },
        { text: "You're a true gem!", emoji: "💎", category: "Value" },
        {
          text: "You're incredibly creative!",
          emoji: "🎨",
          category: "Creativity",
        },
        { text: "You have great energy!", emoji: "⚡", category: "Vibe" },
        { text: "You're really special!", emoji: "🌟", category: "Uniqueness" },
        {
          text: "You're absolutely fantastic!",
          emoji: "🎉",
          category: "General",
        },
        {
          text: "You brighten everyone's day!",
          emoji: "🌞",
          category: "Impact",
        },
        {
          text: "Your wisdom is truly admirable!",
          emoji: "🦉",
          category: "Intelligence",
        },
        {
          text: "You're a natural leader!",
          emoji: "👑",
          category: "Leadership",
        },
        {
          text: "Your dedication is inspiring!",
          emoji: "🔥",
          category: "Motivation",
        },
        {
          text: "You have an amazing personality!",
          emoji: "🎭",
          category: "Character",
        },
        {
          text: "You're incredibly thoughtful!",
          emoji: "💭",
          category: "Kindness",
        },
      ];

      const compliment =
        compliments[Math.floor(Math.random() * compliments.length)];

      let recipientMsg, mentions;

      if (mentionedUser) {
        const recipientName = `@${mentionedUser.split("@")[0]}`;
        recipientMsg = `💌 ${sender} → ${recipientName}`;
        mentions = [message.sender, mentionedUser];
      } else {
        recipientMsg = `💌 *To:* ${sender}`;
        mentions = [message.sender];
      }

      await message.send(
        `╭━━━『 🌟 *COMPLIMENT* 🌟 』━━━╮\n\n` +
          `${recipientMsg}\n\n` +
          `${compliment.emoji} "${compliment.text}"\n\n` +
          `🏷️ *Category:* ${compliment.category}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`,
        { mentions }
      );
    } catch (error) {
      console.error("❌ Error in .compliment command:", error);
      await message.send("❌ *Error occurred while giving compliment.*");
    }
  }
);

// ==================== DICE ROLL ====================
plugin(
  {
    pattern: "dice ?(.*)",
    desc: "Roll a dice (1-6) or custom range",
    react: "🎲",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      let sides = 6;
      let count = 1;

      if (match) {
        const parts = match.trim().split(/\s+/);
        if (parts[0]) sides = parseInt(parts[0]) || 6;
        if (parts[1]) count = parseInt(parts[1]) || 1;

        if (sides < 2 || sides > 100) sides = 6;
        if (count < 1 || count > 10) count = 1;
      }

      const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
      const results = [];

      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * sides) + 1);
      }

      const total = results.reduce((a, b) => a + b, 0);
      const resultsDisplay = results
        .map(
          (r, i) =>
            `🎲 Dice ${i + 1}: **${r}**${r <= 6 ? ` ${diceEmojis[r - 1]}` : ""}`
        )
        .join("\n");

      await message.send(
        `╭━━━『 🎲 *DICE ROLL* 🎲 』━━━╮\n\n` +
          `🎯 *Sides:* ${sides}\n` +
          `🔢 *Count:* ${count}\n\n` +
          `${resultsDisplay}\n\n` +
          `${count > 1 ? `➕ *Total:* **${total}**\n` : ""}` +
          `📊 *Average:* ${(total / count).toFixed(2)}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`
      );
    } catch (error) {
      console.error("❌ Error in .dice command:", error);
      await message.send("❌ *Error occurred while rolling dice.*");
    }
  }
);

// ==================== RANDOM NUMBER ====================
plugin(
  {
    pattern: "random ?(.*)",
    desc: "Generate random number(s) in a range",
    react: "🎰",
    type: "fun",
    fromMe: mode,
  },
  async (message, match) => {
    try {
      let min = 1,
        max = 100,
        count = 1;

      if (match) {
        const parts = match.trim().split(/\s+/);
        if (parts[0]) min = parseInt(parts[0]) || 1;
        if (parts[1]) max = parseInt(parts[1]) || 100;
        if (parts[2]) count = parseInt(parts[2]) || 1;

        if (min > max) [min, max] = [max, min];
        if (count < 1) count = 1;
        if (count > 20) count = 20;
      }

      const numbers = [];
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }

      await message.send(
        `╭━━━『 🎰 *RANDOM NUMBER* 🎰 』━━━╮\n\n` +
          `📊 *Range:* ${min} - ${max}\n` +
          `🔢 *Count:* ${count}\n\n` +
          `🎯 *Result${count > 1 ? "s" : ""}:*\n${numbers
            .map((n, i) => `${i + 1}. **${n}**`)
            .join("\n")}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `💡 *Usage:* .random <min> <max> <count>\n\n` +
          `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`
      );
    } catch (error) {
      console.error("❌ Error in .random command:", error);
      await message.send("❌ *Error occurred while generating random number.*");
    }
  }
);
