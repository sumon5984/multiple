const {
    plugin,
    groupDB,
    mode,
    isAccess
} = require('../lib');

plugin({
    pattern: 'pdm ?(.*)',
    desc: 'promote, demote message',
    type: 'manage',
    fromMe: mode
}, async (message, match) => {
     if (!message.isGroup)
      return await message.reply("*_This command is for groups_*");
  if (!await isAccess(message)) {
		return await message.send('*_Only bot owner and group admins can use this command_*');
  } if (!match) return message.reply('pdm on/off');
    if (match != 'on' && match != 'off') return message.reply('pdm on');
    const {pdm} = await groupDB(['pdm'], {jid: message.jid, content: {}}, 'get');
    if (match == 'on') {
        if (pdm == 'true') return message.reply('_Already activated_');
        await groupDB(['pdm'], {jid: message.jid, content: 'true'}, 'set');
        return await message.reply('_activated_')
    } else if (match == 'off') {
        if (pdm == 'false') return message.reply('_Already Deactivated_');
        await groupDB(['pdm'], {jid: message.jid, content: 'false'}, 'set');
        return await message.reply('_deactivated_')
    }
});

