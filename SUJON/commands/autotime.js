module.exports.config = {
  name: "autotime",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Evo",
  description: "Show Islamic & English time info",
  commandCategory: "Utility",
  usages: "autotime",
  cooldowns: 5
};

const DAY_NAMES_BN = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

const HIGRI_MONTHS_EN = [
  "Muharram","Safar","Rabi' al-awwal","Rabi' al-thani",
  "Jumada al-awwal","Jumada al-thani","Rajab","Sha'ban",
  "Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"
];

function pad(n){ return n < 10 ? '0' + n : '' + n; }

const ISLAMIC_EPOCH = 1948439.5;
function toJulianDay(dt){
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth() + 1;
  const day = dt.getUTCDate();
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y
           + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const seconds = dt.getUTCHours() * 3600 + dt.getUTCMinutes() * 60 + dt.getUTCSeconds();
  return jd + seconds / 86400;
}

function islamicToJD(day, month, year){
  return day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    ISLAMIC_EPOCH - 1;
}

function gregorianToHijri(date){
  const jd = Math.floor(toJulianDay(date)) + 0.5;
  const days = jd - ISLAMIC_EPOCH;
  const year = Math.floor((30 * days + 10646) / 10631);
  let month = Math.ceil((jd - islamicToJD(1,1,year) + 1) / 29.5);
  if(month <= 0) month = 1;
  if(month > 12) month = 12;
  let monthStart = islamicToJD(1, month, year);
  while (monthStart > jd){
    month--;
    monthStart = islamicToJD(1, month, year);
  }
  let day = Math.floor(jd - monthStart + 1);
  return { day, month, year };
}

function format12Hour(date){
  let h = date.getHours();
  const m = date.getMinutes();
  const suffix = h >= 12 ? "PM" : "AM";
  let hh = h % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${pad(m)} ${suffix}`;
}

function buildTimeMessage(){
  const d = new Date();
  const dayBn = DAY_NAMES_BN[d.getDay()];
  const engMonth = d.toLocaleString('en-US', { month: 'long' });
  const gregorianDate = d.getDate();
  const timeStr = format12Hour(d);
  const hijri = gregorianToHijri(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
  const hijriDay = hijri.day;

  const pronunciation = "রাববানাগু ফিরলি ওয়ালি ওয়ালিদাইয়া, ওয়ালিলি মুমিনিনা ইয়াওয়া ইয়াকুমুল";
  const meaning = "অর্থ: হে আমাদের প্রতিপালক! রোজ কেয়ামতে আমাকে, আমার পিতা-মাতা ও সকল মুমিনকে ক্ষমা করুন। (সূরা ইবরাহীম: ৪১)";

  return (
`======= TIME =======

📅 ইংরেজি তারিখ: ${gregorianDate}
🗓️ মাস : ${engMonth}
🔴 দিন: ${dayBn}
📕 আশ্বিন: ৬
🕌 রবিউল আউয়াল: ${hijriDay}
⏰ সময়: ${timeStr}

উচ্চারণ:- ${pronunciation}

★✦★ ---------------------- ✦★★

${meaning}

Creator —-> Islamick Chat`
  );
}

module.exports.run = async function({ api, event }) {
  return api.sendMessage(buildTimeMessage(), event.threadID, event.messageID);
};
