
const { Sequelize, DataTypes } = require("sequelize");
const config = require('../../config'); // adjust path as needed

const methods = ['get', 'set', 'add', 'delete'];
const types = [
  { bot: 'object' }, { delete: 'string' }, { fake: 'object' },
  { link: 'object' }, { word: 'object' }, { demote: 'string' },
  { promote: 'string' }, { filter: 'object' }, { warn: 'object' },
  { welcome: 'object' }, { exit: 'object' }, { pdm: 'string' }, 
  { chatbot: 'object' }, { global_welcome: 'object' }, { global_exit: 'object' },
  { global_pdm: 'object' }
];

function jsonConcat(o1, o2) {
  for (const key in o2) o1[key] = o2[key];
  return o1;
}

const groupDb = config.DATABASE.define("groupDB", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bot: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  delete: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  fake: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  word: {
    type: DataTypes.STRING,
    allowNull: true
  },
  demote: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  promote: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  filter: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '{}'
  },
  warn: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '{}'
  },
  welcome: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({
      status: 'false',
      message: 'Hey &mention welcome to &name all groups members &size &pp'
    })
  },
  chatbot: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '{}'
  },
  exit: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({
      status: 'false',
      message: 'Goodbye &mention! Thanks for being part of &name &pp'
    })
  },
  pdm: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  global_welcome: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({
      status: 'true',
      all_status: 'true',
      message: 'Hey &mention welcome to &name all groups members &size &pp'
    })
  },
  global_exit: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({
      status: 'true',
      all_status: 'true',
      message: 'Goodbye &mention! Thanks for being part of &name &pp'
    })
  },
  global_pdm: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({
      status: 'true',
      all_status: 'true'
    })
  }
});

async function groupDB(type, options, method) {
  if (!Array.isArray(type) || typeof options !== 'object' || !options.jid) return;

  let filter = type.map(t => types.find(a => a[t])).filter(Boolean);
  if (!filter.length || !methods.includes(method)) return;

  if (['set', 'add', 'delete'].includes(method)) {
    filter = filter[0];
    type = type[0];
  }

  const dbData = await groupDb.findOne({ where: { jid: options.jid } });

  if (method === 'set') {
    if (typeof options.content !== filter[type]) return;

    const contentValue = filter[type] === 'object' ? JSON.stringify(options.content) : options.content;

    if (!dbData) {
      const createData = { jid: options.jid, [type]: contentValue };

      // Always ensure global defaults exist when creating global entry
      if (options.jid === 'global') {
        createData.global_welcome = createData.global_welcome || JSON.stringify({
          status: 'true',
          all_status: 'true',
          message: 'Hey &mention welcome to &name all groups members &size &pp'
        });
        createData.global_exit = createData.global_exit || JSON.stringify({
          status: 'true',
          all_status: 'true',
          message: 'Goodbye &mention! Thanks for being part of &name &pp'
        });
        createData.global_pdm = createData.global_pdm || JSON.stringify({
          status: 'true',
          all_status: 'true'
        });
      }

      await groupDb.create(createData);
    } else {
      await dbData.update({ [type]: contentValue });
    }
    return true;
  }

  if (method === 'add') {
    let existing = dbData ? dbData.dataValues[type] : (filter[type] === 'object' ? '{}' : '');
    if (filter[type] === 'object') {
      const updated = JSON.stringify(jsonConcat(JSON.parse(existing || '{}'), options.content));
      if (dbData) {
        await dbData.update({ [type]: updated });
      } else {
        const createData = { jid: options.jid, [type]: updated };
        await groupDb.create(createData);
      }
      return JSON.parse(updated);
    } else {
      if (dbData) {
        await dbData.update({ [type]: options.content });
        return options.content;
      } else {
        await groupDb.create({ jid: options.jid, [type]: options.content });
        return options.content;
      }
    }
  }

  if (method === 'delete') {
    if (!dbData || !options.content?.id || filter[type] !== 'object') return false;

    const json = JSON.parse(dbData.dataValues[type] || '{}');
    if (!json[options.content.id]) return false;
    delete json[options.content.id];
    await dbData.update({ [type]: JSON.stringify(json) });
    return true;
  }

  if (method === 'get') {
    if (!dbData) {
      const result = {};
      filter.forEach(f => {
        const k = Object.keys(f)[0];

        // Return proper default values
        if (k === 'welcome') {
          result[k] = {
            status: 'false',
            message: 'Hey &mention welcome to &name all groups members &size &pp'
          };
        } else if (k === 'exit') {
          result[k] = {
            status: 'false',
            message: 'Goodbye &mention! Thanks for being part of &name &pp'
          };
        } else if (k === 'global_welcome') {
          result[k] = {
            status: 'true',
            all_status: 'true',
            message: 'Hey &mention welcome to &name all groups members &size &pp'
          };
        } else if (k === 'global_exit') {
          result[k] = {
            status: 'true',
            all_status: 'true',
            message: 'Goodbye &mention! Thanks for being part of &name &pp'
          };
        } else if (k === 'global_pdm') {
          result[k] = {
            status: 'true',
            all_status: 'true'
          };
        } else {
          result[k] = f[k] === 'object' ? {} : 'false';
        }
      });
      return result;
    }

    const result = {};
    filter.forEach(f => {
      const k = Object.keys(f)[0];
      const val = dbData.dataValues[k];

      if (f[k] === 'object') {
        try {
          const parsed = JSON.parse(val || '{}');
          result[k] = parsed;
        } catch (error) {
          // Fallback to defaults on parse error
          if (k === 'welcome') {
            result[k] = {
              status: 'false',
              message: 'Hey &mention welcome to &name all groups members &size &pp'
            };
          } else if (k === 'exit') {
            result[k] = {
              status: 'false',
              message: 'Goodbye &mention! Thanks for being part of &name &pp'
            };
          } else if (k === 'global_welcome') {
            result[k] = {
              status: 'true',
              all_status: 'true',
              message: 'Hey &mention welcome to &name all groups members &size &pp'
            };
          } else if (k === 'global_exit') {
            result[k] = {
              status: 'true',
              all_status: 'true',
              message: 'Goodbye &mention! Thanks for being part of &name &pp'
            };
          } else if (k === 'global_pdm') {
            result[k] = {
              status: 'true',
              all_status: 'true'
            };
          } else {
            result[k] = {};
          }
        }
      } else {
        result[k] = val || 'false';
      }
    });
    return result;
  }

  return;
}

