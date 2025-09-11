
const { plugin, mode } = require('../lib');

plugin({
    pattern: 'calc ?(.*)',
    fromMe: mode,
    desc: 'Calculate mathematical expressions',
    type: 'utility',
    react: '🧮'
}, async (message, match) => {
    try {
        const expression = match || message.reply_message?.text;
        
        if (!expression) {
            return await message.send('*Please provide a mathematical expression*\n\n*Examples:*\n• .calc 2 + 2\n• .calc 5 * (3 + 2)\n• .calc sqrt(16)\n• .calc sin(30)');
        }

        // Security: Only allow safe mathematical operations
        const safeExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
        
        // Add support for common math functions
        const mathExpression = safeExpression
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log(')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^/g, '**'); // Power operator

        let result;
        try {
            result = eval(mathExpression);
        } catch (evalError) {
            return await message.send('*Invalid mathematical expression*\n\nPlease check your syntax and try again.');
        }

        if (typeof result !== 'number' || !isFinite(result)) {
            return await message.send('*Invalid result*\n\nThe expression resulted in an invalid number.');
        }

        // Format the result
        const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');

        const response = `*🧮 Calculator*\n\n` +
            `*Expression:* ${expression}\n` +
            `*Result:* ${formattedResult}\n\n` +
            `> © ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀`;

        await message.send(response);

    } catch (error) {
        console.error('Calculator error:', error);
        await message.send('*Calculation failed*\nPlease check your expression and try again.');
    }
});

plugin({
    pattern: 'convert ?(.*)',
    fromMe: mode,
    desc: 'Unit conversions (temperature, length, weight)',
    type: 'utility',
    react: '🔄'
}, async (message, match) => {
    try {
        if (!match) {
            return await message.send('*Unit Converter*\n\n*Examples:*\n• .convert 100 c to f (temperature)\n• .convert 5 km to miles\n• .convert 10 kg to lbs');
        }

        const parts = match.toLowerCase().split(' ');
        if (parts.length < 4 || parts[2] !== 'to') {
            return await message.send('*Invalid format*\n\nUse: .convert [value] [from_unit] to [to_unit]');
        }

        const value = parseFloat(parts[0]);
        const fromUnit = parts[1];
        const toUnit = parts[3];
        
        if (isNaN(value)) {
            return await message.send('*Invalid value*\nPlease provide a valid number.');
        }

        let result, category;

        // Temperature conversions
        if (['c', 'celsius', 'f', 'fahrenheit', 'k', 'kelvin'].includes(fromUnit) && 
            ['c', 'celsius', 'f', 'fahrenheit', 'k', 'kelvin'].includes(toUnit)) {
            category = 'Temperature';
            
            if (fromUnit.startsWith('c') && toUnit.startsWith('f')) {
                result = (value * 9/5) + 32;
            } else if (fromUnit.startsWith('f') && toUnit.startsWith('c')) {
                result = (value - 32) * 5/9;
            } else if (fromUnit.startsWith('c') && toUnit.startsWith('k')) {
                result = value + 273.15;
            } else if (fromUnit.startsWith('k') && toUnit.startsWith('c')) {
                result = value - 273.15;
            } else if (fromUnit.startsWith('f') && toUnit.startsWith('k')) {
                result = (value - 32) * 5/9 + 273.15;
            } else if (fromUnit.startsWith('k') && toUnit.startsWith('f')) {
                result = (value - 273.15) * 9/5 + 32;
            } else {
                result = value; // Same unit
            }
        }
        // Length conversions
        else if (['m', 'meter', 'km', 'kilometer', 'cm', 'centimeter', 'mm', 'millimeter', 'ft', 'feet', 'in', 'inch', 'mile', 'miles'].includes(fromUnit) &&
                 ['m', 'meter', 'km', 'kilometer', 'cm', 'centimeter', 'mm', 'millimeter', 'ft', 'feet', 'in', 'inch', 'mile', 'miles'].includes(toUnit)) {
            category = 'Length';
            
            // Convert to meters first
            let meters = value;
            if (fromUnit.startsWith('km')) meters *= 1000;
            else if (fromUnit.startsWith('cm')) meters *= 0.01;
            else if (fromUnit.startsWith('mm')) meters *= 0.001;
            else if (fromUnit.startsWith('ft')) meters *= 0.3048;
            else if (fromUnit.startsWith('in')) meters *= 0.0254;
            else if (fromUnit.includes('mile')) meters *= 1609.34;
            
            // Convert from meters to target unit
            if (toUnit.startsWith('km')) result = meters / 1000;
            else if (toUnit.startsWith('cm')) result = meters / 0.01;
            else if (toUnit.startsWith('mm')) result = meters / 0.001;
            else if (toUnit.startsWith('ft')) result = meters / 0.3048;
            else if (toUnit.startsWith('in')) result = meters / 0.0254;
            else if (toUnit.includes('mile')) result = meters / 1609.34;
            else result = meters;
        }
        // Weight conversions
        else if (['kg', 'kilogram', 'g', 'gram', 'lb', 'lbs', 'pound', 'oz', 'ounce'].includes(fromUnit) &&
                 ['kg', 'kilogram', 'g', 'gram', 'lb', 'lbs', 'pound', 'oz', 'ounce'].includes(toUnit)) {
            category = 'Weight';
            
            // Convert to grams first
            let grams = value;
            if (fromUnit.startsWith('kg')) grams *= 1000;
            else if (fromUnit.includes('lb') || fromUnit.includes('pound')) grams *= 453.592;
            else if (fromUnit.includes('oz') || fromUnit.includes('ounce')) grams *= 28.3495;
            
            // Convert from grams to target unit
            if (toUnit.startsWith('kg')) result = grams / 1000;
            else if (toUnit.includes('lb') || toUnit.includes('pound')) result = grams / 453.592;
            else if (toUnit.includes('oz') || toUnit.includes('ounce')) result = grams / 28.3495;
            else result = grams;
        }
        else {
            return await message.send('*Unsupported conversion*\n\nSupported categories:\n• Temperature: C, F, K\n• Length: m, km, cm, mm, ft, in, miles\n• Weight: kg, g, lbs, oz');
        }

        const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(4).replace(/\.?0+$/, '');

        const response = `*🔄 Unit Converter*\n\n` +
            `*Category:* ${category}\n` +
            `*From:* ${value} ${fromUnit}\n` +
            `*To:* ${formattedResult} ${toUnit}\n\n` +
            `> © ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀`;

        await message.send(response);

    } catch (error) {
        console.error('Converter error:', error);
        await message.send('*Conversion failed*\nPlease check your input and try again.');
    }
});
