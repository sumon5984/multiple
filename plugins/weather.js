
const { plugin, mode, fetchJson } = require('../lib');

plugin({
    pattern: 'weather ?(.*)',
    fromMe: mode,
    desc: 'Get weather information for a location',
    type: 'utility',
    react: '🌤️'
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send('*Please provide a location*\n\n*Example:* .weather New York');
        }

        const location = match.trim();
        
        // Using OpenWeatherMap free API (requires API key in config)
        const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
        
        const weatherData = await fetchJson(url);
        
        if (weatherData.cod === '404') {
            return await message.send('*Location not found!*\nPlease check the spelling and try again.');
        }

        const weather = weatherData.weather[0];
        const main = weatherData.main;
        const wind = weatherData.wind;

        const weatherInfo = `*🌤️ Weather Information*\n\n` +
            `*📍 Location:* ${weatherData.name}, ${weatherData.sys.country}\n` +
            `*🌡️ Temperature:* ${Math.round(main.temp)}°C (Feels like ${Math.round(main.feels_like)}°C)\n` +
            `*📊 Condition:* ${weather.main} - ${weather.description}\n` +
            `*💧 Humidity:* ${main.humidity}%\n` +
            `*🌬️ Wind Speed:* ${wind.speed} m/s\n` +
            `*👁️ Visibility:* ${weatherData.visibility / 1000} km\n` +
            `*🌅 Sunrise:* ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}\n` +
            `*🌇 Sunset:* ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}`;

        await message.send(weatherInfo);

    } catch (error) {
        console.error('Weather error:', error);
        await message.send('*Failed to get weather information*\nPlease try again later or check if you have a valid weather API key.');
    }
});
