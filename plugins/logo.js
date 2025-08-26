
//---------------------------------------------
//              KAISEN-MD  
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  😂
//---------------------------------------------

const {
    plugin,
    mode,
    fetchJson,
    config
} = require('../lib');

plugin({
    pattern: "3dcomic",
    fromMe: mode,
    desc: "Create a 3D Comic-style text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: 3dcomic Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the 3D Comic-style text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "dragonball",
    fromMe: mode,
    desc: "Create a Dragon Ball style text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: dragonball Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the Dragon Ball style text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "deadpool",
    fromMe: mode,
    desc: "Create a Deadpool text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: deadpool Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the Deadpool style text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "blackpink",
    fromMe: mode,
    desc: "Create a Blackpink text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: blackpink Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the Blackpink style text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "neonlight",
    fromMe: mode,
    desc: "Create a neon light text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: neonlight Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the neon light text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "cat",
    fromMe: mode,
    desc: "Create a foggy glass text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: cat Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the foggy glass text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "sadgirl",
    fromMe: mode,
    desc: "Create a wet glass text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: sadgirl Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-on-wet-glass-online-589.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the wet glass text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});


plugin({
    pattern: "naruto",
    fromMe: mode,
    desc: "Create a Naruto text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: naruto Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the Naruto style text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "thor",
    fromMe: mode,
    desc: "Create a Thor text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: thor Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the Thor style text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "america",
    fromMe: mode,
    desc: "Create American flag text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: america Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the American flag text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "eraser",
    fromMe: mode,
    desc: "Create an eraser text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: eraser Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the eraser text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "3dpaper",
    fromMe: mode,
    desc: "Create a 3D paper text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: 3dpaper Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the 3D paper text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "futuristic",
    fromMe: mode,
    desc: "Create a futuristic text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: futuristic Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the futuristic text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "clouds",
    fromMe: mode,
    desc: "Create a clouds text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: clouds Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the clouds text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "sand",
    fromMe: mode,
    desc: "Create a sand text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: sand Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the sand text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "galaxy",
    fromMe: mode,
    desc: "Create a galaxy text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: galaxy Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the galaxy text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

plugin({
    pattern: "leaf",
    fromMe: mode,
    desc: "Create a leaf text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: leaf Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the leaf text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});


plugin({
    pattern: "hacker",
    fromMe: mode,
    desc: "Create a hacker text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: leaf Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the leaf text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});


plugin({
    pattern: "boom",
    fromMe: mode,
    desc: "Create a boom text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: leaf Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the leaf text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});



plugin({
    pattern: "floral",
    fromMe: mode,
    desc: "Create a floral text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: leaf Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the leaf text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});



plugin({
    pattern: "zodiac",
    fromMe: mode,
    desc: "Create a zodiac text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: leaf Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the leaf text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});


plugin({
    pattern: "angel",
    fromMe: mode,
    desc: "Create a angel text effect",
    type: "logo",
    react: "🎨"
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send("❌ Please provide a name. Example: leaf Empire");
        }
        
        const name = match;
        
        // API URL with user-provided name
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/angel-wing-effect-329.html&name=${encodeURIComponent(name)}`;

        // Fetch JSON response
        const result = await fetchJson(apiUrl);

        // Check if the download_url is present
        if (!result?.result?.download_url) {
            return await message.send("❌ Failed to generate logo. Please try again.");
        }

        // Send the leaf text effect image
        await message.sendFromUrl(result.result.download_url);

    } catch (e) {
        return await message.send(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});