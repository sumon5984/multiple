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
        errorMsg += `🔧 Please try again later.`;
    }
    errorMsg += `\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
    return errorMsg;
};

plugin({
    pattern: 'fact ?(.*)',
    desc: 'Get a random fun fact',
    react: "🧠",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        
        const apiUrl = "https://uselessfacts.jsph.pl/random.json?language=en";
        let res = await axios.get(apiUrl, axiosConfig);
        let factData = res.data;

        if (factData && factData.text) {
            let factText = `🧠 *FUN FACT* 🧠\n\n`;
            factText += `📚 ${factData.text}\n\n`;
            factText += `🎯 *Category:* ${factData.source || 'General Knowledge'}\n`;
            factText += `📊 *Mind-blown Level:* ${Math.floor(Math.random() * 100) + 1}%\n`;
            factText += `🤓 *Nerd Points:* +${Math.floor(Math.random() * 50) + 10}\n\n`;
            factText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

            await message.send(factText, { mentions: [message.sender] });
        } else {
            throw new Error('No fact data received');
        }
    } catch (error) {
        await message.send(handleCommandError(error, '.fact'));
    }
});

plugin({
    pattern: 'trivia ?(.*)',
    desc: 'Get random trivia questions and facts',
    react: "🎯",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const triviaFacts = [
            "Octopuses have three hearts and blue blood!",
            "Bananas are berries, but strawberries aren't!",
            "A group of flamingos is called a 'flamboyance'!",
            "Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs.",
            "A single cloud can weigh more than a million pounds!",
            "Sharks are older than trees! They've been around for about 400 million years.",
            "There are more possible games of chess than atoms in the observable universe!",
            "Wombat poop is cube-shaped!",
            "A mantis shrimp can punch with the force of a bullet!",
            "The shortest war in history lasted only 38-45 minutes!",
            "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid!",
            "There are more trees on Earth than stars in the Milky Way galaxy!",
            "A single teaspoon of neutron star material would weigh about 6 billion tons!",
            "Dolphins have names for each other!",
            "The human brain contains approximately 86 billion neurons!",
            "A day on Venus is longer than its year!",
            "Butterflies taste with their feet!",
            "The Great Wall of China isn't visible from space with the naked eye!",
            "A group of pugs is called a 'grumble'!",
            "The immortal jellyfish can theoretically live forever!"
        ];

        let randomTrivia = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
        
        let triviaText = `🎯 *TRIVIA TIME* 🎯\n\n`;
        triviaText += `🧩 ${randomTrivia}\n\n`;
        triviaText += `📖 *Knowledge Category:* Random Facts\n`;
        triviaText += `🤯 *Wow Factor:* ${Math.floor(Math.random() * 30) + 70}%\n`;
        triviaText += `🏆 *Trivia Points:* +${Math.floor(Math.random() * 25) + 15}\n\n`;
        triviaText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(triviaText, { mentions: [message.sender] });
    } catch (error) {
        await message.send(handleCommandError(error, '.trivia'));
    }
});

plugin({
    pattern: 'science ?(.*)',
    desc: 'Get interesting science facts',
    react: "🔬",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const scienceFacts = [
            "Water can exist in all three states of matter at the same time in what's called the 'triple point'!",
            "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth!",
            "Your body produces about 25 million new cells every second!",
            "The human eye can distinguish about 10 million different colors!",
            "Antarctica is technically a desert because it receives very little precipitation!",
            "Sound travels 4 times faster in water than in air!",
            "A lightning bolt is 5 times hotter than the surface of the Sun!",
            "The human brain uses about 20% of the body's total energy!",
            "Diamond is the hardest natural substance, but graphite (also carbon) is one of the softest!",
            "The smallest unit of matter that retains chemical properties is an atom!",
            "Fingernails grow about 4 times faster than toenails!",
            "The speed of light in a vacuum is 299,792,458 meters per second!",
            "Helium makes your voice higher because it's less dense than air!",
            "Absolute zero is -273.15°C, where all molecular motion stops!",
            "The human DNA shares about 60% of its genes with bananas!"
        ];

        let randomScience = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
        
        let scienceText = `🔬 *SCIENCE FACT* 🔬\n\n`;
        scienceText += `⚗️ ${randomScience}\n\n`;
        scienceText += `🧬 *Field:* General Science\n`;
        scienceText += `🎓 *Education Level:* Mind-expanding\n`;
        scienceText += `⚡ *Cool Factor:* ${Math.floor(Math.random() * 20) + 80}%\n\n`;
        scienceText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(scienceText, { mentions: [message.sender] });
    } catch (error) {
        await message.send(handleCommandError(error, '.science'));
    }
});

plugin({
    pattern: 'history ?(.*)',
    desc: 'Get interesting historical facts',
    react: "🏛️",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        const historyFacts = [
            "The Great Fire of London in 1666 actually helped end the Great Plague by killing disease-carrying rats and fleas!",
            "Napoleon was actually average height for his time at 5'7\" - the 'short' myth came from British propaganda!",
            "The ancient Egyptians used slabs of stone as pillows!",
            "Vikings never actually wore horned helmets - that's a modern myth from operas!",
            "The shortest serving Pope in history, Pope Urban VII, served for only 13 days in 1590!",
            "Ancient Romans used to brush their teeth with urine because they believed it would whiten them!",
            "The ancient Olympic Games banned women from competing, but they created their own games called the Heraean Games!",
            "Cleopatra could speak at least 9 languages fluently!",
            "The ancient library of Alexandria had over 700,000 scrolls!",
            "The Colosseum could be filled with water for mock naval battles!",
            "Ancient Mayans used cacao beans as currency!",
            "The Vikings reached North America 500 years before Columbus!",
            "In ancient Egypt, both men and women wore makeup for protection from the sun!",
            "The ancient Greeks invented the first vending machine to dispense holy water!",
            "Medieval people actually had pretty good hygiene and bathed regularly!"
        ];

        let randomHistory = historyFacts[Math.floor(Math.random() * historyFacts.length)];
        
        let historyText = `🏛️ *HISTORY FACT* 🏛️\n\n`;
        historyText += `📜 ${randomHistory}\n\n`;
        historyText += `⏰ *Era:* Ancient Times\n`;
        historyText += `📚 *Knowledge Type:* Historical\n`;
        historyText += `🎭 *Interest Level:* ${Math.floor(Math.random() * 25) + 75}%\n\n`;
        historyText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(historyText, { mentions: [message.sender] });
    } catch (error) {
        await message.send(handleCommandError(error, '.history'));
    }
});