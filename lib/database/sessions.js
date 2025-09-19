const { DataTypes } = require("sequelize");
const config = require("../../config");
const fs = require("fs-extra");
const path = require("path");

const Session = config.DATABASE.define("sessions", {
  number: { type: DataTypes.STRING, unique: true },
  creds: { type: DataTypes.JSONB },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Make sure table exists
async function initSessions() {
  await Session.sync();
}

// Save/update creds
async function saveSession(number, creds) {
  await Session.upsert({ number, creds, updatedAt: new Date() });
}

// Get one session
async function getSession(number) {
  return await Session.findOne({ where: { number } });
}

// Get all sessions
async function getAllSessions() {
  return await Session.findAll();
}

// Delete session
async function deleteSession(number) {
  await Session.destroy({ where: { number } });
  const sessionDir = path.join(__dirname, "../../sessions", number);
  fs.removeSync(sessionDir);
}

module.exports = {
  initSessions,
  saveSession,
  getSession,
  getAllSessions,
  deleteSession
};