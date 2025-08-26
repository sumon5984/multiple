// Fancy fonts: 1–35 basic styles (add more if needed)
const fontStyles = [
  t => t, // Plain
  t => t.toUpperCase(), // UPPERCASE
  t => t.split('').map(c => `(${c})`).join(''),
  t => t.split('').map(c => c + ' ').join(''), // spaced
  t => t.split('').map(c => '『' + c + '』').join(''),
  t => t.replace(/[A-Za-z]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x1D400 - 65)), // 𝓐
  t => t.replace(/[A-Za-z]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x1D5A0 - 65)), // 𝗔
  t => t.replace(/[A-Za-z]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x1D670 - 65)), // 𝙰
  t => t.replace(/[A-Za-z]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x1D4D0 - 65)), // 𝓐 cursive
  t => t.split('').map(c => '⟦' + c + '⟧').join(''),
  t => t.split('').map(c => '【' + c + '】').join(''),
  t => t.split('').map(c => '꧁' + c + '꧂').join(''),
  t => `『${t}』`,
  t => `*${t}*`,
  t => `~${t}~`,
  t => `「${t}」`,
  t => `≋${t}≋`,
  t => `〘${t}〙`,
  t => `『${t.toUpperCase()}』`,
  t => `•°•${t}•°•`,
  t => `༒${t}༒`,
  t => `𓆩${t}𓆪`,
  t => `×º°”˜${t}˜”°º×`,
  t => `< ${t} `,
  t => `| ${t} `,
  t => `- ${t} `,
  t => ` ${t.toUpperCase()} `,
  t => `░▒▓█ ${t} █▓▒░`,
  t => `《${t.toUpperCase()}》`,
  t => `• ${t.toLowerCase()} •`,
  t => `♬ ${t} ♬`
];

const fancy = async (text, styleIndex = 0) => {
  const i = parseInt(styleIndex) - 1;
  if (i >= 0 && i < fontStyles.length) return fontStyles[i](text);
  return text;
};

const readMore = async () => {
  const readMoreUnicode = String.fromCharCode(8206).repeat(4001);
  return readMoreUnicode;
};

const isUrls = (url) => {
  return /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(url);
};

module.exports = {
  fancy,
  readMore,
  isUrls
};