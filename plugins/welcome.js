const { plugin, groupDB, isAdmin, isAccess, config } = require("../lib");

// 🔹 Welcome Plugin
plugin(
  {
    pattern: "welcome ?(.)",
    desc: "Set or control welcome message",
    react: "👋",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command is for groups_*");

    if (!(await isAccess(message))) {
      return await message.send(
        "*_Only bot owner and group admins can use this command_*"
      );
    }
    const defaultText = `
    *╭ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄──*
    *│  ̇─̣─̇─̣〘 ωєℓ¢σмє 〙̣─̇─̣─̇*
    *├┅┅┅┅┈┈┈┈┈┈┈┈┈┅┅┅◆*
    *│❀ нєу* &mention !
    *│❀ gʀσᴜᴘ* &name
    *├┅┅┅┅┈┈┈┈┈┈┈┈┈┅┅┅◆*
    *│● ѕтαу ѕαfє αɴ∂ fσℓℓσω*
    *│● тнє gʀσυᴘѕ ʀᴜℓєѕ!*
    *│● ᴊσιɴє∂ &size *
    *╰┉┉┉┉┈┈┈┈┈┈┈┈┉┉┉᛫᛭*
     &pp `;

    match = (match || "").trim();
    const { welcome } =
      (await groupDB(["welcome"], { jid: message.jid, content: {} }, "get")) ||
      {};
    const status = welcome?.status === "true" ? "true" : "false";
    const currentMsg = welcome?.message || "";

    if (match.toLowerCase() === "get") {
      if (status === "false") {
        return await message.send(
          `*🔹 Welcome Setup Example:*\n` +
            `.welcome Hey &mention 👋\nWelcome to *&name* 🎉\nNow we are *&size* members 💎\n&pp\n\n` +
            `*Options:*\n.welcome on – Enable welcome\n.welcome off – Disable welcome\n.welcome get – Show current welcome\n\n` +
            `*Supports:* &mention, &name, &size, &pp`
        );
      }
      return await message.send(`*🔹 Current Welcome Message:*\n${currentMsg}`);
    }

    if (match.toLowerCase() === "on") {
      if (status === "true") return await message.send("_already activated_");

      // If no message exists, automatically set the default message
      const messageToSet = currentMsg || defaultText;

      await groupDB(
        ["welcome"],
        {
          jid: message.jid,
          content: { status: "true", message: messageToSet },
        },
        "set"
      );

      if (!currentMsg) {
        return await message.send(
          "*welcome activated*\n> default welcome message has been set automatically"
        );
      }

      return await message.send("*welcome activated*");
    }

    if (match.toLowerCase() === "off") {
      if (status === "false")
        return await message.send("_already deactivated_");
      await groupDB(
        ["welcome"],
        {
          jid: message.jid,
          content: { status: "false", message: currentMsg },
        },
        "set"
      );
      return await message.send("*welcome deactivated*");
    }

    if (match.length) {
      await groupDB(
        ["welcome"],
        {
          jid: message.jid,
          content: { status, message: match },
        },
        "set"
      );
      return await message.send("*welcome message saved*\n> please on welcome");
    }

    return await message.send(
      `*🔹 Welcome Setup Example:*\n` +
        `.welcome Hey &mention 👋\nWelcome to *&name* 🎉\nNow we are *&size* members 💎\n&pp\n\n` +
        `*Options:*\n.welcome on – Enable welcome\n.welcome off – Disable welcome\n.welcome get – Show current welcome\n\n` +
        `*Supports:* &mention, &name, &size, &pp`
    );
  }
);

// 🔹 Goodbye Plugin
plugin(
  {
    pattern: "goodbye ?(.)",
    desc: "Set or control goodbye message",
    react: "👋",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("*_This command is for groups_*");

    if (!(await isAccess(message))) {
      return await message.send(
        "*_Only bot owner and group admins can use this command_*"
      );
    }

    const defaultText = `
    *╭ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄─ׂ┄─ׅ─ׂ┄──*
    *│  ̇─̣─̇─̣〘 gσσ∂вує 〙̣─̇─̣─̇*
    *├┅┅┅┅┈┈┈┈┈┈┈┈┈┅┅┅◆*
    *│❀ вує* &mention !
    *│❀ fʀσм* &name
    *├┅┅┅┅┈┈┈┈┈┈┈┈┈┅┅┅◆*
    *│● ωє'ℓℓ мιѕѕ уσυ!*
    *│● тαкє ¢αʀє & ѕтαу ѕαfє*
    *│● ʀємαιɴιɴg мємвєʀѕ: &size*
    *╰┉┉┉┉┈┈┈┈┈┈┈┈┉┉┉᛫᛭*
     &pp `;

    match = (match || "").trim();
    const { exit } =
      (await groupDB(["exit"], { jid: message.jid, content: {} }, "get")) || {};
    const status = exit?.status === "true" ? "true" : "false";
    const currentMsg = exit?.message || "";

    if (match.toLowerCase() === "get") {
      if (status === "false") {
        return await message.send(
          `*🔹 Goodbye Setup Example:*\n` +
            `.goodbye Bye &mention 👋\nWe'll miss you from *&name* 🥀\nRemaining members: *&size* \n&pp\n\n` +
            `*Options:*\n.goodbye on – Enable goodbye\n.goodbye off – Disable goodbye\n.goodbye get – Show current goodbye\n\n` +
            `*Supports:* &mention, &name, &size, &pp`
        );
      }
      return await message.send(`*🔹 Current Goodbye Message:*\n${currentMsg}`);
    }

    if (match.toLowerCase() === "on") {
      if (status === "true") return await message.send("_already activated_");

      // If no message exists, automatically set the default message
      const messageToSet = currentMsg || defaultText;

      await groupDB(
        ["exit"],
        {
          jid: message.jid,
          content: { status: "true", message: messageToSet },
        },
        "set"
      );

      if (!currentMsg) {
        return await message.send(
          "*goodbye activated*\n> default goodbye message has been set automatically"
        );
      }

      return await message.send("*goodbye activated*");
    }

    if (match.toLowerCase() === "off") {
      if (status === "false")
        return await message.send("_already deactivated_");
      await groupDB(
        ["exit"],
        {
          jid: message.jid,
          content: { status: "false", message: currentMsg },
        },
        "set"
      );
      return await message.send("*goodbye deactivated*");
    }

    if (match.length) {
      await groupDB(
        ["exit"],
        {
          jid: message.jid,
          content: { status, message: match },
        },
        "set"
      );
      return await message.send("*goodbye message saved*");
    }

    return await message.send(
      `*🔹 Goodbye Setup Example:*\n` +
        `.goodbye Bye &mention 👋\nWe'll miss you from *&name* 🥀\nRemaining members: *&size* \n&pp\n\n` +
        `*Options:*\n.goodbye on – Enable goodbye\n.goodbye off – Disable goodbye\n.goodbye get – Show current goodbye\n\n` +
        `*Supports:* &mention, &name, &size, &pp`
    );
  }
);
