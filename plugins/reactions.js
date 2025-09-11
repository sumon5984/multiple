
const {
    plugin,
    mode,
    fetchGif,
    gifToVideo
} = require('../lib');
const axios = require('axios');

plugin({
    pattern: 'dance ?(.*)',
    desc: 'Send a dancing reaction GIF.',
    react: "💃",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is dancing with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is dancing!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/dance";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await message.send(videoBuffer, {
            caption: msg,
            gifPlayback: true,
            mentions: [message.sender, mentionedUser].filter(Boolean)
        }, 'video');
    } catch (error) {
        console.error("❌ Error in .dance command:", error);
        await message.send(`❌ *Error in .dance command:*\n\`\`\`Please try again later.\`\`\``);
    }
});

plugin({
    pattern: 'happy ?(.*)',
    desc: 'Send a happy reaction GIF.',
    react: "😄",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is happy because of @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is feeling happy!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/happy";
        let res = await axios.get(apiUrl);
        let gifUrl = res.data.url;

        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);

        await message.send(videoBuffer, {
            caption: msg,
            gifPlayback: true,
            mentions: [message.sender, mentionedUser].filter(Boolean)
        }, 'video');
    } catch (error) {
        console.error("❌ Error in .happy command:", error);
        await message.send(`❌ *Error in .happy command:*\n\`\`\`Please try again later.\`\`\``);
    }
});

plugin({
    pattern: 'confused ?(.*)',
    desc: 'Send a confused reaction.',
    react: "😵",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);

        let confusedEmojis = ['😵', '🤔', '😕', '🙃', '😵‍💫', '🤷‍♀️', '🤷‍♂️'];
        let randomEmoji = confusedEmojis[Math.floor(Math.random() * confusedEmojis.length)];

        let msg = mentionedUser
            ? `${sender} is confused by @${mentionedUser.split("@")[0]} ${randomEmoji}`
            : `${sender} is confused ${randomEmoji}`;

        await message.send(msg, {
            mentions: [message.sender, mentionedUser].filter(Boolean)
        });
    } catch (error) {
        console.error("❌ Error in .confused command:", error);
        await message.send(`❌ *Error occurred, please try again later.*`);
    }
});

plugin({
    pattern: 'love ?(.*)',
    desc: 'Send love to someone.',
    react: "❤️",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);

        let loveMessages = [
            "sends love and hugs! 💖",
            "is spreading love! ❤️✨",
            "shares warm feelings! 💕",
            "sends positive vibes! 💖🌟",
            "is feeling the love! 💝"
        ];
        
        let randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];

        let msg = mentionedUser
            ? `${sender} ${randomMessage.replace('!', '')} to @${mentionedUser.split("@")[0]}! 💖`
            : `${sender} ${randomMessage}`;

        await message.send(msg, {
            mentions: [message.sender, mentionedUser].filter(Boolean)
        });
    } catch (error) {
        console.error("❌ Error in .love command:", error);
        await message.send(`❌ *Error occurred, please try again later.*`);
    }
});
