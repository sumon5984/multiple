const {
  getBuffer,
  fetchJson,
  runtime,
  sleep,
  isUrl,
  bytesToSize,
  getSizeMedia,
  check,
} = require("i-nrl");
const {
  cutAudio,
  cutVideo,
  toAudio,
  toPTT,
  isAdmin,
  isBotAdmin,
  getCompo,
  getDate,
  parsedJid,
  PREFIX,
  mode,
  extractUrlsFromString,
  getJson,
  isIgUrl,
  getUrl,
  isNumber,
  MediaUrls,
} = require("./handler");
const { commands } = require("./main");
const config = require("../config");
const package = require("../package");
const env = process.env;
const os = require("os");
let img_url,
  theam = "text";
const ID3Writer = require("browser-id3-writer");
const FormData = require("form-data");
const axios = require("axios");
const api =
  "76a050f031972d9f27e329d767dd988f" || "deb80cd12ababea1c9b9a8ad6ce3fab2";
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

function isInstagramURL(url) {
  var pattern = /^https?:\/\/(www\.)?instagram\.com\/.*/i;
  return pattern.test(url);
}

function linkPreview(options = {}) {
  if (
    !config.LINK_PREVIEW ||
    config.LINK_PREVIEW.toLowerCase() == "false" ||
    !config.LINK_PREVIEW.toLowerCase() == "null"
  )
    return undefined;
  const opt = {
    showAdAttribution: true,
    title:
      options.title || config.LINK_PREVIEW.split(/[;,|]/)[0] || "KAISEN-MD",
    body: options.body || config.LINK_PREVIEW.split(/[;,|]/)[1],
    mediaType: 1,
    thumbnailUrl:
      options.url ||
      config.LINK_PREVIEW.split(/[;,|]/)[2] ||
      "https://i.imgur.com/qyvmAzS.jpeg",
    sourceUrl:
      config.LINK_PREVIEW.split(/[;,|]/)[3] ||
      "https://whatsapp.com/channel/0029VaAKCMO1noz22UaRdB1Q",
  };
  return opt;
}

const format = function (code) {
  let i = -1;
  let byt = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  do {
    code /= 1024;
    i++;
  } while (code > 1024);
  return Math.max(code, 0.1).toFixed(1) + byt[i];
};
async function uploadImageToImgur(imagePath) {
  try {
    const data = new FormData();
    data.append("image", fs.createReadStream(imagePath));

    const headers = {
      Authorization: `Client-ID 3ca8036b07e0f25`,
      ...data.getHeaders(),
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.imgur.com/3/upload",
      headers: headers,
      data: data,
    };

    const response = await axios(config);
    return response?.data?.data?.link;
  } catch (error) {
    return `invalid location get:bad-get`;
  }
}

async function AudioMetaData(audio, info = {}) {
  let title = info.title || "ÉªÉ´Ê€ÊŸ-Ê™á´á´›-á´á´…";
  let body = info.body ? [info.body] : [];
  let img = info.image || "https://i.imgur.com/DyLAuEh.jpg";
  if (!Buffer.isBuffer(img)) img = await getBuffer(img);
  if (!Buffer.isBuffer(audio)) audio = await getBuffer(audio);
  const writer = new ID3Writer(audio);
  writer.setFrame("TIT2", title).setFrame("TPE1", body).setFrame("APIC", {
    type: 3,
    data: img,
    description: "INRL-BOT-MD",
  });
  writer.addTag();
  return Buffer.from(writer.arrayBuffer);
}

function addSpace(text, length = 3, align = "left") {
  text = text.toString();
  if (text.length >= length) return text;
  const even = length - (text.length % 2) != 0 ? length + 1 : length;
  const space = " ";
  if (align != "left" && align != "right") {
    for (let i = 0; i <= even / 2; i++) {
      if (text.length < even) {
        text = space + text + space;
      }
    }
    return text;
  }
  for (let i = 1; text.length < length; i++) {
    if (align == "left") text = text + space;
    if (align == "right") text = space + text;
  }
  return text;
}

async function sendUrl(message) {
  if (message.reply_message.sticker) {
    const imageBuffer = await message.reply_message.download();
    const form = new FormData();
    form.append("image", imageBuffer, "bt.jpg");
    form.append("key", api);
    const response = await axios
      .post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders(),
      })
      .catch((e) => e.response);
    return await message.send(response.data.data.image.url);
  } else if (message.reply_message.image || message.image) {
    const msg = message.reply_message.image || message.image;
    const url = await uploadImageToImgur(
      await message.client.downloadAndSaveMediaMessage(msg)
    );
    return await message.send(url);
  } else if (message.reply_message.video || message.video) {
    const msg = message.reply_message.video || message.video;
    const url = await uploadImageToImgur(
      await message.client.downloadAndSaveMediaMessage(msg)
    );
    return await message.send(url);
  } else if (message.reply_message.audio) {
    const msg = message.reply_message.audio;
    let urvideo = await message.client.downloadAndSaveMediaMessage(msg);
    await ffmpeg(urvideo)
      .outputOptions([
        "-y",
        "-filter_complex",
        "[0:a]showvolume=f=1:b=4:w=720:h=68,format=yuv420p[vid]",
        "-map",
        "[vid]",
        "-map 0:a",
      ])
      .save("output.mp4")
      .on("end", async () => {
        const url = await uploadImageToImgur("./output.mp4");
        return await message.send(url);
      });
  }
}

