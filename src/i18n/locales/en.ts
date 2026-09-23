const en = {
  navigation: {
    dashboard: "Dashboard",
    tasks: "Today's Tasks",
    trading: "Trading Journal",
    motivation: "Motivation",
    markets: "Markets",
    music: "Music",
    ai: "AI Assistant",
    workspace: "Workspace",
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

    appearance: {
      title: "Appearance",
      description: "Customize the look and feel of the application",

      darkMode: {
        label: "Dark Mode",
        description: "Use a dark user interface",
      },

      accentColor: {
        label: "Accent Color",
        description: "Choose the application's accent color",
        purple: "Electric Purple",
        blue: "Tech Blue",
        emerald: "Emerald Green",
        amber: "Amber",
        rose: "Rose",
      },

      displayMode: {
        label: "Display Mode",
        description: "Choose how compact the interface should be",
        standard: "Standard",
        compact: "Compact",
      },
    },

    application: {
      title: "Application",
      description: "General Personal OS settings",

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
        local: "Local Device Time",
        utc: "UTC",
      },
    },

    music: {
      title: "Music",
      description: "Music playback settings",

      autoPlay: {
        label: "Autoplay",
        description: "Automatically start playback after selecting a track",
      },

      defaultSpeed: {
        label: "Default Playback Speed",
        description: "Initial playback speed for music",
      },
    },

    markets: {
      title: "Markets",
      description: "Price and market settings",

      autoUpdate: {
        label: "Automatic Updates",
        description: "Automatically fetch the latest market prices",
      },

      currency: {
        label: "Currency",
        description: "Currency used to display domestic prices",
        toman: "Toman",
        rial: "Rial",
      },
    },

    trading: {
      title: "Trading",
      description: "Trading journal settings",

      tradeLimit: {
        label: "Maximum Daily Trades",
        description: "Maximum number of trades allowed per day",
      },

      trade: "{{count}} trade",
      trades: "{{count}} trades",
    },

    ai: {
      title: "Artificial Intelligence",
      description: "Smart assistant settings",

      localOnly: {
        label: "Local Only",
        description: "Only use local AI models",
      },

      model: {
        label: "Default Model",
        description: "Model used by the AI assistant",
        local: "Local Model",
        cloud: "Cloud Model",
      },
    },

    data: {
      title: "Data",
      description: "Manage data stored in the application",

      export: {
        label: "Export Data",
        description: "Create a backup of your Personal OS data",
      },

      import: {
        label: "Import Data",
        description: "Restore data from a backup file",
      },

      delete: {
        label: "Delete All Data",
        description: "All data stored on this device will be deleted",
      },
    },

    about: {
      title: "About",
      name: "Personal OS",
      description: "Personal system for managing life, trading, music, and AI",
      version: "Initial UI version",
    },
  },

  tasks: {
    dailyPlan: "Daily plan",
    todayTitle: "Today's tasks",
    selectedDayTitle: "Tasks for selected day",
    subtitle: "Manage and track your daily tasks.",
    newTaskPlaceholder: "Enter a new task...",
    addTask: "Add task",
    todayProgress: "Today's progress",
    ofTasks: "of {{count}} tasks",
    todayList: "Today's task list",
    selectedDayList: "Task list for this day",
    empty: "There are no tasks in this section.",
    completeTask: "Complete task",
    restoreTask: "Restore task",
    deleteTask: "Delete task",
    added: "Task added",
    deleted: "Task deleted",
    allDone: "Nice! All today's tasks are done 🎉",
    priority: "Priority",
    priorities: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    tagsPlaceholder: "Tags (comma separated)",
    export: "Export",
    import: "Import",
    exportSuccess: "Tasks file downloaded",
    exportError: "Export failed",
    importSuccess: "{{count}} tasks imported",
    importError: "Invalid file",

    filters: {
      all: "All",
      active: "Remaining",
      completed: "Completed",
    },

    calendar: {
      title: "Task calendar",
      subtitle: "Task status throughout the month",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      today: "Today",
      officialHoliday: "Official holiday",
      holidayShort: "Holiday",
      hoverHoliday: "Hover over a day to see the holiday reason",
      completed: "Completed",
      remaining: "Remaining",
      hoverDetails: "Hover over a day to see details",

      weekdays: {
        saturday: "Sat",
        sunday: "Sun",
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
      },
    },

    tooltip: {
      title: "Tasks for this day",
      completedCount: "{{completed}} of {{total}} completed",
    },
  },
  sidebar: {
    personalSpace: "Your Personal Space",
    me: "Me",
    online: "Online",
    offline: "Offline",
    local: "Local",
    utc: "UTC",
  },

  dashboard: {
    title: "Dashboard",
    subtitle: "An overview of your day",

    systemStatus: "System status",

    stats: {
      todayTasks: "Today's tasks",
      noTasks: "No tasks registered yet",
      remainingTasks: "{{count}} tasks remaining",
      tradingPerformance: "Trading performance",
      tradesRecorded: "{{count}} trades recorded",
      tradeStatus: "Trade status",
      tradeCount: "{{count}} trades",
      successFailure: "{{success}} successful • {{failed}} failed",
    },

    markets: {
      title: "Selected markets",
      subtitle: "Quick market overview",
      updating: "Updating...",
      online: "Live data",
      cached: "Cached data",
      unavailable: "Market data is unavailable",
    },

    tasks: {
      title: "Latest tasks",
      subtitle: "The 5 most recently registered tasks",
      progress: "{{completed}} of {{total}} tasks today",
      empty: "No tasks registered yet",
    },

    activity: {
      title: "Recent activity",
      subtitle: "Latest recorded activities",
      empty: "No activity registered yet",
      tradeRecorded: "Trade recorded: {{symbol}}",
      profit: "Profit {{value}}",
      loss: "Loss {{value}}",
      noProfitLoss: "Trade with no profit or loss",
      taskCompleted: "Daily task completed",
      newTask: "New task",
    },
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

  command: {
    placeholder: "Type a command or search...",
    empty: "No results found",
    hint: "Ctrl+K to open",
    navigate: "Navigate",
    newTask: "New task",
  },
} as const;

export default en;
