const { plugin, personalDB } = require('../lib');

 const DEVELOPERS = [
    '918509656378@s.whatsapp.net',      // KING TOM
    '917003816486@s.whatsapp.net',      // Add your second developer number
    '917439489057@s.whatsapp.net', 
    '919749366957@s.whatsapp.net', // Add your third developer number
    // Add more developer numbers as needed
];


plugin({
    pattern: 'ban ?(.*)',
    desc: 'deactivate bot in specified jid',
    type: 'owner',
    root: true
}, async (message, match) => {
    // Only allow developer

// Check if sender is NOT in the developers list
if (!DEVELOPERS.includes(message.sender)) {
    return await message.send(`বোকাচোদা তুই আমার ওপরে যাবি নুনু মুকো 🤣🤣🤣
    এটা KING TOM and SUMON and DEVELOPER ছাড়া কেউই ব্যবহার করতে পারবে না রে পাগলা চোদা 🤣🤣`);
}
  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];
    const { ban } = await personalDB(['ban'], { content: {} }, 'get', botNumber);

    if (ban && ban.includes(message.jid)) {
        return await message.send("_already deactivated bot in this jid!_");
    }

    const update = ban ? ban + ',' + message.jid : message.jid;
    await personalDB(['ban'], { content: update }, 'set', botNumber);

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
   if (!DEVELOPERS.includes(message.sender)) {
    return await message.send(`বোকাচোদা তুই আমার ওপরে যাবি নুনু মুকো 🤣🤣🤣
    এটা KING TOM and SUMON ছাড়া কেউই ব্যবহার করতে পারবে না রে পাগলা চোদা 🤣🤣`);
}
  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];

    const { ban } = await personalDB(['ban'], { content: {} }, 'get', botNumber);

    if (!ban) return await message.send("_bot is not disabled in any jid_");
    if (!ban.includes(message.jid)) return await message.send("_bot not deactivated in this jid_");

    let update = [];
    ban.split(',').map(a => {
        if (a != message.jid) update.push(a);
    });

    await personalDB(['ban'], { content: update.join(",") }, 'set', botNumber);
    await message.send('*✅ Bot activated in this jid*\n*restarting!*');
    process.exit(0);
});