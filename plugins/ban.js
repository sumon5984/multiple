const { plugin, personalDB } = require('../lib');

// Developer number
const DEVELOPER = '918509656378@s.whatsapp.net';

plugin({
    pattern: 'ban ?(.*)',
    desc: 'deactivate bot in specified jid',
    type: 'owner',
    root: true
}, async (message, match) => {
    // Only allow developer
    if (message.sender !== DEVELOPER) {
        return await message.send(`বোকাচোদা তুই আমার ওপরে যাবি নুনু মুকো 🤣🤣🤣
        এটা KING TOM ছাড়া কেউই ব্যবহার করতে পারবে না রে পাগলা চোদা 🤣🤣`);
    }

    const { ban } = await personalDB(['ban'], { content: {} }, 'get');

    if (ban && ban.includes(message.jid)) {
        return await message.send("_already deactivated bot in this jid!_");
    }

    const update = ban ? ban + ',' + message.jid : message.jid;
    await personalDB(['ban'], { content: update }, 'set');

    await message.send('*✅ Bot deactivated in this jid⚫️*');
    process.exit(0);
});

plugin({
    pattern: 'unban ?(.*)',
    desc: 'activate bot in deactivated bot jid',
    type: 'owner',
    root: true
}, async (message, match) => {
    // Only allow developer
    if (message.sender !== DEVELOPER) {
        return await message.send(`বোকাচোদা তুই আমার ওপরে যাবি নুনু মুকো 🤣🤣🤣
        এটা KING TOM ছাড়া কেউই ব্যবহার করতে পারবে না রে পাগলা চোদা 🤣🤣`);
    }

    const { ban } = await personalDB(['ban'], { content: {} }, 'get');

    if (!ban) return await message.send("_bot is not disabled in any jid_");
    if (!ban.includes(message.jid)) return await message.send("_bot not deactivated in this jid_");

    let update = [];
    ban.split(',').map(a => {
        if (a != message.jid) update.push(a);
    });

    await personalDB(['ban'], { content: update.join(",") }, 'set');
    await message.send('*✅ Bot activated in this jid*\n*restarting!*');
    process.exit(0);
});