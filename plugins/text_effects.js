
const {
    plugin,
    mode
} = require('../lib');

plugin({
    pattern: 'fancy ?(.*)',
    desc: 'Convert text to fancy styles',
    react: "✨",
    type: "converter",
    fromMe: mode
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("✨ *FANCY TEXT GENERATOR* ✨\n\nUsage: .fancy your text here\n\nExample: .fancy Hello World");
        }

        const text = match;
        const styles = {
            "𝗕𝗼𝗹𝗱": text.replace(/[a-zA-Z0-9]/g, char => {
                if (char >= 'a' && char <= 'z') return String.fromCharCode(0x1D5EE + char.charCodeAt(0) - 97);
                if (char >= 'A' && char <= 'Z') return String.fromCharCode(0x1D5D4 + char.charCodeAt(0) - 65);
                if (char >= '0' && char <= '9') return String.fromCharCode(0x1D7EC + char.charCodeAt(0) - 48);
                return char;
            }),
            "𝘐𝘵𝘢𝘭𝘪𝘤": text.replace(/[a-zA-Z]/g, char => {
                if (char >= 'a' && char <= 'z') return String.fromCharCode(0x1D622 + char.charCodeAt(0) - 97);
                if (char >= 'A' && char <= 'Z') return String.fromCharCode(0x1D608 + char.charCodeAt(0) - 65);
                return char;
            }),
            "𝒮𝒸𝓇𝒾𝓅𝓉": text.replace(/[a-zA-Z]/g, char => {
                if (char >= 'a' && char <= 'z') return String.fromCharCode(0x1D4B6 + char.charCodeAt(0) - 97);
                if (char >= 'A' && char <= 'Z') return String.fromCharCode(0x1D49C + char.charCodeAt(0) - 65);
                return char;
            }),
            "ᴛɪɴʏ ᴄᴀᴘꜱ": text.replace(/[a-zA-Z]/g, char => {
                const tiny = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ";
                if (char >= 'a' && char <= 'z') return tiny[char.charCodeAt(0) - 97];
                if (char >= 'A' && char <= 'Z') return tiny[char.charCodeAt(0) - 65];
                return char;
            }),
            "🅱🅻🅾🅲🅺🆂": text.replace(/[a-zA-Z]/g, char => {
                if (char >= 'a' && char <= 'z') return String.fromCharCode(0x1F170 + char.charCodeAt(0) - 97);
                if (char >= 'A' && char <= 'Z') return String.fromCharCode(0x1F170 + char.charCodeAt(0) - 65);
                return char;
            }).replace(/[0-9]/g, char => String.fromCharCode(0x1F1E6 + char.charCodeAt(0) - 48))
        };

        let result = "✨ *FANCY TEXT STYLES* ✨\n\n";
        result += `*Original:* ${text}\n\n`;
        
        for (const [styleName, styledText] of Object.entries(styles)) {
            result += `*${styleName}:* ${styledText}\n\n`;
        }
        
        result += "> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*";
        
        await message.send(result);
    } catch (error) {
        console.error("❌ Error in .fancy command:", error);
        await message.send("❌ *Error occurred while generating fancy text.*");
    }
});

plugin({
    pattern: 'bubble ?(.*)',
    desc: 'Convert text to bubble letters',
    react: "🫧",
    type: "converter",
    fromMe: mode
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("🫧 *BUBBLE TEXT* 🫧\n\nUsage: .bubble your text here\n\nExample: .bubble Hello");
        }

        const bubbleMap = {
            'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ',
            'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ',
            's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
            'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ',
            'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ',
            'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
            '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
        };

        const bubbleText = match.split('').map(char => bubbleMap[char] || char).join('');
        
        await message.send(`🫧 *BUBBLE TEXT* 🫧\n\n*Original:* ${match}\n*Bubble:* ${bubbleText}\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .bubble command:", error);
        await message.send("❌ *Error occurred while generating bubble text.*");
    }
});

plugin({
    pattern: 'reverse ?(.*)',
    desc: 'Reverse text',
    react: "🔄",
    type: "converter",
    fromMe: mode
}, async (message, match) => {
    try {
        const text = match || message.reply_message?.text;
        
        if (!text) {
            return await message.send("🔄 *TEXT REVERSER* 🔄\n\nUsage: .reverse your text here\nOr reply to a message with .reverse");
        }

        const reversed = text.split('').reverse().join('');
        
        await message.send(`🔄 *TEXT REVERSER* 🔄\n\n*Original:* ${text}\n*Reversed:* ${reversed}\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .reverse command:", error);
        await message.send("❌ *Error occurred while reversing text.*");
    }
});

plugin({
    pattern: 'mock ?(.*)',
    desc: 'Convert text to mocking SpongeBob style',
    react: "🤡",
    type: "converter",
    fromMe: mode
}, async (message, match) => {
    try {
        const text = match || message.reply_message?.text;
        
        if (!text) {
            return await message.send("🤡 *MOCKING TEXT* 🤡\n\nUsage: .mock your text here\nOr reply to a message with .mock");
        }

        const mockText = text.split('').map((char, index) => {
            if (char.match(/[a-zA-Z]/)) {
                return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
            }
            return char;
        }).join('');
        
        await message.send(`🤡 *MOCKING SPONGEBOB* 🤡\n\n*Original:* ${text}\n*Mocked:* ${mockText}\n\n> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`);
    } catch (error) {
        console.error("❌ Error in .mock command:", error);
        await message.send("❌ *Error occurred while mocking text.*");
    }
});

plugin({
    pattern: 'aesthetic ?(.*)',
    desc: 'Convert text to aesthetic style',
    react: "🌸",
    type: "converter",
    fromMe: mode
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("🌸 *AESTHETIC TEXT* 🌸\n\nUsage: .aesthetic your text here\n\nExample: .aesthetic love yourself");
        }

        const aesthetic = match.split('').join(' ').toUpperCase();
        const vaporwave = match.replace(/[a-zA-Z0-9]/g, char => {
            if (char >= 'a' && char <= 'z') return String.fromCharCode(0xFF41 + char.charCodeAt(0) - 97);
            if (char >= 'A' && char <= 'Z') return String.fromCharCode(0xFF21 + char.charCodeAt(0) - 65);
            if (char >= '0' && char <= '9') return String.fromCharCode(0xFF10 + char.charCodeAt(0) - 48);
            return char;
        });

        let result = "🌸 *AESTHETIC STYLES* 🌸\n\n";
        result += `*Original:* ${match}\n\n`;
        result += `*Spaced:* ${aesthetic}\n\n`;
        result += `*Vaporwave:* ${vaporwave}\n\n`;
        result += `*With Symbols:* ・❀・${match}・❀・\n\n`;
        result += `*Kawaii:* (◕‿◕) ${match} (◕‿◕)\n\n`;
        result += "> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*";
        
        await message.send(result);
    } catch (error) {
        console.error("❌ Error in .aesthetic command:", error);
        await message.send("❌ *Error occurred while generating aesthetic text.*");
    }
});
