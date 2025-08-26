
const {
    plugin,
    mode,
   fetchGif,
   gifToVideo
} = require('../lib');
const axios = require('axios');


plugin({
    pattern: 'cry ?(.*)',
    desc: 'Send a crying reaction GIF.',
    react: "😢",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is crying over @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is crying!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/cry";
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
        console.error("❌ Error in .cry command:", error);
        await message.send(`❌ *Error in .cry command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'cuddle ?(.*)',
    desc: 'Send a cuddle reaction GIF.',
    react: "🤗",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} cuddled @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is cuddling everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/cuddle";
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
        console.error("❌ Error in .cuddle command:", error);
        await message.send(`❌ *Error in .cuddle command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'bully ?(.*)',
    desc: 'Send a bully reaction GIF.',
    react: "😈",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is bullying @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is bullying everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/bully";
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
        console.error("❌ Error in .bully command:", error);
        await message.send(`❌ *Error in .bully command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'hug ?(.*)',
    desc: 'Send a hug reaction GIF.',
    react: "🤗",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} hugged @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is hugging everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/hug";
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
        console.error("❌ Error in .hug command:", error);
        await message.send(`❌ *Error in .hug command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'awoo ?(.*)',
    desc: 'Send an awoo reaction GIF.',
    react: "🐺",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} awoos at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is awooing everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/awoo";
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
        console.error("❌ Error in .awoo command:", error);
        await message.send(`❌ *Error in .awoo command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'lick ?(.*)',
    desc: 'Send a lick reaction GIF.',
    react: "👅",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);

        let msg = mentionedUser ? `${sender} licked @${mentionedUser.split("@")[0]}` : `${sender} licked themselves!`;

        const apiUrl = "https://api.waifu.pics/sfw/lick";
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
        console.error("❌ Error in .lick command:", error);
        await message.send(`❌ *Error in .lick command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'pat ?(.*)',
    desc: 'Send a pat reaction GIF.',
    react: "🫂",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} patted @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is patting everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/pat";
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
        console.error("❌ Error in .pat command:", error);
        await message.send(`❌ *Error in .pat command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'smug ?(.*)',
    desc: 'Send a smug reaction GIF.',
    react: "😏",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is smug at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is feeling smug!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/smug";
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
        console.error("❌ Error in .smug command:", error);
        await message.send(`❌ *Error in .smug command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'bonk ?(.*)',
    desc: 'Send a bonk reaction GIF.',
    react: "🔨",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} bonked @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is bonking everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/bonk";
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
        console.error("❌ Error in .bonk command:", error);
        await message.send(`❌ *Error in .bonk command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'yeet ?(.*)',
    desc: 'Send a yeet reaction GIF.',
    react: "🔪",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} yeeted @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is yeeting everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/yeet";
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
        console.error("❌ Error in .yeet command:", error);
        await message.send(`❌ *Error in .yeet command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'blush ?(.*)',
    desc: 'Send a blush reaction GIF.',
    react: "😊",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is blushing at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is blushing!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/blush";
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
        console.error("❌ Error in .blush command:", error);
        await message.send(`❌ *Error in .blush command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'handhold ?(.*)',
    desc: 'Send a hand-holding reaction GIF.',
    react: "🤝",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is holding hands with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} wants to hold hands with everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/handhold";
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
        console.error("❌ Error in .handhold command:", error);
        await message.send(`❌ *Error in .handhold command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'highfive ?(.*)',
    desc: 'Send a high-five reaction GIF.',
    react: "✋",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} gave a high-five to @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is high-fiving everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/highfive";
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
        console.error("❌ Error in .highfive command:", error);
        await message.send(`❌ *Error in .highfive command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'nom ?(.*)',
    desc: 'Send a nom reaction GIF.',
    react: "🍽️",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} is nomming @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is nomming everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/nom";
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
        console.error("❌ Error in .nom command:", error);
        await message.send(`❌ *Error in .nom command:*\n\`\`\`${error.message}\`\`\``);
    }
});

plugin({
    pattern: 'wave ?(.*)',
    desc: 'Send a wave reaction GIF.',
    react: "👋",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let isGroup = message.isGroup;

        let msg = mentionedUser
            ? `${sender} waved at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is waving at everyone!`
            : `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        const apiUrl = "https://api.waifu.pics/sfw/wave";
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
        console.error("❌ Error in .wave command:", error);
        await message.send(`❌ *Error in .wave command:*\n\`\`\`${error.message}\`\`\``);
    }
});
