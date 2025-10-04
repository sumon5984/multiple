const { plugin, mode } = require("../lib");
const { CMD_NAME } = require("../config");
const axios = require("axios");

plugin(
  {
    pattern: "img ?(.*)",
    react: "🖼",
    fromMe: mode,
    type: "search",
    desc: "Search and download original quality images from Google",
  },
  async (message, match) => {
    if (!match) {
      return await message.send(
        "_Please provide a search keyword_\n*Example:* .img anime\n.img anime,5"
      );
    }

    let [text, count] = match.split(/[;,|]/);
    if (!text) text = match.trim();

    count = parseInt(count) || 5;
    if (count > 10) count = 10;

    await message.send(
      `🔍 Searching Google Images for *${text}*... (Original Quality)`
    );

    try {
      const images = await searchGoogleImagesOriginal(text);

      if (!images || images.length === 0) {
        return await message.send(
          `❌ No images found for *"${text}"*. Try another search.`
        );
      }

      const max = Math.min(images.length, count);

      for (let i = 0; i < max; i++) {
        try {
          await message.client.sendMessage(
            message.jid,
            {
              image: { url: images[i] },
              caption: `🖼️ *Search:* ${text}\n📊 *Image ${
                i + 1
              }/${max}*\n> *${CMD_NAME}*`,
            },
            { quoted: message.data }
          );

          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (sendErr) {
          console.error(`Failed to send image ${i + 1}:`, sendErr.message);
        }
      }
    } catch (err) {
      console.error("Google image search error:", err);
      return await message.send(
        `❌ *Error while fetching images. Please try again.*`
      );
    }
  }
);

async function searchGoogleImagesOriginal(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    // Use image size parameter for larger images
    const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch&tbs=isz:l&hl=en`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
      },
      timeout: 15000,
    });

    const images = [];
    const html = response.data;

    // Primary Method: Extract "ou" (Original URL) parameter - THIS IS THE ORIGINAL IMAGE
    const ouRegex = /"ou":"(https?:\/\/[^"]+?)"/g;
    let match;

    while ((match = ouRegex.exec(html)) !== null) {
      let originalUrl = match[1];
      // Decode URL escapes
      originalUrl = originalUrl
        .replace(/\\u003d/g, "=")
        .replace(/\\u0026/g, "&")
        .replace(/\\u002F/g, "/")
        .replace(/\\/g, "");

      // Only add if it's a valid image URL
      if (originalUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i)) {
        if (!images.includes(originalUrl)) {
          images.push(originalUrl);
        }
      }
    }

    // Secondary Method: Extract from metadata JSON
    const metadataRegex =
      /\["(https?:\/\/[^"]+?\.(?:jpg|jpeg|png|gif|webp))","(\d+)","(\d+)"\]/g;
    let metaMatch;

    while ((metaMatch = metadataRegex.exec(html)) !== null) {
      const url = metaMatch[1];
      const width = parseInt(metaMatch[2]);
      const height = parseInt(metaMatch[3]);

      // Only include larger images (original quality)
      if (width >= 800 || height >= 800) {
        if (!images.includes(url) && !url.includes("gstatic.com")) {
          images.push(url);
        }
      }
    }

    // Tertiary Method: Extract high-res image URLs from AF_initDataCallback
    const dataRegex = /\["(https?:\/\/[^"]+?)",(\d+),(\d+)\]/g;
    let dataMatch;

    while ((dataMatch = dataRegex.exec(html)) !== null) {
      const url = dataMatch[1];
      const dimension = parseInt(dataMatch[2]) || 0;

      if (
        url.match(/\.(jpg|jpeg|png|gif|webp)$/i) &&
        dimension >= 500 &&
        !url.includes("encrypted-tbn") &&
        !url.includes("gstatic.com") &&
        !images.includes(url)
      ) {
        images.push(url);
      }
    }

    console.log(
      `Found ${images.length} ORIGINAL quality Google images for: ${query}`
    );

    // Return unique original quality images
    return [...new Set(images)].slice(0, 20);
  } catch (error) {
    console.error("Google scraping error:", error.message);
    throw new Error("Failed to fetch Google images");
  }
}
