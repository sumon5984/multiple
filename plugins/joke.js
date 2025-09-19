const {
    plugin,
    mode
} = require('../lib');
const axios = require('axios');

// Configure axios timeout
const axiosConfig = {
    timeout: 10000 // 10 seconds timeout
};

// Enhanced error handling
const handleCommandError = (error, commandName) => {
    console.error(`❌ Error in ${commandName} command:`, error);
    let errorMsg = `❌ *${commandName} command failed*\n\n`;
    if (error.code === 'ECONNABORTED') {
        errorMsg += `⏰ Request timed out. Please try again.`;
    } else if (error.response && error.response.status >= 500) {
        errorMsg += `🔧 Server error. Please try again later.`;
    } else {
        errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
    }
    errorMsg += `\n\n> *© ᴘσωєʀєԃ ву 𝖐𝚊𝚒𝚜єɳ 𝙼ԃ⎯꯭̽💀*`;
    return errorMsg;
};

plugin({
    pattern: 'joke ?(.*)',
    desc: 'Get a random joke',
    react: "😂",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        
        const apiUrl = "https://official-joke-api.appspot.com/random_joke";
        let res = await axios.get(apiUrl, axiosConfig);
        let jokeData = res.data;

        if (jokeData && jokeData.setup && jokeData.punchline) {
            let jokeText = `😂 *RANDOM JOKE* 😂\n\n`;
            jokeText += `**Setup:** ${jokeData.setup}\n\n`;
            jokeText += `**Punchline:** ${jokeData.punchline}\n\n`;
            jokeText += `🎭 *Type:* ${jokeData.type || 'General'}\n\n`;
            jokeText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.send(jokeText, { mentions: [message.sender] });
        } else {
            throw new Error('No joke data received');
        }
    } catch (error) {
        await message.send(handleCommandError(error, '.joke'));
    }
});

plugin({
    pattern: 'dadjoke ?(.*)',
    desc: 'Get a random dad joke',
    react: "👨",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const apiUrl = "https://icanhazdadjoke.com/";
        let res = await axios.get(apiUrl, {
            headers: {
                'Accept': 'application/json'
            },
            ...axiosConfig
        });
        let jokeData = res.data;

        if (jokeData && jokeData.joke) {
            let jokeText = `👨 *DAD JOKE* 👨\n\n`;
            jokeText += `${jokeData.joke}\n\n`;
            jokeText += `😄 *Rating:* Groan-worthy\n`;
            jokeText += `🎭 *Dad Level:* Maximum\n\n`;
            jokeText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.send(jokeText, { mentions: [message.sender] });
        } else {
            throw new Error('No dad joke data received');
        }
    } catch (error) {
        await message.send(handleCommandError(error, '.dadjoke'));
    }
});

plugin({
    pattern: 'pun ?(.*)',
    desc: 'Get a random pun',
    react: "🤭",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const puns = [
            "I wondered why the baseball kept getting bigger. Then it hit me.",
            "A bicycle can't stand on its own because it is two-tired.",
            "What did the grape say when it got stepped on? Nothing, it just let out a little wine.",
            "I used to hate facial hair, but then it grew on me.",
            "The early bird might get the worm, but the second mouse gets the cheese.",
            "I'm reading a book about anti-gravity. It's impossible to put down!",
            "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
            "Why don't scientists trust atoms? Because they make up everything!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "I'm terrified of elevators, so I'm going to start taking steps to avoid them.",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a fake noodle? An impasta!",
            "How does a penguin build its house? Igloos it together!",
            "Why did the coffee file a police report? It got mugged!"
        ];

        let randomPun = puns[Math.floor(Math.random() * puns.length)];
        
        let punText = `🤭 *PUN TIME* 🤭\n\n`;
        punText += `${randomPun}\n\n`;
        punText += `😅 *Pun Level:* Epic\n`;
        punText += `🎭 *Groan Factor:* Maximum\n\n`;
        punText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(punText, { mentions: [message.sender] });
    } catch (error) {
        await message.send(handleCommandError(error, '.pun'));
    }
});