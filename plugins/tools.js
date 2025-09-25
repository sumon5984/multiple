const {
  plugin,
  mode,
  isBot,
  personalDB
} = require('../lib');

plugin({
  pattern: 'astatus',
  fromMe: mode,
  desc: 'Auto seen WhatsApp status',
  type: 'owner'
}, async (message, match) => {
  if (!await isBot(message)) {
    return await message.send('*_Only bot owner can use this command_*');
  }
  
  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];
  const input = match?.trim().toLowerCase();

  if (input === 'on') {
    const result = await personalDB(['autostatus'], { content: 'true' }, 'set', botNumber);
    if (result) {
      return await message.send('*Auto status seen is now `ON`*');
    } else {
      return await message.send('*Error setting auto status*');
    }
  } else if (input === 'off') {
    const result = await personalDB(['autostatus'], { content: 'false' }, 'set', botNumber);
    if (result) {
      return await message.send('*Auto status seen is now `OFF`*');
    } else {
      return await message.send('*Error setting auto status*');
    }
  } else {
    const data = await personalDB(['autostatus'], {}, 'get', botNumber);
    const status = data?.autostatus === 'true';
    return await message.send(
      `*Auto Status Seen:*\nStatus: ${status ? 'ON' : 'OFF'}\n\nUse:\n• astatus on\n• astatus off`
    );
  }
});

plugin({
  pattern: 'astatusreact',
  fromMe: mode,
  desc: 'Auto react WhatsApp status',
  type: 'owner'
}, async (message, match) => {
  if (!await isBot(message)) {
    return await message.send('*_Only bot owner can use this command_*');
  }
  
  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];
  const input = match?.trim().toLowerCase();

  if (input === 'on') {
    const result = await personalDB(['autostatus_react'], { content: 'true' }, 'set', botNumber);
    if (result) {
      return await message.send('*Auto status react is now `ON`*');
    } else {
      return await message.send('*Error setting auto status react*');
    }
  } else if (input === 'off') {
    const result = await personalDB(['autostatus_react'], { content: 'false' }, 'set', botNumber);
    if (result) {
      return await message.send('*Auto status react is now `OFF`*');
    } else {
      return await message.send('*Error setting auto status react*');
    }
  } else {
    const data = await personalDB(['autostatus_react'], {}, 'get', botNumber);
    // Fixed: Use correct field name
    const status = data?.autostatus_react === 'true';
    return await message.send(
      `*Auto Status react:*\nStatus react: ${status ? 'ON' : 'OFF'}\n\nUse:\n• astatusreact on\n• astatusreact off`
    );
  }
});

plugin({
  pattern: 'autotyping',
  fromMe: mode,
  desc: 'autotyping WhatsApp',
  type: 'owner'
}, async (message, match) => {
  if (!await isBot(message)) {
    return await message.send('*_Only bot owner can use this command_*');
  }
  
  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];
  const input = match?.trim().toLowerCase();

  if (input === 'on') {
    const result = await personalDB(['autotyping'], { content: 'true' }, 'set', botNumber);
    if (result) {
      return await message.send('*activate auto typing `ON`*');
    } else {
      return await message.send('*Error setting auto typing*');
    }
  } else if (input === 'off') {
    const result = await personalDB(['autotyping'], { content: 'false' }, 'set', botNumber);
    if (result) {
      return await message.send('*deactivate auto typing `OFF`*');
    } else {
      return await message.send('*Error setting auto typing*');
    }
  } else {
    const data = await personalDB(['autotyping'], {}, 'get', botNumber);
    // Fixed: Use correct field name
    const status = data?.autotyping === 'true';
    return await message.send(
      `*autotyping:*\nstatus: ${status ? 'ON' : 'OFF'}\n\nUse:\n• autotyping on\n• autotyping off`
    );
  }
});

plugin({
  pattern: 'autoreact ?(.*)',
  fromMe: mode,
  desc: '✨ Toggle Auto React',
  type: 'owner'
}, async (message, match) => {
  if (!await isBot(message)) {
    return await message.send('*_Only bot owner can use this command_*');
  }

  const fullJid = message.client.user.id;
  const botNumber = fullJid.split(':')[0];
  const input = match.trim().toLowerCase();

  if (input === 'on') {
    // Fixed: Pass content properly
    const result = await personalDB(['autoreact'], { content: 'true' }, 'set', botNumber);
    if (result) {
      return await message.send('✅ *AutoReact enabled*');
    } else {
      return await message.send('❌ *Error enabling AutoReact*');
    }
  }

  if (input === 'off') {
    // Fixed: Pass content properly
    const result = await personalDB(['autoreact'], { content: 'false' }, 'set', botNumber);
    if (result) {
      return await message.send('🚫 *AutoReact disabled*');
    } else {
      return await message.send('❌ *Error disabling AutoReact*');
    }
  }

  const settings = await personalDB(['autoreact'], {}, 'get', botNumber);
  return await message.send(
    `⚙️ *AutoReact Settings*\n` +
    `> Status: ${settings?.autoreact === 'true' ? '✅ ON' : '❌ OFF'}`
  );
});