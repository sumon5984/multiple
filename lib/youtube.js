
const axios = require('axios');
const yts = require("yt-search");
const fs = require("fs");

const validQueryDomains = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'gaming.youtube.com',
]);

const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;

const getURLVideoID = link => {
    const parsed = new URL(link.trim());
    let id = parsed.searchParams.get('v');
    if (validPathDomains.test(link.trim()) && !id) {
        const paths = parsed.pathname.split('/');
        id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
        throw Error('Not a YouTube domain');
    }
    if (!id) {
        throw Error(`No video id found: "${link}"`);
    }
    id = id.substring(0, 11);
    return id;
};

const ffmpeg = require('fluent-ffmpeg');
const googleTTS = require('google-tts-api');
const {
    translate
} = require('@vitalets/google-translate-api');

const stream2buffer = async (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
};

async function searchYT(q) {
    try {
        const res = await yts(q);
        let aa = [];
        res.all.filter(a => a.type == 'video').map((r) => aa.push({
            title: r.title,
            url: r.url,
            thumbnail: r.thumbnail,
            duration: r.duration,
            author: r.author.name
        }));
        return aa;
    } catch (e) {
        console.error("Search error:", e);
        return [];
    }
}

const downloadMp3 = async (url) => {
    try {
        const videoId = getURLVideoID(url);
        const apiUrl = `https://api.cobalt.tools/api/json`;
        
        const response = await axios.post(apiUrl, {
            url: url,
            vCodec: "h264",
            vQuality: "720",
            aFormat: "mp3",
            filenamePattern: "classic",
            isAudioOnly: true
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.url) {
            const audioResponse = await axios.get(response.data.url, { responseType: 'arraybuffer' });
            return Buffer.from(audioResponse.data);
        }
        
        // Fallback to alternative API
        const fallbackUrl = `https://api.youtubei.org/api/v1/download?url=${encodeURIComponent(url)}&format=mp3`;
        const fallbackResponse = await axios.get(fallbackUrl);
        
        if (fallbackResponse.data && fallbackResponse.data.download_url) {
            const audioResponse = await axios.get(fallbackResponse.data.download_url, { responseType: 'arraybuffer' });
            return Buffer.from(audioResponse.data);
        }
        
        throw new Error("No download URL found");
    } catch (e) {
        console.error("Download MP3 error:", e);
        return "rejected";
    }
};

const downloadMp4 = async (url) => {
    try {
        const videoId = getURLVideoID(url);
        const apiUrl = `https://api.cobalt.tools/api/json`;
        
        const response = await axios.post(apiUrl, {
            url: url,
            vCodec: "h264",
            vQuality: "720",
            aFormat: "mp3",
            filenamePattern: "classic",
            isAudioOnly: false
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.url) {
            const videoResponse = await axios.get(response.data.url, { responseType: 'arraybuffer' });
            return Buffer.from(videoResponse.data);
        }
        
        // Fallback to alternative API
        const fallbackUrl = `https://api.youtubei.org/api/v1/download?url=${encodeURIComponent(url)}&format=mp4`;
        const fallbackResponse = await axios.get(fallbackUrl);
        
        if (fallbackResponse.data && fallbackResponse.data.download_url) {
            const videoResponse = await axios.get(fallbackResponse.data.download_url, { responseType: 'arraybuffer' });
            return Buffer.from(videoResponse.data);
        }
        
        throw new Error("No download URL found");
    } catch (e) {
        console.error("Download MP4 error:", e);
        return "rejected";
    }
};

function GenListMessage(title, options, desc, footer) {
    if (!title) return false;
    if (!options) return false;
    if (!options[0]) return "options must be array and its have values";
    let response = "*_" + title + "_*\n\n",
        n = 1;
    if (desc) response += desc + '\n\n';
    options.map((o) => {
        response += `*${n++}*. ` + '```' + `${o}` + '```\n'
    });
    if (footer) response += footer;
    return response;
}

const TTS = async (text, lang) => {
    try {
        const options = {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com'
        };
        const audioBase64Array = await googleTTS.getAllAudioBase64(text, options);
        const base64Data = audioBase64Array.map((audio) => audio.base64).join();
        const fileData = Buffer.from(base64Data, 'base64');
        fs.writeFileSync('tts.mp3', fileData, {
            encoding: 'base64'
        });
        return new Promise((resolve) => {
            ffmpeg('tts.mp3').audioCodec('libopus').save('tts.opus').on('end', async () => {
                resolve(fs.readFileSync('tts.opus'));
            });
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

const TRT = async (text, lang = 'en') => {
    const res = await translate(text, {
        to: lang,
        autoCorrect: true
    }).catch(_ => "request failed with status code 303")
    return res;
}

const getYTInfo = async (url) => {
    try {
        const video_id = getURLVideoID(url);
        const res = await yts({
            videoId: video_id
        });
        const {
            title,
            description,
            seconds,
            uploadDate,
            views,
            thumbnail,
            author,
            videoId
        } = res;
        return ({
            title,
            description,
            seconds,
            uploadDate,
            views,
            thumbnail,
            author: author.name,
            videoId
        });
    } catch (error) {
        console.error("Get YT Info error:", error);
        return null;
    }
}

module.exports = {
    stream2buffer,
    searchYT,
    downloadMp3,
    downloadMp4,
    GenListMessage,
    TTS,
    TRT,
    getYTInfo
};
