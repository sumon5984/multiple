
const {
    plugin,
    mode
} = require('../lib');
const axios = require('axios');

plugin({
    pattern: 'roast ?(.*)',
    desc: 'Get a funny roast',
    react: "🔥",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let mentionedUser = message.mention[0] || (message.reply_message && message.reply_message.sender);
        let sender = `@${message.sender.split("@")[0]}`;
        
        const roasts = [
            "I'd roast you, but my mom said I'm not allowed to burn trash 🔥",
            "You're proof that evolution can go in reverse 🦖",
            "I'm not saying you're dumb, but you'd struggle to pour water out of a boot with instructions on the heel 👢",
            "You bring everyone so much joy... when you leave the room 🚪",
            "If I had a dollar for every brain cell you have, I'd have 25 cents 🪙",
            "You're like a software update - nobody wants you, but here you are anyway 💻",
            "I'd explain it to you, but I left my crayons at home 🖍️",
            "You're the reason the gene pool needs a lifeguard 🏊‍♂️",
            "If you were any more inbred, you'd be a sandwich 🥪",
            "I'm jealous of people who don't know you 😌"
        ];
        
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        
        let msg = mentionedUser
            ? `${sender} roasts @${mentionedUser.split("@")[0]}:\n\n"${randomRoast}"`
            : `${sender}, here's your roast:\n\n"${randomRoast}"`;

        await message.send(`🔥 *ROAST ZONE* 🔥\n\n${msg}\n\n*Disclaimer: This is just for fun!*\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`, {
            mentions: [message.sender, mentionedUser].filter(Boolean)
        });
    } catch (error) {
        console.error("❌ Error in .roast command:", error);
        await message.send("❌ *Error occurred while roasting.*");
    }
});

plugin({
    pattern: 'pickup ?(.*)',
    desc: 'Get a pickup line',
    react: "😏",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const pickupLines = [
            "Are you Wi-Fi? Because I'm feeling a connection 📶",
            "Do you have a map? I keep getting lost in your eyes 🗺️",
            "Are you a magician? Because every time I look at you, everyone else disappears ✨",
            "If you were a vegetable, you'd be a cute-cumber 🥒",
            "Are you made of copper and tellurium? Because you're Cu-Te 🧪",
            "Do you have a Band-Aid? I just scraped my knee falling for you 🩹",
            "Are you a parking ticket? Because you've got 'FINE' written all over you 🎫",
            "If you were a triangle, you'd be acute one 📐",
            "Are you a time traveler? Because I see you in my future ⏰",
            "Do you believe in love at first sight, or should I walk by again? 👀"
        ];
        
        const randomLine = pickupLines[Math.floor(Math.random() * pickupLines.length)];
        
        await message.send(`😏 *PICKUP LINE GENERATOR* 😏\n\n"${randomLine}"\n\n*Use at your own risk!* 😂\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .pickup command:", error);
        await message.send("❌ *Error occurred while generating pickup line.*");
    }
});

plugin({
    pattern: 'truth ?(.*)',
    desc: 'Get a truth question for truth or dare',
    react: "🤔",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const truthQuestions = [
            "What's the most embarrassing thing you've ever done?",
            "Who was your first crush?",
            "What's your biggest fear?",
            "Have you ever lied to your best friend?",
            "What's the weirdest dream you've ever had?",
            "What's your most embarrassing childhood memory?",
            "Have you ever had a crush on a teacher?",
            "What's the longest you've gone without showering?",
            "What's your biggest secret?",
            "Have you ever cheated on a test?",
            "What's the worst thing you've ever said to someone?",
            "Who do you have a crush on right now?",
            "What's something you've never told your parents?",
            "Have you ever been in love?",
            "What's your most irrational fear?"
        ];
        
        const randomQuestion = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
        
        await message.send(`🤔 *TRUTH QUESTION* 🤔\n\n${randomQuestion}\n\n*Answer honestly!* 😊\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .truth command:", error);
        await message.send("❌ *Error occurred while generating truth question.*");
    }
});

