import type { CaseStudy, ColumnDef, OptionLists, OptionItem } from "../types";

export type GroupStat = {
  id: string;
  label: string;
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  avgR: number | null;
  totalR: number;
};

export type Insight = {
  id: string;
  tone: "positive" | "negative" | "neutral" | "warning";
  text: string;
  textEn: string;
};

export type AnalysisResult = {
  sampleSize: number;
  dataQuality: "low" | "medium" | "ok";
  winRate: number | null;
  avgR: number | null;
  bestR: number | null;
  worstR: number | null;
  avgSl: number | null;
  medianSl: number | null;
  minSl: number | null;
  maxSl: number | null;
  pairs: GroupStat[];
  setups: GroupStat[];
  confluences: GroupStat[];
  positions: GroupStat[];
  sessions: GroupStat[];
  trends: GroupStat[];
  customGroups: {
    key: string;
    title: string;
    titleEn?: string;
    stats: GroupStat[];
  }[];
  customNumbers: {
    key: string;
    title: string;
    avg: number | null;
    min: number | null;
    max: number | null;
  }[];
  insights: Insight[];
};

function labelOf(list: OptionItem[], id: string) {
  return list.find((o) => o.id === id)?.label ?? id;
}

function median(nums: number[]): number | null {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function groupBy(
  items: {
    key: string;
    label: string;
    r: number | null;
    win: boolean | null;
  }[],
): GroupStat[] {
  const map = new Map<
    string,
    { label: string; count: number; wins: number; losses: number; rs: number[] }
  >();

  for (const it of items) {
    const cur = map.get(it.key) ?? {
      label: it.label,
      count: 0,
      wins: 0,
      losses: 0,
      rs: [],
    };
    cur.count += 1;
    if (it.win === true) cur.wins += 1;
    if (it.win === false) cur.losses += 1;
    if (it.r != null && !Number.isNaN(it.r)) cur.rs.push(it.r);
    map.set(it.key, cur);
  }

  return [...map.entries()]
    .map(([id, v]) => {
      const decided = v.wins + v.losses;
      return {
        id,
        label: v.label,
        count: v.count,
        wins: v.wins,
        losses: v.losses,
        winRate: decided ? (v.wins / decided) * 100 : 0,
        avgR: avg(v.rs),
        totalR: v.rs.reduce((a, b) => a + b, 0),
      };
    })
    .sort((a, b) => {
      const ar = a.avgR ?? -999;
      const br = b.avgR ?? -999;
      if (br !== ar) return br - ar;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.count - a.count;
    });
}

function score(s: GroupStat): number {
  const r = s.avgR ?? 0;
  return s.winRate * 0.5 + r * 15 + Math.min(s.count, 10);
}

function describe(
  s: GroupStat,
  categoryFa: string,
  categoryEn: string,
  minCount: number,
): Insight | null {
  if (s.count < minCount) return null;
  const decided = s.wins + s.losses;
  if (!decided) return null;

  if (s.wins > 0 && s.losses === 0) {
    return {
      id: `allwin-${categoryEn}-${s.id}`,
      tone: "positive",
      text: `در «${categoryFa}» مورد «${s.label}» از ${s.count} نمونه، همه برد بوده‌اند${s.avgR != null ? ` (میانگین R: ${s.avgR.toFixed(2)})` : ""}. می‌تواند سیگنال قوی باشد.`,
      textEn: `For ${categoryEn} “${s.label}”: ${s.count} samples, all wins${s.avgR != null ? ` (avg R ${s.avgR.toFixed(2)})` : ""}. Looks strong.`,
    };
  }

  if (s.losses > 0 && s.wins === 0) {
    return {
      id: `allloss-${categoryEn}-${s.id}`,
      tone: "negative",
      text: `در «${categoryFa}» مورد «${s.label}» از ${s.count} نمونه، همه باخت بوده‌اند. فعلاً پیشنهادش نمی‌کنم.`,
      textEn: `For ${categoryEn} “${s.label}”: ${s.count} samples, all losses. I wouldn’t recommend it for now.`,
    };
  }

  if (s.wins >= s.losses * 2 && s.wins >= 2) {
    return {
      id: `good-${categoryEn}-${s.id}`,
      tone: "positive",
      text: `«${s.label}» (${categoryFa}): ${s.wins} برد و ${s.losses} باخت از ${s.count} معامله${s.avgR != null ? `، میانگین R ${s.avgR.toFixed(2)}` : ""}. عملکرد نسبتاً خوب؛ ارزش ادامه دارد.`,
      textEn: `“${s.label}” (${categoryEn}): ${s.wins} wins, ${s.losses} losses in ${s.count} trades${s.avgR != null ? `, avg R ${s.avgR.toFixed(2)}` : ""}. Relatively solid.`,
    };
  }

  if (s.losses >= s.wins * 2 && s.losses >= 2) {
    return {
      id: `bad-${categoryEn}-${s.id}`,
      tone: "negative",
      text: `«${s.label}» (${categoryFa}): ${s.losses} باخت در برابر فقط ${s.wins} برد از ${s.count} معامله. بازخورد منفی تکراری — پیشنهادش نمی‌کنم.`,
      textEn: `“${s.label}” (${categoryEn}): ${s.losses} losses vs ${s.wins} wins in ${s.count} trades. Repeated negative outcome — not recommended.`,
    };
  }

  return null;
}

function buildInsights(
  a: Omit<AnalysisResult, "insights">,
  minCount: number,
): Insight[] {
  const out: Insight[] = [];

  // Sessions comparison
  const sess = a.sessions.filter((s) => s.count >= 1);
  if (sess.length >= 2) {
    const ranked = [...sess].sort((x, y) => score(y) - score(x));
    const best = ranked[0]!;
    const worst = ranked[ranked.length - 1]!;
    if (best.id !== worst.id) {
      out.push({
        id: "session-compare",
        tone: best.winRate >= 60 ? "positive" : "neutral",
        text: `سشن «${best.label}»: ${best.wins} برد و ${best.losses} باخت (${best.count} معامله)${best.avgR != null ? `، میانگین R ${best.avgR.toFixed(2)}` : ""}. در مقابل سشن «${worst.label}»: ${worst.wins} برد و ${worst.losses} باخت (${worst.count} معامله). ${
          best.winRate > worst.winRate + 15
            ? `سشن ${best.label} فعلاً گزینهٔ بهتری به نظر می‌رسد.`
            : `تفاوت خیلی قطعی نیست؛ داده بیشتری لازم است.`
        }`,
        textEn: `Session “${best.label}”: ${best.wins}W / ${best.losses}L (${best.count} trades). vs “${worst.label}”: ${worst.wins}W / ${worst.losses}L (${worst.count} trades). ${
          best.winRate > worst.winRate + 15
            ? `${best.label} looks like the better session for now.`
            : `Difference isn’t decisive yet — need more data.`
        }`,
      });
    }
  }
  for (const s of sess) {
    const ins = describe(s, "سشن", "session", minCount);
    if (ins) out.push(ins);
  }

  // Confluences
  for (const s of a.confluences) {
    const ins = describe(s, "هم‌پوشانی", "confluence", minCount);
    if (ins) out.push(ins);
  }
  const confGood = a.confluences.filter((s) => s.wins >= 2 && s.winRate >= 60);
  const confBad = a.confluences.filter((s) => s.losses >= 2 && s.winRate <= 40);
  if (confGood[0] && confBad[0] && confGood[0].id !== confBad[0].id) {
    const g = confGood[0];
    const b = confBad[0];
    out.push({
      id: "conf-compare",
      tone: "neutral",
      text: `هم‌پوشانی «${g.label}» در ${g.wins} مورد بازخورد مثبت داشته (${g.losses} باخت)، اما «${b.label}» در ${b.losses} مورد بازخورد منفی داده (${b.wins} برد). روی ${g.label} تمرکز کن و ${b.label} را فعلاً کنار بگذار.`,
      textEn: `Confluence “${g.label}” had ${g.wins} positive outcomes (${g.losses} losses), while “${b.label}” had ${b.losses} negatives (${b.wins} wins). Lean on ${g.label}; skip ${b.label} for now.`,
    });
  }

  // Pairs
  for (const s of a.pairs) {
    const ins = describe(s, "جفت‌ارز", "pair", minCount);
    if (ins) out.push(ins);
  }
  const pairBest = a.pairs.find((s) => s.count >= minCount && s.winRate >= 55);
  const pairWorst = [...a.pairs]
    .filter((s) => s.count >= minCount)
    .sort((x, y) => x.winRate - y.winRate)[0];
  if (pairBest && pairWorst && pairBest.id !== pairWorst.id) {
    out.push({
      id: "pair-compare",
      tone: "positive",
      text: `بهترین جفت‌ارز فعلاً «${pairBest.label}» است (${pairBest.wins} برد / ${pairBest.losses} باخت). ضعیف‌ترین: «${pairWorst.label}» (${pairWorst.wins} برد / ${pairWorst.losses} باخت).`,
      textEn: `Best pair so far: “${pairBest.label}” (${pairBest.wins}W/${pairBest.losses}L). Weakest: “${pairWorst.label}” (${pairWorst.wins}W/${pairWorst.losses}L).`,
    });
  }

  // Setups
  for (const s of a.setups) {
    const ins = describe(s, "ستاپ", "setup", minCount);
    if (ins) out.push(ins);
  }

  // Positions
  for (const s of a.positions) {
    const ins = describe(s, "پوزیشن", "position", minCount);
    if (ins) out.push(ins);
  }

  // Trends
  for (const s of a.trends) {
    const ins = describe(s, "روند", "trend", minCount);
    if (ins) out.push(ins);
  }

  // SL
  if (a.avgSl != null && a.medianSl != null) {
    out.push({
      id: "sl",
      tone: "neutral",
      text: `میانگین استاپ حدود ${a.avgSl.toFixed(1)} پیپ و میانه ${a.medianSl.toFixed(1)} پیپ است${a.minSl != null ? ` (بازه ${a.minSl.toFixed(1)} تا ${a.maxSl?.toFixed(1)})` : ""}. برای پیدا کردن استاپ بهینه، ببین معاملات با استاپ نزدیک میانه چه Rای گرفته‌اند.`,
      textEn: `Average SL is about ${a.avgSl.toFixed(1)} pips (median ${a.medianSl.toFixed(1)})${a.minSl != null ? `, range ${a.minSl.toFixed(1)}–${a.maxSl?.toFixed(1)}` : ""}. Check whether trades near the median SL deliver better R.`,
    });
  }

  // Overall R
  if (a.avgR != null) {
    out.push({
      id: "overall-r",
      tone: a.avgR > 0 ? "positive" : a.avgR < 0 ? "negative" : "neutral",
      text: `میانگین R کل: ${a.avgR.toFixed(2)}${a.bestR != null ? ` — بهترین ${a.bestR.toFixed(2)}` : ""}${a.worstR != null ? `، بدترین ${a.worstR.toFixed(2)}` : ""}.${a.winRate != null ? ` نرخ برد حدود ${a.winRate.toFixed(0)}٪.` : ""}`,
      textEn: `Overall avg R: ${a.avgR.toFixed(2)}${a.bestR != null ? ` — best ${a.bestR.toFixed(2)}` : ""}${a.worstR != null ? `, worst ${a.worstR.toFixed(2)}` : ""}.${a.winRate != null ? ` Win rate ~${a.winRate.toFixed(0)}%.` : ""}`,
    });
  }

  // Custom columns
  for (const g of a.customGroups) {
    for (const s of g.stats) {
      const ins = describe(s, g.title, g.titleEn ?? g.title, minCount);
      if (ins) out.push({ ...ins, id: `custom-${g.key}-${ins.id}` });
    }
  }

  const seen = new Set<string>();
  return out.filter((i) => {
    if (seen.has(i.text)) return false;
    seen.add(i.text);
    return true;
  });
}

export function analyzeCases(
  cases: CaseStudy[],
  optionLists: OptionLists,
  columns: ColumnDef[],
): AnalysisResult {
  const n = cases.length;
  const dataQuality: AnalysisResult["dataQuality"] =
    n < 20 ? "low" : n < 50 ? "medium" : "ok";

  const rs = cases
    .map((c) => c.rValue)
    .filter((v): v is number => v != null && !Number.isNaN(v));
  const sls = cases
    .map((c) => c.minSlPips)
    .filter((v): v is number => v != null && !Number.isNaN(v));

  const wins = cases.filter((c) => c.status === "win").length;
  const losses = cases.filter((c) => c.status === "loss").length;
  const decided = wins + losses;

  const winOf = (c: CaseStudy): boolean | null =>
    c.status === "win" ? true : c.status === "loss" ? false : null;

  const pairs = groupBy(
    cases
      .filter((c) => c.pairId)
      .map((c) => ({
        key: c.pairId!,
        label: labelOf(optionLists.pairs, c.pairId!),
        r: c.rValue,
        win: winOf(c),
      })),
  );

  const setups = groupBy(
    cases
      .filter((c) => c.setupId)
      .map((c) => ({
        key: c.setupId!,
        label: labelOf(optionLists.setups, c.setupId!),
        r: c.rValue,
        win: winOf(c),
      })),
  );

  const confluenceItems: {
    key: string;
    label: string;
    r: number | null;
    win: boolean | null;
  }[] = [];
  for (const c of cases) {
    for (const id of c.confluenceIds ?? []) {
      confluenceItems.push({
        key: id,
        label: labelOf(optionLists.confluences, id),
        r: c.rValue,
        win: winOf(c),
      });
    }
  }
  const confluences = groupBy(confluenceItems);

  const positions = groupBy(
    cases
      .filter((c) => c.positionId)
      .map((c) => ({
        key: c.positionId!,
        label: labelOf(optionLists.positions, c.positionId!),
        r: c.rValue,
        win: winOf(c),
      })),
  );

  const sessions = groupBy(
    cases
      .filter((c) => c.session)
      .map((c) => ({
        key: c.session!,
        label: c.session!,
        r: c.rValue,
        win: winOf(c),
      })),
  );

  const trendItems: typeof confluenceItems = [];
  for (const c of cases) {
    for (const id of c.trendIds ?? []) {
      trendItems.push({
        key: id,
        label: labelOf(optionLists.trends, id),
        r: c.rValue,
        win: winOf(c),
      });
    }
  }
  const trends = groupBy(trendItems);

  const customGroups: AnalysisResult["customGroups"] = [];
  const customNumbers: AnalysisResult["customNumbers"] = [];

  for (const col of columns) {
    if (col.isDefault) continue;

    if (col.type === "text" || col.type === "singleSelect") {
      const items = cases
        .map((c) => {
          const raw = c.customFields?.[col.key];
          if (raw == null || raw === "") return null;
          const label = String(raw);
          return { key: label, label, r: c.rValue, win: winOf(c) };
        })
        .filter(Boolean) as {
        key: string;
        label: string;
        r: number | null;
        win: boolean | null;
      }[];
      if (items.length) {
        customGroups.push({
          key: col.key,
          title: col.title,
          titleEn: col.titleEn,
          stats: groupBy(items),
        });
      }
    }

    if (
      col.type === "number" ||
      col.type === "positionSize" ||
      col.type === "slPips" ||
      col.type === "rValue"
    ) {
      const nums = cases
        .map((c) => {
          const v = c.customFields?.[col.key];
          return typeof v === "number"
            ? v
            : v != null && v !== ""
              ? Number(v)
              : null;
        })
        .filter((v): v is number => v != null && !Number.isNaN(v));
      if (nums.length) {
        customNumbers.push({
          key: col.key,
          title: col.title,
          avg: avg(nums),
          min: Math.min(...nums),
          max: Math.max(...nums),
        });
      }
    }
  }

  const base: Omit<AnalysisResult, "insights"> = {
    sampleSize: n,
    dataQuality,
    winRate: decided ? (wins / decided) * 100 : null,
    avgR: avg(rs),
    bestR: rs.length ? Math.max(...rs) : null,
    worstR: rs.length ? Math.min(...rs) : null,
    avgSl: avg(sls),
    medianSl: median(sls),
    minSl: sls.length ? Math.min(...sls) : null,
    maxSl: sls.length ? Math.max(...sls) : null,
    pairs,
    setups,
    confluences,
    positions,
    sessions,
    trends,
    customGroups,
    customNumbers,
  };

  const minCount = n >= 50 ? 3 : n >= 20 ? 2 : 1;

  return {
    ...base,
    insights: buildInsights(base, minCount),
  };
}
