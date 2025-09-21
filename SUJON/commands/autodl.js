module.exports = {
  config: {
    name: "autodl",
    version: "0.0.3",
    hasPermssion: 0,
    credits: "SHAON",
    description: "Auto video download with stats",
    commandCategory: "user",
    usages: "",
    cooldowns: 5,
  },

  run: async function({ api, event, args }) {},

  handleEvent: async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    const { alldown } = require("shaon-videos-downloader");

    if (body.startsWith("https://")) {
      try {
        api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);

        // ডাউনলোড ডেটা
        const data = await alldown(content);
        console.log(data);

        // ভিডিও URL
        let videoURL = data.url;

        // ভিডিও ডাউনলোড
        const video = (await axios.get(videoURL, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + "/cache/auto.mp4", Buffer.from(video, "utf-8"));

        // তথ্য নাও, যদি উপস্থিত থাকে
        let title = data.title ? data.title : "Unknown Title";
        let likes = data.likes ? data.likes : "Unknown";
        let comments = data.comments ? data.comments : "Unknown";
        let shares = data.shares ? data.shares : "Unknown";
        let downloads = data.downloads ? data.downloads : "Unknown";

        // মেসেজ পাঠাও
        return api.sendMessage({
          body: `🔥🚀 ─꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 🔥💻
📥⚡ 𝗔𝘂𝘁𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 ⚡📂
❖⋆═══════════════════⋆❖
🎬 Title: ${title}
「」 Likes: ${likes}
「」 Comments: ${comments}
「」 Share: ${shares}
「」 Downloads: ${downloads}
❖⋆═══════════════════⋆❖
🎀 𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐕𝐢𝐝𝐞𝐨 🔥`,
          attachment: fs.createReadStream(__dirname + "/cache/auto.mp4")
        }, event.threadID, event.messageID);

      } catch (err) {
        console.log(err);
        return api.sendMessage("❌ ভিডিও ডাউনলোডে সমস্যা হয়েছে!", event.threadID, event.messageID);
      }
    }
  }
};
