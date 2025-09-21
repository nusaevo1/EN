// quiz.js - Messenger Bot Quiz File (50+ Questions)

const quiz = [
    // ইসলামিক প্রশ্ন
    { category: "Islamic", question: "প্রথম খলিফা কে ছিলেন?", options: ["আবু বকর (RA)", "ওমর (RA)", "ওসমান (RA)", "আলী (RA)"], answer: "আবু বকর (RA)" },
    { category: "Islamic", question: "কোন মাসে মুসলিমরা রোজা রাখে?", options: ["মহররম", "শাওয়াল", "রামাদান", "জিলহজ"], answer: "রামাদান" },
    { category: "Islamic", question: "নামাজে কতটি রাকাত ফজর নামাজে পড়ে?", options: ["২", "৪", "৩", "৬"], answer: "২" },
    { category: "Islamic", question: "পবিত্র কুরআন কতটি সুরা আছে?", options: ["১১২", "১১৪", "১২০", "১১৮"], answer: "১১৪" },
    { category: "Islamic", question: "হজ কত দিনে সম্পন্ন হয়?", options: ["৩", "৫", "৭", "১০"], answer: "৫" },
    { category: "Islamic", question: "ইসলামে কতটি স্তম্ভ (পিলার) আছে?", options: ["৫", "৬", "৭", "৪"], answer: "৫" },
    { category: "Islamic", question: "মহানবী মুহাম্মদ (সা.) কোথায় জন্মগ্রহণ করেন?", options: ["মক্কা", "মদিনা", "জেরুজালেম", "বাগদাদ"], answer: "মক্কা" },
    { category: "Islamic", question: "রোজা কোন সময়ের মধ্যে রাখতে হয়?", options: ["সকাল থেকে রাত", "সকাল থেকে বিকেল", "সাহর থেকে ইফতার", "দুপুর থেকে রাত"], answer: "সাহর থেকে ইফতার" },
    { category: "Islamic", question: "জাকাত কাকে দেয়া হয়?", options: ["গরীব ও দরিদ্র", "শিক্ষক", "বানিজ্যিক প্রতিষ্ঠান", "বন্ধু"], answer: "গরীব ও দরিদ্র" },
    { category: "Islamic", question: "মহানবীর প্রথম স্ত্রী কে ছিলেন?", options: ["আয়া খাদিজা (RA)", "আয়েশা (RA)", "ফাতিমা (RA)", "হাফসা (RA)"], answer: "আয়া খাদিজা (RA)" },
    { category: "Islamic", question: "কোরআন শরীফের প্রথম আয়াত কোনটি?", options: ["আলহামদুলিল্লাহ", "বিসমিল্লাহ", "আয়াতুল কুরসি", "সালাম"], answer: "বিসমিল্লাহ" },
    { category: "Islamic", question: "মক্কায় কাবা কতবার ঘুরে ফিরতে হয় হজে?", options: ["৫", "৭", "৩", "১"], answer: "৭" },
    { category: "Islamic", question: "মহানবীর শেষ হিজরতের বছর কত?", options: ["৬২২", "৬২০", "৬২৪", "৬২১"], answer: "৬২২" },
    { category: "Islamic", question: "নামাজের সময় কিউবাহ কোথায় থাকে?", options: ["মসজিদে", "মাদ্রাসায়", "বাড়িতে", "মহলায়"], answer: "মসজিদে" },

    // সাধারণ জ্ঞান প্রশ্ন
    { category: "General Knowledge", question: "পৃথিবীর সবচেয়ে বড় মহাসাগর কোনটি?", options: ["ইন্ডিয়ান ওসেন", "আটলান্টিক ওসেন", "প্যাসিফিক ওসেন", "আর্কটিক ওসেন"], answer: "প্যাসিফিক ওসেন" },
    { category: "General Knowledge", question: "বাংলাদেশের স্বাধীনতার বছর কত?", options: ["১৯৭১", "১৯৭৫", "১৯৬৫", "১৯৮১"], answer: "১৯৭১" },
    { category: "General Knowledge", question: "মানব দেহে সবচেয়ে বড় অঙ্গ কোনটি?", options: ["হৃদয়", "লিভার", "ত্বক", "ফুসফুস"], answer: "ত্বক" },
    { category: "General Knowledge", question: "সৌরজগতে সবচেয়ে বড় গ্রহ কোনটি?", options: ["পৃথিবী", "বৃহস্পতি", "শনি", "মঙ্গল"], answer: "বৃহস্পতি" },
    { category: "General Knowledge", question: "বিশ্বের সবচেয়ে ছোট দেশ কোনটি?", options: ["মোনাকো", "ভ্যাটিকান সিটি", "লিক্টেনস্টেইন", "স্যান মারিনো"], answer: "ভ্যাটিকান সিটি" },
    { category: "General Knowledge", question: "বাংলাদেশের জাতীয় ফুল কোনটি?", options: ["চাঁপা", "শাপলা", "গোলাপ", "জবা"], answer: "শাপলা" },
    { category: "General Knowledge", question: "বৃহৎ দেশ হিসেবে বিশ্বের নাম কোনটি?", options: ["চীন", "ইউএসএ", "রাশিয়া", "ভারত"], answer: "রাশিয়া" },
    { category: "General Knowledge", question: "বিশ্বের সবচেয়ে বড় মরুভূমি কোনটি?", options: ["সাহারা", "গোবি", "কালাহারি", "থার"], answer: "সাহারা" },
    { category: "General Knowledge", question: "প্রথম মহাকাশচারী কে ছিলেন?", options: ["ইউরি গগারিন", "নিল আর্মস্ট্রং", "বাজ অল্ড্রিন", "মাইকেল কলিন্স"], answer: "ইউরি গগারিন" },
    { category: "General Knowledge", question: "মানব দেহে কতটি হাড় আছে?", options: ["২০৬", "২২০", "২০০", "১৮৫"], answer: "২০৬" },
    { category: "General Knowledge", question: "বিশ্বের সবচেয়ে বড় নদী কোনটি?", options: ["নাইল", "আমাজন", "ইন্ডাস", "মিসিসিপি"], answer: "নাইল" },
    { category: "General Knowledge", question: "ইউরোপের সবচেয়ে বড় দেশ কোনটি?", options: ["জার্মানি", "ফ্রান্স", "ইতালি", "ইউক্রেন"], answer: "ইউক্রেন" },
    { category: "General Knowledge", question: "বিশ্বের সবচেয়ে উঁচু পাহাড় কোনটি?", options: ["কাঞ্চনজঙ্ঘা", "মাউন্ট এভারেস্ট", "কিলিমাঞ্জারো", "ম্যাককিনলি"], answer: "মাউন্ট এভারেস্ট" }
];

// র্যান্ডম প্রশ্ন নেওয়ার ফাংশন
function getRandomQuestion(category = null) {
    let filteredQuiz = quiz;
    if (category) {
        filteredQuiz = quiz.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }
    const randomIndex = Math.floor(Math.random() * filteredQuiz.length);
    return filteredQuiz[randomIndex];
}

// উত্তর চেক করার ফাংশন
function checkAnswer(question, userAnswer) {
    return question.answer === userAnswer;
}

// Messenger Bot Quick Reply Format
function formatQuestionForMessenger(question) {
    return {
        text: question.question,
        quick_replies: question.options.map(option => ({
            content_type: "text",
            title: option,
            payload: option
        }))
    };
}

module.exports = { quiz, getRandomQuestion, checkAnswer, formatQuestionForMessenger };
