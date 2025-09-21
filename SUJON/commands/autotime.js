module.exports.config = {
    name: "autotime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Evo",
    description: "Show Islamic & English time info with Ayat and Doa",
    commandCategory: "Utility",
    usages: "autotime",
    cooldowns: 5
};

const axios = require('axios');
const PAGE_ACCESS_TOKEN = "YOUR_PAGE_ACCESS_TOKEN"; // তোমার Page Access Token
const RECIPIENT_ID = "RECIPIENT_USER_ID"; // যাকে পাঠাতে চাও তার ID

// ইসলামিক আয়াত ও দোয়া লিস্ট
const islamicMessages = [
    {
        ayat: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        meaning: "নিশ্চয়ই আল্লাহর স্মরণে হৃদয় শান্তি পায়।"
    },
    {
        ayat: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
        meaning: "বলুন, ‘হে আমার পালনকর্তা! আমাকে জ্ঞান বৃদ্ধি দাও।’"
    },
    {
        ayat: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
        meaning: "হে আমাদের পালনকর্তা! আমাদেরকে এই দুনিয়ায় এবং পরকালে ভাল দিন।"
    },
    {
        ayat: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        meaning: "আমাদের জন্য আল্লাহ যথেষ্ট এবং তিনি সেরা অভিভাবক।"
    },
    {
        ayat: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ",
        meaning: "হে আমার পালনকর্তা! আমাকে এবং আমার পিতামাতাকে ক্ষমা দাও।"
    }
];

// Messenger এ পাঠানোর ফাংশন
async function sendMessage(text) {
    try {
        await axios.post(
            `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                recipient: { id: RECIPIENT_ID },
                message: { text }
            }
        );
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
}

// টাইম ও ক্যালেন্ডার ইনফো
function getTimeInfo() {
    const now = new Date();

    // ইংরেজি দিন ও মাস
    const day = now.getDate();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const month = monthNames[now.getMonth()];

    const dayNames = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
    const weekday = dayNames[now.getDay()];

    // বাংলা মাস
    const banglaMonths = ["বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ","ভাদ্র","আশ্বিন","কার্তিক","অগ্রহায়ণ","পৌষ","মাঘ","ফাল্গুন","চৈত্র"];
    const banglaMonth = banglaMonths[now.getMonth()];

    // ইসলামিক মাস
    const hijriMonths = ["মুহররম","সফর","রবিউল আউয়াল","রবিউল থানি","জমাদিউল আউয়াল","জমাদিউল থানি","রজব","শাবান","রমজান","শাওয়াল","জিলক্বদ","জিলহজ"];
    const hijriMonth = hijriMonths[(now.getMonth() + 1) % 12];

    // সময়
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const time = `${hours}:${minutes} ${ampm}`;

    // এলোমেলো আয়াত নির্বাচন
    const randomIndex = Math.floor(Math.random() * islamicMessages.length);
    const messageObj = islamicMessages[randomIndex];

    return `======= 𝗧𝗜𝗠𝗘 =======
📅 ইংরেজি তারিখ: ${day}
🗒️ মাস : ${month}
📛 দিন: ${weekday}
🗓️ আশ্বিন: ${banglaMonth}
🕌 ${hijriMonth}: ২৯
🕒 সময়: ${time}
━━━━━━━━━━━━━━━
📖 আয়াত: ${messageObj.ayat}
📝 অর্থ: ${messageObj.meaning}
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ ─꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭`;
}

// কমান্ড একটিভেট হলে
module.exports.run = async ({ event, api }) => {
    const message = getTimeInfo();
    sendMessage(message);

    // প্রতি ঘন্টায় স্বয়ংক্রিয়ভাবে পাঠানো
    setInterval(() => {
        const msg = getTimeInfo();
        sendMessage(msg);
    }, 60 * 60 * 1000);
};
