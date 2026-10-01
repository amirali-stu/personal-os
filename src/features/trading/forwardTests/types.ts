export type CalendarType = "gregorian" | "jalali";

export type Markup = {
  id?: number;
  title: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type KeyLesson = {
  id?: number;
  markupId: number;
  text: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type YearTemplate = {
  id?: number;
  markupId: number;
  name: string;
  calendarType: CalendarType;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type Month = {
  id?: number;
  yearId: number;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type Week = {
  id?: number;
  monthId: number;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type TradingDayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type Day = {
  id?: number;
  weekId: number;
  dayKey: TradingDayKey;
  label: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type SectionImage = {
  id: string;
  dataUrl: string;
  caption?: string;
};

export type Section = {
  id?: number;
  dayId: number;
  title: string;
  /** default section keys for known ones */
  sectionKey?: "1d4h" | "15m5m" | "london" | "newyork" | "custom";
  order: number;
  /** TOTAL R earned */
  totalR: string;
  /** account size in currency units */
  accountSize: number;
  /** risk percent of account per trade e.g. 0.4 */
  riskPercent: number;
  /** rich text / notes */
  content: string;
  images: SectionImage[];
  createdAt: number;
  updatedAt: number;
};

export const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

export const DEFAULT_SECTION_DEFS: {
  title: string;
  titleFa: string;
  sectionKey: Section["sectionKey"];
}[] = [
  { title: "1D/4H", titleFa: "1D/4H", sectionKey: "1d4h" },
  { title: "15M/5M", titleFa: "15M/5M", sectionKey: "15m5m" },
  { title: "London", titleFa: "London", sectionKey: "london" },
  { title: "New York", titleFa: "New York", sectionKey: "newyork" },
];

export const TRADING_DAYS: {
  dayKey: TradingDayKey;
  labelEn: string;
  labelFa: string;
  order: number;
}[] = [
  { dayKey: "monday", labelEn: "Monday", labelFa: "دوشنبه", order: 0 },
  { dayKey: "tuesday", labelEn: "Tuesday", labelFa: "سه‌شنبه", order: 1 },
  { dayKey: "wednesday", labelEn: "Wednesday", labelFa: "چهارشنبه", order: 2 },
  { dayKey: "thursday", labelEn: "Thursday", labelFa: "پنجشنبه", order: 3 },
  { dayKey: "friday", labelEn: "Friday", labelFa: "جمعه", order: 4 },
];
