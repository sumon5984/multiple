const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config");

const methods = ["get", "set", "add", "delete"];
const types = [
  { mention: "object" },
  { autoreact: "string" },
  { ban: "string" },
  { alive: "string" },
  { login: "string" },
  { shutoff: "string" },
  { owner_updt: "string" },
  { commit_key: "string" },
  { sticker_cmd: "object" },
  { plugins: "object" },
  { toggle: "object" },
  { autostatus: "string" },
  { autotyping: "string" },
  { autostatus_react: "string" },
  { chatbot: "object" },
  { always_online: "string" },
  { status_view: "string" },
  { save_status: "string" },
  { anticall: "string" },
  { autoread: "string" },
  { autostatus_save: "string" },
  { autorecord: "string" }
];

function jsonConcat(o1, o2) {
  for (const key in o2) {
    o1[key] = o2[key];
  }
  return o1;
}

const personalDb = config.DATABASE.define("personalDB", {
  number: { type: DataTypes.STRING, primaryKey: true },
  mention: { type: DataTypes.TEXT, allowNull: true },
  ban: { type: DataTypes.TEXT, allowNull: true },
  alive: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "_hey iam alive now &sender_",
  },
  login: { type: DataTypes.TEXT, allowNull: true },
  shutoff: { type: DataTypes.TEXT, allowNull: true },
  owner_updt: { type: DataTypes.TEXT, allowNull: true },
  commit_key: { type: DataTypes.TEXT, allowNull: true },
  sticker_cmd: { type: DataTypes.TEXT, allowNull: true, defaultValue: "{}" },
  plugins: { type: DataTypes.TEXT, allowNull: true, defaultValue: "{}" },
  toggle: { type: DataTypes.TEXT, allowNull: true, defaultValue: "{}" },
  autoreact: { type: DataTypes.TEXT, allowNull: true, defaultValue: "" },
  autostatus: { type: DataTypes.TEXT, allowNull: true, defaultValue: "false" },
  autotyping: { type: DataTypes.TEXT, allowNull: true, defaultValue: "false" },
  chatbot: { type: DataTypes.TEXT, allowNull: true, defaultValue: "{}" },
  autostatus_react: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "false",
  },
  always_online: { type: DataTypes.TEXT, allowNull: true, defaultValue: "{}" },
  status_view: { type: DataTypes.TEXT, allowNull: true, defaultValue: "{}" },
  anticall: { type: DataTypes.TEXT, allowNull: true, defaultValue: "false" },
  save_status: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "{false}",
  },
  autostatus_save: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "{false}",
  },
  autoread: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "{false}",
  },
  autorecord: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "{false}",
  },
});

async function personalDB(type, options = {}, method = "get", number = null) {
  // Fixed: Check if type is array and has valid elements
  if (!Array.isArray(type) || type.length === 0) {
    console.error("personalDB: type must be a non-empty array");
    return null;
  }

  if (typeof options !== "object") {
    console.error("personalDB: options must be an object");
    return null;
  }

  if (!methods.includes(method)) {
    console.error("personalDB: invalid method", method);
    return null;
  }

  if (!number) {
    console.error("personalDB: number is required");
    return null;
  }

  // Fixed: Better type filtering and validation
  let filteredTypes = [];
  for (const t of type) {
    const foundType = types.find((a) => Object.keys(a)[0] === t);
    if (foundType) {
      filteredTypes.push(foundType);
    }
  }

  if (filteredTypes.length === 0) {
    console.error("personalDB: no valid types found", type);
    return null;
  }

  try {
    let data = await personalDb.findByPk(number);

    // CREATE if not exist
    if (!data) {
      if (["set", "add"].includes(method)) {
        const field = Object.keys(filteredTypes[0])[0];
        let content = options.content;

        // Fixed: Handle object serialization properly
        if (filteredTypes[0][field] === "object") {
          content =
            typeof content === "object" ? JSON.stringify(content) : content;
        }

        const createData = { number, [field]: content };
        data = await personalDb.create(createData);
        return method === "add"
          ? filteredTypes[0][field] === "object"
            ? JSON.parse(content || "{}")
            : content
          : true;
      } else if (method === "get") {
        const msg = {};
        type.forEach((k) => {
          const typeInfo = types.find((t) => Object.keys(t)[0] === k);
          if (typeInfo) {
            const isObject = typeInfo[k] === "object";
            // Return default values based on type
            msg[k] = isObject
              ? {}
              : k === "autostatus" ||
                k === "autotyping" ||
                k === "autostatus_react"
              ? "false"
              : "";
          } else {
            msg[k] = false;
          }
        });
        return msg;
      } else {
        return false;
      }
    }

    // --- GET ---
    if (method === "get") {
      const msg = {};
      filteredTypes.forEach((t) => {
        const key = Object.keys(t)[0];
        const isObject = t[key] === "object";
        const rawValue = data.dataValues[key];

        try {
          msg[key] = isObject ? JSON.parse(rawValue || "{}") : rawValue || "";
        } catch (e) {
          console.error(`Error parsing JSON for ${key}:`, e);
          msg[key] = isObject ? {} : "";
        }
      });
      return msg;
    }

    // --- SET ---
    if (method === "set") {
      const field = Object.keys(filteredTypes[0])[0];
      let content = options.content;

      // Fixed: Handle object serialization
      if (filteredTypes[0][field] === "object") {
        content =
          typeof content === "object" ? JSON.stringify(content) : content;
      }

      await data.update({ [field]: content });
      return true;
    }

    // --- ADD ---
    if (method === "add") {
      const field = Object.keys(filteredTypes[0])[0];
      if (filteredTypes[0][field] !== "object") {
        console.error("personalDB: ADD method only works with object types");
        return false;
      }

      try {
        const old = JSON.parse(data.dataValues[field] || "{}");
        const merged = jsonConcat(old, options.content || {});
        await data.update({ [field]: JSON.stringify(merged) });
        return merged;
      } catch (e) {
        console.error("Error in ADD method:", e);
        return false;
      }
    }

    // --- DELETE ---
    if (method === "delete") {
      const field = Object.keys(filteredTypes[0])[0];
      if (filteredTypes[0][field] !== "object") {
        console.error("personalDB: DELETE method only works with object types");
        return false;
      }

      try {
        const json = JSON.parse(data.dataValues[field] || "{}");
        if (!options.content?.id || !json[options.content.id]) {
          return false;
        }
        delete json[options.content.id];
        await data.update({ [field]: JSON.stringify(json) });
        return true;
      } catch (e) {
        console.error("Error in DELETE method:", e);
        return false;
      }
    }
  } catch (error) {
    console.error("personalDB Error:", error);
    return null;
  }
}

module.exports = { personalDB };
