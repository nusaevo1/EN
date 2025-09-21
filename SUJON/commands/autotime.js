module.exports.config = {
  name: "autotime",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Evo",
  description: "Send Islamic & English time info at the start of every hour with random Islamic quotes to all threads",
  commandCategory: "Utility",
  usages: "autotime",
  cooldowns: 5
};

const DAY_NAMES_BN = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

const ISLAMIC_EPOCH = 1948439.5;

const ISLAMIC_QUOTES = [
  { 
    pronunciation: "রাববানাগু ফিরলি ওয়ালি ওয়ালিদাইয়া, ওয়ালিলি মুমিনিনা ইয়াওয়া ইয়াকুমুল",
    meaning: "অর্থ: হে আমাদের প্রতিপালক! রোজ কেয়ামতে আমাকে, আমার পিতা-মাতা ও সকল মুমিনকে ক্ষমা করুন। (সূরা ইবরাহীম: ৪১)"
  },
  {
    pronunciation: "ইন্নাল্লাহা মা'আস সাবিরীন",
    meaning: "অর্থ: নিশ্চয় আল্লাহ ধৈর্যশীলদের সঙ্গে আছেন। (সূরা বাকারা: ১৫০)"
  },
  {
    pronunciation: "আউযুবিল্লাহি মিনাশ শয়তানির রাজীম",
    meaning: "অর্থ: আমি প্রলুব্ধ শয়তান থেকে আল্লাহর কাছে আশ্রয় চাই।"
  },
  {
    pronunciation: "রাব্বানা আজরনী বিল কাওমিল যাযিলীন",
    meaning: "অর্থ: হে আমাদের প্রতিপালক! আমাকে জালিম জনগোষ্ঠীর সঙ্গে মোকাবিলা করার শক্তি দাও।"
  },
  {
    pronunciation: "রাব্বানা লা তুজারনা ইল্লা আসমা'তা",
    meaning: "অর্থ: হে আমাদের প্রতিপালক! আমাদের ভুলত্রুটি ক্ষমা কর এবং আমাদের উত্তম পথে চালিত কর।"
  }
];

function getRandomIslamicQuote() {
  return ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
}

function pad(n){ return n < 10 ? '0' + n : '' + n; }

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

  const quote = getRandomIslamicQuote();

  return (
`======= TIME =======

📅 ইংরেজি তারিখ: ${gregorianDate}
🗓️ মাস : ${engMonth}
🔴 দিন: ${dayBn}
📕 আশ্বিন: ৬
🕌 রবিউল আউয়াল: ${hijriDay}
⏰ সময়: ${timeStr}

উচ্চারণ:- ${quote.pronunciation}

★✦★ ---------------------- ✦★★

${quote.meaning}

Creator —-> ─꯭─⃝‌‌𝐄𝐛𝐫𝐚𝐡𝐢𝐦 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭`
  );
}

module.exports.run = async function({ api }) {
  if (!global.autotimeAllInterval) {
    const sendHourlyMessage = async () => {
      try {
        const threads = await api.getThreadList(100, null, []);
        for (const t of threads) {
          api.sendMessage(buildTimeMessage(), t.threadID);
        }
      } catch (e) {
        console.error("Autotime Error: ", e);
      }
    };

    // প্রথমবারের জন্য সঠিক সময়ে পাঠানো
    const now = new Date();
    const delay = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;
    setTimeout(() => {
      sendHourlyMessage(); // ঘন্টার শুরুতে পাঠাবে
      global.autotimeAllInterval = setInterval(sendHourlyMessage, 60 * 60 * 1000); // প্রতি ঘন্টায়
    }, delay);

    console.log("Autotime started: Messages will be sent at the start of every hour with random Islamic quotes.");
  }
};
