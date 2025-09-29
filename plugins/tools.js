const { plugin, mode, isBot, personalDB } = require("../lib");

// 🔹 Auto Status Seen
plugin(
  {
    pattern: "astatus",
    fromMe: mode,
    desc: "Toggle auto view WhatsApp status",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autostatus"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *Auto status view is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating auto status view*"
      );
    }

    const data = await personalDB(["autostatus"], {}, "get", botNumber);
    const status = data?.autostatus === "true";
    return await message.send(
      `⚙️ *Auto Status View*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• astatus on\n• astatus off`
    );
  }
);

// 🔹 Auto Status React
plugin(
  {
    pattern: "astatusreact",
    fromMe: mode,
    desc: "Toggle auto react to WhatsApp status",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autostatus_react"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *Auto status react is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating auto status react*"
      );
    }

    const data = await personalDB(["autostatus_react"], {}, "get", botNumber);
    const status = data?.autostatus_react === "true";
    return await message.send(
      `⚙️ *Auto Status React*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• astatusreact on\n• astatusreact off`
    );
  }
);

// 🔹 Auto Typing
plugin(
  {
    pattern: "autotyping",
    fromMe: mode,
    desc: "Toggle auto typing in chats",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autotyping"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *Auto typing is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating auto typing*"
      );
    }

    const data = await personalDB(["autotyping"], {}, "get", botNumber);
    const status = data?.autotyping === "true";
    return await message.send(
      `⚙️ *Auto Typing*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• autotyping on\n• autotyping off`
    );
  }
);

// 🔹 Auto React to Messages
plugin(
  {
    pattern: "autoreact ?(.*)",
    fromMe: mode,
    desc: "Toggle auto react to messages",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autoreact"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *AutoReact is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating AutoReact*"
      );
    }

    const settings = await personalDB(["autoreact"], {}, "get", botNumber);
    return await message.send(
      `⚙️ *AutoReact*\n> Status: ${
        settings?.autoreact === "true" ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• autoreact on\n• autoreact off`
    );
  }
);

// 🔹 Anti Call
plugin(
  {
    pattern: "anticall",
    fromMe: mode,
    desc: "Block users who call the bot",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["anticall"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *AntiCall is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating AntiCall*"
      );
    }

    const data = await personalDB(["anticall"], {}, "get", botNumber);
    const status = data?.anticall === "true";
    return await message.send(
      `⚙️ *AntiCall*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• anticall on\n• anticall off`
    );
  }
);

// 🔹 Auto Read
plugin(
  {
    pattern: "autoread",
    fromMe: mode,
    desc: "Toggle auto read messages",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autoread"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *AutoRead is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating AutoRead*"
      );
    }

    const data = await personalDB(["autoread"], {}, "get", botNumber);
    const status = data?.autoread === "true";
    return await message.send(
      `⚙️ *AutoRead*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• autoread on\n• autoread off`
    );
  }
);

// 🔹 Save Status
plugin(
  {
    pattern: "savestatus",
    fromMe: mode,
    desc: "Toggle auto save viewed statuses",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autostatus_save"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *AutoSave Status is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating AutoSave Status*"
      );
    }

    const data = await personalDB(["autostatus_save"], {}, "get", botNumber);
    const status = data?.autostatus_save === "true";
    return await message.send(
      `⚙️ *AutoSave Status*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• savestatus on\n• savestatus off`
    );
  }
);
