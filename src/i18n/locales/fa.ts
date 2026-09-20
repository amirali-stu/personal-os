const fa = {
  navigation: {
    dashboard: "داشبورد",
    tasks: "کارهای امروز",
    trading: "ژورنال ترید",
    markets: "بازارها",
    music: "موسیقی",
    ai: "دستیار هوش مصنوعی",
    workspace: "محیط کار",
    settings: "تنظیمات",
  },

  common: {
    today: "امروز",
    save: "ذخیره",
    cancel: "لغو",
    delete: "حذف",
    edit: "ویرایش",
    add: "افزودن",
    close: "بستن",
    reset: "بازنشانی",
    confirm: "تأیید",
    loading: "در حال بارگذاری...",
    enabled: "فعال",
    disabled: "غیرفعال",
    online: "آنلاین",
    offline: "آفلاین",
    local: "محلی",
    utc: "UTC",
  },

  settings: {
    title: "تنظیمات",
    subtitle: "تنظیمات برنامه و شخصی‌سازی",

    appearance: {
      title: "ظاهر",
      description: "ظاهر و نحوه نمایش برنامه را تنظیم کنید",

      darkMode: {
        label: "حالت تاریک",
        description: "استفاده از رابط کاربری تیره",
      },

      accentColor: {
        label: "رنگ اصلی",
        description: "رنگ اصلی رابط کاربری را انتخاب کنید",
        purple: "بنفش الکتریکی",
        blue: "آبی تکنولوژیک",
        emerald: "سبز زمردی",
        amber: "کهربایی",
        rose: "رز",
      },

      displayMode: {
        label: "حالت نمایش",
        description: "حالت نمایش فشرده یا استاندارد را انتخاب کنید",
        standard: "استاندارد",
        compact: "فشرده",
      },
    },

    application: {
      title: "برنامه",
      description: "تنظیمات عمومی Personal OS",

      language: {
        label: "زبان",
        description: "زبان رابط کاربری برنامه",
        fa: "فارسی",
        en: "English",
      },

      dateFormat: {
        label: "فرمت تاریخ",
        description: "نحوه نمایش تاریخ در برنامه",
        jalali: "شمسی",
        gregorian: "میلادی",
      },

      timezone: {
        label: "منطقه زمانی",
        description: "منطقه زمانی مورد استفاده برنامه",
        local: "زمان محلی دستگاه",
        utc: "UTC",
      },
    },

    music: {
      title: "موسیقی",
      description: "تنظیمات پخش موسیقی",

      autoPlay: {
        label: "پخش خودکار",
        description: "بعد از انتخاب آهنگ، پخش به‌صورت خودکار شروع شود",
      },

      defaultSpeed: {
        label: "سرعت پیش‌فرض پخش",
        description: "سرعت اولیه پخش آهنگ‌ها",
      },
    },

    markets: {
      title: "بازار",
      description: "تنظیمات مربوط به قیمت‌ها و بازار",

      autoUpdate: {
        label: "بروزرسانی خودکار",
        description: "دریافت خودکار آخرین قیمت‌های بازار",
      },

      currency: {
        label: "واحد پول",
        description: "واحد نمایش قیمت‌های داخلی",
        toman: "تومان",
        rial: "ریال",
      },
    },

    trading: {
      title: "ترید",
      description: "تنظیمات مربوط به ژورنال معاملاتی",

      tradeLimit: {
        label: "حداکثر معاملات روزانه",
        description: "حداکثر تعداد معاملات مجاز در هر روز",
      },

      trade: "{{count}} معامله",
      trades: "{{count}} معامله",
    },

    ai: {
      title: "هوش مصنوعی",
      description: "تنظیمات دستیار هوشمند",

      localOnly: {
        label: "فقط محلی",
        description: "استفاده فقط از مدل‌های هوش مصنوعی محلی",
      },

      model: {
        label: "مدل پیش‌فرض",
        description: "مدل مورد استفاده دستیار هوشمند",
        local: "مدل Local",
        cloud: "مدل Cloud",
      },
    },

    data: {
      title: "داده‌ها",
      description: "مدیریت اطلاعات ذخیره‌شده در برنامه",

      export: {
        label: "خروجی گرفتن از داده‌ها",
        description: "دریافت یک نسخه پشتیبان از اطلاعات Personal OS",
      },

      import: {
        label: "وارد کردن داده‌ها",
        description: "بازیابی اطلاعات از یک فایل پشتیبان",
      },

      delete: {
        label: "حذف تمام داده‌ها",
        description: "تمام اطلاعات ذخیره‌شده از این دستگاه حذف خواهد شد",
      },
    },

    about: {
      title: "درباره",
      name: "Personal OS",
      description: "سیستم شخصی مدیریت زندگی، ترید، موسیقی و AI",
      version: "نسخه اولیه رابط کاربری",
    },
  },

  tasks: {
    dailyPlan: "برنامه روزانه",
    todayTitle: "کارهای امروز",
    selectedDayTitle: "کارهای روز انتخاب‌شده",
    subtitle: "کارهای روزانه‌ات را مدیریت و پیگیری کن.",
    newTaskPlaceholder: "کار جدید را وارد کن...",
    addTask: "افزودن کار",
    todayProgress: "پیشرفت امروز",
    ofTasks: "از {{count}} کار",
    todayList: "لیست کارهای امروز",
    selectedDayList: "لیست کارهای این روز",
    empty: "کاری در این بخش وجود ندارد.",
    completeTask: "انجام کار",
    restoreTask: "بازگرداندن کار",
    deleteTask: "حذف کار",

    filters: {
      all: "همه",
      active: "باقی‌مانده",
      completed: "انجام‌شده",
    },

    calendar: {
      title: "تقویم تسک‌ها",
      subtitle: "وضعیت کارها در طول ماه",
      previousMonth: "ماه قبل",
      nextMonth: "ماه بعد",
      today: "امروز",
      officialHoliday: "تعطیل رسمی",
      holidayShort: "تعطیل",
      hoverHoliday: "برای مشاهده علت تعطیلی روی روز هاور کن",
      completed: "انجام شده",
      remaining: "باقی‌مانده",
      hoverDetails: "برای مشاهده جزئیات روی روز هاور کن",

      weekdays: {
        saturday: "شنبه",
        sunday: "یکشنبه",
        monday: "دوشنبه",
        tuesday: "سه‌شنبه",
        wednesday: "چهارشنبه",
        thursday: "پنجشنبه",
        friday: "جمعه",
      },
    },

    tooltip: {
      title: "کارهای این روز",
      completedCount: "{{completed}} از {{total}} انجام شده",
    },
  },

  sidebar: {
    personalSpace: "فضای شخصی شما",
    me: "من",
    online: "حالت آنلاین",
    offline: "حالت آفلاین",
    local: "محلی",
    utc: "UTC",
  },

  dashboard: {
    title: "داشبورد",
    subtitle: "نمای کلی از وضعیت امروزت",

    systemStatus: "وضعیت سیستم",

    stats: {
      todayTasks: "کارهای امروز",
      noTasks: "هنوز کاری ثبت نشده",
      remainingTasks: "{{count}} کار باقی مانده",
      tradingPerformance: "عملکرد ترید",
      tradesRecorded: "{{count}} معامله ثبت شده",
      tradeStatus: "وضعیت معاملات",
      tradeCount: "{{count}} معامله",
      successFailure: "{{success}} موفق • {{failed}} ناموفق",
    },

    markets: {
      title: "بازارهای منتخب",
      subtitle: "نمای سریع بازار",
      updating: "در حال بروزرسانی...",
      online: "داده آنلاین",
      cached: "داده ذخیره‌شده",
      unavailable: "اطلاعات بازار در دسترس نیست",
    },

    tasks: {
      title: "آخرین تسک‌ها",
      subtitle: "۵ تسک آخر ثبت‌شده",
      progress: "{{completed}} از {{total}} کار امروز",
      empty: "هنوز کاری ثبت نشده",
    },

    activity: {
      title: "فعالیت‌های اخیر",
      subtitle: "آخرین فعالیت‌های ثبت‌شده",
      empty: "هنوز فعالیتی ثبت نشده",
      tradeRecorded: "ثبت معامله {{symbol}}",
      profit: "سود {{value}}",
      loss: "زیان {{value}}",
      noProfitLoss: "معامله بدون سود یا زیان",
      taskCompleted: "تکمیل کار روزانه",
      newTask: "کار جدید",
    },
  },

  trading: {
    title: "ژورنال ترید",
  },

  markets: {
    title: "بازارها",
  },

  music: {
    title: "موسیقی",
  },

  ai: {
    title: "دستیار هوش مصنوعی",
  },
} as const;

export default fa;
