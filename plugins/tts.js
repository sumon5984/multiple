const {
    plugin,
    mode,
    TTS
} = require('../lib');

plugin({
    pattern: 'tts',
    fromMe: mode,
    desc: 'text to speech',
    react: "💔",
    type: "converter"
}, async (message, match) => {
        match = match || message.reply_message.text;
        if (!match) return await message.send('_please give me some query_');
        let slang = match.match('\\{([a-z]+)\\}');
        let lang = "hi";
        if (slang) {
            lang = slang[1];
            match = match.replace(slang[0], '');
        }
        return await message.send(await TTS(match,lang),{
            mimetype: 'audio/ogg; codecs=opus',
            ptt: false
        },'audio');
});
