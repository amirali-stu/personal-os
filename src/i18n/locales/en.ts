const en = {
  navigation: {
    dashboard: "Dashboard",
    tasks: "Today's Tasks",
    trading: "Trading Journal",
    markets: "Markets",
    music: "Music",
    ai: "AI Assistant",
    settings: "Settings",
  },

  common: {
    today: "Today",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    reset: "Reset",
    confirm: "Confirm",
    loading: "Loading...",
    enabled: "Enabled",
    disabled: "Disabled",
    online: "Online",
    offline: "Offline",
    local: "Local",
    utc: "UTC",
  },

  settings: {
    title: "Settings",
    subtitle: "Application settings and personalization",

    appearance: "Appearance",
    application: "Application",
    music: "Music",
    markets: "Markets",
    trading: "Trading",
    ai: "Artificial Intelligence",
    data: "Data",
    about: "About",

    language: {
      label: "Language",
      description: "Application interface language",
      fa: "فارسی",
      en: "English",
    },

    dateFormat: {
      label: "Date Format",
      description: "How dates are displayed throughout the application",
      jalali: "Jalali",
      gregorian: "Gregorian",
    },

    timezone: {
      label: "Timezone",
      description: "Timezone used by the application",
      local: "Local",
      utc: "UTC",
    },
  },

  tasks: {
    title: "Today's Tasks",
    subtitle: "Manage your daily tasks",

    all: "All",
    active: "Remaining",
    completed: "Completed",

    addTask: "Add Task",
    addTaskPlaceholder: "Enter a new task...",

    progress: "Today's Progress",
    completedCount: "Completed",
    remainingCount: "Remaining",

    calendar: {
      previousMonth: "Previous month",
      nextMonth: "Next month",
      today: "Today",

      weekdays: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    },

    tooltip: {
      officialHoliday: "Official Holiday",
      tasksOfDay: "Tasks for this day",
      completed: "completed",
      from: "of",
    },
  },

  sidebar: {
    online: "Online",
    offline: "Offline",
    local: "Local",
    utc: "UTC",
  },

  dashboard: {
    title: "Dashboard",
  },

  trading: {
    title: "Trading Journal",
  },

  markets: {
    title: "Markets",
  },

  music: {
    title: "Music",
  },

  ai: {
    title: "AI Assistant",
  },
} as const;

export default en;
