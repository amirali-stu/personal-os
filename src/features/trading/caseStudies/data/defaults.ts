import type { ColumnDef, OptionLists, OptionItem } from "../types";

function opt(id: string, label: string, color: OptionItem["color"], order: number): OptionItem {
  return { id, label, color, order };
}

export function createDefaultOptionLists(): OptionLists {
  return {
    pairs: [
      opt("audusd", "AUDUSD", "yellow", 0),
      opt("eurusd", "EURUSD", "blue", 1),
      opt("gbpjpy", "GBPJPY", "pink", 2),
      opt("gbpusd", "GBPUSD", "yellow", 3),
      opt("usdjpy", "USDJPY", "orange", 4),
      opt("xauusd", "XAUUSD", "brown", 5),
    ],
    setups: [
      opt("confirm-entry", "1 confirm Entry", "blue", 0),
      opt("ibos", "ibos setup", "teal", 1),
    ],
    confluences: [
      opt("industment", "industment", "gray", 0),
      opt("liquidity-sweep", "liquidity sweep", "green", 1),
      opt("flip", "FLip", "yellow", 2),
      opt("choch", "ChoCH", "red", 3),
      opt("strong-swing", "strong SWING", "gray", 4),
      opt("poi-decision", "poi decision", "orange", 5),
      opt("v-shape", "V-shape", "purple", 6),
      opt("ifc", "ifc", "gray", 7),
      opt("htf-mitigation", "HTF mitigation", "teal", 8),
      opt("refined-poi", "Refined Poi", "brown", 9),
      opt("premium-discount", "premium / discount", "blue", 10),
      opt("weak-swing", "weak SWING", "yellow", 11),
      opt("poi-extrem", "poi extrem", "pink", 12),
    ],
    positions: [
      opt("long", "LONG", "orange", 0),
      opt("short", "SHORT", "orange", 1),
    ],
    trends: [
      opt("1d-up", "1D ↑", "green", 0),
      opt("4h-up", "4H ↑", "green", 1),
      opt("m15-up", "M15 ↑", "green", 2),
      opt("1d-down", "1D ↓", "red", 3),
      opt("4h-down", "4H ↓", "red", 4),
      opt("m15-down", "M15 ↓", "red", 5),
      opt("ibos-up", "ibos ↑", "teal", 6),
    ],
  };
}

export function createDefaultColumns(): ColumnDef[] {
  return [
    { id: "col-trade", key: "tradeNumber", title: "شماره ترید", titleEn: "Trade #", type: "number", isDefault: true, order: 0, width: 88 },
    { id: "col-pair", key: "pairId", title: "جفت‌ارز", titleEn: "Pair", type: "singleSelect", optionListKey: "pairs", isDefault: true, order: 1, width: 130 },
    { id: "col-setup", key: "setupId", title: "ستاپ", titleEn: "Setup", type: "singleSelect", optionListKey: "setups", isDefault: true, order: 2, width: 150 },
    { id: "col-size", key: "positionSize", title: "سایز پوزیشن", titleEn: "Lot Size", type: "positionSize", isDefault: true, order: 3, width: 110 },
    { id: "col-r", key: "rValue", title: "R", titleEn: "R", type: "rValue", isDefault: true, order: 4, width: 72 },
    { id: "col-status", key: "status", title: "وضعیت", titleEn: "Status", type: "autoStatus", isDefault: true, order: 5, width: 88 },
    { id: "col-pos", key: "positionId", title: "پوزیشن", titleEn: "Position", type: "singleSelect", optionListKey: "positions", isDefault: true, order: 6, width: 110 },
    { id: "col-open", key: "openedAt", title: "باز شدن", titleEn: "Opened", type: "dateTime", isDefault: true, order: 7, width: 168 },
    { id: "col-close", key: "closedAt", title: "بسته شدن", titleEn: "Closed", type: "dateTime", isDefault: true, order: 8, width: 168 },
    { id: "col-session", key: "session", title: "سشن", titleEn: "Session", type: "autoSession", isDefault: true, order: 9, width: 110 },
    { id: "col-conf", key: "confluenceIds", title: "هم‌پوشانی", titleEn: "Confluence", type: "multiSelect", optionListKey: "confluences", isDefault: true, order: 10, width: 240 },
    { id: "col-trend", key: "trendIds", title: "روند", titleEn: "Trends", type: "multiSelect", optionListKey: "trends", isDefault: true, order: 11, width: 200 },
    { id: "col-sl", key: "minSlPips", title: "حداقل استاپ (پیپ)", titleEn: "Min SL (pips)", type: "slPips", isDefault: true, order: 12, width: 130 },
    { id: "col-notes", key: "notes", title: "توضیحات", titleEn: "Notes", type: "text", isDefault: true, order: 13, width: 200 },
  ];
}

export const TREND_MUTEX: [string, string][] = [
  ["1d-up", "1d-down"],
  ["4h-up", "4h-down"],
  ["m15-up", "m15-down"],
];

export function enforceTrendMutex(selected: string[], newlyAdded: string): string[] {
  let next = [...selected];
  if (!next.includes(newlyAdded)) next.push(newlyAdded);
  for (const [a, b] of TREND_MUTEX) {
    if (newlyAdded === a && next.includes(b)) next = next.filter((x) => x !== b);
    if (newlyAdded === b && next.includes(a)) next = next.filter((x) => x !== a);
  }
  return next;
}
