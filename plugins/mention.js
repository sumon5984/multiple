const {
  plugin,
  mention,
  personalDB,
  GenListMessage,
  isAccess,
  config,
} = require("../lib");

plugin(
  {
    pattern: "mention ?(.*)",
    type: "user",
    desc: "Control bot auto-mention feature",
  },
  async (message, match) => {
    // Get bot number
    const botNumber = message.client.user.id.split(":")[0];

    // ============ GET STATUS ============
    if (match.toLowerCase() === "get" || match.toLowerCase() === "status") {
      const { mention } = await personalDB(
        ["mention"],
        { content: {} },
        "get",
        botNumber
      );

      if (!mention || mention.status === "false") {
        return await message.send(
          `*MENTION STATUS*\n\n` +
            `Status: ❌ OFF\n` +
            `Message: Not set\n\n` +
            `*Usage:*\n` +
            `mention on - Enable\n` +
            `mention off - Disable\n` +
            `mention <message> - Set message\n` +
            `mention get - Check status`
        );
      }

      return await message.send(
        `*MENTION STATUS*\n\n` +
          `Status: ✅ ON\n` +
          `Message: ${mention.message || "Not set"}\n\n` +
          `*Commands:*\n` +
          `mention off - Disable\n` +
          `mention <new message> - Update message`
      );
    }

    // ============ TURN OFF ============
    if (match.toLowerCase() === "off") {
      const { mention } = await personalDB(
        ["mention"],
        { content: {} },
        "get",
        botNumber
      );

      if (!mention || mention.status === "false") {
        return await message.send("_Mention is already deactivated_");
      }

      await personalDB(
        ["mention"],
        {
          content: {
            status: "false",
            message: mention.message,
          },
        },
        "set",
        botNumber
      );

      return await message.send("✅ _Mention deactivated successfully_");
    }

    // ============ TURN ON ============
    if (match.toLowerCase() === "on") {
      const { mention } = await personalDB(
        ["mention"],
        { content: {} },
        "get",
        botNumber
      );

      if (mention && mention.status === "true") {
        return await message.send("_Mention is already activated_");
      }

      if (!mention || !mention.message) {
        return await message.send(
          "❌ _Please set a mention message first_\n\n" +
            "*Example:*\n" +
            "mention Hello &sender! How can I help?"
        );
      }

      await personalDB(
        ["mention"],
        {
          content: {
            status: "true",
            message: mention.message,
          },
        },
        "set",
        botNumber
      );

      return await message.send("✅ _Mention activated successfully_");
    }

    // ============ SET/UPDATE MESSAGE ============
    if (match && match.trim() !== "") {
      const { mention } = await personalDB(
        ["mention"],
        { content: {} },
        "get",
        botNumber
      );
      const currentStatus =
        mention && mention.status === "true" ? "true" : "false";

      await personalDB(
        ["mention"],
        {
          content: {
            status: currentStatus,
            message: match.trim(),
          },
        },
        "set",
        botNumber
      );

      return await message.send(
        `✅ *Mention message updated!*\n\n` +
          `Message: ${match.trim().substring(0, 100)}${
            match.trim().length > 100 ? "..." : ""
          }\n\n` +
          `Status: ${
            currentStatus === "true" ? "✅ Active" : "❌ Inactive"
          }\n\n` +
          `${currentStatus === "false" ? '_Use "mention on" to activate_' : ""}`
      );
    }

    // ============ NO ARGS - SHOW HELP ============
    return await message.send(
      `*MENTION COMMAND HELP*\n\n` +
        `*Usage:*\n` +
        `mention get - Check status\n` +
        `mention on - Enable auto-mention\n` +
        `mention off - Disable auto-mention\n` +
        `mention <message> - Set custom message\n\n` +
        `*Examples:*\n` +
        `mention Hello &sender!\n` +
        `mention type/image https://i.imgur.com/pic.jpg\n` +
        `mention type/video https://example.com/video.mp4\n\n` +
        `*Special:*\n` +
        `Use &sender to tag the person who mentioned bot`
    );
  }
);

plugin(
  {
    pattern: "setmention ?(.*)",
    type: "user",
    desc: "Set mention message with media support",
  },
  async (message, match) => {
    // Get bot number
    const botNumber = message.client.user.id.split(":")[0];

    if (!match || match.trim() === "") {
      return await message.send(
        `*SET MENTION MESSAGE*\n\n` +
          `*Text Message:*\n` +
          `setmention Hello &sender! How can I help?\n\n` +
          `*Image:*\n` +
          `setmention type/image https://i.imgur.com/pic.jpg\n\n` +
          `*Video:*\n` +
          `setmention type/video https://example.com/video.mp4\n\n` +
          `*Audio:*\n` +
          `setmention type/audio https://example.com/audio.mp3\n\n` +
          `*Sticker:*\n` +
          `setmention type/sticker https://example.com/sticker.webp\n\n` +
          `*GIF:*\n` +
          `setmention type/gif https://media.giphy.com/animation.mp4\n\n` +
          `*With Link Preview:*\n` +
          `setmention type/image https://i.imgur.com/pic.jpg {"linkPreview": {"title": "Bot", "body": "Hello!"}}\n\n` +
          `*Note:* Use &sender to mention the user`
      );
    }

    const { mention } = await personalDB(
      ["mention"],
      { content: {} },
      "get",
      botNumber
    );
    const currentStatus =
      mention && mention.status === "true" ? "true" : "false";

    // Save message to database
    await personalDB(
      ["mention"],
      {
        content: {
          status: currentStatus,
          message: match.trim(),
        },
      },
      "set",
      botNumber
    );

    // Detect message type
    let messageType = "text";
    if (match.includes("type/image")) messageType = "image";
    else if (match.includes("type/video")) messageType = "video";
    else if (match.includes("type/audio")) messageType = "audio";
    else if (match.includes("type/sticker")) messageType = "sticker";
    else if (match.includes("type/gif")) messageType = "gif";

    return await message.send(
      `✅ *Mention message set!*\n\n` +
        `Type: ${messageType}\n` +
        `Status: ${currentStatus === "true" ? "✅ Active" : "❌ Inactive"}\n` +
        `Message: ${match.substring(0, 80)}${
          match.length > 80 ? "..." : ""
        }\n\n` +
        `${
          currentStatus === "false"
            ? '_Use "mention on" to activate_'
            : "_When someone mentions bot, this will be sent_"
        }`
    );
  }
);

plugin(
  {
    pattern: "testmention",
    type: "user",
    desc: "Test mention message",
  },
  async (message, match) => {
    // Get bot number
    const botNumber = message.client.user.id.split(":")[0];

    const { mention: mentionData } = await personalDB(
      ["mention"],
      { content: {} },
      "get",
      botNumber
    );

    if (!mentionData || !mentionData.message) {
      return await message.send(
        '❌ _No mention message set. Use "mention <message>" to set one_'
      );
    }

    if (mentionData.status === "false") {
      return await message.send(
        '❌ _Mention is disabled. Use "mention on" to enable_'
      );
    }

    // Prepare test message object
    const testMsg = {
      client: message.client,
      jid: message.jid,
      sender: message.sender,
      number: message.sender.split("@")[0],
    };

    await message.send("_Testing mention message..._");

    // Send the mention message
    await mention(message, mentionData.message);
  }
);
