import type { Trade } from "../../trading/types";

export function buildJournalSummary(trades: Trade[]): string {
  if (!trades || trades.length === 0) {
    return "کاربر هنوز هیچ معامله‌ای در ژورنال ثبت نکرده است.";
  }

  const total = trades.length;
  const wins = trades.filter((t) => t.result > 0).length;
  const losses = trades.filter((t) => t.result < 0).length;
  const be = trades.filter((t) => t.result === 0).length;
  const totalResult = trades.reduce((sum, t) => sum + t.result, 0);
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0";

  // آخرین ۳۰ معامله (برای خلاصه)
  const recent = [...trades]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 30);

  const recentLines = recent.map((t, i) => {
    const side = t.side === "buy" ? "خرید" : "فروش";
    const resultSign = t.result > 0 ? "+" : "";
    return `${i + 1}. ${t.symbol} | ${side} | نتیجه: ${resultSign}${t.result} | امتیاز: ${t.score}/5 | دلیل: ${t.reason} | تاریخ: ${t.date}`;
  });

  // تحلیل ساده روزهای هفته
  const dayStats: Record<string, { count: number; result: number }> = {};
  trades.forEach((t) => {
    const day = new Date(t.createdAt).toLocaleDateString("fa-IR", {
      weekday: "long",
    });
    if (!dayStats[day]) dayStats[day] = { count: 0, result: 0 };
    dayStats[day].count += 1;
    dayStats[day].result += t.result;
  });

  const daySummary = Object.entries(dayStats)
    .map(
      ([day, stat]) =>
        `${day}: ${stat.count} معامله، مجموع نتیجه: ${stat.result > 0 ? "+" : ""}${stat.result.toFixed(2)}`,
    )
    .join(" | ");

  return `
=== خلاصه ژورنال ترید کاربر ===
تعداد کل معاملات: ${total}
معاملات سودده: ${wins}
معاملات ضررده: ${losses}
سربه‌سر: ${be}
نرخ برد (Win Rate): ${winRate}%
مجموع نتیجه مالی: ${totalResult > 0 ? "+" : ""}${totalResult.toFixed(2)}

آمار بر اساس روز هفته:
${daySummary || "داده‌ای موجود نیست"}

آخرین ۳۰ معامله (از جدید به قدیم):
${recentLines.join("\n")}
`.trim();
}

export function buildSystemPrompt(
  journalSummary: string,
  language: "fa" | "en" = "fa",
): string {
  if (language === "en") {
    return `You are a professional trading psychology and performance coach.
You have access to the user's trading journal.

Your job:
- Analyze the journal and find patterns
- Explain possible reasons for stop-outs / losses
- Suggest better risk percentage
- Tell which days of the week are dangerous for this trader
- Give practical, honest and constructive advice
- Always answer in English
- Be direct and useful, not generic motivational talk

Here is the user's journal data:

${journalSummary}
`;
  }

  return `تو یک مربی حرفه‌ای روانشناسی ترید و تحلیل عملکرد هستی.
به ژورنال معاملات کاربر دسترسی داری.

وظایف تو:
- ژورنال را تحلیل کن و الگوها را پیدا کن
- علت‌های احتمالی استاپ‌ها و ضررها را بگو
- درصد ریسک مناسب را پیشنهاد بده
- بگو کدام روزهای هفته برای این تریدر خطرناک‌تر است
- پیشنهادهای عملی، صادقانه و مفید بده
- همیشه به زبان فارسی جواب بده
- کلی‌گویی نکن، مستقیم و کاربردی حرف بزن

اطلاعات ژورنال کاربر:

${journalSummary}
`;
}
