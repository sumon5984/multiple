const { plugin, groupDB, isAdmin, isAccess, config } = require('../lib');



plugin(
  {
    pattern: 'welcome ?(.*)',
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

    // Get group-specific settings
    const { welcome } =
      (await groupDB(['welcome'], { jid: message.jid, content: {} }, 'get')) || {};

    // Get global settings
    const { welcome: globalWelcome } =
      (await groupDB(['global_welcome'], { jid: 'global', content: {} }, 'get')) || {};

    const groupStatus = welcome?.status === 'true' ? 'true' : 'false';
    const globalAllStatus = globalWelcome?.all_status === 'true' ? 'true' : 'false';
    const currentMsg = welcome?.message || globalWelcome?.message || 'Hey &mention welcome to &name all groups members &size &pp';

    if (match.toLowerCase() === 'get') {
      const statusText = groupStatus === 'true' ? 'on' : 'off';
      const allStatusText = globalAllStatus === 'true' ? 'on' : 'off';

      return await message.send(
        `_*Welcome Settings:*_\n` +
        `*Group Status:* ${statusText}\n` +
        `*All Groups Status:* ${allStatusText}\n` +
        `*Message:* ${currentMsg}\n\n` +
        `_Use: welcome on/off, welcome all on/off_\n` +
        `Visit ${config.BASE_URL}info/welcome`
      );
    }

    // Handle "all on" command
    if (match.toLowerCase() === 'all on') {
      await groupDB(['global_welcome'], {
        jid: 'global',
        content: {
          status: globalWelcome?.status || 'true',
          all_status: 'true',
          message: globalWelcome?.message || 'Hey &mention welcome to &name all groups members &size &pp'
        }
      }, 'set');
      return await message.send('*Welcome activated for ALL groups*');
    }

    // Handle "all off" command
    if (match.toLowerCase() === 'all off') {
      await groupDB(['global_welcome'], {
        jid: 'global',
        content: {
          status: globalWelcome?.status || 'true',
          all_status: 'false',
          message: globalWelcome?.message || 'Hey &mention welcome to &name all groups members &size &pp'
        }
      }, 'set');
      return await message.send('*Welcome deactivated for all groups (individual group settings will apply)*');
    }

    if (match.toLowerCase() === 'on') {
      if (groupStatus === 'true') return await message.send('_already activated_');
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: 'true', message: currentMsg },
      }, 'set');
      return await message.send('*Welcome activated for this group*');
    }

    if (match.toLowerCase() === 'off') {
      if (groupStatus === 'false') return await message.send('_already deactivated_');
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: 'false', message: currentMsg },
      }, 'set');
      return await message.send('*Welcome deactivated for this group*');
    }

    if (match.length) {
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: groupStatus, message: match },
      }, 'set');

      // Also update global message if all is enabled
      if (globalAllStatus === 'true') {
        await groupDB(['global_welcome'], {
          jid: 'global',
          content: {
            status: globalWelcome?.status || 'true',
            all_status: 'true',
            message: match
          }
        }, 'set');
      }

      return await message.send('*Welcome message saved*');
    }

    return await message.send(
      '_Example:_\n' +
      'welcome Hello &mention\n' +
      'welcome on/off (for this group)\n' +
      'welcome all on/off (for all groups)\n' +
      'welcome get (check settings)\n\n' +
      'Supports: &mention, &pp, &name, &size'
    );
  }
);

plugin(
  {
    pattern: 'goodbye ?(.*)',
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

    // Get group-specific settings
    const { exit } =
      (await groupDB(['exit'], { jid: message.jid, content: {} }, 'get')) || {};

    // Get global settings
    const { exit: globalExit } =
      (await groupDB(['global_exit'], { jid: 'global', content: {} }, 'get')) || {};

    const groupStatus = exit?.status === 'true' ? 'true' : 'false';
    const globalAllStatus = globalExit?.all_status === 'true' ? 'true' : 'false';
    const currentMsg = exit?.message || globalExit?.message || 'Goodbye &mention! Thanks for being part of &name &pp';

    if (match.toLowerCase() === 'get') {
      const statusText = groupStatus === 'true' ? 'on' : 'off';
      const allStatusText = globalAllStatus === 'true' ? 'on' : 'off';

      return await message.send(
        `_*Goodbye Settings:*_\n` +
        `*Group Status:* ${statusText}\n` +
        `*All Groups Status:* ${allStatusText}\n` +
        `*Message:* ${currentMsg}\n\n` +
        `_Use: goodbye on/off, goodbye all on/off_\n` +
        `Visit ${config.BASE_URL}info/exit`
      );
    }

    // Handle "all on" command
    if (match.toLowerCase() === 'all on') {
      await groupDB(['global_exit'], {
        jid: 'global',
        content: {
          status: globalExit?.status || 'true',
          all_status: 'true',
          message: globalExit?.message || 'Goodbye &mention! Thanks for being part of &name &pp'
        }
      }, 'set');
      return await message.send('*Goodbye activated for ALL groups*');
    }

    // Handle "all off" command
    if (match.toLowerCase() === 'all off') {
      await groupDB(['global_exit'], {
        jid: 'global',
        content: {
          status: globalExit?.status || 'true',
          all_status: 'false',
          message: globalExit?.message || 'Goodbye &mention! Thanks for being part of &name &pp'
        }
      }, 'set');
      return await message.send('*Goodbye deactivated for all groups (individual group settings will apply)*');
    }

    if (match.toLowerCase() === 'on') {
      if (groupStatus === 'true') return await message.send('_already activated_');
      await groupDB(['exit'], {
        jid: message.jid,
        content: { status: 'true', message: currentMsg },
      }, 'set');
      return await message.send('*Goodbye activated for this group*');
    }

    if (match.toLowerCase() === 'off') {
      if (groupStatus === 'false') return await message.send('_already deactivated_');
      await groupDB(['exit'], {
        jid: message.jid,
        content: { status: 'false', message: currentMsg },
      }, 'set');
      return await message.send('*Goodbye deactivated for this group*');
    }

    if (match.length) {
      await groupDB(['exit'], {
        jid: message.jid,
        content: { status: groupStatus, message: match },
      }, 'set');

      // Also update global message if all is enabled
      if (globalAllStatus === 'true') {
        await groupDB(['global_exit'], {
          jid: 'global',
          content: {
            status: globalExit?.status || 'true',
            all_status: 'true',
            message: match
          }
        }, 'set');
      }

      return await message.send('*Goodbye message saved*');
    }

    return await message.send(
      '_Example:_\n' +
      'goodbye Goodbye &mention\n' +
      'goodbye on/off (for this group)\n' +
      'goodbye all on/off (for all groups)\n' +
      'goodbye get (check settings)\n\n' +
      'Supports: &mention, &pp, &name, &size'
    );
  }
);

