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
        ["status_view"],
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

    const data = await personalDB(["status_view"], {}, "get", botNumber);
    const status = data?.status_view === "true";
    return await message.send(
      `⚙️ *Auto Status View*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• astatus on\n• astatus off`
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

// 🔹 Auto Recording
plugin(
  {
    pattern: "autorecord",
    fromMe: mode,
    desc: "Toggle auto voice recording in chats",
    type: "owner",
  },
  async (message, match) => {
    if (!(await isBot(message)))
      return await message.send("*_Only bot owner can use this command_*");

    const botNumber = message.client.user.id.split(":")[0];
    const input = match?.trim().toLowerCase();

    if (input === "on" || input === "off") {
      const result = await personalDB(
        ["autorecord"],
        { content: input === "on" ? "true" : "false" },
        "set",
        botNumber
      );
      return await message.send(
        result
          ? `✅ *Auto record is now \`${input.toUpperCase()}\`*`
          : "❌ *Error updating auto record*"
      );
    }

    const data = await personalDB(["autorecord"], {}, "get", botNumber);
    const status = data?.autorecord === "true";
    return await message.send(
      `🎤 *Auto Record*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• autorecord on\n• autorecord off`
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
        ["save_status"],
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

    const data = await personalDB(["save_status"], {}, "get", botNumber);
    const status = data?.save_status === "true";
    return await message.send(
      `⚙️ *AutoSave Status*\n> Status: ${
        status ? "✅ ON" : "❌ OFF"
      }\n\nUse:\n• savestatus on\n• savestatus off`
    );
  }
);
