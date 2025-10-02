const { plugin, mode } = require("../lib");

plugin(
  {
    pattern: "pair ?(.*)",
    fromMe: mode,
    desc: "Get WhatsApp pairing code",
    type: "tools",
  },
  async (message, match) => {
    try {
      await message.send(
        "*Not available.*\n\n👉 Please visit: https://kaisen-free-deploy.vercel.app"
      );
    } catch (error) {
      console.error(error);
      await message.send("An error occurred. Please try again later.");
    }
  }
);
