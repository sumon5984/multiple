const {
    plugin,
    mode
} = require('../lib');

// Enhanced error handling
const handleCommandError = (error, commandName) => {
    console.error(`❌ Error in ${commandName} command:`, error);
    let errorMsg = `❌ *${commandName} command failed*\n\n`;
    if (error.code === 'ECONNABORTED') {
        errorMsg += `⏰ Request timed out. Please try again.`;
    } else {
        errorMsg += `🔧 ${error.message || 'Please try again later.'}`;
    }
    errorMsg += `\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;
    return errorMsg;
};

plugin({
    pattern: 'dice ?(.*)',
    desc: 'Roll a dice (1-6)',
    react: "🎲",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let diceNumber = Math.floor(Math.random() * 6) + 1;
        
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        let diceText = `🎲 *DICE ROLL* 🎲\n\n`;
        diceText += `${diceEmojis[diceNumber - 1]} *You rolled:* ${diceNumber}\n\n`;
        diceText += `🎯 *Result:* ${diceNumber === 6 ? 'Lucky roll!' : diceNumber >= 4 ? 'Good roll!' : 'Better luck next time!'}\n`;
        diceText += `📊 *Luck Level:* ${Math.floor((diceNumber / 6) * 100)}%\n\n`;
        diceText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(diceText, { mentions: [message.sender] });
    } catch (error) {
        console.error("❌ Error in .dice command:", error);
        await message.send(handleCommandError(error, '.dice'));
    }
});

plugin({
    pattern: 'coin ?(.*)',
    desc: 'Flip a coin',
    react: "🪙",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
        
        let coinText = `🪙 *COIN FLIP* 🪙\n\n`;
        coinText += `🎯 *Result:* ${coinResult}\n\n`;
        coinText += `${coinResult === 'Heads' ? '👑' : '🎯'} *${coinResult === 'Heads' ? 'Leaders win!' : 'Rebels win!'}*\n`;
        coinText += `🎲 *Probability:* 50/50\n\n`;
        coinText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(coinText, { mentions: [message.sender] });
    } catch (error) {
        console.error("❌ Error in .coin command:", error);
        await message.send(handleCommandError(error, '.coin'));
    }
});

plugin({
    pattern: 'gamble ?(.*)',
    desc: 'Simple gambling game with virtual coins',
    react: "🎰",
    type: "fun",
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        let bet = parseInt(match) || 10;
        
        if (bet < 1 || bet > 1000) {
            bet = 10;
        }
        
        let winChance = Math.random();
        let multiplier = 1;
        let result = '';
        
        if (winChance < 0.1) { // 10% chance for jackpot
            multiplier = 5;
            result = 'JACKPOT! 🎊';
        } else if (winChance < 0.3) { // 20% chance for big win
            multiplier = 2;
            result = 'Big Win! 🎉';
        } else if (winChance < 0.5) { // 20% chance for small win
            multiplier = 1.5;
            result = 'Small Win! 😊';
        } else { // 50% chance for loss
            multiplier = 0;
            result = 'You Lost! 😢';
        }
        
        let winnings = Math.floor(bet * multiplier);
        let profit = winnings - bet;
        
        let gambleText = `🎰 *VIRTUAL GAMBLING* 🎰\n\n`;
        gambleText += `💰 *Bet Amount:* ${bet} coins\n`;
        gambleText += `🎯 *Result:* ${result}\n`;
        gambleText += `💸 *Winnings:* ${winnings} coins\n`;
        gambleText += `📈 *Profit/Loss:* ${profit >= 0 ? '+' : ''}${profit} coins\n\n`;
        gambleText += `🎲 *Multiplier:* ${multiplier}x\n`;
        gambleText += `⚠️ *Note:* This is virtual gambling for fun!\n\n`;
        gambleText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(gambleText, { mentions: [message.sender] });
    } catch (error) {
        console.error("❌ Error in .gamble command:", error);
        await message.send(handleCommandError(error, '.gamble'));
    }
});

plugin({
    pattern: 'lottery ?(.*)',
    desc: 'Play virtual lottery',
    react: "🎫",
    type: "fun", 
    fromMe: mode
}, async (message, match) => {
    try {
        let sender = `@${message.sender.split("@")[0]}`;
        
        // Generate user numbers and winning numbers
        let userNumbers = [];
        let winningNumbers = [];
        
        for (let i = 0; i < 6; i++) {
            userNumbers.push(Math.floor(Math.random() * 49) + 1);
            winningNumbers.push(Math.floor(Math.random() * 49) + 1);
        }
        
        // Remove duplicates and sort
        userNumbers = [...new Set(userNumbers)].sort((a, b) => a - b);
        winningNumbers = [...new Set(winningNumbers)].sort((a, b) => a - b);
        
        // Check matches
        let matches = userNumbers.filter(num => winningNumbers.includes(num));
        let matchCount = matches.length;
        
        let prize = '';
        let prizeAmount = 0;
        
        switch (matchCount) {
            case 6:
                prize = 'JACKPOT! 🎊';
                prizeAmount = 1000000;
                break;
            case 5:
                prize = 'Second Prize! 🎉';
                prizeAmount = 10000;
                break;
            case 4:
                prize = 'Third Prize! 🎈';
                prizeAmount = 1000;
                break;
            case 3:
                prize = 'Fourth Prize! 🎁';
                prizeAmount = 100;
                break;
            case 2:
                prize = 'Small Prize! 🎀';
                prizeAmount = 10;
                break;
            default:
                prize = 'No Prize 😔';
                prizeAmount = 0;
        }
        
        let lotteryText = `🎫 *VIRTUAL LOTTERY* 🎫\n\n`;
        lotteryText += `🎯 *Your Numbers:* ${userNumbers.join(', ')}\n`;
        lotteryText += `🏆 *Winning Numbers:* ${winningNumbers.join(', ')}\n\n`;
        lotteryText += `✨ *Matches:* ${matchCount}/6\n`;
        lotteryText += `🎁 *Result:* ${prize}\n`;
        if (prizeAmount > 0) {
            lotteryText += `💰 *Prize:* ${prizeAmount.toLocaleString()} virtual coins\n`;
        }
        lotteryText += `📊 *Luck Factor:* ${Math.floor((matchCount / 6) * 100)}%\n\n`;
        lotteryText += `⚠️ *Note:* This is virtual lottery for entertainment!\n\n`;
        lotteryText += `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(lotteryText, { mentions: [message.sender] });
    } catch (error) {
        console.error("❌ Error in .lottery command:", error);
        await message.send(handleCommandError(error, '.lottery'));
    }
});