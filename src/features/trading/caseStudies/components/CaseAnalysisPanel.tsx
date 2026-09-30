import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import type { CaseStudy, ColumnDef, OptionLists } from "../types";
import { analyzeCases } from "../utils/analyzeCases";

type Props = {
  cases: CaseStudy[];
  columns: ColumnDef[];
  optionLists: OptionLists;
};

function fmt(n: number | null, d = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toFixed(d);
}

const toneColor = {
  positive: "var(--color-success)",
  negative: "var(--cs-danger-text)",
  neutral: "var(--cs-text-soft)",
  warning: "var(--color-warning)",
} as const;

export function CaseAnalysisPanel({ cases, columns, optionLists }: Props) {
  const { i18n } = useTranslation();
  const isFa = i18n.language !== "en";
  const [open, setOpen] = useState(false);

  const analysis = useMemo(
    () => analyzeCases(cases, optionLists, columns),
    [cases, optionLists, columns],
  );

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-start transition-colors"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 size={16} />
          {isFa ? "تحلیل کل" : "Full analysis"}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {analysis.dataQuality !== "ok" && (
            <div
              className="rounded-xl border px-4 py-3 text-[13px] leading-relaxed"
              style={{
                borderColor: "var(--color-warning)",
                color: "var(--cs-text-soft)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              {analysis.dataQuality === "low"
                ? isFa
                  ? `فقط ${analysis.sampleSize} ردیف دارید. زیر ۲۰ نمونه تحلیل قابل‌اتکا نیست — داده بیشتری جمع کنید.`
                  : `Only ${analysis.sampleSize} rows. Under 20 samples analysis is unreliable — collect more data.`
                : isFa
                  ? `${analysis.sampleSize} ردیف دارید. برای نتیجهٔ محکم‌تر حدود ۵۰+ نمونه توصیه می‌شود.`
                  : `${analysis.sampleSize} rows — 50+ samples recommended for stronger conclusions.`}
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: isFa ? "نرخ برد" : "Win rate",
                value:
                  analysis.winRate != null
                    ? `${fmt(analysis.winRate, 0)}%`
                    : "—",
              },
              {
                label: isFa ? "میانگین R" : "Avg R",
                value: fmt(analysis.avgR),
              },
              {
                label: isFa ? "میانگین استاپ" : "Avg SL",
                value:
                  analysis.avgSl != null
                    ? `${fmt(analysis.avgSl, 1)} pip`
                    : "—",
              },
              {
                label: isFa ? "نمونه" : "Samples",
                value: String(analysis.sampleSize),
              },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border px-3 py-2.5"
                style={{
                  borderColor: "var(--cs-table-border)",
                  backgroundColor: "var(--cs-table-bg)",
                }}
              >
                <div
                  className="text-[11px]"
                  style={{ color: "var(--cs-muted)" }}
                >
                  {c.label}
                </div>
                <div
                  className="mt-0.5 text-base font-semibold tabular-nums"
                  style={{ color: "var(--cs-text)" }}
                >
                  {c.value}
                </div>
              </div>
            ))}
          </div>

          <div
            className="space-y-2 rounded-2xl border p-4"
            style={{
              borderColor: "var(--cs-table-border)",
              backgroundColor: "var(--cs-table-bg)",
            }}
          >
            <h4
              className="mb-2 text-sm font-semibold"
              style={{ color: "var(--cs-text)" }}
            >
              {isFa ? "جمع‌بندی و پیشنهاد" : "Insights & suggestions"}
            </h4>

            {analysis.insights.length === 0 ? (
              <p className="text-[13px]" style={{ color: "var(--cs-muted)" }}>
                {isFa
                  ? "هنوز دادهٔ کافی برای پیشنهاد مشخص نیست. چند ردیف کامل‌تر (با R، وضعیت، سشن و هم‌پوشانی) ثبت کن."
                  : "Not enough data for concrete suggestions yet. Add more complete rows (R, status, session, confluence)."}
              </p>
            ) : (
              analysis.insights.map((ins) => (
                <div
                  key={ins.id}
                  className="rounded-xl border px-3 py-2.5 text-[13px] leading-relaxed"
                  style={{
                    borderColor: "var(--cs-table-border)",
                    borderInlineStartWidth: 3,
                    borderInlineStartColor: toneColor[ins.tone],
                    color: "var(--cs-text)",
                  }}
                >
                  {isFa ? ins.text : ins.textEn}
                </div>
              ))
            )}
          </div>

          {analysis.customNumbers.length > 0 && (
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: "var(--cs-table-border)",
                backgroundColor: "var(--cs-table-bg)",
              }}
            >
              <h4
                className="mb-3 text-sm font-semibold"
                style={{ color: "var(--cs-text)" }}
              >
                {isFa ? "ستون‌های عددی سفارشی" : "Custom numeric columns"}
              </h4>
              {analysis.customNumbers.map((c) => (
                <div
                  key={c.key}
                  className="flex justify-between gap-3 py-1.5 text-[13px]"
                  style={{ color: "var(--cs-text)" }}
                >
                  <span>{c.title}</span>
                  <span
                    className="tabular-nums"
                    style={{ color: "var(--cs-text-soft)" }}
                  >
                    avg {fmt(c.avg)} · {fmt(c.min)}–{fmt(c.max)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
