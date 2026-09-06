const fa = {
  navigation: {
    dashboard: "داشبورد",
    tasks: "کارهای امروز",
    trading: "ژورنال ترید",
    markets: "بازارها",
    music: "موسیقی",
    ai: "دستیار هوش مصنوعی",
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

    appearance: "ظاهر",
    application: "برنامه",
    music: "موسیقی",
    markets: "بازارها",
    trading: "ترید",
    ai: "هوش مصنوعی",
    data: "داده‌ها",
    about: "درباره",

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
      local: "محلی",
      utc: "UTC",
    },
  },

  tasks: {
    title: "کارهای امروز",
    subtitle: "کارهای روزانه خود را مدیریت کنید",

    all: "همه",
    active: "باقی‌مانده",
    completed: "انجام‌شده",

    addTask: "افزودن کار",
    addTaskPlaceholder: "کار جدید را وارد کنید...",

    progress: "پیشرفت امروز",
    completedCount: "انجام شده",
    remainingCount: "باقی‌مانده",

    calendar: {
      previousMonth: "ماه قبل",
      nextMonth: "ماه بعد",
      today: "امروز",

      weekdays: [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
      ],
    },

    tooltip: {
      officialHoliday: "تعطیل رسمی",
      tasksOfDay: "کارهای این روز",
      completed: "انجام شده",
      from: "از",
    },
  },

  sidebar: {
    online: "حالت آنلاین",
    offline: "حالت آفلاین",
    local: "محلی",
    utc: "UTC",
  },

  dashboard: {
    title: "داشبورد",
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
