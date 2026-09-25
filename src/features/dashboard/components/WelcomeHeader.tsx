import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { formatFullDate } from "../../../lib/dateUtils";
import { QUOTES, type Quote } from "../data/quotes";

type Props = {
  isOnline: boolean;
};

type StoredQuote = {
  id: number;
  date: string;
};

const STORAGE_KEY = "dashboard_daily_quote";
const SHOWN_IDS_KEY = "dashboard_shown_quote_ids";

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getRandomQuote(excludeIds: number[] = []): Quote {
  const available = QUOTES.filter((q) => !excludeIds.includes(q.id));

  const pool = available.length > 0 ? available : QUOTES;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function WelcomeHeader({ isOnline }: Props) {
  const { t } = useTranslation();

  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const timezone = useSettingsStore((state) => state.timezone);
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";
  const today = formatFullDate(new Date(), dateFormat, timezone, language);

  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const todayKey = getTodayKey();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredQuote = JSON.parse(stored);
        if (parsed.date === todayKey) {
          const found = QUOTES.find((q) => q.id === parsed.id);
          if (found) {
            setQuote(found);
            return;
          }
        }
      }
    } catch {}

    let shownIds: number[] = [];
    try {
      const raw = localStorage.getItem(SHOWN_IDS_KEY);
      if (raw) shownIds = JSON.parse(raw);
    } catch {
      shownIds = [];
    }

    const selected = getRandomQuote(shownIds);
    setQuote(selected);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ id: selected.id, date: todayKey }),
      );
    } catch {}

    try {
      const updated = [...shownIds, selected.id].slice(-50);
      localStorage.setItem(SHOWN_IDS_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  if (!quote) return null;

  const text = language === "fa" ? quote.text.fa : quote.text.en;
  const author = language === "fa" ? quote.author.fa : quote.author.en;

  return (
    <section dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <p className="mb-2 text-start text-sm text-[var(--color-primary)]">
            {today}
          </p>

          <h1 className="text-start text-3xl font-bold tracking-tight sm:text-4xl">
            {t("dashboard.title")}
          </h1>

          <p className="mt-2 text-start text-sm text-[var(--color-text-secondary)]">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div
          className={[
            "text-start text-sm",
            isOnline
              ? "text-[var(--color-success)]"
              : "text-[var(--color-warning)]",
          ].join(" ")}
        >
          {t("dashboard.systemStatus")}:{" "}
          {isOnline ? t("common.online") : t("common.offline")}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
        <p className="text-start text-[15px] leading-7 text-[var(--color-text-secondary)]">
          «{text}»
        </p>
        <p className="mt-2 text-start text-sm font-medium text-[var(--color-primary)]">
          — {author}
        </p>
      </div>
    </section>
  );
}
