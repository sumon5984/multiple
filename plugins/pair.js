
const {
    plugin,
    mode,
    fetchJson,
    sleep
} = require('../lib');

plugin({
    pattern: 'pair ?(.*)',
    fromMe: mode,
    desc: 'Get WhatsApp pairing code',
    type: 'tools'
}, async (message, match) => {
    try {
        // Validate input
        if (!match) {
            return await message.send("*Example : .pair 917468758800*");
        }

        // Fetch pairing code
        const response = await fetchJson(`http://trolley.proxy.rlwy.net:20379/pair?number=${match}`);
        
        // Check for errors in response
        if (!response || !response.code) {
            return await message.send("Failed to retrieve pairing code. Please check the phone number and try again.");
        }

        // Success response
        const pairingCode = response.code;
        const doneMessage = "> *𓂀 𝐊คเรєภ𓍯 PAIR COMPLETED*";

        // Send first message
        await message.send(`${doneMessage}\n\n> *PAIRING CODE IS: ${pairingCode}*`);

        // Add a delay of 2 seconds before sending the second message
        await sleep(2000);

        // Send second message with just the pairing code
        await message.send(`${pairingCode}`);
    } catch (error) {
        console.error(error);
        await message.send("An error occurred. Please try again later please go to https://kaisen-bot-free.vercel.app");
    }
});