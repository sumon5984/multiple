const {
	plugin,
	mode
} = require('../lib');
const yts = require("yt-search");
const axios = require("axios");

plugin({
pattern: 'video',
	fromMe: mode,
	desc: 'Search and download a song from YouTube as video',
	react: "🎵",
	type: "downloader"
}, async (message, match) => {
	try {
		match = match || message.reply_message?.text;
		if (!match) {
			return await message.send("Please provide a song name download.");
		}

		let videoUrl = match;
		if (!match.includes("youtube.com") && !match.includes("youtu.be")) {
			await message.send("*🎐 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆 𝐒𝐎𝐍𝐆...*");
			const searchResults = await yts(match);
			if (!searchResults.videos.length) {
				return await message.send("No results found for your query.");
			}
			videoUrl = searchResults.videos[0].url;
		}

		const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${videoUrl}`;
		const response = await axios.get(apiUrl);

		if (!response.data || !response.data.status || !response.data.result.url) {
			return await message.send("Failed to fetch the video. Try again later.");
		}

		const caption = `🎶 *Title:* ${response.data.result.title}`;

		await message.send(response.data.result.url, {
			caption: caption,
			mimetype: 'video/mp4'
		}, 'video');

	} catch (e) {
		console.error("Error in ong command:", e);
		await message.send("An error occurred while processing your request.");
	}
});

// New audio download command
plugin({
pattern: 'song',
	fromMe: mode,
	desc: 'Search and download audio from YouTube',
	react: "🎧",
	type: "downloader"
}, async (message, match) => {
	try {
		match = match || message.reply_message?.text;
		if (!match) {
			return await message.send("*please provide a song name..*\n*example -: `.song faded`*");
		}

		let videoUrl = match;
		if (!match.includes("youtube.com") && !match.includes("youtu.be")) {
			await message.send("*🎐 𝐒𝐄𝐀𝐑𝐂𝐇𝐈𝐍𝐆 𝐒𝐎𝐍𝐆...*");
			const searchResults = await yts(match);
			if (!searchResults.videos.length) {
				return await message.send("*No results found for your query.*");
			}
			videoUrl = searchResults.videos[0].url;
		}

		const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${videoUrl}`;
		const response = await axios.get(apiUrl);

		if (!response.data || !response.data.success || !response.data.result.downloadUrl) {
			return await message.send("😐 Failed to fetch the audio. Try again later.");
		}

		const caption = `🎵 *Title:* ${response.data.result.title}\n🔗 *Link:* ${videoUrl}`;

		await message.send(response.data.result.downloadUrl, {
			caption: caption,
			mimetype: "audio/mpeg"
		}, 'audio');

	} catch (e) {
		console.error("Error in music command:", e);
		await message.send("An error occurred while processing your request.");
	}
});
