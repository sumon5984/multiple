const {
	plugin,
	isAdmin,
	isBotAdmin,
	linkPreview,
	isAccess,
	mode,
	config
} = require('../lib');

// Helper function to check if user replied to someone
const getRepliedUser = (message) => {
	return message.reply_message?.participant || message.reply_message?.sender || message.send_message?.sender;
};

// Helper function to format phone number
const formatPhoneNumber = (number) => {
	return number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
};

// Helper function to send response with consistent formatting
const sendResponse = (message, text, options = {}) => {
	return message.send(text, {
			linkPreview: linkPreview(),
			...options
	});
};

// Promote user to admin
plugin({
	pattern: 'promote ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Promote group member to admin'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	const targetUser = getRepliedUser(message) || (match ? formatPhoneNumber(match) : null);

	if (!targetUser) {
			return await sendResponse(message, '_Please reply to a user or provide a phone number_');
	}

	try {
			await message.client.groupParticipantsUpdate(message.jid, [targetUser], "promote");
			return await sendResponse(message, `_@${targetUser.split('@')[0]} promoted as admin successfully_`, {
					mentions: [targetUser]
			});
	} catch (error) {
			console.error('Promote error:', error);
			return await sendResponse(message, '_Failed to promote user. Make sure they are in the group._');
	}
});

// Demote admin to member
plugin({
	pattern: 'demote ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: "Demote group admin to member"
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	const targetUser = getRepliedUser(message) || (match ? formatPhoneNumber(match) : null);

	if (!targetUser) {
			return await sendResponse(message, '_Please reply to a user or provide a phone number_');
	}

	try {
			await message.client.groupParticipantsUpdate(message.jid, [targetUser], "demote");
			return await sendResponse(message, `_@${targetUser.split('@')[0]} demoted from admin successfully_`, {
					mentions: [targetUser]
			});
	} catch (error) {
			console.error('Demote error:', error);
			return await sendResponse(message, '_Failed to demote user. Make sure they are an admin._');
	}
});

// Revoke group invite link
plugin({
	pattern: 'revoke ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Revoke group invite link'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	try {
			await message.client.groupRevokeInvite(message.jid);
			return await sendResponse(message, '_Successfully revoked group link_');
	} catch (error) {
			console.error('Revoke error:', error);
			return await sendResponse(message, '_Failed to revoke group link_');
	}
});

// Get group invite link
plugin({
	pattern: 'invite ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Get group invite link'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	try {
			const code = await message.client.groupInviteCode(message.jid);
			return await sendResponse(message, `https://chat.whatsapp.com/${code}`);
	} catch (error) {
			console.error('Invite error:', error);
			return await sendResponse(message, '_Failed to get group invite link_');
	}
});

// Lock group (only admins can edit group info)
plugin({
	pattern: 'lock ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Lock group settings (only admins can edit)'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	try {
			await message.client.groupSettingUpdate(message.jid, 'locked');
			return await sendResponse(message, '_Successfully locked group settings_');
	} catch (error) {
			console.error('Lock error:', error);
			return await sendResponse(message, '_Failed to lock group settings_');
	}
});

// Unlock group (members can edit group info)
plugin({
	pattern: 'unlock ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Unlock group settings (members can edit)'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	try {
			await message.client.groupSettingUpdate(message.jid, 'unlocked');
			return await sendResponse(message, '_Successfully unlocked group settings_');
	} catch (error) {
			console.error('Unlock error:', error);
			return await sendResponse(message, '_Failed to unlock group settings_');
	}
});

// Mute group (only admins can send messages)
plugin({
	pattern: 'mute ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Mute group (only admins can send messages)'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	try {
			await message.client.groupSettingUpdate(message.jid, 'announcement');
			return await sendResponse(message, '_Group muted successfully_');
	} catch (error) {
			console.error('Mute error:', error);
			return await sendResponse(message, '_Failed to mute group_');
	}
});

// Unmute group (all members can send messages)
plugin({
	pattern: 'unmute ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Unmute group (all members can send messages)'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	try {
			await message.client.groupSettingUpdate(message.jid, 'not_announcement');
			return await sendResponse(message, '_Group unmuted successfully_');
	} catch (error) {
			console.error('Unmute error:', error);
			return await sendResponse(message, '_Failed to unmute group_');
	}
});

// Update group description
plugin({
	pattern: 'gdesc ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Update group description'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	const description = match || '';

	if (description.length > 400) {
			return await sendResponse(message, '_Description too long (max 400 characters)_');
	}

	try {
			await message.client.groupUpdateDescription(message.jid, description);
			return await sendResponse(message, '_Group description updated successfully_');
	} catch (error) {
			console.error('Description update error:', error);
			return await sendResponse(message, '_Failed to update group description_');
	}
});

// Update group name
plugin({
	pattern: 'gname ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Update group name'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	const groupName = match || '';

	if (!groupName.trim()) {
			return await sendResponse(message, '_Please provide a group name_');
	}

	if (groupName.length > 75) {
			return await sendResponse(message, '_Group name too long (max 75 characters)_');
	}

	try {
			await message.client.groupUpdateSubject(message.jid, groupName);
			return await sendResponse(message, '_Group name updated successfully_');
	} catch (error) {
			console.error('Group name update error:', error);
			return await sendResponse(message, '_Failed to update group name_');
	}
});

