export function getTodayDate(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function normalizeSymbol(value: string): string {
  return value.replace(/[^a-zA-Z0-9/]/g, "").toUpperCase();
}

export function formatResult(value: number): string {
  if (value > 0) {
    return `+${value.toLocaleString("en-US")}`;
  }

  return value.toLocaleString("en-US");
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}/${month}/${day}`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
