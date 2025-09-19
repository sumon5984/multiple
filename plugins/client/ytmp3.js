const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const { fetchJson, getBuffer} = require('../../lib')

async function songCommand(Aliconn,chatId, message) {
try {
              const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();


        if (!searchQuery) {
            await message.client.sendMessage(chatId, { text: 'What video do you want to download?' }, { quoted: message });
            return;
        }

      let downloadUrl;
      let dataa;
      let buffer;

      const getBufferWithHeaders = async (url) => {
          try {
              const response = await axios({
                  method: 'GET',
                  url: url,
                  responseType: 'arraybuffer',
                  timeout: 60000, // 60 seconds timeout
                  headers: {
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                      'Accept': '*/*',
                      'Accept-Language': 'en-US,en;q=0.9',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Connection': 'keep-alive',
                      'Upgrade-Insecure-Requests': '1',
                      'Sec-Fetch-Dest': 'audio',
                      'Sec-Fetch-Mode': 'cors',
                      'Sec-Fetch-Site': 'cross-site',
                      'Referer': 'https://www.youtube.com/'
                  }
              });
              return Buffer.from(response.data);
          } catch (error) {
              console.error(`Failed to fetch buffer from ${url}:`, error.message);
              throw error;
          }
      };

      if (searchQuery.startsWith("https://youtu")) {
          // Get video info first
          try {
              const searchs = await fetchJson(`https://api.giftedtech.web.id/api/search/yts?apikey=gifted&query=${encodeURIComponent(searchQuery)}`);
              dataa = searchs.results[0];
          } catch (err) {
              console.error("Failed to get video info:", err);
              return message.send("❌ Unable to fetch video information. Please try again later.");
          }

          // Try multiple download endpoints
         const downloadMethods = [
          () => fetchJson(`https://api.giftedtech.web.id/api/download/ytaudio?apikey=gifted&format=128kbps&url=${encodeURIComponent(videoUrl)}`),
          () => fetchJson(`https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted&url=${encodeURIComponent(videoUrl)}`),
          () => fetchJson(`https://api.giftedtech.web.id/api/download/yta?apikey=gifted&url=${encodeURIComponent(videoUrl)}`)
      ];

          let downloadSuccess = false;
          for (const method of downloadMethods) {
              try {
                  const down = await method();
                  downloadUrl = down.result.download_url;
                  
                  // Try to get buffer with enhanced headers
                  try {
                      buffer = await getBufferWithHeaders(downloadUrl);
                      downloadSuccess = true;
                      break;
                  } catch (bufferErr) {
                      console.error("Buffer fetch failed, trying fallback:", bufferErr.message);
                      // Try original getBuffer as fallback
                      try {
                          buffer = await getBuffer(downloadUrl);
                          downloadSuccess = true;
                          break;
                      } catch (fallbackErr) {
                          console.error("Fallback buffer fetch also failed:", fallbackErr.message);
                          continue;
                      }
                  }
              } catch (err) {
                  console.error("Download method failed:", err.message);
                  continue;
              }
          }

          if (!downloadSuccess) {
              return message.send("❌ All download methods failed. The video might be restricted or temporarily unavailable.");
          }
          
          // Send audio directly with song details
          await Aliconn.sendMessage(message.jid, {
              audio: buffer,
              mimetype: "audio/mpeg",
              contextInfo: {
                  externalAdReply: {
                      title: dataa.title,
                      body: 'ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ',
                      mediaType: 1,
                      sourceUrl: 'https://youtube.com',
                      thumbnailUrl: dataa.thumbnail
                  }
              }
          }, { quoted: message.data });
          
          return;
      }

      // For search queries
      const search = await yts(searchQuery);
      if (!search.videos || search.videos.length === 0) {
          return message.send("❌ No results found for your search query.");
      }
      
      const datas = search.videos[0];
      const videoUrl = datas.url;

      // Try multiple download endpoints for search results
      const downloadMethods = [
          () => fetchJson(`https://api.giftedtech.web.id/api/download/ytaudio?apikey=gifted&format=128kbps&url=${encodeURIComponent(videoUrl)}`),
          () => fetchJson(`https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted&url=${encodeURIComponent(videoUrl)}`),
          () => fetchJson(`https://api.giftedtech.web.id/api/download/yta?apikey=gifted&url=${encodeURIComponent(videoUrl)}`)
      ];

      let downloadSuccess = false;
      for (const method of downloadMethods) {
          try {
              const down = await method();
              downloadUrl = down.result.download_url;
              
              // Try to get buffer with enhanced headers
              try {
                  buffer = await getBufferWithHeaders(downloadUrl);
                  downloadSuccess = true;
                  break;
              } catch (bufferErr) {
                  console.error("Buffer fetch failed, trying fallback:", bufferErr.message);
                  // Try original getBuffer as fallback
                  try {
                      buffer = await getBuffer(downloadUrl);
                      downloadSuccess = true;
                      break;
                  } catch (fallbackErr) {
                      console.error("Fallback buffer fetch also failed:", fallbackErr.message);
                      continue;
                  }
              }
          } catch (err) {
              console.error("Download method failed:", err.message);
              continue;
          }
      }

      if (!downloadSuccess) {
          return message.send("❌ All download methods failed. The video might be restricted or temporarily unavailable.");
      }
      
      // Send audio directly with song details
      await Aliconn.sendMessage(message.jid, {
          audio: buffer,
          mimetype: "audio/mpeg",
          contextInfo: {
              externalAdReply: {
                  title: `${datas.title}`,
                  body: 'ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ',
                  mediaType: 1,
                  sourceUrl: 'https://youtube.com',
                  thumbnailUrl: datas.thumbnail
              }
          }
      }, { quoted: message.data });

  } catch (err) {
      console.error("Main Error:", err);
      message.send(`❌ Error: ${err.message || 'Unknown error occurred'}`);
  }
};

module.exports = songCommand; 