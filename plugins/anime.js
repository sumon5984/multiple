const axios = require("axios");
const { plugin, mode, isBot } = require("../lib");

// Milf command (available for all users)
plugin(
  {
    pattern: "milf ?(.*)",
    desc: "Download Milf Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.im/search/?included_tags=milf";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.images && data.images[0]) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.images[0].url },
            caption: "> Here is your milf anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Ero command (available for all users)
plugin(
  {
    pattern: "ero ?(.*)",
    desc: "Download Erotic Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.im/search/?included_tags=ero";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.images && data.images[0]) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.images[0].url },
            caption: "> Here is your erotic anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Ecchi command (available for all users)
plugin(
  {
    pattern: "ecchi ?(.*)",
    desc: "Download Ecchi Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.im/search/?included_tags=ecchi";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.images && data.images[0]) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.images[0].url },
            caption: "> Here is your ecchi anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Ass command (available for all users)
plugin(
  {
    pattern: "ass ?(.*)",
    desc: "Download Ass Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.im/search/?included_tags=ass";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.images && data.images[0]) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.images[0].url },
            caption: "> Here is your anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Random anime command
plugin(
  {
    pattern: "ranime ?(.*)",
    desc: "Download Random Anime Information",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.jikan.moe/v4/random/anime";
      const response = await axios.get(apiUrl);
      const data = response.data.data;

      const title = data.title;
      const synopsis = data.synopsis || "No synopsis available";
      const imageUrl = data.images.jpg.image_url;
      const episodes = data.episodes || "Unknown";
      const status = data.status;
      const messageText = `📺 Title: ${title}\n🎬 Episodes: ${episodes}\n📡 Status: ${status}\n📝 Synopsis: ${synopsis}\n🔗 URL: ${data.url}`;

      await message.client.sendMessage(
        message.jid,
        {
          image: { url: imageUrl },
          caption: messageText,
          contextInfo: {
            mentionedJid: [message.sender],
          },
        },
        { quoted: message.data }
      );
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Loli command
plugin(
  {
    pattern: "loli ?(.*)",
    desc: "Download Loli Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.data && data.data[0]) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.data[0].urls.original },
            caption: "> Here is your loli anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Waifu command
plugin(
  {
    pattern: "waifu ?(.*)",
    desc: "Download Waifu Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/waifu";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.url },
            caption: "> Here is your waifu anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Neko command
plugin(
  {
    pattern: "neko ?(.*)",
    desc: "Download Neko Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/neko";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.url },
            caption: "> Here is your neko anime image! 🐱",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Megumin command
plugin(
  {
    pattern: "megumin ?(.*)",
    desc: "Download Megumin Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/megumin";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.url },
            caption: "> Here is your Megumin anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Maid command
plugin(
  {
    pattern: "maid ?(.*)",
    desc: "Download Maid Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.im/search/?included_tags=maid";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.images && data.images[0]) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.images[0].url },
            caption: "> Here is your maid anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Awoo command
plugin(
  {
    pattern: "awoo ?(.*)",
    desc: "Download Awoo Anime Images",
    react: "💫",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/awoo";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.url },
            caption: "> Here is your awoo anime image! 💫",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// NEW ANIME API PLUGINS BELOW

// Anime Quote command
plugin(
  {
    pattern: "aquote ?(.*)",
    desc: "Get Random Anime Quote",
    react: "💬",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://animechan.vercel.app/api/random";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.quote) {
        const quoteText = `💬 *Quote:* "${data.quote}"\n\n👤 *Character:* ${data.character}\n📺 *Anime:* ${data.anime}`;
        await message.reply(quoteText);
      } else {
        await message.reply("Error: Could not fetch anime quote.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Anime Character Search command
plugin(
  {
    pattern: "achar ?(.*)",
    desc: "Search Anime Character Information",
    react: "👤",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const query = match.trim();
      if (!query)
        return await message.reply(
          "Please provide a character name! Example: .achar Naruto"
        );

      const apiUrl = `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(
        query
      )}&limit=1`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.data && data.data[0]) {
        const char = data.data[0];
        const charText = `👤 *Name:* ${char.name}\n📝 *About:* ${
          char.about
            ? char.about.substring(0, 500) + "..."
            : "No information available"
        }\n🔗 *URL:* ${char.url}`;

        await message.client.sendMessage(
          message.jid,
          {
            image: { url: char.images.jpg.image_url },
            caption: charText,
          },
          { quoted: message.data }
        );
      } else {
        await message.reply(
          "Character not found! Please try a different name."
        );
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Anime Search command
plugin(
  {
    pattern: "asearch ?(.*)",
    desc: "Search for Anime Information",
    react: "🔍",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const query = match.trim();
      if (!query)
        return await message.reply(
          "Please provide an anime name! Example: .asearch Naruto"
        );

      const apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
        query
      )}&limit=1`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.data && data.data[0]) {
        const anime = data.data[0];
        const animeText = `📺 *Title:* ${anime.title}\n⭐ *Rating:* ${
          anime.score || "N/A"
        }\n🎬 *Episodes:* ${anime.episodes || "Unknown"}\n📡 *Status:* ${
          anime.status
        }\n📅 *Year:* ${anime.year || "Unknown"}\n🎭 *Genres:* ${anime.genres
          .map((g) => g.name)
          .join(", ")}\n📝 *Synopsis:* ${
          anime.synopsis
            ? anime.synopsis.substring(0, 300) + "..."
            : "No synopsis available"
        }\n🔗 *URL:* ${anime.url}`;

        await message.client.sendMessage(
          message.jid,
          {
            image: { url: anime.images.jpg.image_url },
            caption: animeText,
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Anime not found! Please try a different name.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Anime Recommendations command
plugin(
  {
    pattern: "arecommend ?(.*)",
    desc: "Get Top Anime Recommendations",
    react: "🌟",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.jikan.moe/v4/top/anime?limit=5";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.data && data.data.length > 0) {
        let recText = "🌟 *TOP ANIME RECOMMENDATIONS:*\n\n";
        data.data.forEach((anime, index) => {
          recText += `${index + 1}. *${anime.title}*\n⭐ Rating: ${
            anime.score
          }\n📺 Episodes: ${anime.episodes || "Unknown"}\n🎭 ${anime.genres
            .slice(0, 3)
            .map((g) => g.name)
            .join(", ")}\n\n`;
        });
        recText += "> Use .asearch [anime name] for more details!";

        await message.reply(recText);
      } else {
        await message.reply("Error: Could not fetch anime recommendations.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Shinobu command (new waifu API)
plugin(
  {
    pattern: "shinobu ?(.*)",
    desc: "Download Shinobu Anime Images",
    react: "🦋",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/shinobu";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            image: { url: data.url },
            caption: "> Here is your Shinobu anime image! 🦋",
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch image from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

plugin(
  {
    pattern: "boobs ?(.*)",
    desc: "Download boobs Images",
    react: "🦋",
    fromMe: mode,
    type: "xxx",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://r4bbit-api.vercel.app/api/boobs";

      await message.client.sendMessage(
        message.jid,
        {
          image: { url: apiUrl },
          caption: "> Here is your boobs image! ",
        },
        { quoted: message.data }
      );
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Cuddle command (anime reaction)
plugin(
  {
    pattern: "cuddle ?(.*)",
    desc: "Send Anime Cuddle GIF",
    react: "🤗",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/cuddle";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            video: { url: data.url },
            caption: "> Here's a warm cuddle for you! 🤗",
            gifPlayback: true,
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch cuddle GIF from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);

// Pat command (anime reaction)
plugin(
  {
    pattern: "pat ?(.*)",
    desc: "Send Anime Pat GIF",
    react: "👋",
    fromMe: mode,
    type: "anime",
  },
  async (message, match) => {
    try {
      const apiUrl = "https://api.waifu.pics/sfw/pat";
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data && data.url) {
        await message.client.sendMessage(
          message.jid,
          {
            video: { url: data.url },
            caption: "> Here's a gentle pat for you! 👋",
            gifPlayback: true,
          },
          { quoted: message.data }
        );
      } else {
        await message.reply("Error: Could not fetch pat GIF from API.");
      }
    } catch (e) {
      if (e.response) {
        await message.reply(
          `API Error: ${e.response.status} - ${
            e.response.data?.message || "No message provided"
          }`
        );
      } else if (e.request) {
        await message.reply(
          "Network Error: API server not responding. Please try again later."
        );
      } else {
        await message.reply("Unexpected Error: Please try again later.");
      }
      console.log(e);
    }
  }
);
