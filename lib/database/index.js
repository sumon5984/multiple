const {personalDB} = require('./personal');
const {groupDB} = require('./group');
const {
  initSessions,
  saveSession,
  getSession,
  getAllSessions,
  deleteSession
} = require('./sessions');

module.exports = {personalDB,groupDB,initSessions,
  saveSession,
  getSession,
  getAllSessions,
  deleteSession};
