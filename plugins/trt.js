const { TRT, mode, plugin } = require('../lib');

plugin(
	{
		pattern: 'trt ?(.*)',
		fromMe: mode,
		desc: 'convert texts to various languages',
		type: 'converter',
	},
	async (message, match) => {
		if (!message.reply_message.text)
			return await message.send(
				'_give me some query_'
			)
                if(!match) return await message.send('_which lang_');
                const {text} = await TRT(message.reply_message.text, match)
		return await message.send(text);
	}
)
