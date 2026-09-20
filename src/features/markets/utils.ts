export function formatPrice(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

export function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(2)}%`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
