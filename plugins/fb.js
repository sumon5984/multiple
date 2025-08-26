
const {
    plugin,
    mode,
    extractUrlsFromString,
    config,
    linkPreview
} = require('../lib');

const axios = require('axios');

plugin({
    pattern: 'fb ?(.*)',
    react: "⏰",
    desc: 'Download videos from Facebook',
    type: "downloader",
    fromMe: mode
}, async (message, match) => {
    try {
        // Get URL from match or reply message
        match = match || message.reply_message?.text;
        if (!match) {
            return await message.send('*please provide video url ..*');
        }

        // Extract URLs from the input
        const urls = extractUrlsFromString(match);
        if (!urls[0] || !urls[0].includes("facebook.com")) {
            return await message.send('*please provide video url ..*' );
        }

        // Send loading message
        await message.send('```Downloading video... Please wait.📥```', );

        // Prepare the API URL
        const apiUrl = `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(urls[0])}`;

        // Call the API using GET
        const response = await axios.get(apiUrl);

        // Check if the API response is valid
        if (!response.data || !response.data.status || !response.data.video) {
            return await message.send('❌ Unable to fetch the video. Please check the URL and try again.');
        }

        // Extract the video details
        const { title, thumbnail, downloads } = response.data.video;

        // Get the highest quality download link (HD or SD)
        const downloadLink = downloads.find(d => d.quality === "HD")?.downloadUrl || downloads[0].downloadUrl;

        // Download the video
        const videoResponse = await axios.get(downloadLink, { responseType: 'arraybuffer' });
        if (!videoResponse.data) {
            return await message.send('❌ Failed to download the video. Please try again later.', );
        }

        // Prepare the video buffer
        const videoBuffer = Buffer.from(videoResponse.data, 'binary');

        // Send the video with details
        const caption = `*ƙαιʂҽɳ-ɱԃ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃*\n\n` +
            `🔖 *TITLE*: ${title}\n` +
            `📏 *QUALITY*: ${downloads.find(d => d.quality === "HD") ? "HD" : "SD"}\n\n` +
            `> *© ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀*`;

        await message.send(videoBuffer, {
            caption: caption,
            mimetype: 'video/mp4'
        }, 'video');

    } catch (error) {
        console.error('Error downloading Facebook video:', error);
        await message.send('❌ Unable to download the video. Please try again later.' );
    }
});
