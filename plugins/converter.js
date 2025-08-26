const {
    plugin,
    mode,
    toAudio,
    toPTT,
    toVideo,
    AudioMetaData,
    config,
    webp2mp4File
} = require('../lib');

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

plugin({
    pattern: 'photo ?(.*)',
    desc: 'convert sticker to image',
    type: "converter",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.sticker) return  await message.reply('_please reply to a sticker_');
    if(message.reply_message.isAnimatedSticker) return  await message.reply('_please reply to a non animated sticker_');
    const media = await message.client.downloadAndSaveMediaMessage(message.reply_message.sticker)
        await ffmpeg(media)
            .fromFormat('webp_pipe')
            .save('output.png')
            .on('error', async(err) => {
                return await message.send(`*error while converting webp to image*`);
            })
            .on('end', async () => {
                return await message.send(fs.readFileSync('output.png'), {},'image');
            });
});
plugin({
    pattern: 'voice ?(.*)',
    desc: 'audio to ptt converter',
    type: "converter",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_plesse reply to video/audio message_');
    let media = await toPTT(await message.reply_message.download())
    return await message.send(media,{
        mimetype: 'audio/mpeg',
        ptt: true
    }, 'audio')
});
plugin({
    pattern: 'gif ?(.*)',
    desc: 'vedio to gif converter',
    type: "converter",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.sticker || message.reply_message.video) return message.reply('_please reply to a animated sticker/video message_');
    await webp2mp4File(await message.client.downloadAndSaveMediaMessage(message.reply_message.sticker || message.reply_message.video))
    return await message.send({ url : webpToMp4.result }, {gifPlayback: true, quoted: message.data }, 'video'); 
});
plugin({
    pattern: 'bass ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-af equalizer=f=54:width_type=o:width=2:g=20"])
        .save("./media/bass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });
});
plugin({
    pattern: 'slow ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .audioFilter("atempo=0.5")
        .outputOptions(["-y", "-af", "asetrate=44100*0.9"])
        .save("./media/slow.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while degreasing audio speed*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/slow.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
      });
});
plugin({
    pattern: 'blown ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-af acrusher=.1:1:64:0:log"])
        .save("./media/blown.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating blown audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/blown.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });
});
plugin({
    pattern: 'deep ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-af atempo=4/4,asetrate=44500*2/3"])
        .save("./media/bass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
      });      
});
plugin({
    pattern: 'earrape ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-af volume=12"])
        .save("./media/bass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });	
});
plugin({
    pattern: 'fast ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-filter:a atempo=1.63,asetrate=44100"])
        .save("./media/bhass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bhass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
     });
});
plugin({
    pattern: 'fat ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-filter:a atempo=1.6,asetrate=22100"])
        .save("./media/bgass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bgass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });
});
plugin({
    pattern: 'nightcore ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-filter:a atempo=1.06,asetrate=44100*1.25"])
        .save("./media/bgass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bgass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });  
});
plugin({
    pattern: 'reverse ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-filter_complex areverse"])
        .save("./media/bgass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/bgass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });  
});
plugin({
    pattern: 'squirrel ?(.*)',
    desc: 'audio edit',
    type: "audio-edit",
    fromMe: mode
}, async (message) => {
    if (!message.reply_message.audio) return message.reply('_please reply to an audio message_');
    await ffmpeg(await message.client.downloadAndSaveMediaMessage(message.reply_message.audio))
        .outputOptions(["-filter:a atempo=0.5,asetrate=65100"])
        .save("./media/beass.mp3")
        .on('error', async(err) => {
                return await message.send(`*error while generating bass audio*`);
         })
        .on('end', async () => {
            await message.client.sendMessage(message.from, {
                audio: fs.readFileSync('./media/beass.mp3'),
                mimetype: 'audio/mp4',
                ptt: false
            })
        });
});

plugin({
    pattern: 'mp3 ?(.*)',
    desc: 'video to mp3 converter',
    type: "converter",
    fromMe: mode
}, (async (message) => {
    if (!message.reply_message.audio && !message.reply_message.video) return message.reply('_please reply to an video message_');
    const opt = {
                title: config.AUDIO_DATA.split(/[|,;]/)[0] || config.AUDIO_DATA,
                body: config.AUDIO_DATA.split(/[|,;]/)[1],
                image: config.AUDIO_DATA.split(/[|,;]/)[2]
            }
    const AudioMeta = await AudioMetaData(await toAudio(await message.reply_message.download()), opt);
    return await message.send(AudioMeta,{
        mimetype: 'audio/mpeg'
    },'audio')
}));
