const axios = require('axios');
const {
  plugin,
  mode
} = require('../lib');

plugin({
  pattern: 'neko ?(.*)',
  desc: 'Fetch a random neko picture',
  react: '🥵',
  fromMe: mode,
  type: 'anime'
}, async (message, match) => {
  try {
    const apiUrl = `https://api.waifu.pics/sfw/neko`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.url) {

                    await message.client.sendMessage(message.jid, {
                      image: { url: data.url },
                      caption: "> Here is your random neko picture! 🐱",
                  }, { quoted: message.data });
              } else {
                  reply("Error: The API response is invalid. Could not fetch a neko picture.");
              }
          } catch (e) {

              if (e.response) {

                  reply(`API Error: ${e.response.status} - ${e.response.data?.message || 'No message provided by the server'}`);
              } else if (e.request) {

                  reply(
                      "Network Error: The API server is not responding. Possible reasons:\n" +
                      "- The server may be down or temporarily unavailable.\n" +
                      "- There may be an issue with your internet connection.\n\n" +
                      "Please check your internet connection and try again later."
                  );
              } else {

                  reply(`Unexpected Error: ${e.message}`);
              }
          }
      });


plugin({
  pattern: 'waifu ?(.*)',
  desc: 'Fetch a random waifu picture',
  react: '🥵',
  fromMe: mode,
  type: 'anime'

    }, async (message, match) => {
      try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data.url) {

                        await message.client.sendMessage(message.jid, {
                          image: { url: data.url },
                          caption: "> Here is your random waifu picture! 🐱",
                      }, { quoted: message.data });
                  } else {
                      reply("Error: The API response is invalid. Could not fetch a waifu  picture.");
                  }
              } catch (e) {

                  if (e.response) {

                      reply(`API Error: ${e.response.status} - ${e.response.data?.message || 'No message provided by the server'}`);
                  } else if (e.request) {

                      reply(
                          "Network Error: The API server is not responding. Possible reasons:\n" +
                          "- The server may be down or temporarily unavailable.\n" +
                          "- There may be an issue with your internet connection.\n\n" +
                          "Please check your internet connection and try again later."
                      );
                  } else {

                      reply(`Unexpected Error: ${e.message}`);
                  }
              }
          });

plugin({
  pattern: 'animegirl ?(.*)',
  desc: 'Fetch a random anime girl image.',
  react: '🥵',
  fromMe: mode,
  type: 'anime'

    }, async (message, match) => {
     try {
     const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data.url) {

                        await message.client.sendMessage(message.jid, {
                          image: { url: data.url },
                          caption: "> Here is your random waifu picture! 🐱",
                      }, { quoted: message.data });
                  } else {
                      reply("Error: The API response is invalid. Could not fetch a waifu  picture.");
                  }
              } catch (e) {

                  if (e.response) {

                      reply(`API Error: ${e.response.status} - ${e.response.data?.message || 'No message provided by the server'}`);
                  } else if (e.request) {

                      reply(
                          "Network Error: The API server is not responding. Possible reasons:\n" +
                          "- The server may be down or temporarily unavailable.\n" +
                          "- There may be an issue with your internet connection.\n\n" +
                          "Please check your internet connection and try again later."
                      );
                  } else {

                      reply(`Unexpected Error: ${e.message}`);
                  }
              }
          });

plugin({
  pattern: 'cosplay ?(.*)',
  desc: 'Fetch a random cosplay picture.',
  react: '😍',
  fromMe: mode,
  type: 'fun_img'

    }, async (message, match) => {

      try {
     const apiUrl = `https://fantox-cosplay-api.onrender.com`;
        const response = await axios.get(apiUrl);
        const data = response.data;

 
    await message.client.sendMessage(message.jid, {
      image: { url: apiUrl },
      caption: '> *Fetch a random cosplay picture.*',
      mentions: message.mention || []
    }, { quoted: message.data });
    
  } catch (error) {
    console.error("❌ Error in cosplay command:", error);
    await message.send(`❌ *Error in cosplay command:*\n\`\`\`${error.message}\`\`\``);
  }
});

