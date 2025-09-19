const { plugin, kickAllMembers, linkPreview, isBotAdmin, getNonAdmins, mode, isBot } = require('../lib');

plugin({
    pattern: 'kick ?(.*)',
    type: 'group',
    fromMe: mode,
    desc: "Kick group member(s)"
}, async (message, match) => {
    // Defensive check for client property
    if (!message.client) {
        console.error("Kick plugin error: message.client is undefined");
        return await message.send('_❌ Bot client error. Please try again._');
    }

    if (!message.isGroup)
        return await message.reply("*_This command is for groups_*");

    if (!await isBot(message)) {
        return await message.send('*_Only bot owner can use this command_*');
    }

    // Uncomment if you want to check bot admin status
    /*if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
        linkPreview: linkPreview()
    })*/

    // Handle "kick all" command
    if (match && match.toLowerCase() === "all") {
        let totalKicked = await kickAllMembers(message);
        return await message.send(`✅ Kick All Completed.\n👢 Total kicked: *${totalKicked}*`);
    }

    let user = null;

    // Priority order: 1. Match parameter, 2. Quoted message, 3. Mentioned users
    if (match) {
        // Clean the match and format as WhatsApp ID
        user = match.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else if (message.quoted && message.quoted.sender) {
        // If replying to a message
        user = message.quoted.sender;
    } else if (message.mention && message.mention.length > 0) {
        // If mentioning users
        user = message.mention[0];
    }

    if (!user) {
        return await message.send('_❌ Please reply to a user, mention a user, or provide a number to kick._\n\n*Usage:*\n• `.kick` (reply to message)\n• `.kick @user` (mention user)\n• `.kick 917003816486` (phone number)\n• `.kick all` (kick all non-admins)');
    }

    // Get non-admin users from the current group
    const nonAdmins = await getNonAdmins(message);

    if (!nonAdmins.includes(user)) {
        return await message.send("_❌ Can't kick an admin or bot._");
    }

    try {
        await message.client.groupParticipantsUpdate(message.jid, [user], "remove");
        return await message.send(`👢 _@${user.split('@')[0]} has been kicked from the group._`, {
            mentions: [user]
        });
    } catch (e) {
        console.error("Kick error:", e);
        return await message.send('_❌ Failed to kick user. Possible reasons:_\n• User already left the group\n• Bot lacks admin permissions\n• User is an admin\n• Network error');
    }
});