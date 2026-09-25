export type Quote = {
  id: number;
  text: {
    fa: string;
    en: string;
  };
  author: {
    fa: string;
    en: string;
  };
};

export const QUOTES: Quote[] = [
  {
    id: 1,
    text: {
      fa: "آن‌که دلیل محکمی برای زیستن دارد، تقریباً با هر چگونه‌ای می‌تواند کنار بیاید.",
      en: "He who has a why to live can bear almost any how.",
    },
    author: { fa: "فریدریش نیچه", en: "Friedrich Nietzsche" },
  },
  {
    id: 2,
    text: {
      fa: "آن‌چه ما را نکشد، قوی‌ترمان می‌کند.",
      en: "What does not kill us makes us stronger.",
    },
    author: { fa: "فریدریش نیچه", en: "Friedrich Nietzsche" },
  },
  {
    id: 3,
    text: {
      fa: "اگر می‌خواهی به اوج برسی، از فرود آمدن نترس.",
      en: "If you want to reach the heights, do not be afraid of falling.",
    },
    author: { fa: "فریدریش نیچه", en: "Friedrich Nietzsche" },
  },
  {
    id: 4,
    text: {
      fa: "آن‌که با هیولاها می‌جنگد باید مراقب باشد که خودش هیولا نشود.",
      en: "Whoever fights monsters should see to it that he does not become a monster.",
    },
    author: { fa: "فریدریش نیچه", en: "Friedrich Nietzsche" },
  },
  {
    id: 5,
    text: {
      fa: "بدون موسیقی، زندگی یک اشتباه است.",
      en: "Without music, life would be a mistake.",
    },
    author: { fa: "فریدریش نیچه", en: "Friedrich Nietzsche" },
  },
  {
    id: 6,
    text: {
      fa: "اگر انرژی‌ات را روی چیزهای درست متمرکز کنی، می‌توانی هر چیزی را تغییر دهی.",
      en: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
    },
    author: { fa: "نیکولا تسلا", en: "Nikola Tesla" },
  },
  {
    id: 7,
    text: {
      fa: "ایده‌های بزرگ از ذهن‌های آرام بیرون می‌آیند، نه از شلوغی.",
      en: "Great ideas come from quiet minds, not from chaos.",
    },
    author: { fa: "نیکولا تسلا", en: "Nikola Tesla" },
  },
  {
    id: 8,
    text: {
      fa: "زمانی که تمرکز کنی، جهان با تو هم‌صدا می‌شود.",
      en: "When you focus, the universe aligns with you.",
    },
    author: { fa: "نیکولا تسلا", en: "Nikola Tesla" },
  },
  {
    id: 9,
    text: {
      fa: "من نمی‌خواهم ثروت جمع کنم. می‌خواهم ایده‌هایم دنیا را تغییر دهند.",
      en: "I don't care that they stole my idea. I care that they don't have any of their own.",
    },
    author: { fa: "نیکولا تسلا", en: "Nikola Tesla" },
  },
  {
    id: 10,
    text: {
      fa: "آینده متعلق به کسانی است که به زیبایی رویاهایشان ایمان دارند.",
      en: "The future belongs to those who believe in the beauty of their dreams.",
    },
    author: { fa: "النور روزولت", en: "Eleanor Roosevelt" },
  },
  {
    id: 11,
    text: {
      fa: "راز پیشرفت این است که شروع کنی.",
      en: "The secret of getting ahead is getting started.",
    },
    author: { fa: "مارک تواین", en: "Mark Twain" },
  },
  {
    id: 12,
    text: {
      fa: "اگر بتوانی رویایت را تصور کنی، می‌توانی آن را محقق کنی.",
      en: "If you can dream it, you can do it.",
    },
    author: { fa: "والت دیزنی", en: "Walt Disney" },
  },
  {
    id: 13,
    text: {
      fa: "موفقیت مجموع تلاش‌های کوچک است که هر روز تکرار می‌شوند.",
      en: "Success is the sum of small efforts repeated day in and day out.",
    },
    author: { fa: "رابرت کالیر", en: "Robert Collier" },
  },
  {
    id: 14,
    text: {
      fa: "تنها راه انجام کارهای بزرگ، عشق به آن کار است.",
      en: "The only way to do great work is to love what you do.",
    },
    author: { fa: "استیو جابز", en: "Steve Jobs" },
  },
  {
    id: 15,
    text: {
      fa: "من شکست نخوردم. فقط ۱۰ هزار راه پیدا کردم که کار نمی‌کند.",
      en: "I have not failed. I've just found 10,000 ways that won't work.",
    },
    author: { fa: "توماس ادیسون", en: "Thomas Edison" },
  },
  {
    id: 16,
    text: {
      fa: "نظم، پل بین اهداف و دستاوردهاست.",
      en: "Discipline is the bridge between goals and accomplishment.",
    },
    author: { fa: "جیم ران", en: "Jim Rohn" },
  },
  {
    id: 17,
    text: {
      fa: "موفقیت یک سفر است، نه مقصد.",
      en: "Success is a journey, not a destination.",
    },
    author: { fa: "آرتور اش", en: "Arthur Ashe" },
  },
  {
    id: 18,
    text: {
      fa: "اگر منتظر لحظه مناسب بمانی، ممکن است هرگز شروع نکنی.",
      en: "If you wait for the perfect moment, you may never begin.",
    },
    author: { fa: "جان وودن", en: "John Wooden" },
  },
  {
    id: 19,
    text: {
      fa: "بزرگ‌ترین خطر در زندگی این است که ریسک نکنی.",
      en: "The biggest risk is not taking any risk.",
    },
    author: { fa: "مارک زاکربرگ", en: "Mark Zuckerberg" },
  },
  {
    id: 20,
    text: {
      fa: "تنها محدودیت‌های واقعی، آن‌هایی هستند که در ذهن خودت می‌سازی.",
      en: "The only real limitations are the ones you place on yourself.",
    },
    author: { fa: "وین دایر", en: "Wayne Dyer" },
  },
  {
    id: 21,
    text: {
      fa: "بهترین زمان برای کاشتن درخت ۲۰ سال پیش بود. دومین بهترین زمان، همین الان است.",
      en: "The best time to plant a tree was 20 years ago. The second best time is now.",
    },
    author: { fa: "ضرب‌المثل چینی", en: "Chinese Proverb" },
  },
  {
    id: 22,
    text: {
      fa: "هر روز یک فرصت جدید برای بهتر شدن است.",
      en: "Every day is a new opportunity to become better.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 23,
    text: {
      fa: "ترس را احساس کن و با این حال انجامش بده.",
      en: "Feel the fear and do it anyway.",
    },
    author: { fa: "سوزان جفرز", en: "Susan Jeffers" },
  },
  {
    id: 24,
    text: {
      fa: "آن‌چه فکر می‌کنی، به آن تبدیل می‌شوی.",
      en: "What you think, you become.",
    },
    author: { fa: "بودا", en: "Buddha" },
  },
  {
    id: 25,
    text: {
      fa: "آرامش در پذیرش چیزهایی است که نمی‌توانی تغییر دهی.",
      en: "Peace lies in accepting what you cannot change.",
    },
    author: { fa: "اپیکتتوس", en: "Epictetus" },
  },
  {
    id: 26,
    text: {
      fa: "سعادت در این نیست که داشته باشی، بلکه در این است که باشی.",
      en: "Happiness is not in having, but in being.",
    },
    author: { fa: "سقراط", en: "Socrates" },
  },
  {
    id: 27,
    text: {
      fa: "دانستن کافی نیست، باید عمل کرد.",
      en: "Knowing is not enough; we must apply.",
    },
    author: { fa: "یوهان ولفگانگ فون گوته", en: "Johann Wolfgang von Goethe" },
  },
  {
    id: 28,
    text: {
      fa: "بزرگ‌ترین افتخار در این نیست که هرگز نیفتی، بلکه در این است که هر بار بلند شوی.",
      en: "Our greatest glory is not in never falling, but in rising every time we fall.",
    },
    author: { fa: "کنفوسیوس", en: "Confucius" },
  },
  {
    id: 29,
    text: {
      fa: "زندگی ۱۰ درصد آن چیزی است که برایت اتفاق می‌افتد و ۹۰ درصد نحوه‌ی واکنش تو به آن.",
      en: "Life is 10% what happens to you and 90% how you react to it.",
    },
    author: { fa: "چارلز آر. سیندول", en: "Charles R. Swindoll" },
  },
  {
    id: 30,
    text: {
      fa: "اگر می‌خواهی چیزهای بزرگ بسازی، باید چیزهای کوچک را دوست بداری.",
      en: "If you want to build great things, you must love the small ones.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 31,
    text: {
      fa: "تمرکز کن. ساده‌سازی کن. اولویت‌بندی کن.",
      en: "Focus. Simplify. Prioritize.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 32,
    text: {
      fa: "هیچ‌کس نمی‌تواند تو را بدون اجازه‌ات کوچک کند.",
      en: "No one can make you feel inferior without your consent.",
    },
    author: { fa: "النور روزولت", en: "Eleanor Roosevelt" },
  },
  {
    id: 33,
    text: {
      fa: "آینده را پیش‌بینی نکن، آن را بساز.",
      en: "The best way to predict the future is to create it.",
    },
    author: { fa: "پیتر دراکر", en: "Peter Drucker" },
  },
  {
    id: 34,
    text: {
      fa: "موفقیت نهایی نیست، شکست هم کشنده نیست. شجاعت ادامه دادن است که اهمیت دارد.",
      en: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    },
    author: { fa: "وینستون چرچیل", en: "Winston Churchill" },
  },
  {
    id: 35,
    text: {
      fa: "آن‌که هرگز اشتباه نکرده، هرگز چیز جدیدی امتحان نکرده است.",
      en: "Anyone who has never made a mistake has never tried anything new.",
    },
    author: { fa: "آلبرت اینشتین", en: "Albert Einstein" },
  },
  {
    id: 36,
    text: {
      fa: "تخیل مهم‌تر از دانش است.",
      en: "Imagination is more important than knowledge.",
    },
    author: { fa: "آلبرت اینشتین", en: "Albert Einstein" },
  },
  {
    id: 37,
    text: {
      fa: "سعی کن نه انسان موفقی، بلکه انسان باارزشی باشی.",
      en: "Try not to become a man of success, but rather try to become a man of value.",
    },
    author: { fa: "آلبرت اینشتین", en: "Albert Einstein" },
  },
  {
    id: 38,
    text: {
      fa: "تنها چیزی که برای پیروزی شر لازم است، این است که انسان‌های خوب هیچ کاری نکنند.",
      en: "The only thing necessary for the triumph of evil is for good men to do nothing.",
    },
    author: { fa: "ادموند برک", en: "Edmund Burke" },
  },
  {
    id: 39,
    text: {
      fa: "اگر می‌خواهی بروی، برو. اگر می‌خواهی بمانی، بمان. فقط تصمیم بگیر.",
      en: "If you want to go, go. If you want to stay, stay. Just decide.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 40,
    text: {
      fa: "هر روز صبح دو انتخاب داری: ادامه دادن به خواب دیدن یا بلند شدن و دنبال کردن رویاهایت.",
      en: "Every morning you have two choices: continue dreaming or get up and chase your dreams.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 41,
    text: {
      fa: "سخت‌ترین بخش شروع کردن، تصمیم گرفتن برای شروع است.",
      en: "The hardest part of getting started is deciding to start.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 42,
    text: {
      fa: "نظم از انگیزه قوی‌تر است. انگیزه می‌آید و می‌رود، نظم می‌ماند.",
      en: "Discipline is stronger than motivation. Motivation comes and goes, discipline stays.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 43,
    text: {
      fa: "تو مجبور نیستی کامل باشی، فقط باید شروع کنی.",
      en: "You don't have to be perfect, you just have to start.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 44,
    text: {
      fa: "کوچک بودن امروز، به معنای کوچک ماندن فردا نیست.",
      en: "Being small today does not mean staying small tomorrow.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 45,
    text: {
      fa: "هر معامله یک درس است، نه فقط یک عدد.",
      en: "Every trade is a lesson, not just a number.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 46,
    text: {
      fa: "بازار به احساسات تو اهمیت نمی‌دهد. فقط به نظم تو اهمیت می‌دهد.",
      en: "The market doesn't care about your emotions. It only cares about your discipline.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 47,
    text: {
      fa: "ضرر بخشی از بازی است. اجتناب از درس گرفتن از آن، شکست واقعی است.",
      en: "Loss is part of the game. Avoiding the lesson is the real failure.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 48,
    text: {
      fa: "صبوری در ترید، همان چیزی است که بیشتر تریدرها ندارند.",
      en: "Patience in trading is what most traders lack.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 49,
    text: {
      fa: "ریسک را مدیریت کن، نه سود را.",
      en: "Manage risk, not profit.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 50,
    text: {
      fa: "یک پلن خوب بدون اجرا، هیچ ارزشی ندارد.",
      en: "A good plan without execution has no value.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 51,
    text: {
      fa: "ذهن آرام، تصمیم‌های بهتری می‌گیرد.",
      en: "A calm mind makes better decisions.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 52,
    text: {
      fa: "وقتی همه عجله دارند، تو صبر کن.",
      en: "When everyone is rushing, you wait.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 53,
    text: {
      fa: "موفقیت در ترید از کنترل خودت شروع می‌شود، نه از پیش‌بینی بازار.",
      en: "Success in trading starts with self-control, not market prediction.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 54,
    text: {
      fa: "هر روز یک قدم کوچک بردار. بعد از یک سال، مسیر درازی آمده‌ای.",
      en: "Take one small step every day. After a year, you will have come a long way.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 55,
    text: {
      fa: "ترس از دست دادن فرصت، بیشتر از خود فرصت خطرناک است.",
      en: "The fear of missing out is more dangerous than the opportunity itself.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 56,
    text: {
      fa: "یاد بگیر که نه بگویی. به معاملات بد، به عجله، به احساسات.",
      en: "Learn to say no. To bad trades, to haste, to emotions.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 57,
    text: {
      fa: "ژورنال نوشتن، آینه‌ی واقعی عملکرد توست.",
      en: "Journaling is the real mirror of your performance.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 58,
    text: {
      fa: "اگر دلیل ورودت را ننویسی، دلیل خروجت را هم نخواهی فهمید.",
      en: "If you don't write down your entry reason, you won't understand your exit either.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 59,
    text: {
      fa: "بازار همیشه فرصت می‌دهد. عجله نکن.",
      en: "The market always gives opportunities. Don't rush.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 60,
    text: {
      fa: "بهترین تریدرها کسانی هستند که کمتر معامله می‌کنند، اما بهتر.",
      en: "The best traders are those who trade less, but better.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 61,
    text: {
      fa: "احساسات را بشناس، اما اجازه نده تصمیم بگیرند.",
      en: "Recognize your emotions, but don't let them decide.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 62,
    text: {
      fa: "شکست در یک معامله، شکست در زندگی نیست.",
      en: "A losing trade is not a failure in life.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 63,
    text: {
      fa: "تمرکز روی فرآیند، نه نتیجه.",
      en: "Focus on the process, not the outcome.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 64,
    text: {
      fa: "هر روز که نظم را رعایت کنی، یک قدم به آزادی نزدیک‌تر می‌شوی.",
      en: "Every day you stay disciplined, you get one step closer to freedom.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 65,
    text: {
      fa: "آزادی واقعی زمانی می‌آید که به سیستم خودت وابسته باشی، نه به شانس.",
      en: "True freedom comes when you rely on your system, not on luck.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 66,
    text: {
      fa: "یاد بگیر که در سکوت صبر کنی. فرصت‌های خوب با سروصدا نمی‌آیند.",
      en: "Learn to wait in silence. Good opportunities don't come with noise.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 67,
    text: {
      fa: "قدرتمندترین سلاح تو در بازار، توانایی نگه‌داشتن خودت است.",
      en: "Your most powerful weapon in the market is the ability to hold yourself back.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 68,
    text: {
      fa: "هیچ استراتژی بدون مدیریت ریسک کامل نیست.",
      en: "No strategy is complete without risk management.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 69,
    text: {
      fa: "موفقیت یک عادت است، نه یک اتفاق.",
      en: "Success is a habit, not an event.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 70,
    text: {
      fa: "هر بار که تسلیم نشوی، قوی‌تر می‌شوی.",
      en: "Every time you don't give up, you get stronger.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 71,
    text: {
      fa: "مسیر طولانی است. عجله نکن، اما متوقف هم نشو.",
      en: "The path is long. Don't rush, but don't stop either.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 72,
    text: {
      fa: "تو مسئول انتخاب‌هایت هستی، نه شرایط.",
      en: "You are responsible for your choices, not the circumstances.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 73,
    text: {
      fa: "وقتی خسته‌ای، استراحت کن. وقتی ناامید شدی، به یاد بیاور چرا شروع کردی.",
      en: "When you're tired, rest. When you're discouraged, remember why you started.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 74,
    text: {
      fa: "کوچک فکر کن، بزرگ عمل کن.",
      en: "Think small, act big.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 75,
    text: {
      fa: "هر روز یک نسخه‌ی بهتر از خودت بساز.",
      en: "Build a better version of yourself every day.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 76,
    text: {
      fa: "زمانی که تمرکز داشته باشی، حتی کارهای سخت آسان به نظر می‌رسند.",
      en: "When you have focus, even hard tasks seem easy.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 77,
    text: {
      fa: "موفقیت متعلق به کسانی است که حاضرند کارهایی را انجام دهند که دیگران حاضر نیستند.",
      en: "Success belongs to those willing to do what others are not.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 78,
    text: {
      fa: "از اشتباهاتت فرار نکن. آن‌ها را مطالعه کن.",
      en: "Don't run from your mistakes. Study them.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 79,
    text: {
      fa: "یک تصمیم خوب امروز، می‌تواند ماه‌ها زحمتت را نجات دهد.",
      en: "One good decision today can save months of effort.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 80,
    text: {
      fa: "صبر کن تا شرایط با تو هم‌خوان شود، نه اینکه تو با عجله شرایط را مجبور کنی.",
      en: "Wait for conditions to align with you, don't force them with haste.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 81,
    text: {
      fa: "ذهن قوی‌تر از هر استراتژی است.",
      en: "The mind is stronger than any strategy.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 82,
    text: {
      fa: "اگر امروز نظم نداشته باشی، فردا هم نخواهی داشت.",
      en: "If you don't have discipline today, you won't have it tomorrow either.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 83,
    text: {
      fa: "هر بار که به پلن خودت وفادار بمانی، اعتمادبه‌نفست بیشتر می‌شود.",
      en: "Every time you stay loyal to your plan, your confidence grows.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 84,
    text: {
      fa: "بازار معلم بی‌رحمی است. درس‌هایش را جدی بگیر.",
      en: "The market is a ruthless teacher. Take its lessons seriously.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 85,
    text: {
      fa: "عجله دشمن دقت است.",
      en: "Haste is the enemy of precision.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 86,
    text: {
      fa: "گاهی بهترین معامله، معامله‌ای است که انجام نمی‌دهی.",
      en: "Sometimes the best trade is the one you don't take.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 87,
    text: {
      fa: "کنترل خودت، اولین و آخرین مهارت است.",
      en: "Self-control is the first and last skill.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 88,
    text: {
      fa: "پیشرفت آهسته بهتر از توقف کامل است.",
      en: "Slow progress is better than a complete stop.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 89,
    text: {
      fa: "تو لازم نیست کامل باشی. فقط باید بهتر از دیروزت باشی.",
      en: "You don't have to be perfect. You just have to be better than yesterday.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 90,
    text: {
      fa: "هر روز که ژورنال بنویسی، یک قدم به خودآگاهی نزدیک‌تر می‌شوی.",
      en: "Every day you journal, you get one step closer to self-awareness.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 91,
    text: {
      fa: "موفقیت در سکوت ساخته می‌شود، نه در سروصدا.",
      en: "Success is built in silence, not in noise.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 92,
    text: {
      fa: "وقتی همه دنبال میانبر هستند، تو مسیر درست را برو.",
      en: "When everyone is looking for shortcuts, take the right path.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 93,
    text: {
      fa: "تمرکز روی چیزی که می‌توانی کنترل کنی.",
      en: "Focus on what you can control.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 94,
    text: {
      fa: "نتیجه را به خدا بسپار، فرآیند را به خودت.",
      en: "Leave the outcome to God, the process to yourself.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 95,
    text: {
      fa: "هر شکست، داده‌ای است برای تصمیم بهتر بعدی.",
      en: "Every failure is data for a better next decision.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 96,
    text: {
      fa: "آرامش در تصمیم‌گیری، نشانه‌ی حرفه‌ای بودن است.",
      en: "Calmness in decision-making is a sign of professionalism.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 97,
    text: {
      fa: "اگر نمی‌توانی احساساتت را کنترل کنی، بازار آن‌ها را کنترل خواهد کرد.",
      en: "If you can't control your emotions, the market will control them for you.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 98,
    text: {
      fa: "یک سیستم خوب + اجرای منظم = آزادی.",
      en: "A good system + consistent execution = freedom.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 99,
    text: {
      fa: "امروز را جدی بگیر. فردا نتیجه‌ی امروز است.",
      en: "Take today seriously. Tomorrow is the result of today.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
  {
    id: 100,
    text: {
      fa: "تو قوی‌تر از آن چیزی هستی که فکر می‌کنی. فقط کافی است ادامه بدهی.",
      en: "You are stronger than you think. You just need to keep going.",
    },
    author: { fa: "ناشناس", en: "Anonymous" },
  },
];
