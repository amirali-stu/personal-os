export type DateFormat = "jalali" | "gregorian";
export type Timezone = "local" | "utc";

function getTimeZone(timezone: Timezone) {
  return timezone === "utc" ? "UTC" : undefined;
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

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(date);
}

export function formatWeekday(
  date: Date = new Date(),
  timezone: Timezone = "local",
): string {
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    timeZone: getTimeZone(timezone),
  }).format(date);
}

export function formatFullDate(
  date: Date = new Date(),
  dateFormat: DateFormat = "jalali",
  timezone: Timezone = "local",
): string {
  const weekday = formatWeekday(date, timezone);

  const formattedDate = formatPersianDate(date, dateFormat, timezone);

  return `${weekday}، ${formattedDate}`;
}

export function getTodayDate(timezone: Timezone = "local"): string {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    calendar: "gregory",
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
): string {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: getTimeZone(timezone),
  }).format(typeof date === "number" ? new Date(date) : date);
}
