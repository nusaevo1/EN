module.exports.config = {
    name: "autotime",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
    description: "Islamic captions at specific times with full date info.",
    commandCategory: "user",
    usages: '',
    cooldowns: 5,
    dependencies: {}
};

const messages = [
    // … তোমার আগের messages array ঠিকই থাকবে এখানে …
];

const getMessageForTime = (time, day) => {
    const isFriday = day === 5; 
    const timeData = messages.find(m => m.timer === time);
    
    if (timeData) {
        if (isFriday && timeData.friday_message) {
            return timeData.friday_message[Math.floor(Math.random() * timeData.friday_message.length)];
        } else if (timeData.normal_message) {
            return timeData.normal_message[Math.floor(Math.random() * timeData.normal_message.length)];
        } else {
            return timeData.message[Math.floor(Math.random() * timeData.message.length)];
        }
    }
    return null;
};

const formatMessage = (originalMessage, period, time) => {
    const now = new Date(Date.now() + 21600000); // GMT+6
    const options = { month: 'long' };
    const englishMonth = now.toLocaleDateString('en-US', options);
    const dayOfWeek = now.toLocaleDateString('bn-BD', { weekday: 'long' });
    const dayOfMonth = now.getDate();

    // ইসলামিক ক্যালেন্ডার (উদাহরণ)
    const islamicDate = now.toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
    const islamicDay = islamicDate.split(' ')[0]; 
    const islamicMonth = islamicDate.split(' ')[1]; 

    return `======== 𝗧𝗜𝗠𝗘 =========
📅 ইংরেজি তারিখ: ${dayOfMonth} 
🗒️ মাস : ${englishMonth}
📛 দিন: ${dayOfWeek}
🗓️ আশ্বিন: ${islamicDay} 
🕌 রবিউস সানি: ${islamicMonth} 
🕒 সময়: ${time}
✢━━━━━━━━━━━━━━━✢
${originalMessage}
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ ─𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭`;
};

module.exports.onLoad = ({ api }) => {
    setInterval(() => {
        const now = new Date(Date.now() + 21600000); // GMT+6
        const day = now.getDay();
        const formattedTime = now.toLocaleTimeString('en-US', { hour12: true });

        const timeData = messages.find(m => m.timer === formattedTime);
        if (timeData) {
            const messageToSend = getMessageForTime(formattedTime, day);
            if (messageToSend) {
                const formattedText = formatMessage(messageToSend, timeData.period, formattedTime);
                global.data.allThreadID.forEach(threadID => {
                    api.sendMessage(formattedText, threadID);
                });
            }
        }
    }, 60000); // প্রতি মিনিটে চেক করা (1 সেকেন্ডের পরিবর্তে)
};

module.exports.run = () => {};
