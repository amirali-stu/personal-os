import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Save } from "lucide-react";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { getTodayDate } from "../../../lib/dateUtils";
import { useToast } from "../../../components/ui/Toast";

const STORAGE_KEY = "personal-os-daily-reviews";

type ReviewsMap = Record<string, string>;

function loadReviews(): ReviewsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ReviewsMap;
  } catch {
    return {};
  }
}

function saveReviews(map: ReviewsMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

type Props = {
  date?: string;
};

export function DailyReview({ date }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const timezone = useSettingsStore((s) => s.timezone);
  const isRtl = language === "fa";
  const toast = useToast();

  const targetDate = date ?? getTodayDate(timezone);
  const [text, setText] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const map = loadReviews();
    setText(map[targetDate] ?? "");
    setDirty(false);
  }, [targetDate]);

  function handleSave() {
    const map = loadReviews();
    const value = text.trim();
    if (value) map[targetDate] = value;
    else delete map[targetDate];
    saveReviews(map);
    setDirty(false);
    toast.success(
      t("dashboard.review.saved", {
        defaultValue: isRtl ? "خلاصه روز ذخیره شد" : "Daily review saved",
      }),
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold">
              {t("dashboard.review.title", {
                defaultValue: isRtl ? "خلاصه روز" : "Daily review",
              })}
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {t("dashboard.review.subtitle", {
                defaultValue: isRtl
                  ? "چند خط درباره این روز بنویس"
                  : "Write a short note about this day",
              })}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 text-xs font-semibold text-white transition enabled:hover:bg-[var(--color-primary-hover)] disabled:opacity-40"
        >
          <Save size={14} />
          {t("common.save")}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setDirty(true);
        }}
        rows={4}
        placeholder={t("dashboard.review.placeholder", {
          defaultValue: isRtl
            ? "امروز چه چیزهایی خوب پیش رفت؟ چه چیزی یاد گرفتی؟..."
            : "What went well today? What did you learn?...",
        })}
        className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
      />
    </section>
  );
}
