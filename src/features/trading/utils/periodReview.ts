import type { Trade } from "../types";

export type ReviewPeriod = "week" | "month";

export type PeriodStats = {
  period: ReviewPeriod;
  fromLabel: string;
  toLabel: string;
  tradeCount: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number;
  totalResult: number;
  avgResult: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number | null;
  avgScore: number | null;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  topSymbols: { symbol: string; count: number; result: number }[];
  topLossReasons: { reason: string; count: number }[];
  insight: {
    tone: "strong" | "caution" | "critical" | "neutral";
    title: string;
    text: string;
  };
};

function parseTradeDate(dateStr: string): Date {
  // تاریخ ذخیره‌شده به صورت YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function startOfWeek(base: Date): Date {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? 6 : day - 1; // هفته از دوشنبه
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(base: Date): Date {
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function formatFaDate(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

function normalizeReason(reason: string): string {
  return reason.trim().replace(/\s+/g, " ");
}

function buildInsight(input: {
  tradeCount: number;
  winRate: number;
  totalResult: number;
  avgScore: number | null;
  profitFactor: number | null;
  topLossReasons: { reason: string; count: number }[];
  period: ReviewPeriod;
}): PeriodStats["insight"] {
  const {
    tradeCount,
    winRate,
    totalResult,
    avgScore,
    profitFactor,
    topLossReasons,
    period,
  } = input;

  const periodLabel = period === "week" ? "این هفته" : "این ماه";

  if (tradeCount === 0) {
    return {
      tone: "neutral",
      title: `${periodLabel} هنوز معامله‌ای ثبت نشده`,
      text: "بدون داده، تحلیلی وجود ندارد. حداقل چند معامله با دلیل ورود و نمره ثبت کن تا سیستم بتواند الگوی واقعی‌ات را ببیند.",
    };
  }

  // اشتباه تکراری غالب
  if (topLossReasons[0] && topLossReasons[0].count >= 2) {
    const r = topLossReasons[0];
    return {
      tone: "critical",
      title: "یک اشتباه دارد تکرار می‌شود",
      text: `بیشترین ضررهای ${periodLabel} با دلیل «${r.reason}» آمده (${r.count} بار). قبل از معامله بعدی، فقط همین یک مورد را حذف کن؛ نه همه‌چیز را یک‌جا.`,
    };
  }

  // نمره پایین = نظم ضعیف
  if (avgScore != null && avgScore < 5) {
    return {
      tone: "caution",
      title: "کیفیت اجرا پایین‌تر از انتظار است",
      text: `میانگین نمره معاملات ${periodLabel} ${avgScore.toFixed(1)} از ۱۰ است. یعنی مشکل اصلی entrysetup نیست؛ مشکل پایبندی به قوانین خودت است.`,
    };
  }

  // وین‌ریت بالا ولی نتیجه منفی
  if (winRate >= 55 && totalResult < 0) {
    return {
      tone: "caution",
      title: "برد زیاد، اما حساب منفی",
      text: `${periodLabel} وین‌ریت ${Math.round(winRate)}٪ بوده ولی نتیجه منفی است. یعنی ضررها بزرگ‌تر از سودهاست. روی اندازه پوزیشن و حد ضرر کار کن، نه روی تعداد سیگنال.`,
    };
  }

  // وین‌ریت پایین
  if (winRate < 40 && tradeCount >= 5) {
    return {
      tone: "caution",
      title: "نرخ موفقیت نیاز به بازبینی دارد",
      text: `وین‌ریت ${periodLabel} زیر ۴۰٪ است. قبل از افزایش حجم، ستاپ‌هایت را فیلتر کن و فقط بهترین‌ها را بگیر.`,
    };
  }

  // پروفیت فکتور ضعیف
  if (profitFactor != null && profitFactor < 1 && tradeCount >= 4) {
    return {
      tone: "critical",
      title: "نسبت سود به ضرر به‌نفع تو نیست",
      text: `Profit Factor زیر ۱ یعنی مجموع ضررها از سودها بیشتر بوده. ${periodLabel} را به عنوان داده آموزشی ببین، نه شکست هویتی.`,
    };
  }

  // عملکرد قوی
  if (totalResult > 0 && winRate >= 50 && (avgScore == null || avgScore >= 6)) {
    return {
      tone: "strong",
      title: `${periodLabel} مسیر درست بوده`,
      text: "نتیجه مثبت همراه با اجرای قابل‌قبول است. الان خطر اصلی غرور است؛ قوانین را سفت‌تر نگه دار، نه شل‌تر.",
    };
  }

  if (totalResult > 0) {
    return {
      tone: "strong",
      title: `${periodLabel} نتیجه مثبت ثبت شده`,
      text: "سود هست، اما هنوز باید ببینی از کدام ستاپ آمده. تکرار همان شرایط مهم‌تر از جشن گرفتن یک عدد است.",
    };
  }

  return {
    tone: "neutral",
    title: `${periodLabel} برای یادگیری است، نه قضاوت`,
    text: "اعداد را مثل کارنامه ببین. یک دوره بد هویت تو نیست؛ فقط داده است برای اصلاح سیستم.",
  };
}

export function computePeriodReview(
  trades: Trade[],
  period: ReviewPeriod,
  locale = "fa-IR",
): PeriodStats {
  const now = new Date();
  const from = period === "week" ? startOfWeek(now) : startOfMonth(now);
  const to = endOfDay(now);

  const filtered = trades.filter((t) => {
    if (!t.date) return false;
    const d = parseTradeDate(t.date);
    return d >= from && d <= to;
  });

  const wins = filtered.filter((t) => t.result > 0);
  const losses = filtered.filter((t) => t.result < 0);
  const breakeven = filtered.filter((t) => t.result === 0);

  const tradeCount = filtered.length;
  const winRate = tradeCount > 0 ? (wins.length / tradeCount) * 100 : 0;
  const totalResult = filtered.reduce((s, t) => s + t.result, 0);
  const avgResult = tradeCount > 0 ? totalResult / tradeCount : 0;

  const avgWin =
    wins.length > 0 ? wins.reduce((s, t) => s + t.result, 0) / wins.length : 0;
  const avgLoss =
    losses.length > 0
      ? losses.reduce((s, t) => s + t.result, 0) / losses.length
      : 0;

  const grossProfit = wins.reduce((s, t) => s + t.result, 0);
  const grossLossAbs = Math.abs(losses.reduce((s, t) => s + t.result, 0));
  const profitFactor =
    grossLossAbs > 0
      ? grossProfit / grossLossAbs
      : grossProfit > 0
        ? null
        : null;

  const scores = filtered
    .map((t) => t.score)
    .filter((s) => typeof s === "number");
  const avgScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

  const bestTrade =
    filtered.length > 0
      ? filtered.reduce((best, t) => (t.result > best.result ? t : best))
      : null;
  const worstTrade =
    filtered.length > 0
      ? filtered.reduce((worst, t) => (t.result < worst.result ? t : worst))
      : null;

  // نمادها
  const symbolMap = new Map<string, { count: number; result: number }>();
  for (const t of filtered) {
    const key = (t.symbol || "—").toUpperCase();
    const prev = symbolMap.get(key) ?? { count: 0, result: 0 };
    symbolMap.set(key, {
      count: prev.count + 1,
      result: prev.result + t.result,
    });
  }
  const topSymbols = [...symbolMap.entries()]
    .map(([symbol, v]) => ({ symbol, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // دلایل ضرر (اشتباه تکراری)
  const reasonMap = new Map<string, number>();
  for (const t of losses) {
    const r = normalizeReason(t.reason || "");
    if (!r) continue;
    reasonMap.set(r, (reasonMap.get(r) ?? 0) + 1);
  }
  const topLossReasons = [...reasonMap.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const insight = buildInsight({
    tradeCount,
    winRate,
    totalResult,
    avgScore,
    profitFactor: profitFactor === null && grossProfit > 0 ? 99 : profitFactor,
    topLossReasons,
    period,
  });

  return {
    period,
    fromLabel: formatFaDate(from, locale),
    toLabel: formatFaDate(to, locale),
    tradeCount,
    wins: wins.length,
    losses: losses.length,
    breakeven: breakeven.length,
    winRate,
    totalResult,
    avgResult,
    avgWin,
    avgLoss,
    profitFactor:
      grossLossAbs === 0
        ? grossProfit > 0
          ? Infinity
          : null
        : grossProfit / grossLossAbs,
    avgScore,
    bestTrade,
    worstTrade,
    topSymbols,
    topLossReasons,
    insight,
  };
}
