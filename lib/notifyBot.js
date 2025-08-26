
const pino = require("pino");
const path = require("path");
const fs = require("fs");
const config = require("../config");
const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers
} = require("@whiskeysockets/baileys");
const { WAConnection } = require("./main");
const { sleep } = require("i-nrl");



//=================================================================================
async function downloadSessionFromMega(file_path) {
  const { File } = require('megajs');
  try {
    console.log('🍓 Connecting to session...');
    
    // Validate SESSION_ID format
    if (!config.SESSION_ID || !config.SESSION_ID.startsWith('KAISEN~')) {
      throw new Error('Invalid SESSION_ID format. Must start with "KAISEN~"');
    }
    
    const sessPart = config.SESSION_ID.replace('KAISEN~', '');
    
    // Validate session part
    if (!sessPart || sessPart.length < 10) {
      throw new Error('Invalid session ID part after KAISEN~');
    }
    
    const megaUrl = `https://mega.nz/file/${sessPart}`;
    console.log(`🔗 Attempting to download from: ${megaUrl.substring(0, 30)}...`);
    
    const file = File.fromURL(megaUrl);
    
    // Add timeout for download
    const downloadPromise = file.downloadBuffer();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Download timeout after 60 seconds')), 60000)
    );
    
    const buffer = await Promise.race([downloadPromise, timeoutPromise]);
    
    if (!buffer || buffer.length === 0) {
      throw new Error('Downloaded buffer is empty or invalid');
    }
    
    // Ensure the directory exists
    const authDir = `./notify/${file_path}`;
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
      console.log(`📁 Created directory: ${authDir}`);
    }
    
    const targetPath = path.join(authDir, 'creds.json');
    
    // Validate JSON before saving
    try {
      const jsonData = JSON.parse(buffer.toString());
      if (!jsonData.noiseKey || !jsonData.pairingEphemeralKeyPair) {
        throw new Error('Invalid session data structure');
      }
    } catch (parseError) {
      throw new Error(`Invalid JSON in session file: ${parseError.message}`);
    }
    
    fs.writeFileSync(targetPath, buffer);
    console.log('🍉 Session downloaded and saved successfully!');
    console.log(`📍 Saved to: ${targetPath}`);
    
    // Verify file was created and has content
    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      console.log(`✅ File verified - Size: ${stats.size} bytes`);
    } else {
      throw new Error('File was not created successfully');
    }
    
  } catch (e) {
    console.log('❌ Failed to connect session:', e.message || e);
    
    // More specific error handling
    if (e.message.includes('timeout')) {
      console.log("🕐 Session download timed out. Check your internet connection.");
    } else if (e.message.includes('Invalid session')) {
      console.log("🔑 Session ID is invalid or corrupted.");
    } else if (e.message.includes('ENOTFOUND') || e.message.includes('network')) {
      console.log("🌐 Network error. Check your internet connection.");
    } else {
      console.log("🔧 Possible solutions:");
      console.log("   - Verify SESSION_ID in config.js");
      console.log("   - Check if MEGA link is still valid");
      console.log("   - Ensure stable internet connection");
    }
    
    console.log("🎐 Rebooting in 45 seconds...");
    await sleep(45000);
    process.exit(0);
  }
  console.log(`🌲 Auth file loaded from database`);
}


// Store for notification connections
const notificationConnections = new Map();
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
let isConnecting = false;

// Initialize notification connection on startup
async function initializeNotificationConnection() {
  if (isConnecting) {
    console.log('⚠️ Connection already in progress, skipping...');
    return false;
  }
  
  try {
    isConnecting = true;
    const notifyConn = await connect('notifyAuth');
    if (notifyConn) {
      console.log('📢 Notification system initialized successfully');
      reconnectAttempts = 0;
      return true;
    } else {
      console.log('⚠️ Failed to initialize notification connection - retrying in 5 seconds...');
      setTimeout(() => {
        isConnecting = false;
        initializeNotificationConnection();
      }, 5000);
    }
  } catch (error) {
    console.log('⚠️ Failed to initialize notification connection:', error.message);
    setTimeout(() => {
      isConnecting = false;
      initializeNotificationConnection();
    }, 10000);
  } finally {
    if (!notificationConnections.size) {
      isConnecting = false;
    }
  }
  return false;
}

