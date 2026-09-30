export type TagColor =
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "teal";

/** Notion-like solid tag colors */
export const TAG_COLORS: {
  id: TagColor;
  bg: string;
  text: string;
  bgLight: string;
  textLight: string;
}[] = [
  {
    id: "gray",
    bg: "#5a5a5a",
    text: "#f1f1ef",
    bgLight: "#e4e4e7",
    textLight: "#3f3f46",
  },
  {
    id: "brown",
    bg: "#594a3a",
    text: "#f1f1ef",
    bgLight: "#efe6dc",
    textLight: "#5c4033",
  },
  {
    id: "orange",
    bg: "#854c1d",
    text: "#f1f1ef",
    bgLight: "#ffedd5",
    textLight: "#9a3412",
  },
  {
    id: "yellow",
    bg: "#89632a",
    text: "#f1f1ef",
    bgLight: "#fef9c3",
    textLight: "#854d0e",
  },
  {
    id: "green",
    bg: "#2b593f",
    text: "#f1f1ef",
    bgLight: "#dcfce7",
    textLight: "#166534",
  },
  {
    id: "blue",
    bg: "#28456c",
    text: "#f1f1ef",
    bgLight: "#dbeafe",
    textLight: "#1e40af",
  },
  {
    id: "purple",
    bg: "#492f64",
    text: "#f1f1ef",
    bgLight: "#f3e8ff",
    textLight: "#6b21a8",
  },
  {
    id: "pink",
    bg: "#69314c",
    text: "#f1f1ef",
    bgLight: "#fce7f3",
    textLight: "#9d174d",
  },
  {
    id: "red",
    bg: "#6e3630",
    text: "#f1f1ef",
    bgLight: "#fee2e2",
    textLight: "#b91c1c",
  },
  {
    id: "teal",
    bg: "#1c4a4a",
    text: "#f1f1ef",
    bgLight: "#ccfbf1",
    textLight: "#0f766e",
  },
];

export function getTagStyle(color: TagColor): {
  backgroundColor: string;
  color: string;
} {
  const c = TAG_COLORS.find((x) => x.id === color) ?? TAG_COLORS[0];

  const light =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light-mode");

  return {
    backgroundColor: light ? c.bgLight : c.bg,
    color: light ? c.textLight : c.text,
  };
}

export type OptionItem = {
  id: string;
  label: string;
  color: TagColor;
  order: number;
};

export type ColumnType =
  | "number"
  | "text"
  | "singleSelect"
  | "multiSelect"
  | "dateTime"
  | "autoStatus"
  | "autoSession"
  | "positionSize"
  | "rValue"
  | "slPips";

export type ColumnDef = {
  id: string;
  key: string;
  title: string;
  titleEn?: string;
  type: ColumnType;
  optionListKey?: "pairs" | "setups" | "confluences" | "positions" | "trends";
  width?: number;
  isDefault: boolean;
  order: number;
};

export type CaseImage = {
  id: string;
  dataUrl: string;
  caption: string;
};

/**
 * یک Case متعلق به یک Board است.
 *
 * boardId در نسخه 2 دیتابیس اضافه شده و برای جداسازی
 * Caseها بین Boardهای مختلف استفاده می‌شود.
 */
export type CaseStudy = {
  id?: number;

  boardId: number;

  tradeNumber: number;

  pairId: string | null;
  setupId: string | null;

  positionSize: number | null;
  rValue: number | null;

  status: "win" | "loss" | null;

  positionId: string | null;

  openedAt: string | null;
  closedAt: string | null;

  session: "ASIA" | "LONDON" | "NEWYORK" | "OVERLAP" | null;

  confluenceIds: string[];
  trendIds: string[];

  minSlPips: number | null;

  notes: string;

  images: CaseImage[];

  customFields: Record<string, string | number | string[] | null>;

  createdAt: number;
  updatedAt: number;
};

export type OptionLists = {
  pairs: OptionItem[];
  setups: OptionItem[];
  confluences: OptionItem[];
  positions: OptionItem[];
  trends: OptionItem[];
};

/**
 * تنظیمات هر Board.
 *
 * هر Board یک رکورد Meta جداگانه دارد و با boardId
 * به Board مربوطه متصل می‌شود.
 */
export type CaseStudiesMeta = {
  id?: number;

  boardId: number;

  columns: ColumnDef[];

  optionLists: OptionLists;

  updatedAt: number;
};

export function computeStatus(
  r: number | null | undefined,
): "win" | "loss" | null {
  if (r == null || Number.isNaN(r)) {
    return null;
  }

  if (r > 0) {
    return "win";
  }

  if (r < 0) {
    return "loss";
  }

  return null;
}

export function computeSession(iso: string | null): CaseStudy["session"] {
  if (!iso) {
    return null;
  }

  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) {
    return null;
  }

  const h = d.getHours();

  if (h >= 0 && h < 8) {
    return "ASIA";
  }

  if (h >= 8 && h < 13) {
    return "LONDON";
  }

  if (h >= 13 && h < 21) {
    return "NEWYORK";
  }

  return "OVERLAP";
}

const TITLE_FA: Record<string, string> = {
  tradeNumber: "شماره ترید",
  pairId: "جفت‌ارز",
  setupId: "ستاپ",
  positionSize: "سایز پوزیشن",
  rValue: "R",
  status: "وضعیت",
  positionId: "پوزیشن",
  openedAt: "باز شدن",
  closedAt: "بسته شدن",
  session: "سشن",
  confluenceIds: "هم‌پوشانی",
  trendIds: "روند",
  minSlPips: "حداقل استاپ (پیپ)",
  notes: "توضیحات",
};

const TITLE_EN: Record<string, string> = {
  tradeNumber: "Trade #",
  pairId: "Pair",
  setupId: "Setup",
  positionSize: "Lot Size",
  rValue: "R",
  status: "Status",
  positionId: "Position",
  openedAt: "Opened",
  closedAt: "Closed",
  session: "Session",
  confluenceIds: "Confluence",
  trendIds: "Trends",
  minSlPips: "Min SL (pips)",
  notes: "Notes",
};

export function columnTitle(col: ColumnDef, language: string): string {
  if (language === "en") {
    return col.titleEn || TITLE_EN[col.key] || col.title;
  }

  return TITLE_FA[col.key] || col.title || TITLE_EN[col.key] || col.key;
}

export type CaseBoard = {
  id?: number;
  title: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};
