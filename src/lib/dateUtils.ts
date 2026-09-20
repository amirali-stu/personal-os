export type DateFormat = "jalali" | "gregorian";

export type Timezone = "local" | "utc";

function getTimeZone(timezone: Timezone): string | undefined {
  return timezone === "utc" ? "UTC" : undefined;
}

function getLocale(language: string): string {
  return language === "en" ? "en-US" : "fa-IR";
}

function getCalendar(dateFormat: DateFormat, language: string): string {
  if (language === "en") {
    return "gregory";
  }

  return dateFormat === "gregorian" ? "gregory" : "persian";
}

export function formatPersianDate(
  date: Date = new Date(),
  dateFormat: DateFormat = "jalali",
  timezone: Timezone = "local",
): string {
  const timeZone = getTimeZone(timezone);

  if (dateFormat === "gregorian") {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "gregory",
      numberingSystem: "arabext",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    }).format(date);
  }

  return new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    numberingSystem: "arabext",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(date);
}

export function formatWeekday(
  date: Date = new Date(),
  timezone: Timezone = "local",
  language: string = "fa",
): string {
  const locale = getLocale(language);

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: getTimeZone(timezone),
  }).format(date);
}

export function formatFullDate(
  date: Date = new Date(),
  dateFormat: DateFormat = "jalali",
  timezone: Timezone = "local",
  language: string = "fa",
): string {
  const locale = getLocale(language);
  const timeZone = getTimeZone(timezone);
  const calendar = getCalendar(dateFormat, language);

  return new Intl.DateTimeFormat(locale, {
    calendar,
    numberingSystem: language === "fa" ? "arabext" : "latn",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);
}

export function getTodayDate(timezone: Timezone = "local"): string {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: getTimeZone(timezone),
  });

  return formatter.format(date);
}

export function formatTime(
  date: Date | number = new Date(),
  timezone: Timezone = "local",
  language: string = "fa",
): string {
  const locale = getLocale(language);

  return new Intl.DateTimeFormat(locale, {
    numberingSystem: language === "fa" ? "arabext" : "latn",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: getTimeZone(timezone),
  }).format(typeof date === "number" ? new Date(date) : date);
}