const connect = async (file_path) => {
  try {
    // Create base directory if it doesn't exist
    const baseDir = `./${file_path}`;
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log(`📁 Created base directory: ${baseDir}`);
    }
    
    console.log('🍁 Generating session!!');

    if (!config.SESSION_ID) {
      console.log('❌ Please provide a session id in config.js');
      console.log('🔧 Scan QR from server to get SESSION_ID');
      await sleep(60000);
      process.exit(1);
    }

    const authDir = `./notify/${file_path}`;
    const credsPath = path.join(authDir, 'creds.json');
    
    // Check if directory and creds exist
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
      console.log(`📁 Created auth directory: ${authDir}`);
    }
    
    // Download session if creds.json doesn't exist or is empty
    if (!fs.existsSync(credsPath)) {
      console.log('📥 Downloading session from MEGA...');
      await downloadSessionFromMega(file_path);
    } else {
      // Verify existing creds file
      try {
        const stats = fs.statSync(credsPath);
        if (stats.size === 0) {
          console.log('⚠️ Existing creds.json is empty, re-downloading...');
          await downloadSessionFromMega(file_path);
        } else {
          console.log('✅ Using existing session file');
        }
      } catch (error) {
        console.log('⚠️ Error reading existing creds, re-downloading...', error.message);
        await downloadSessionFromMega(file_path);
      }
    }
    const { state, saveCreds } = await useMultiFileAuthState(`./notify/${file_path}`);
    const { version } = await fetchLatestBaileysVersion();

    let conn = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Firefox"),
      version,
      printQRInTerminal: false,
      connectTimeoutMs: 30000,
      defaultQueryTimeoutMs: 10000,
      keepAliveIntervalMs: 25000,
    });

    conn.ev.on("creds.update", saveCreds);

    if (!conn.wcg) conn.wcg = {};
    conn = new WAConnection(conn);

    conn.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode || 0;
        console.log(`🛑 [${file_path}] connection closed with status code: ${statusCode}`);

        // Remove from notification connections
        notificationConnections.delete(file_path);

        switch (statusCode) {
          case DisconnectReason.badSession:
            console.log("❌ Bad Session File. Notification system disabled.");
            break;
          case DisconnectReason.connectionClosed:
          case DisconnectReason.connectionLost:
          case DisconnectReason.restartRequired:
          case DisconnectReason.timedOut:
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              console.log(`⚠️ [${file_path}] Connection issue. Attempting reconnect ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}`);
              reconnectAttempts++;
              await sleep(5000 * reconnectAttempts); // Exponential backoff
              if (!isConnecting) {
                setTimeout(() => connect(file_path), 1000);
              }
            } else {
              console.log(`❌ [${file_path}] Max reconnection attempts reached. Notification system disabled.`);
            }
            break;
          case DisconnectReason.connectionReplaced:
            console.log("⚠️ Connection replaced. Notification session logged in elsewhere. Stopping reconnection attempts.");
            reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // Stop reconnecting
            break;
          case DisconnectReason.loggedOut:
            console.log("🛑 Logged out. Notification system disabled.");
            break;
          case DisconnectReason.multideviceMismatch:
            console.log("❌ Multi-device mismatch. Notification system disabled.");
            break;
          default:
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              console.log(`❌ Unknown reason: ${statusCode}. Attempting reconnect ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}`);
              reconnectAttempts++;
              await sleep(3000 * reconnectAttempts);
              if (!isConnecting) {
                setTimeout(() => connect(file_path), 1000);
              }
            } else {
              console.log(`❌ [${file_path}] Max reconnection attempts reached. Notification system disabled.`);
            }
        }

      } else if (connection === "open") {
        console.log(`✅ [${file_path}] WhatsApp Connected`);
        reconnectAttempts = 0; // Reset on successful connection

        // Store the connection for notifications
        notificationConnections.set(file_path, conn);
      }
    });

    return conn;
  } catch (err) {
    console.error(`❌ Error connecting [${file_path}]:`, err.message);
    throw err;
  }
};