// Update group profile picture
plugin({
	pattern: 'gpp ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: 'Update group profile picture'
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	if (!message.reply_message?.image) {
			return await sendResponse(message, '_Please reply to an image message_');
	}

	try {
			const media = await message.reply_message.download();
			await message.client.updateProfilePicture(message.jid, media);
			return await sendResponse(message, '_Group profile picture updated successfully_');
	} catch (error) {
			console.error('Profile picture update error:', error);
			return await sendResponse(message, '_Failed to update group profile picture_');
	}
});



// Join group using invite link
plugin({
	pattern: 'join ?(.*)',
	type: 'owner',
	fromMe: mode,
	desc: 'Join group using invite link'
}, async (message, match) => {
	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner can use this command_*');
	}

	if (!match || !match.match(/^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]+$/)) {
			return await sendResponse(message, '_Please provide a valid WhatsApp group invite link_');
	}

	const urlArray = match.trim().split('/');

	if (urlArray[2] !== 'chat.whatsapp.com') {
			return await sendResponse(message, '_Invalid WhatsApp group link_');
	}

	try {
			await message.client.groupAcceptInvite(urlArray[3]);
			return await sendResponse(message, '_Successfully joined the group_');
	} catch (error) {
			console.error('Join group error:', error);
			return await sendResponse(message, '_Failed to join group. Link may be invalid or expired._');
	}
});

// Add member to group
plugin({
	pattern: 'add ?(.*)',
	type: 'group',
	fromMe: mode,
	desc: "Add member to group"
}, async (message, match) => {
	if (!message.isGroup) {
			return await message.reply("*_This command is for groups only_*");
	}

	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	if (!await isBotAdmin(message)) {
			return await sendResponse(message, '_Bot must be admin first_');
	}

	const targetUser = getRepliedUser(message) || (match ? formatPhoneNumber(match) : null);

	if (!targetUser) {
			return await sendResponse(message, '_Please reply to a user or provide a phone number_');
	}

	try {
			// Check if user is on WhatsApp
			const info = await message.client.onWhatsApp(targetUser);
			if (!info.length || !info.some(user => user.jid === targetUser)) {
					return await sendResponse(message, '_User not found on WhatsApp_');
			}

			const result = await message.client.groupParticipantsUpdate(message.jid, [targetUser], "add");
			const status = result[0]?.status;

			switch (status) {
					case 200:
							return await sendResponse(message, `_@${targetUser.split('@')[0]} added to the group successfully_`, {
									mentions: [targetUser]
							});
					case 403:
							await sendResponse(message, "_Couldn't add user. Sending invite instead..._");
							const code = await message.client.groupInviteCode(message.jid);
							return await message.client.sendMessage(targetUser, {
									text: `You've been invited to join a group: https://chat.whatsapp.com/${code}`
							});
					case 408:
							return await sendResponse(message, "_User recently left the group. Please try again later._");
					case 401:
							return await sendResponse(message, "_Couldn't add user. They may have blocked the bot._");
					case 409:
							return await sendResponse(message, "_User is already in the group_");
					default:
							return await sendResponse(message, `_Failed to add user. Status: ${status}_`);
			}
	} catch (error) {
			console.error('Add user error:', error);
			return await sendResponse(message, '_Failed to add user to group_');
	}
});

// Get group invite info
plugin({
	pattern: 'ginfo ?(.*)',
	fromMe: mode,
	desc: 'Show group invite info',
	type: 'group'
}, async (message, match) => {
	if (!await isAccess(message)) {
			return await sendResponse(message, '*_Only bot owner and group admins can use this command_*');
	}

	const link = match || message.reply_message?.text;

	if (!link) {
			return await message.reply('*Need Group Link*\n_Example: ginfo https://chat.whatsapp.com/..._');
	}

	const inviteMatch = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i);

	if (!inviteMatch) {
			return await message.reply('*Invalid invite link*');
	}

	const inviteCode = inviteMatch[1];

	try {
			const groupInfo = await message.client.groupGetInviteInfo(inviteCode);

			const info = [
					`*Group Information*`,
					``,
					`*ID:* ${groupInfo.id}`,
					`*Name:* ${groupInfo.subject}`,
					`*Owner:* ${groupInfo.owner ? groupInfo.owner.split('@')[0] : 'Unknown'}`,
					`*Members:* ${groupInfo.size}`,
					`*Restricted:* ${groupInfo.restrict ? 'Yes' : 'No'}`,
					`*Announcement:* ${groupInfo.announce ? 'Yes' : 'No'}`,
					`*Created:* ${new Date(groupInfo.creation * 1000).toLocaleString()}`,
					groupInfo.desc ? `*Description:* ${groupInfo.desc}` : ''
			].filter(Boolean).join('\n');

			return await sendResponse(message, info);
	} catch (error) {
			console.error('Group info error:', error);
			return await message.reply('*Failed to get group information. Link may be invalid.*');
	}
});