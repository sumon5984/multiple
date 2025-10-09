// ============================================
// CONNECTION MANAGER CLASS
// ============================================
class ConnectionManager {
  constructor() {
    this.connections = new Map(); // { file_path: connection_object }
    this.connectingState = new Set(); // file_paths currently connecting
  }

  // Get all connected sessions
  getAllConnections() {
    const allConnections = [];
    for (const [file_path, connection] of this.connections.entries()) {
      allConnections.push({
        file_path,
        connection,
      });
    }
    return allConnections;
  }

  // Check if already connected
  isConnected(file_path) {
    return this.connections.has(file_path);
  }

  // Check if currently connecting
  isConnecting(file_path) {
    return this.connectingState.has(file_path);
  }

  // Mark session as connecting
  setConnecting(file_path) {
    this.connectingState.add(file_path);
  }

  // Remove from connecting state
  removeConnecting(file_path) {
    this.connectingState.delete(file_path);
  }

  // Add successful connection
  addConnection(file_path, connection) {
    this.connections.set(file_path, connection);
    this.removeConnecting(file_path);
  }

  // Remove connection
  removeConnection(file_path) {
    this.connections.delete(file_path);
    this.removeConnecting(file_path);
  }
}

// ============================================
// INITIALIZE MANAGER
// ============================================
const manager = new ConnectionManager();

// ============================================
// EXPORT MANAGER
// ============================================
module.exports = manager;