// Function to send notifications to user
async function notifyDeveloper(message, num) {
  try {
    if (!num) {
      console.log('⚠️ No recipient number provided for notification');
      return false;
    }

    const number = num + "@s.whatsapp.net";
    
    // Try to use any available notification connection
    for (const [sessionId, conn] of notificationConnections) {
      if (conn && conn.user && conn.ws && conn.ws.readyState === 1) {
        try {
          await conn.sendMessage(number, { text: message });
          console.log(`📢 User ${num} notified via session: ${sessionId}`);
          return true;
        } catch (sendError) {
          console.log(`⚠️ Failed to send via session ${sessionId}: ${sendError.message}`);
          // Remove invalid connection
          notificationConnections.delete(sessionId);
          continue;
        }
      }
    }

    // If no connections available, try to create a temporary one
    console.log('⚠️ No available connections to send notification, attempting to create temporary connection...');
    
    try {
      const tempConn = await createNotificationConnection();
      if (tempConn && tempConn.user) {
        await tempConn.sendMessage(number, { text: message });
        console.log(`📢 User ${num} notified via temporary connection`);
        return true;
      }
    } catch (tempError) {
      console.log(`⚠️ Failed to create temporary connection: ${tempError.message}`);
    }

    console.log('⚠️ All notification attempts failed');
    return false;
  } catch (error) {
    console.error("❌ Failed to notify user:", error.message);
    return false;
  }
}

// Create a temporary notification connection using notifyAuth
async function createNotificationConnection() {
  if (isConnecting) {
    return null;
  }
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./notify/notifyAuth');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Firefox"),
      version,
      printQRInTerminal: false,
      connectTimeoutMs: 10000,
    });

    conn.ev.on("creds.update", saveCreds);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(null);
      }, 15000);

      conn.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
          clearTimeout(timeout);
          resolve(new WAConnection(conn));
        } else if (connection === "close") {
          clearTimeout(timeout);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("❌ Failed to create notification connection:", error.message);
    return null;
  }
}

// Send connection notification
async function sendConnectionNotification(userNumber, conn) {
  // Safety check - only proceed if conn and conn.user exist
  if (!conn || !conn.user) {
    console.log(`⚠️ Cannot send connection notification for ${userNumber} - connection not ready`);
    return;
  }

  const userJid = conn.user.id || userNumber;
  const timestamp = new Date().toLocaleString();

  const message = `🟢 *BOT CONNECTION ALERT*\n\n` +
    `👤 *User:* ${userNumber}\n` +
    `📱 *Bot ID:* ${userJid}\n` +
    `✅ *Status:* CONNECTED\n` +
    `🕐 *Time:* ${timestamp}\n` +
    `🌍 *Platform:* WhatsApp Bot Hosting\n\n` +
    `_User bot is now online and operational_`;

  // Send to admin/developer (if configured)
  const adminNumber = process.env.ADMIN_NUMBER || null;
  if (adminNumber) {
    await notifyDeveloper(message, adminNumber);
  }

  // Also notify the user
  try {
    const userMessage = `🎉 *Welcome to Bot Hosting Platform!*\n\n` +
      `✅ Your bot is now *CONNECTED* and ready to use!\n` +
      `🕐 Connected at: ${timestamp}\n\n` +
      `📞 *Support:* Contact admin if you need help\n` +
      `🔧 *Features:* Your bot is fully operational`;

    await conn.sendMessage(userJid, { text: userMessage });
    console.log(`📢 User ${userNumber} notified of connection`);
  } catch (error) {
    console.error("⚠️ Failed to notify user:", error.message);
  }
}

