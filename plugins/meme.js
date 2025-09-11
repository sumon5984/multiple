const {
    plugin,
    mode
} = require('../lib');
const axios = require('axios');
const config = require('../config');

// Configure axios timeout
const axiosConfig = {
    timeout: 10000 // 10 seconds timeout
};

// Popular meme templates with their IDs
const memeTemplates = {
    'drake': '181913649',
    'distracted_boyfriend': '112126428',
    'mocking_spongebob': '102156234',
    'two_buttons': '87743020',
    'change_my_mind': '129242436',
    'expanding_brain': '93895088',
    'woman_yelling_at_cat': '188390779',
    'surprised_pikachu': '155067746',
    'this_is_fine': '55311130',
    'scroll_of_truth': '123999232',
    'one_does_not_simply': '61579',
    'ancient_aliens': '101470',
    'bad_luck_brian': '61585',
    'success_kid': '61544',
    'grumpy_cat': '405658',
    'doge': '8072285',
    'arthur_fist': '80707627'
};

// Main meme generation command with custom text
plugin({
    pattern: 'meme ?(.*)',
    desc: 'Generate custom memes with text. Usage: .meme top text|bottom text or .meme template_name top text|bottom text',
    react: "😂",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        
        if (!match || match.trim() === '') {
            let helpText = `🎭 *CUSTOM MEME GENERATOR* 🎭\n\n`;
            helpText += `📝 *Usage:*\n`;
            helpText += `• .meme top text|bottom text\n`;
            helpText += `• .meme template_name top text|bottom text\n\n`;
            helpText += `🖼️ *Popular Templates:*\n`;
            helpText += `• drake, distracted_boyfriend\n`;
            helpText += `• mocking_spongebob, two_buttons\n`;
            helpText += `• change_my_mind, expanding_brain\n`;
            helpText += `• woman_yelling_at_cat, surprised_pikachu\n`;
            helpText += `• this_is_fine, one_does_not_simply\n\n`;
            helpText += `💡 *Examples:*\n`;
            helpText += `• .meme Me trying to code|It's working somehow\n`;
            helpText += `• .meme drake Don't study for exam|Study one day before exam\n\n`;
            helpText += `ℹ️ *Note:* For random memes use .rmeme\n\n`;
            helpText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
            
            await message.send(helpText, { mentions: [message.sender] });
            return;
        }

        // Check if Imgflip credentials are configured
        if (!config.IMGFLIP_USERNAME || !config.IMGFLIP_PASSWORD) {
            let errorMsg = `❌ *IMGFLIP API NOT CONFIGURED*\n\n`;
            errorMsg += `⚙️ To use custom meme generation, please configure:\n`;
            errorMsg += `• IMGFLIP_USERNAME\n`;
            errorMsg += `• IMGFLIP_PASSWORD\n\n`;
            errorMsg += `📝 Get free account at: https://imgflip.com/signup\n\n`;
            errorMsg += `💡 For now, you can use .rmeme for random memes!\n\n`;
            errorMsg += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
            
            await message.send(errorMsg, { mentions: [message.sender] });
            return;
        }

        await message.send("🎭 Generating your custom meme... Please wait!");

        let templateId = '181913649'; // Default drake template
        let inputText = match.trim();
        
        // Check if a template is specified
        for (const [templateName, id] of Object.entries(memeTemplates)) {
            if (inputText.toLowerCase().startsWith(templateName.toLowerCase() + ' ')) {
                templateId = id;
                inputText = inputText.substring(templateName.length + 1);
                break;
            }
        }

        // Parse text (split by |)
        let texts = inputText.split('|');
        if (texts.length < 2) {
            await message.send(`❌ *Invalid format!*\n\nUse: .meme top text|bottom text\nExample: .meme When you code|It actually works`);
            return;
        }

        let topText = texts[0].trim();
        let bottomText = texts[1].trim();

        // Generate meme using Imgflip API
        const formData = new URLSearchParams({
            template_id: templateId,
            username: config.IMGFLIP_USERNAME,
            password: config.IMGFLIP_PASSWORD,
            text0: topText,
            text1: bottomText
        });

        const response = await axios.post(
            'https://api.imgflip.com/caption_image',
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                ...axiosConfig
            }
        );

        if (response.data && response.data.success && response.data.data && response.data.data.url) {
            let caption = `🎭 *CUSTOM MEME GENERATED* 🎭\n\n`;
            caption += `📝 *Top:* ${topText}\n`;
            caption += `📝 *Bottom:* ${bottomText}\n`;
            caption += `🖼️ *Template:* ${Object.keys(memeTemplates).find(key => memeTemplates[key] === templateId) || 'Default'}\n\n`;
            caption += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.client.sendMessage(message.jid, {
                image: { url: response.data.data.url },
                caption: caption,
                mentions: [message.sender]
            }, { quoted: message.data });
        } else {
            throw new Error(response.data ? response.data.error_message || 'Unknown API error' : 'No response data');
        }

    } catch (error) {
        console.error("❌ Error in .meme command:", error);
        let errorMsg = `❌ *Failed to generate meme*\n\n`;
        
        if (error.code === 'ECONNABORTED') {
            errorMsg += `⏰ Request timed out. Please try again.`;
        } else if (error.response && error.response.status === 401) {
            errorMsg += `🔐 Invalid Imgflip credentials. Please check configuration.`;
        } else if (error.response && error.response.status === 429) {
            errorMsg += `⚡ Rate limit exceeded. Please wait before trying again.`;
        } else {
            errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
        }
        
        errorMsg += `\n\n💡 You can use .rmeme for random memes!\n\n`;
        errorMsg += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
        
        await message.send(errorMsg);
    }
});

