const { personalDB } = require('./index');
async function handleStatusUpdate(conn, msg) {
    const config = await personalDB(['autostatus'], {}, 'get');
    if (config.autostatus !== 'true') return;
     if (msg.key.remoteJid !== 'status@broadcast') return;
      try {
        await conn.readMessages([msg.key]);
        console.log(`Auto-seen status from ${msg.key.participant || 'unknown sender'}`);
    } catch (e) {
        console.error(`❌ Failed to auto-see status:`, e.message);
    }
}

module.exports = { handleStatusUpdate };