// Send disconnection notification
async function sendDisconnectionNotification(userNumber, statusCode) {
  const timestamp = new Date().toLocaleString();
  let reason = "Unknown";

  switch (statusCode) {
    case DisconnectReason.badSession:
      reason = "Bad Session File";
      break;
    case DisconnectReason.connectionClosed:
      reason = "Connection Closed";
      break;
    case DisconnectReason.connectionLost:
      reason = "Connection Lost";
      break;
    case DisconnectReason.connectionReplaced:
      reason = "Connection Replaced";
      break;
    case DisconnectReason.loggedOut:
      reason = "User Logged Out";
      break;
    case DisconnectReason.multideviceMismatch:
      reason = "Multi-device Mismatch";
      break;
    case DisconnectReason.restartRequired:
      reason = "Restart Required";
      break;
    case DisconnectReason.timedOut:
      reason = "Connection Timed Out";
      break;
  }

  const message = `🔴 *BOT DISCONNECTION ALERT*\n\n` +
    `👤 *User:* ${userNumber}\n` +
    `❌ *Status:* DISCONNECTED\n` +
    `⚠️ *Reason:* ${reason}\n` +
    `🔢 *Code:* ${statusCode}\n` +
    `🕐 *Time:* ${timestamp}\n\n` +
    `_User bot has gone offline_`;

  const adminNumber = process.env.ADMIN_NUMBER || null;
  if (adminNumber) {
    await notifyDeveloper(message, adminNumber);
  }

  // Remove from active connections
  notificationConnections.delete(userNumber);
}

// Send reconnection notification
async function sendReconnectionNotification(userNumber) {
  const timestamp = new Date().toLocaleString();

  const message = `🟡 *BOT RECONNECTION ALERT*\n\n` +
    `👤 *User:* ${userNumber}\n` +
    `🔄 *Status:* ATTEMPTING RECONNECTION\n` +
    `🕐 *Time:* ${timestamp}\n\n` +
    `_Bot is trying to reconnect automatically_`;

  const adminNumber = process.env.ADMIN_NUMBER || null;
  if (adminNumber) {
    await notifyDeveloper(message, adminNumber);
  }
}

// Send error notification
async function sendErrorNotification(userNumber, errorMessage) {
  const timestamp = new Date().toLocaleString();

  const message = `🚨 *BOT ERROR ALERT*\n\n` +
    `👤 *User:* ${userNumber}\n` +
    `❌ *Status:* ERROR\n` +
    `🐛 *Error:* ${errorMessage.substring(0, 100)}...\n` +
    `🕐 *Time:* ${timestamp}\n\n` +
    `_Immediate attention required_`;

  const adminNumber = process.env.ADMIN_NUMBER || null;
  if (adminNumber) {
    await notifyDeveloper(message, adminNumber);
  }
}

// Function to send custom notifications (can be called from other parts of the system)
async function notifysend(recipient, message) {
  try {
    for (const [sessionId, conn] of notificationConnections) {
      if (conn && conn.user && conn.ws && conn.ws.readyState === 1) {
        try {
          await conn.sendMessage(recipient, { text: message });
          console.log(`📤 Message sent to ${recipient} via session: ${sessionId}`);
          return true;
        } catch (sendError) {
          console.log(`⚠️ Failed to send via session ${sessionId}: ${sendError.message}`);
          // Remove invalid connection
          notificationConnections.delete(sessionId);
          continue;
        }
      }
    }

    console.log('⚠️ No available connections for custom notification');
    return false;
  } catch (error) {
    console.error("❌ Failed to send notification:", error.message);
    return false;
  }
}

// Get notification system status
function getNotificationStatus() {
  return {
    connections: notificationConnections.size,
    reconnectAttempts: reconnectAttempts,
    isConnecting: isConnecting,
    maxAttempts: MAX_RECONNECT_ATTEMPTS
  };
}

module.exports = {
  
  connect,
  notifysend,
  notifyDeveloper,
  sendConnectionNotification,
  sendDisconnectionNotification,
  sendReconnectionNotification,
  sendErrorNotification,
  initializeNotificationConnection,
  getNotificationStatus
};
