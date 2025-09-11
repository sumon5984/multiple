const {
    plugin,
    mode
} = require('../lib');

// Enhanced error handling
const handleCommandError = (error, commandName) => {
    console.error(`❌ Error in ${commandName} command:`, error);
    let errorMsg = `❌ *${commandName} command failed*\n\n`;
    errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
    errorMsg += `\n\n> *© ᴘσωєʀєԃ ву 𝖐𝚊𝚒𝚜єɳ 𝙼ԃ⎯꯭̽💀*`;
    return errorMsg;
};

plugin({
    pattern: '8ball ?(.*)',
    desc: 'Ask the magic 8-ball a question',
    react: "🎱",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let question = match || "Will I be lucky today?";
        
        const responses = [
            "It is certain",
            "Reply hazy, try again",
            "Don't count on it",
            "It is decidedly so",
            "Ask again later",
            "My reply is no",
            "Without a doubt",
            "Better not tell you now",
            "My sources say no",
            "Yes definitely",
            "Cannot predict now",
            "Outlook not so good",
            "You may rely on it",
            "Concentrate and ask again",
            "Very doubtful",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Absolutely",
            "Ask me later",
            "I don't think so",
            "Yes, in due time",
            "Definitely not",
            "You can count on it",
            "Probably",
            "Unlikely",
            "No way",
            "Certainly"
        ];

        let randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        let ballText = `🎱 *MAGIC 8-BALL* 🎱\n\n`;
        ballText += `❓ *Question:* ${question}\n\n`;
        ballText += `🔮 *Answer:* ${randomResponse}\n\n`;
        ballText += `✨ *Confidence:* ${Math.floor(Math.random() * 100)}%\n\n`;
        ballText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(ballText, { mentions: [message.sender] });
    } catch (error) {
        await message.send(handleCommandError(error, '.8ball'));
    }
});

plugin({
    pattern: 'fortune ?(.*)',
    desc: 'Get your fortune reading',
    react: "🔮",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        
        const fortunes = [
            "A pleasant surprise is waiting for you.",
            "Your future is created by what you do today, not tomorrow.",
            "Good news will come to you by mail.",
            "Don't just think, act!",
            "Your shoes will make you happy today.",
            "You will find luck is just a matter of preparation meeting opportunity.",
            "The early bird catches the worm.",
            "A smile is the lighting system of the face.",
            "Today is your lucky day!",
            "Adventure awaits you in the coming days.",
            "Your hard work will soon pay off.",
            "A new friendship will brighten your path.",
            "Trust your intuition; it will guide you well.",
            "Something you lost will soon be found.",
            "An unexpected opportunity will present itself.",
            "Your creativity will solve a difficult problem.",
            "A kind gesture will return to you tenfold.",
            "The stars are aligned in your favor.",
            "Your positive attitude will attract success.",
            "A journey of a thousand miles begins with a single step."
        ];

        let randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        
        let fortuneText = `🔮 *FORTUNE READING* 🔮\n\n`;
        fortuneText += `✨ *Your Fortune:*\n${randomFortune}\n\n`;
        fortuneText += `🌟 *Lucky Numbers:* ${Math.floor(Math.random() * 99) + 1}, ${Math.floor(Math.random() * 99) + 1}, ${Math.floor(Math.random() * 99) + 1}\n`;
        fortuneText += `🍀 *Lucky Color:* ${['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink'][Math.floor(Math.random() * 7)]}\n\n`;
        fortuneText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(fortuneText, { mentions: [message.sender] });
    } catch (error) {
        await message.send(handleCommandError(error, '.fortune'));
    }
});