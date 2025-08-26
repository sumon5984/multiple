
const {
plugin,	getJson
} = require('../lib');


plugin({
    pattern: "repo|script",
    fromMe: false,
    desc: "Fetch information about a GitHub repository.",
    type: "info",
}, async (message, match) => {
    const githubRepoURL = 'https://github.com/sumon9836/KAISEN-MD';

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        // Fetch repository details using GitHub API
        const repoData = await getJson(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!repoData || repoData.message) {
            throw new Error('Failed to fetch repository data');
        }

        // Format the repository information
        const formattedInfo = `𓆩 𝐇𝐄𝐋𝐋𝐎 𝐓𝐇𝐄𝐑𝐄  𝐁𝐎𝐓 𝐔𝐒𝐄𝐑! 🥰𓆪

> Ｓｉｍｐｌｅ・Ｉｃｙ・Ｃｏｌｄ・Ｒｉｃｈ𝓁𝔂 Ｌｏａｄｅｄ ｗｉｔｈ Ａｍａｚｉｎｇ Ｆｅａｔｕｒｅｓ — 𝓚𝓐𝓘𝓢𝓔𝓝 𝙈𝘿 ❄️

╭─────────◇◇───────╮
│🫶 𝙏𝙃𝘼𝙉𝙆 𝙔𝙊𝙐 𝙁𝙊𝙍 𝙐𝙎𝙄𝙉𝙂│
╰─────────◇◇───────╯

> 𝘿𝙤𝙣'𝙩 𝙛𝙤𝙧𝙜𝙚𝙩 𝙩𝙤 ⭐ 𝙎𝙏𝘼𝙍 & 🍴 𝙁𝙊𝙍𝙆 𝙏𝙃𝙀 𝙍𝙀𝙋𝙊:

\`🔮 𝐁𝐎𝐓 𝐑𝐄𝐏𝐎 𝐋𝐈𝐍𝐊:\`💀👇

> https://github.com/sumon9836/KAISEN-MD
━━━━━━━━━━━━━━━━━━━━━━

\`📡 𝐁𝐎𝐓 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 𝐆𝐂:\`💀👇

> https://chat.whatsapp.com/CQyxExEBMGvEnkA32zqbNY

\`🤖 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄:\`🍑

> ${repoData.name}

\`👑 𝐎𝐖𝐍𝐄𝐑 𝐍𝐀𝐌𝐄:\`🍉

> ${repoData.owner.login}

\`🌟 𝐒𝐓𝐀𝐑𝐒:\`🌳

> ${repoData.stargazers_count}

\`🍴 𝐅𝐎𝐑𝐊𝐒:\`☔

> ${repoData.forks_count}

\`📝 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐓𝐈𝐎𝐍:\`🍒

> ${repoData.description || 'No description'}

━━━━━━━━━━━━━━━━━━━━━

> © 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮  『 𝙆𝘼𝙄𝙎𝙀𝙉 - 𝙈𝘿 』 ꯭̽💖`;

        // Send an image with the formatted info as a caption
        await message.client.sendMessage(message.jid, {
            image: { url: `https://files.catbox.moe/hwl3d4.jpg` },
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [message.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: '',
                    serverMessageId: 143
                }
            }
        }, { quoted: message.data });

        // Send the audio file
        await message.client.sendMessage(message.jid, {
            audio: { url: 'https://files.catbox.moe/ulh93p.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: { 
                mentionedJid: [message.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: '',
                    serverMessageId: 143
                }
            }
        }, { quoted: message.data });

    } catch (error) {
        console.error("Error in repo command:", error);
        await message.send("Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
});
