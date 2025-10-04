const {
  plugin,
  kickAllMembers,
  linkPreview,
  isBotAdmin,
  getNonAdmins,
  mode,
  isBot,
} = require("../lib");

plugin(
  {
    pattern: "kick ?(.*)",
    type: "group",
    fromMe: mode,
    desc: "Kick group member(s)",
  },
  async (message, match) => {
    // Defensive check for client property
    if (!message.client) {
      console.error("Kick plugin error: message.client is undefined");
      return await message.send("_❌ Bot client error. Please try again._");
    }

    if (!message.isGroup)
      return await message.reply("*_This command is for groups_*");

    if (!(await isBot(message))) {
      return await message.send("*_Only bot owner can use this command_*");
    }

    // CRITICAL: Check if bot is admin BEFORE attempting any kick
    const botIsAdmin = await isBotAdmin(message);
    if (!botIsAdmin) {
      return await message.send(
        "_❌ Bot must be an admin to kick members._\n\n*Please make the bot an admin first.*"
      );
    }

    // Handle "kick all" command
    if (match && match.toLowerCase() === "all") {
      try {
        let totalKicked = await kickAllMembers(message);
        return await message.send(
          `✅ Kick All Completed.\n👢 Total kicked: *${totalKicked}*`
        );
      } catch (error) {
        console.error("Kick all error:", error);
        return await message.send(
          "_❌ Failed to kick all members. Bot may have lost admin permissions._"
        );
      }
    }

    let user = null;

    // Priority order: 1. Reply message, 2. Mentioned users, 3. Match parameter
    if (message.reply_message && message.reply_message.sender) {
      // If replying to a message
      user = message.reply_message.sender;
    } else if (message.mention && message.mention.length > 0) {
      // If mentioning users
      user = message.mention[0];

      // Ensure proper format
      if (user && !user.includes("@s.whatsapp.net")) {
        user = user.split("@")[0] + "@s.whatsapp.net";
      }
    } else if (message.mentionedJid && message.mentionedJid.length > 0) {
      // Alternative mention format
      user = message.mentionedJid[0];
    } else if (match) {
      // Clean the match and format as WhatsApp ID
      const cleaned = match.replace(/[^0-9]/g, "");
      if (cleaned.length > 0) {
        user = cleaned + "@s.whatsapp.net";
      }
    }

    if (!user) {
      return await message.send(
        "_❌ Please reply to a user, mention a user, or provide a number to kick._\n\n*Usage:*\n• `.kick` (reply to message)\n• `.kick @user` (mention user)\n• `.kick 917003816486` (phone number)\n• `.kick all` (kick all non-admins)"
      );
    }

    // Check if target is bot itself
    const botJid = message.client.user.id.split(":")[0] + "@s.whatsapp.net";
    if (user === botJid) {
      return await message.send("_❌ I cannot kick myself!_");
    }

    try {
      // Verify group metadata and user existence
      const groupMetadata = await message.client.groupMetadata(message.jid);

      // Check if user exists in group - try multiple matching strategies
      let participant = groupMetadata.participants.find((p) => p.id === user);

      // If not found, try without the @s.whatsapp.net part
      if (!participant) {
        const userNumber = user.split("@")[0];
        participant = groupMetadata.participants.find(
          (p) => p.id.split("@")[0] === userNumber
        );
        if (participant) {
          user = participant.id; // Use the correct format from group
        }
      }

      if (!participant) {
        return await message.send(
          `_❌ User @${user.split("@")[0]} is not in this group._`,
          { mentions: [user] }
        );
      }

      // Check if user is an admin
      if (participant.admin === "admin" || participant.admin === "superadmin") {
        return await message.send(
          `_❌ Cannot kick @${user.split("@")[0]} - user is a group admin._`,
          { mentions: [user] }
        );
      }

      // Attempt to kick
      await message.client.groupParticipantsUpdate(
        message.jid,
        [user],
        "remove"
      );

      return await message.send(
        `👢 _@${user.split("@")[0]} has been kicked from the group._`,
        { mentions: [user] }
      );
    } catch (e) {
      console.error("Kick error:", e);

      // Handle specific error types
      if (e.data === 403 || e.output?.statusCode === 403) {
        return await message.send(
          "_❌ Access denied. Possible reasons:_\n• Bot is no longer admin\n• Bot was removed from group\n• Group settings restrict kicks"
        );
      } else if (e.data === 404) {
        return await message.send(
          "_❌ User not found in group or already left._"
        );
      } else {
        return await message.send(
          `_❌ Failed to kick user._\n\n*Error:* ${
            e.message || "Unknown error"
          }\n\n*Possible reasons:*\n• Network issue\n• User already left\n• Bot permissions changed`
        );
      }
    }
  }
);