async function send_menu(m) {
  const image = MediaUrls(config.BOT_INFO);
  if (image) {
    img_url = image[0];
    theam = img_url.video ? "video" : "image";
    config.BOT_INFO = config.BOT_INFO.replace(img_url[theam], "").trim();
  }
  const info_vars = config.BOT_INFO.split(/[;,|]/);
  let date = new Date().toLocaleDateString("EN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let types = {};
  let menu = `*Owner: ${(info_vars[0] || info_vars || "").replace(
    /[;,|]/g,
    ""
  )}*
*User: @${m.number}*
*Plugins: ${commands.length.toString()}*
*Prefix: ${PREFIX}*
*Date: ${date}*
*Mode: ${config.WORKTYPE}*
*Version: ${require("../package.json").version}*
*Ram: ${format(os.totalmem() - os.freemem())}*\n\n`;

  commands.map((command) => {
    if (command.pattern) {
      const type = command.type.toLowerCase();
      if (!types[type]) types[type] = [];
      types[type].push(command.pattern);
    }
  });
  const cmd_list = Object.keys(types);
  cmd_list.forEach((cmmd) => {
    menu += `⭓ ${addSpace("*" + cmmd.toUpperCase() + "*", 14, "both")} ⭓`;
    types[cmmd].map((a) => {
      menu += `\n• _${a.replace(/[^a-zA-Z0-9-+]/g, "")}_`;
    });
    menu += `\n\n${String.fromCharCode(8206).repeat(4001)}`;
  });
  const options = {
    contextInfo: {
      mentionedJid: [m.sender],
    },
  };
  if (
    config.LINK_PREVIEW &&
    config.LINK_PREVIEW.toLowerCase() != "null" &&
    config.LINK_PREVIEW.toLowerCase() != "false"
  ) {
    options.contextInfo.externalAdReply = {};
    const image = MediaUrls(config.LINK_PREVIEW);
    if (image[0]) {
      config.LINK_PREVIEW = config.LINK_PREVIEW.replace(image[0]);
      options.contextInfo.externalAdReply.thumbnailUrl = image[0];
    }
    options.contextInfo.externalAdReply.title =
      config.LINK_PREVIEW.split(/[,;|]/)[0];
    options.contextInfo.externalAdReply.body =
      config.LINK_PREVIEW.split(/[,;|]/)[1];
    options.contextInfo.externalAdReply.sourceUrl = extractUrlsFromString(
      config.LINK_PREVIEW
    )[0];
  }
  if (theam == "text") {
    return await m.client.sendMessage(m.jid, {
      text: menu,
      ...options,
    });
  } else {
    return await m.client.sendMessage(m.from, {
      [theam]: {
        url: img_url,
      },
      caption: menu,
      ...options,
    });
  }
}

async function send_alive(m, ALIVE_DATA, obj) {
  const sstart = new Date().getTime();
  let msg = {
    contextInfo: {},
  };
  const prefix = obj.PREFIX == "false" ? "" : obj.PREFIX;
  let extractions = ALIVE_DATA.match(/#(.*?)#/g);
  let URLS;
  if (extractions) {
    ALIVE_DATA = ALIVE_DATA.replace(/#([^#]+)#/g, "");
    extractions = extractions.map((m) => m.slice(1, -1));
    let arra = [];
    URLS = MediaUrls(ALIVE_DATA);
    msg.contextInfo.externalAdReply = {
      containsAutoReply: true,
      mediaType: 1,
      previewType: "PHOTO",
    };
    extractions.map((extraction) => {
      extraction = extraction.replace("\\", "");
      if (extraction.match(/adattribution/gi))
        msg.contextInfo.externalAdReply.showAdAttribution = true;
      if (extraction.match(/adreply/gi))
        msg.contextInfo.externalAdReply.showAdAttribution = true;
      if (extraction.match(/largerthumbnail/gi))
        msg.contextInfo.externalAdReply.renderLargerThumbnail = true;
      if (extraction.match(/largethumb/gi))
        msg.contextInfo.externalAdReply.renderLargerThumbnail = true;
      if (extraction.match(/title/gi))
        msg.contextInfo.externalAdReply.title = extraction.replace(
          /title/gi,
          ""
        );
      if (extraction.match(/body/gi))
        msg.contextInfo.externalAdReply.body = extraction.replace(/body/gi, "");
      if (
        extraction.match(/thumbnail/gi) &&
        !extraction.match(/largerthumbnail/gi)
      )
        msg.contextInfo.externalAdReply.thumbnailUrl = extraction.replace(
          /thumbnail/gi,
          ""
        );
      if (
        extraction.match(/thumb/gi) &&
        !extraction.match(/largerthumbnail/gi) &&
        !extraction.match(/largethumb/gi) &&
        !extraction.match(/thumbnail/gi)
      )
        msg.contextInfo.externalAdReply.thumbnailUrl = extraction.replace(
          /thumb/gi,
          ""
        );
      if (extraction.match(/sourceurl/gi))
        msg.contextInfo.externalAdReply.sourceUrl = extraction.replace(
          /sourceurl/gi,
          ""
        );
      if (extraction.match(/mediaurl/gi))
        msg.contextInfo.externalAdReply.mediaUrl = extraction.replace(
          /mediaurl/gi,
          ""
        );
    });
  } else {
    URLS = MediaUrls(ALIVE_DATA);
  }
  let date = new Date().toLocaleDateString("EN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const URL = URLS[Math.floor(Math.random() * URLS.length)];
  const platform = os.platform();
  const sender = m.sender;
  const user = m.pushName;
  let text = ALIVE_DATA.replace(/&ram/gi, format(os.totalmem() - os.freemem()))
    .replace(/&sender/gi, `@${sender.replace(/[^0-9]/g, "")}`)
    .replace(/&user/gi, `${user}`)
    .replace(/&prefix/gi, `${prefix}`)
    .replace(/&mode/gi, `${obj.WORKTYPE}`)
    .replace(/&platform/gi, `${platform}`)
    .replace(/&date/gi, `${date}`)
    .replace(/&speed/gi, `${sstart - new Date().getTime()}`)
    .replace(/&gif/g, "");
  if (ALIVE_DATA.includes("&sender")) msg.contextInfo.mentionedJid = [sender];
  if (ALIVE_DATA.includes("&gif")) msg.gifPlayback = true;
  if (URL && URL.endsWith(".mp4")) {
    (msg.video = {
      url: URL,
    }),
      (msg.caption = URLS.map((url) => (text = text.replace(url, ""))));
  } else if (URL) {
    (msg.image = {
      url: URL,
    }),
      (msg.caption = URLS.map((url) => (text = text.replace(url, ""))));
  } else msg.text = text.trim();
  return await m.client.sendMessage(m.jid, msg);
}

async function poll(id) {
  if (!fs.existsSync("./lib/database/poll.json"))
    return {
      status: false,
    };
  const file = JSON.parse(fs.readFileSync("./lib/database/poll.json"));
  const poll_res = file.message.filter((a) => id.key.id == Object.keys(a)[0]);
  if (!poll_res[0])
    return {
      status: false,
    };
  let options = {};
  const vote_id = Object.keys(poll_res[0]);
  const vote_obj = Object.keys(poll_res[0][vote_id].votes);
  let total_votes = 0;
  vote_obj.map((a) => {
    options[a] = {
      count: poll_res[0][vote_id].votes[a].length,
    };
    total_votes = total_votes + poll_res[0][vote_id].votes[a].length;
  });
  const keys = Object.keys(options);
  keys.map(
    (a) =>
      (options[a].percentage = (options[a].count / total_votes) * 100 + "%")
  );
  return {
    status: true,
    res: options,
    total: total_votes,
  };
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function platforms() {
  if (env.RAILWAY_STATIC_URL || env.RAILWAY_ENVIRONMENT) {
    return "Railway";
  } else if (env.VERCEL || env.VERCEL_ENV || env.NOW_REGION) {
    return "Vercel";
  } else if (env.RENDER || env.RENDER_INSTANCE_ID || env.RENDER_EXTERNAL_URL) {
    return "Render";
  } else if (env.HEROKU_APP_NAME || env.HEROKU_API_KEY) {
    return "Heroku";
  } else if (env.REPL_ID || env.REPL_SLUG) {
    return "Replit";
  } else if (env.PROJECT_REMIX_CHAIN || env.GIT_REPO_SLUG) {
    return "Glitch";
  } else {
    const osType = os.type();
    const osMap = {
      Linux: "Linux",
      Darwin: "macOS",
      Windows_NT: "Windows",
    };
    return osMap[osType] || `${osType}`;
  }
}

module.exports = {
  isInstagramURL,
  linkPreview,
  AudioMetaData,
  addSpace,
  sendUrl,
  send_menu,
  send_alive,
  platforms,
  poll,
  getRandom,
  getBuffer,
  fetchJson,
  runtime,
  sleep,
  isUrl,
  bytesToSize,
  getSizeMedia,
  check,
};