async function initializeGlobalDefaults() {
  try {
    await groupDb.sync();

    const globalEntry = await groupDb.findOne({ where: { jid: 'global' } });

    if (!globalEntry) {
      await groupDb.create({
        jid: 'global',
        global_welcome: JSON.stringify({
          status: 'true',
          all_status: 'true',
          message: 'Hey &mention welcome to &name all groups members &size &pp'
        }),
        global_exit: JSON.stringify({
          status: 'true',
          all_status: 'true',
          message: 'Goodbye &mention! Thanks for being part of &name &pp'
        }),
        global_pdm: JSON.stringify({
          status: 'true',
          all_status: 'true'
        })
      });
      console.log('✅ Global welcome/goodbye/pdm defaults initialized');
    } else {
      // Update existing global entry to ensure all_status defaults are correct
      const updates = {};

      try {
        const globalWelcome = JSON.parse(globalEntry.global_welcome || '{}');
        if (globalWelcome.all_status === undefined) {
          globalWelcome.all_status = 'true';
          updates.global_welcome = JSON.stringify(globalWelcome);
        }
      } catch (e) {
        updates.global_welcome = JSON.stringify({
          status: 'true',
          all_status: 'true',
          message: 'Hey &mention welcome to &name all groups members &size &pp'
        });
      }

      try {
        const globalExit = JSON.parse(globalEntry.global_exit || '{}');
        if (globalExit.all_status === undefined) {
          globalExit.all_status = 'true';
          updates.global_exit = JSON.stringify(globalExit);
        }
      } catch (e) {
        updates.global_exit = JSON.stringify({
          status: 'true',
          all_status: 'true',
          message: 'Goodbye &mention! Thanks for being part of &name &pp'
        });
      }

      if (Object.keys(updates).length > 0) {
        await globalEntry.update(updates);
        console.log('✅ Global settings updated with proper defaults');
      }
    }
  } catch (error) {
    console.error('❌ Error initializing global defaults:', error);
  }
}

module.exports = { groupDB, initializeGlobalDefaults };