// Random meme command (renamed from original meme command)
plugin({
    pattern: 'rmeme ?(.*)',
    desc: 'Get random memes from Reddit',
    react: "🎲",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        
        await message.send("🎲 Fetching random meme... Please wait!");
        
        const apiUrl = "https://meme-api.com/gimme";
        let res = await axios.get(apiUrl, axiosConfig);
        let memeData = res.data;

        if (memeData && memeData.url) {
            let caption = `🎲 *RANDOM MEME* 🎲\n\n`;
            caption += `*${memeData.title}*\n\n`;
            caption += `📊 *Upvotes:* ${memeData.ups || 'N/A'}\n`;
            caption += `🔗 *Subreddit:* r/${memeData.subreddit}\n`;
            caption += `👤 *Posted by:* u/${memeData.author}\n\n`;
            caption += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.client.sendMessage(message.jid, {
                image: { url: memeData.url },
                caption: caption,
                mentions: [message.sender]
            }, { quoted: message.data });
        } else {
            throw new Error('No meme data received');
        }
    } catch (error) {
        console.error("❌ Error in .rmeme command:", error);
        let errorMsg = `❌ *Failed to fetch random meme*\n\n`;
        
        if (error.code === 'ECONNABORTED') {
            errorMsg += `⏰ Request timed out. Please try again.`;
        } else {
            errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
        }
        
        errorMsg += `\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
        
        await message.send(errorMsg);
    }
});

// Dank memes from specific subreddit
plugin({
    pattern: 'dmeme ?(.*)',
    desc: 'Generate dank memes from r/dankmemes',
    react: "🔥",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        await message.send("🔥 Fetching dank meme... Please wait!");
        
        const apiUrl = "https://meme-api.com/gimme/dankmemes";
        let res = await axios.get(apiUrl, axiosConfig);
        let memeData = res.data;

        if (memeData && memeData.url) {
            let caption = `🔥 *DANK MEME* 🔥\n\n`;
            caption += `*${memeData.title}*\n\n`;
            caption += `🔥 *Dank Level:* Maximum\n`;
            caption += `📊 *Upvotes:* ${memeData.ups || 'N/A'}\n`;
            caption += `🔗 *Source:* r/${memeData.subreddit}\n`;
            caption += `👤 *Posted by:* u/${memeData.author}\n\n`;
            caption += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.client.sendMessage(message.jid, {
                image: { url: memeData.url },
                caption: caption,
                mentions: [message.sender]
            }, { quoted: message.data });
        } else {
            throw new Error('No meme data received');
        }
    } catch (error) {
        console.error("❌ Error in .dmeme command:", error);
        let errorMsg = `❌ *Failed to fetch dank meme*\n\n`;
        
        if (error.code === 'ECONNABORTED') {
            errorMsg += `⏰ Request timed out. Please try again.`;
        } else {
            errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
        }
        
        errorMsg += `\n\n💡 Try .rmeme for random memes!\n\n`;
        errorMsg += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
        
        await message.send(errorMsg);
    }
});

// Programming memes
plugin({
    pattern: 'programming ?(.*)',
    desc: 'Programming and coding memes from r/ProgrammerHumor',
    react: "💻",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        await message.send("💻 Fetching programming meme... Please wait!");
        
        const apiUrl = "https://meme-api.com/gimme/ProgrammerHumor";
        let res = await axios.get(apiUrl, axiosConfig);
        let memeData = res.data;

        if (memeData && memeData.url) {
            let caption = `💻 *PROGRAMMER HUMOR* 💻\n\n`;
            caption += `*${memeData.title}*\n\n`;
            caption += `💻 *Coding Humor Level:* Expert\n`;
            caption += `📊 *Upvotes:* ${memeData.ups || 'N/A'}\n`;
            caption += `🔗 *Source:* r/${memeData.subreddit}\n`;
            caption += `👤 *Posted by:* u/${memeData.author}\n\n`;
            caption += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.client.sendMessage(message.jid, {
                image: { url: memeData.url },
                caption: caption,
                mentions: [message.sender]
            }, { quoted: message.data });
        } else {
            throw new Error('No meme data received');
        }
    } catch (error) {
        console.error("❌ Error in .programming command:", error);
        let errorMsg = `❌ *Failed to fetch programming meme*\n\n`;
        
        if (error.code === 'ECONNABORTED') {
            errorMsg += `⏰ Request timed out. Please try again.`;
        } else {
            errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
        }
        
        errorMsg += `\n\n💡 Try .rmeme for random memes!\n\n`;
        errorMsg += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
        
        await message.send(errorMsg);
    }
});

// Meme templates list
plugin({
    pattern: 'mtemplates ?(.*)',
    desc: 'List popular meme templates for custom generation',
    react: "📋",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let templatesText = `📋 *MEME TEMPLATES* 📋\n\n`;
        templatesText += `🎭 *Popular Templates for Custom Memes:*\n\n`;
        
        const templateEntries = Object.entries(memeTemplates);
        for (let i = 0; i < templateEntries.length; i++) {
            const [name, id] = templateEntries[i];
            templatesText += `${i + 1}. *${name.replace(/_/g, ' ')}*\n`;
        }
        
        templatesText += `\n💡 *Usage:*\n`;
        templatesText += `• .meme template_name top text|bottom text\n`;
        templatesText += `• Example: .meme drake Love coding|Love debugging\n\n`;
        templatesText += `🎲 *Want random memes?* Use .rmeme\n\n`;
        templatesText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
        
        await message.send(templatesText, { mentions: [message.sender] });
    } catch (error) {
        console.error("❌ Error in .mtemplates command:", error);
        await message.send(`❌ *Error loading templates*\n\nPlease try again later.\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    }
});