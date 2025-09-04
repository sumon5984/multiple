const { Sequelize, DataTypes } = require("sequelize");
const config = require('../../config');

const methods = ['get', 'set', 'add', 'delete'];
const types = [
  { 'mention': 'object' },
  { 'areact': 'string' },
  { 'ban': 'string' },
  { 'alive': 'string' },
  { 'login': 'string' },
  { 'shutoff': 'string' },
  { 'owner_updt': 'string' },
  { 'commit_key': 'string' },
  { 'sticker_cmd': 'object' },
  { 'plugins': 'object' },
  { 'toggle': 'object' },   
  { 'autostatus': 'string' },
  { 'autostatus_react': 'string' },
  { 'chatbot': 'object' },
  { 'always_online': 'string' },
  { 'status_view': 'string' },
  { 'save_status': 'string' },
  ];

function jsonConcat(o1, o2) {
  for (const key in o2) {
    o1[key] = o2[key];
  }
  return o1;
}

const personalDb = config.DATABASE.define("personalDB", {
  jid: { type: DataTypes.STRING, unique: true },
  mention: { type: DataTypes.TEXT, allowNull: true },
  ban: { type: DataTypes.TEXT, allowNull: true },
  alive: { type: DataTypes.TEXT, allowNull: true, defaultValue: '_hey iam alive now &sender_' },
  login: { type: DataTypes.TEXT, allowNull: true },
  shutoff: { type: DataTypes.TEXT, allowNull: true },
  owner_updt: { type: DataTypes.TEXT, allowNull: true },
  commit_key: { type: DataTypes.TEXT, allowNull: true },
  sticker_cmd: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' },
  plugins: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' },
  toggle: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' },
  areact: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
  autostatus: { type: DataTypes.TEXT, allowNull: true, defaultValue: 'false' },
  chatbot: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' },
  autostatus_react: { type: DataTypes.TEXT, allowNull: true, defaultValue: 'false' },
  always_online: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' },
  status_view: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' },
  save_status: { type: DataTypes.TEXT, allowNull: true, defaultValue: '{}' }
});

async function personalDB(type, options = {}, method = 'get', jid) {
  if (!Array.isArray(type)) return;
  if (typeof options !== 'object') return;
  if (!methods.includes(method)) return;
  if (!jid) return; // JID must be provided

  let filteredTypes = type.map(t => types.find(a => a[t])).filter(Boolean);
  if (filteredTypes.length === 0) return;

  let data = await personalDb.findOne({ where: { jid } });

  // CREATE if not exist and setting
  if (!data) {
    if (['set', 'add'].includes(method)) {
      const field = Object.keys(filteredTypes[0])[0];
      let content = options.content;

      if (filteredTypes[0][field] === 'object') content = JSON.stringify(content);
      await personalDb.create({ jid, [field]: content });
      return true;
    } else if (method === 'get') {
      const msg = {};
      type.forEach(k => msg[k] = false);
      return msg;
    } else {
      return false;
    }
  }

  // --- GET ---
  if (method === 'get') {
    const msg = {};
    filteredTypes.forEach(t => {
      const key = Object.keys(t)[0];
      const isObject = t[key] === 'object';
      const rawValue = data.dataValues[key];
      msg[key] = isObject ? JSON.parse(rawValue || '{}') : rawValue;
    });
    return msg;
  }

  // --- SET ---
  if (method === 'set') {
    const field = Object.keys(filteredTypes[0])[0];
    let content = options.content;
    if (filteredTypes[0][field] === 'object') content = JSON.stringify(content);
    await data.update({ [field]: content });
    return true;
  }

  // --- ADD ---
  if (method === 'add') {
    const field = Object.keys(filteredTypes[0])[0];
    if (filteredTypes[0][field] !== 'object') return false;

    const old = JSON.parse(data.dataValues[field] || '{}');
    const merged = jsonConcat(old, options.content);
    await data.update({ [field]: JSON.stringify(merged) });
    return merged;
  }

  // --- DELETE ---
  if (method === 'delete') {
    const field = Object.keys(filteredTypes[0])[0];
    if (filteredTypes[0][field] !== 'object') return false;

    const json = JSON.parse(data.dataValues[field] || '{}');
    if (!options.content?.id || !json[options.content.id]) return false;
    delete json[options.content.id];
    await data.update({ [field]: JSON.stringify(json) });
    return true;
  }
}

module.exports = { personalDB };