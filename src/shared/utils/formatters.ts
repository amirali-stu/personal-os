// src/shared/utils/formatters.ts

export function formatNumber(value: number, language: string) {
  return new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US", {
    numberingSystem: language === "fa" ? "arabext" : "latn",
  }).format(value);
}

export function formatDate(value: string | number | Date, language: string) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    numberingSystem: language === "fa" ? "arabext" : "latn",
  }).format(new Date(value));
}

export function formatDateTime(
  value: string | number | Date,
  language: string,
) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    numberingSystem: language === "fa" ? "arabext" : "latn",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTime(value: string | number | Date, language: string) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    numberingSystem: language === "fa" ? "arabext" : "latn",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
