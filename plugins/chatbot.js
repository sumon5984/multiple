const { plugin, personalDB, mode, isBot } = require('../lib');

plugin({
  pattern: 'chatbot ?(.*)',
  fromMe: mode,
  desc: '🤖 Manage chatbot settings',
  type: 'owner'
}, async (message, match) => {
  try {
    // Check if user is bot owner
    if (!await isBot(message)) {
      return await message.send('*_Only bot owner can use this command_*');
    }

    // Get bot number properly
    const fullJid = message.client.user.id;
    const botNumber = fullJid.includes(':') ? fullJid.split(':')[0] : fullJid.split('@')[0];
    
    const raw = (match || '').trim();
    const lower = raw.toLowerCase();

    // Default chatbot settings
    const defaultSettings = {
      status: true,
      scope: 'only_group', // all | only_pm | only_group
      typingMs: 800,
      excludeJids: []
    };

    // Load current settings from database
    let current = { ...defaultSettings };
    
    try {
      // Get existing chatbot settings using your personalDB syntax
      const existingData = await personalDB(['chatbot'], {}, 'get', botNumber);
      
      if (existingData && existingData.chatbot) {
        // Parse existing settings
        const savedSettings = typeof existingData.chatbot === 'string' 
          ? JSON.parse(existingData.chatbot) 
          : existingData.chatbot;
        
        // Merge with defaults to ensure all properties exist
        current = { ...defaultSettings, ...savedSettings };
      }
    } catch (error) {
      console.log('Error loading chatbot settings:', error.message);
      // Use default settings if loading fails
      current = { ...defaultSettings };
    }

    // Show help and current settings if no command provided
    if (!raw) {
      const statusEmoji = current.status ? '✅ ON' : '❌ OFF';
      const excludedList = current.excludeJids.length > 0 
        ? `\n• Excluded JIDs: ${current.excludeJids.length}` 
        : '';
      
      return await message.reply(`
*🤖 Chatbot Settings*
────────────────
• Status: ${statusEmoji}
• Scope: ${current.scope.toUpperCase()}
• Typing Delay: ${current.typingMs}ms${excludedList}

*📝 Available Commands:*
• \`chatbot on\` - Enable chatbot
• \`chatbot off\` - Disable chatbot
• \`chatbot only_pm\` - PM only mode
• \`chatbot only_group\` - Group only mode
• \`chatbot all\` - Work in all chats
• \`chatbot typing <ms>\` - Set typing delay
• \`chatbot exclude <jid>\` - Exclude a JID
• \`chatbot reset\` - Reset to defaults
• \`chatbot status\` - Show current settings
────────────────`);
    }

    let updateMessage = '';

    // Handle different commands
    if (lower === 'on') {
      current.status = true;
      updateMessage = '✅ Chatbot enabled successfully!';
      
    } else if (lower === 'off') {
      current.status = false;
      updateMessage = '❌ Chatbot disabled successfully!';
      
    } else if (['only_pm', 'only_group', 'all'].includes(lower)) {
      current.scope = lower;
      updateMessage = `📍 Chatbot scope set to: *${lower.toUpperCase()}*`;
      
    } else if (lower.startsWith('typing')) {
      const typingValue = raw.replace(/typing/i, '').trim();
      const typingMs = parseInt(typingValue);
      
      if (isNaN(typingMs) || typingMs < 100 || typingMs > 10000) {
        return await message.send('❌ *Invalid typing delay!*\nProvide a value between 100-10000 ms\n\n*Example:* `chatbot typing 800`');
      }
      
      current.typingMs = typingMs;
      updateMessage = `⏱️ Typing delay set to: *${typingMs}ms*`;
      
    } else if (lower.startsWith('exclude')) {
      const jidToExclude = raw.replace(/exclude/i, '').trim();
      
      if (!jidToExclude) {
        return await message.send('❌ *Missing JID!*\nProvide a JID to exclude from chatbot\n\n*Example:* `chatbot exclude 1234567890@s.whatsapp.net`');
      }
      
      if (!current.excludeJids.includes(jidToExclude)) {
        current.excludeJids.push(jidToExclude);
        updateMessage = `🚫 JID excluded: *${jidToExclude}*`;
      } else {
        return await message.send('⚠️ *JID already excluded!*');
      }
      
    } else if (lower === 'reset') {
      current = { ...defaultSettings };
      updateMessage = '🔄 Chatbot settings reset to default values!';
      
    } else if (lower === 'status') {
      // Just show current settings (same as no command)
      const statusEmoji = current.status ? '✅ ON' : '❌ OFF';
      const excludedList = current.excludeJids.length > 0 
        ? `\n• Excluded JIDs: ${current.excludeJids.join(', ')}` 
        : '';
      
      return await message.reply(`
*🤖 Current Chatbot Status*
────────────────
• Status: ${statusEmoji}
• Scope: ${current.scope.toUpperCase()}
• Typing Delay: ${current.typingMs}ms${excludedList}
────────────────`);
      
    } else {
      return await message.send('❌ *Invalid command!*\n\nType `chatbot` to see all available commands.');
    }

    // Save updated settings to database using your personalDB syntax
    try {
      // Use 'set' method with content property as required by your personalDB
      const saveResult = await personalDB(['chatbot'], { content: current }, 'set', botNumber);
      
      if (saveResult) {
        // Send success message
        await message.send(`${updateMessage}\n\n*✅ Settings saved successfully!*`);
      } else {
        await message.send('❌ *Failed to save settings!*\nPlease try again.');
      }
      
    } catch (saveError) {
      console.error('Error saving chatbot settings:', saveError);
      await message.send('❌ *Failed to save settings!*\nPlease try again or contact support.');
    }

  } catch (error) {
    console.error('Chatbot plugin error:', error);
    await message.send('❌ *An error occurred while processing the command.*\nPlease try again later.');
  }
});