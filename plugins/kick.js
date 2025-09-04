const { plugin, kickAllMembers, linkPreview, isBotAdmin, getNonAdmins, mode, isBot } = require('../lib');

plugin({
    pattern: 'kick ?(.*)',
    type: 'group',
    fromMe: mode,
    desc: "Kick group member(s)"
}, async (message, match) => {
    if (!message.isGroup)
        return await message.reply("*_This command is for groups_*");
if (!await isBot(message)) {
		return await message.send('*_Only bot owner can use this command_*');
	}
    /*if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})*/
    if (match.toLowerCase() === "all") {
        let totalKicked = await kickAllMembers(message);
        return await message.send(`✅ Kick All Completed.\n👢 Total kicked: *${totalKicked}*`);
    }

    let user = match || (message.quoted ? message.quoted.sender : null);
    if (!user) return await message.send('_❌ Please reply to a user or give number to kick._');

    user = user.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

     const nonAdmins = await getNonAdmins();
    if (!nonAdmins.includes(user)) {
        return await message.send("_❌ Can't kick an admin or bot._");
    }

    try {
        await message.client.groupParticipantsUpdate(message.jid, [user], "remove");
        return await message.send(`👢 _@${user.split('@')[0]} has been kicked._`, {
            mentions: [user]
        });
    } catch (e) {
        console.error("Kick error:", e);
        return await message.send('_❌ Failed to kick user. Maybe already left or permission denied._');
    }
});
