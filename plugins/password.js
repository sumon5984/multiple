
const { plugin, mode } = require('../lib');

plugin({
    pattern: 'password ?(.*)',
    fromMe: mode,
    desc: 'Generate secure passwords',
    type: 'utility',
    react: '🔐'
}, async (message, match) => {
    try {
        const length = parseInt(match) || 12;
        
        if (length < 4 || length > 50) {
            return await message.send('*Password length must be between 4 and 50 characters*\n\n*Example:* .password 16');
        }

        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const allChars = lowercase + uppercase + numbers + symbols;
        let password = '';
        
        // Ensure at least one character from each category
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        const result = `*🔐 Secure Password Generated*\n\n` +
            `*Length:* ${length} characters\n` +
            `*Password:* \`${password}\`\n\n` +
            `*Security Tips:*\n` +
            `• Don't share this password\n` +
            `• Use different passwords for different accounts\n` +
            `• Store it securely\n\n` +
            `> © ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀`;

        await message.send(result);

    } catch (error) {
        console.error('Password Generator error:', error);
        await message.send('*Failed to generate password*\nPlease try again.');
    }
});

plugin({
    pattern: 'passcheck ?(.*)',
    fromMe: mode,
    desc: 'Check password strength',
    type: 'utility',
    react: '🛡️'
}, async (message, match) => {
    try {
        const password = match || message.reply_message?.text;
        
        if (!password) {
            return await message.send('*Please provide a password to check*\n\n*Example:* .passcheck MyPassword123!');
        }

        let score = 0;
        let feedback = [];
        
        // Length check
        if (password.length >= 12) {
            score += 2;
        } else if (password.length >= 8) {
            score += 1;
            feedback.push('• Consider using at least 12 characters');
        } else {
            feedback.push('• Too short! Use at least 8 characters');
        }
        
        // Character variety checks
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('• Add lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('• Add uppercase letters');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('• Add numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 2;
        else feedback.push('• Add special characters (!@#$%^&*)');
        
        // Common patterns check
        if (!/(.)\1{2,}/.test(password)) score += 1;
        else feedback.push('• Avoid repeating characters');
        
        let strength = '';
        let emoji = '';
        
        if (score <= 2) {
            strength = 'Very Weak';
            emoji = '🔴';
        } else if (score <= 4) {
            strength = 'Weak';
            emoji = '🟠';
        } else if (score <= 6) {
            strength = 'Good';
            emoji = '🟡';
        } else if (score <= 7) {
            strength = 'Strong';
            emoji = '🟢';
        } else {
            strength = 'Very Strong';
            emoji = '💚';
        }
        
        const result = `*🛡️ Password Strength Analysis*\n\n` +
            `*Strength:* ${emoji} ${strength}\n` +
            `*Score:* ${score}/8\n` +
            `*Length:* ${password.length} characters\n\n` +
            (feedback.length > 0 ? `*Recommendations:*\n${feedback.join('\n')}\n\n` : '*✅ Great password!*\n\n') +
            `> © ᴘσωєʀє∂ ву 𝖐𝚊𝚒𝚜𝖊𝖓 𝙼ԃ⎯꯭̽💀`;

        await message.send(result);

    } catch (error) {
        console.error('Password Check error:', error);
        await message.send('*Failed to analyze password*\nPlease try again.');
    }
});