plugin({
    pattern: 'dare ?(.*)',
    desc: 'Get a dare challenge for truth or dare',
    react: "😈",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const dareChallengess = [
            "Send a silly selfie to the group",
            "Do 10 jumping jacks and record it",
            "Sing your favorite song out loud",
            "Do your best animal impression",
            "Call someone and sing Happy Birthday",
            "Post an embarrassing photo on your story",
            "Do the chicken dance",
            "Speak in an accent for the next 10 minutes",
            "Write your name with your non-dominant hand",
            "Do 20 push-ups",
            "Eat a spoonful of hot sauce",
            "Dance to a song of the group's choice",
            "Send a voice message singing the alphabet",
            "Do your best celebrity impression",
            "Wear your clothes backwards for 30 minutes"
        ];
        
        const randomDare = dareChallengess[Math.floor(Math.random() * dareChallengess.length)];
        
        await message.send(`😈 *DARE CHALLENGE* 😈\n\n${randomDare}\n\n*Complete the dare!* 💪\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .dare command:", error);
        await message.send("❌ *Error occurred while generating dare challenge.*");
    }
});

plugin({
    pattern: 'wouldyou ?(.*)',
    desc: 'Get a would you rather question',
    react: "🤷",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const wouldYouRather = [
            "Would you rather have the ability to fly or be invisible?",
            "Would you rather live without music or without TV?",
            "Would you rather be able to read minds or predict the future?",
            "Would you rather have unlimited money or unlimited time?",
            "Would you rather live in the past or the future?",
            "Would you rather be famous or anonymous?",
            "Would you rather have super strength or super speed?",
            "Would you rather never use social media again or never watch TV again?",
            "Would you rather be able to speak every language or play every instrument?",
            "Would you rather live underwater or in space?",
            "Would you rather never eat your favorite food again or only eat your favorite food?",
            "Would you rather be incredibly lucky or incredibly smart?",
            "Would you rather have a rewind button or a pause button for life?",
            "Would you rather know when you're going to die or how you're going to die?",
            "Would you rather be feared by all or loved by all?"
        ];
        
        const randomQuestion = wouldYouRather[Math.floor(Math.random() * wouldYouRather.length)];
        
        await message.send(`🤷 *WOULD YOU RATHER* 🤷\n\n${randomQuestion}\n\n*What's your choice?* 🤔\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .wouldyou command:", error);
        await message.send("❌ *Error occurred while generating question.*");
    }
});

plugin({
    pattern: 'advice ?(.*)',
    desc: 'Get some life advice',
    react: "💡",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const advice = [
            "Always be yourself, unless you can be a unicorn. Then always be a unicorn 🦄",
            "Life is like a camera: focus on what's important and you'll capture it perfectly 📸",
            "Don't wait for opportunity. Create it ✨",
            "The best time to plant a tree was 20 years ago. The second best time is now 🌳",
            "Be yourself; everyone else is already taken 💫",
            "In the end, we only regret the chances we didn't take 🎯",
            "Life begins at the end of your comfort zone 🚀",
            "Don't let yesterday take up too much of today 📅",
            "Success is not final, failure is not fatal: it is the courage to continue that counts 💪",
            "The only way to do great work is to love what you do ❤️",
            "Believe you can and you're halfway there 🌟",
            "It's never too late to be what you might have been 🎭",
            "The future belongs to those who believe in the beauty of their dreams 🌈",
            "You are never too old to set another goal or to dream a new dream 🎯",
            "Happiness is not by chance, but by choice 😊"
        ];
        
        const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
        const sender = `@${message.sender.split("@")[0]}`;
        
        await message.send(`💡 *LIFE ADVICE* 💡\n\n${sender}, here's some wisdom for you:\n\n"${randomAdvice}"\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`, {
            mentions: [message.sender]
        });
    } catch (error) {
        console.error("❌ Error in .advice command:", error);
        await message.send("❌ *Error occurred while generating advice.*");
    }
});
