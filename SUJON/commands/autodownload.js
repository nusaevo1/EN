module.exports = {
    config: {
        name: "autodl",
        version: "0.0.3", // Version updated
        hasPermssion: 0,
        credits: "SHAON (modified by Gemini)",
        description: "auto video download with details",
        commandCategory: "user",
        usages: "",
        cooldowns: 5,
    },
    run: async function({ api, event, args }) {},
    handleEvent: async function({ api, event, args }) {
        const axios = require("axios");
        const request = require("request");
        const fs = require("fs-extra");
        const content = event.body ? event.body : '';
        const body = content.toLowerCase();
        const { alldown } = require("shaon-videos-downloader");

        if (body.startsWith("https://")) {
            try {
                api.setMessageReaction("⏳", event.messageID, (err) => {}, true); // Waiting reaction

                // Fetch video data
                const data = await alldown(content);
                if (!data || !data.url) {
                    api.sendMessage("❌ দুঃখিত, ভিডিওর তথ্য আনতে পারিনি।", event.threadID, event.messageID);
                    api.setMessageReaction("❌", event.messageID, (err) => {}, true);
                    return;
                }

                const videoUrl = data.url;

                api.setMessageReaction("📥", event.messageID, (err) => {}, true); // Downloading reaction

                // Download the video
                const video = (await axios.get(videoUrl, {
                    responseType: "arraybuffer",
                })).data;
                fs.writeFileSync(__dirname + "/cache/auto.mp4", Buffer.from(video, "utf-8"));

                // Create the detailed message body
                const messageBody = `╭─❍「 𝐕𝐢𝐝𝐞𝐨 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 」
│ ───❖ ─── ❖ ─── ❖
│
│ 📝 𝗧𝗶𝘁𝗹𝗲: ${data.title || 'N/A'}
│ 👍 𝗟𝗶𝗸𝗲𝘀: ${data.likes || 'N/A'}
│ 💬 𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀: ${data.comments || 'N/A'}
│ 🔗 𝗦𝗵𝗮𝗿𝗲𝘀: ${data.shares || 'N/A'}
│ 📥 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝘀: ${data.downloads || 'N/A'}
│
╰─❍`;

                // Send the message with the video and details
                api.sendMessage({
                    body: messageBody,
                    attachment: fs.createReadStream(__dirname + "/cache/auto.mp4")
                }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/auto.mp4"), event.messageID);
                
                api.setMessageReaction("✅", event.messageID, (err) => {}, true); // Success reaction

            } catch (error) {
                console.error("Auto Downloader Error:", error);
                api.sendMessage(`🚫 একটি সমস্যা হয়েছে: ${error.message}`, event.threadID, event.messageID);
                api.setMessageReaction("❌", event.messageID, (err) => {}, true);
            }
        }
    }
};
