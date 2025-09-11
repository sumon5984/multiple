// PDM Plugin with Global Settings
const {
    plugin,
    groupDB,
    mode,
    isAccess
} = require('../lib');


plugin({
    pattern: 'pdm ?(.*)',
    desc: 'promote, demote message - supports global and individual group settings',
    type: 'manage',
    fromMe: mode
}, async (message, match) => {
    if (!message.isGroup)
        return await message.reply("*_This command is for groups_*");

    if (!await isAccess(message)) {
        return await message.send('*_Only bot owner and group admins can use this command_*');
    }

    match = (match || '').trim();

    // Get group-specific settings
    const { pdm } = await groupDB(['pdm'], { jid: message.jid, content: {} }, 'get');

    // Get global settings
    const { global_pdm } =
        (await groupDB(['global_pdm'], { jid: 'global', content: {} }, 'get')) || {};

    const groupStatus = pdm === 'true' ? 'true' : 'false';
    const globalAllStatus = global_pdm?.all_status === 'true' ? 'true' : 'false';

    if (match.toLowerCase() === 'get') {
        const statusText = groupStatus === 'true' ? 'on' : 'off';
        const allStatusText = globalAllStatus === 'true' ? 'on' : 'off';

        return await message.send(
            `_*PDM Settings:*_\n` +
            `*Group Status:* ${statusText}\n` +
            `*All Groups Status:* ${allStatusText}\n\n` +
            `_Use: pdm on/off, pdm all on/off_`
        );
    }

    // Handle "all on" command
    if (match.toLowerCase() === 'all on') {
        await groupDB(['global_pdm'], {
            jid: 'global',
            content: {
                status: global_pdm?.status || 'true',
                all_status: 'true'
            }
        }, 'set');
        return await message.send('*PDM activated for ALL groups*');
    }

    // Handle "all off" command
    if (match.toLowerCase() === 'all off') {
        await groupDB(['global_pdm'], {
            jid: 'global',
            content: {
                status: global_pdm?.status || 'true',
                all_status: 'false'
            }
        }, 'set');
        return await message.send('*PDM deactivated for all groups (individual group settings will apply)*');
    }

    if (match.toLowerCase() === 'on') {
        if (groupStatus === 'true') return message.reply('_Already activated_');
        await groupDB(['pdm'], { jid: message.jid, content: 'true' }, 'set');
        return await message.reply('*PDM activated for this group*');
    }

    if (match.toLowerCase() === 'off') {
        if (groupStatus === 'false') return message.reply('_Already deactivated_');
        await groupDB(['pdm'], { jid: message.jid, content: 'false' }, 'set');
        return await message.reply('*PDM deactivated for this group*');
    }

    if (!match) {
        return message.reply(
            '_Example:_\n' +
            'pdm on/off (for this group)\n' +
            'pdm all on/off (for all groups)\n' +
            'pdm get (check settings)\n\n' +
            '*Current Status:*\n' +
            `Group: ${groupStatus === 'true' ? 'on' : 'off'}\n` +
            `All Groups: ${globalAllStatus === 'true' ? 'on' : 'off'}`
        );
    }

    // Invalid command
    return message.reply('Invalid option. Use: pdm on/off/get or pdm all on/off');
});

