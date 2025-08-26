const { plugin, groupDB, isAdmin, isAccess, config } = require('../lib');


plugin(
  {
    pattern: 'welcome ?(.)',
    desc: 'Set or control welcome message',
    react: '👋',
    type: 'group'
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command is for groups_*");
  if (!await isAccess(message)) {
		return await message.send('*_Only bot owner and group admins can use this command_*');
  }
    match = (match || '').trim();
    
    const { welcome } =
      (await groupDB(['welcome'], { jid: message.jid, content: {} }, 'get')) || {};
    const status = welcome?.status === 'true' ? 'true' : 'false';
    const currentMsg = welcome?.message || '';

    if (match.toLowerCase() === 'get') {
      if (status === 'false') {
        return await message.send(
          `_*Example:* welcome Hello &mention_\n_status: off_\nVisit ${config.BASE_URL}info/welcome_`
        );
      }
      return await message.send(`_*Welcome Message:*_\n${currentMsg}`);
    }

    if (match.toLowerCase() === 'on') {
      if (status === 'true') return await message.send('_already activated_');
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: 'true', message: currentMsg },
      }, 'set');
      return await message.send('*welcome activated*');
    }

    if (match.toLowerCase() === 'off') {
      if (status === 'false') return await message.send('_already deactivated_');
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: 'false', message: currentMsg },
      }, 'set');
      return await message.send('*welcome deactivated*');
    }

    if (match.length) {
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status, message: match },
      }, 'set');
      return await message.send('*welcome message saved*');
    }

    return await message.send(
      '_Example:_\nwelcome Hello &mention\nwelcome on/off/get\nSupports: &mention, &pp, &name, &size'
    );
  }
);

plugin(
  {
    pattern: 'goodbye ?(.)',
    desc: 'Set or control goodbye message',
    react: '👋',
    type: 'group'
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command is for groups_*");
  if (!await isAccess(message)) {
		return await message.send('*_Only bot owner and group admins can use this command_*');
  }
    match = (match || '').trim();

    const { exit } =
      (await groupDB(['exit'], { jid: message.jid, content: {} }, 'get')) || {};
    const status = exit?.status === 'true' ? 'true' : 'false';
    const currentMsg = exit?.message || '';

    if (match.toLowerCase() === 'get') {
      if (status === 'false') {
        return await message.send(
          `_*Example:* exit Goodbye &mention_\n_status: off_\nVisit ${config.BASE_URL}info/exit_`
        );
      }
      return await message.send(`_*Goodbye Message:*_\n${currentMsg}`);
    }

    if (match.toLowerCase() === 'on') {
      if (status === 'true') return await message.send('_already activated_');
      await groupDB(['exit'], {
        jid: message.jid,
        content: { status: 'true', message: currentMsg },
      }, 'set');
      return await message.send('*goodbye activated*');
    }

    if (match.toLowerCase() === 'off') {
      if (status === 'false') return await message.send('_already deactivated_');
      await groupDB(['exit'], {
        jid: message.jid,
        content: { status: 'false', message: currentMsg },
      }, 'set');
      return await message.send('*goodbye deactivated*');
    }

    if (match.length) {
      await groupDB(['exit'], {
        jid: message.jid,
        content: { status, message: match },
      }, 'set');
      return await message.send('*goodbye message saved*');
    }

    return await message.send(
      '_Example:_\nexit Goodbye &mention\nexit on/off/get\nSupports: &mention, &pp, &name, &size'
    );
  }
);
