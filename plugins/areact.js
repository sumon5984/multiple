

const { plugin, personalDB, mode, isBot } = require('../lib');

const formatStatus = (config) => {
  if (!config) return '*Auto-react is `OFF`*';

  const status = [];
  if (config.includes('on')) status.push('Enabled');
  if (config.includes('only_pm')) status.push('Only PM');
  if (config.includes('only_group')) status.push('Only Groups');

  const reactOnlyList = (config.match(/react_only ([^\s]+)/g) || []).map(j => j.split(' ')[1]);
  if (reactOnlyList.length) status.push('📍 React Only to:\n' + reactOnlyList.map(j => `   • ${j}`).join('\n'));

  const notReactList = (config.match(/not_react ([^\s]+)/g) || []).map(j => j.split(' ')[1]);
  if (notReactList.length) status.push('dDo Not React to:\n' + notReactList.map(j => `   • ${j}`).join('\n'));

  const emojiLine = config.match(/add_emoji (.+)/)?.[1]?.trim();
  if (emojiLine) status.push('😄 Emojis:\n   ' + emojiLine.split(/ +/).join(' '));

  return `*Auto-react Settings:*\n\n${status.join('\n\n')}`;
};

plugin({
  pattern: 'areact ?(.*)',
  formMe: mode,
  desc: 'Auto React settings',
  type: 'owner'
}, async (message, match) => {
  if (!await isBot(message)) {
		return await message.send('*_Only bot owner can use this command_*');
  }
  const input = match?.trim();
  let settings = await personalDB(['areact'], {}, 'get');
  let config = settings?.areact || '';

  switch (true) {
    case input === 'on':
      config = config.replace('off', '').trim();
      if (!config.includes('on')) config += ' on';
      break;

    case input === 'off':
      config = 'off';
      break;

    case input === 'only_pm':
      config = config.replace('only_group', '').replace('only_pm', '').trim();
      config += ' only_pm';
      break;

    case input === 'only_group':
      config = config.replace('only_pm', '').replace('only_group', '').trim();
      config += ' only_group';
      break;

    case input?.startsWith('react_only'):
      {
        const jid = input.split(' ')[1]?.trim();
        if (!jid) return await message.reply('❌ Provide JID\nExample: `.areact react_only 1234@s.whatsapp.net`');
        if (!config.includes(`react_only ${jid}`)) config += ` react_only ${jid}`;
      }
      break;

    case input?.startsWith('not_react'):
      {
        const jid = input.split(' ')[1]?.trim();
        if (!jid) return await message.reply('❌ Provide JID\nExample: `.areact not_react 1234@s.whatsapp.net`');
        if (!config.includes(`not_react ${jid}`)) config += ` not_react ${jid}`;
      }
      break;

    case input?.startsWith('add_emoji'):
      {
        let emojis = input.replace('add_emoji', '').replace(/[\s]+/g, '').trim();
        if (!emojis) return await message.reply('❌ Provide emojis\nExample: `.areact add_emoji 😂🥲🔥`');

        emojis = [...emojis].join(' ');
        config = config.replace(/add_emoji\s+[^\n]+/, '').trim();
        config += ` add_emoji ${emojis}`;
      }
      break;

    case input === 'reset':
      config = '';
      break;

    case input === '':
      return await message.reply(
        '*Usage:*\n' +
        '- areact on / off\n' +
        '- areact only_pm / only_group\n' +
        '- areact react_only <jid>\n' +
        '- areact not_react <jid>\n' +
        '- areact add_emoji 😀😂🥲\n' +
        '- areact reset\n\n' +
        formatStatus(config.trim())
      );

    default:
      return await message.reply(
        '*Usage:*\n' +
        '- areact on / off\n' +
        '- areact only_pm / only_group\n' +
        '- areact react_only <jid>\n' +
        '- areact not_react <jid>\n' +
        '- areact add_emoji 😀😂🥲\n' +
        '- areact reset\n\n' +
        formatStatus(config.trim())
      );
  }

  await personalDB(['areact'], { content: config.trim() }, 'set');
  return await message.reply('*Updated!*\n\n' + formatStatus(config.trim()));
});