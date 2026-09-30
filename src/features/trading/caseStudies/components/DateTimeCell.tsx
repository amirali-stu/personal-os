import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { Calendar, Clock } from "lucide-react";
import { useSettingsStore } from "../../../../app/store/settingsStore";

type Props = {
  value: string | null;
  onChange: (iso: string | null) => void;
};

const persianFmt = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function toPersianParts(d: Date) {
  const parts = persianFmt.formatToParts(d);
  return {
    year: Number(parts.find((p) => p.type === "year")?.value),
    month: Number(parts.find((p) => p.type === "month")?.value),
    day: Number(parts.find((p) => p.type === "day")?.value),
  };
}

function persianToGregorian(py: number, pm: number, pd: number): Date {
  let guess = new Date(py + 621, pm - 1, pd);
  for (let i = 0; i < 400; i++) {
    const p = toPersianParts(guess);
    if (p.year === py && p.month === pm && p.day === pd) return guess;
    const dy = py - p.year;
    const dm = pm - p.month;
    const dd = pd - p.day;
    guess = new Date(guess.getTime() + (dy * 365 + dm * 30 + dd) * 86400000);
  }
  return guess;
}

const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

function daysInPersianMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  const d30 = persianToGregorian(year, 12, 30);
  const p = toPersianParts(d30);
  return p.year === year && p.month === 12 && p.day === 30 ? 30 : 29;
}

function formatDisplay(iso: string | null, jalali: boolean, withTime: boolean) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  if (jalali) {
    const p = toPersianParts(d);
    const base = `${p.year}/${String(p.month).padStart(2, "0")}/${String(p.day).padStart(2, "0")}`;
    if (!withTime) return base;
    return `${base} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  const base = d.toLocaleDateString("en-CA");
  if (!withTime) return base;
  return `${base} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function DateTimeCell({ value, onChange }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const dateFormat = useSettingsStore((s) => s.dateFormat);
  const isJalali = language === "fa" && dateFormat === "jalali";

  const [open, setOpen] = useState(false);
  const [includeTime, setIncludeTime] = useState(() => {
    if (!value) return false;
    const d = new Date(value);
    return d.getHours() !== 0 || d.getMinutes() !== 0;
  });
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    maxHeight: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const initial = useMemo(() => {
    if (value) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        if (isJalali) {
          const p = toPersianParts(d);
          return { y: p.year, m: p.month, day: p.day, h: d.getHours(), min: d.getMinutes() };
        }
        return {
          y: d.getFullYear(),
          m: d.getMonth() + 1,
          day: d.getDate(),
          h: d.getHours(),
          min: d.getMinutes(),
        };
      }
    }
    const now = new Date();
    if (isJalali) {
      const p = toPersianParts(now);
      return { y: p.year, m: p.month, day: p.day, h: now.getHours(), min: now.getMinutes() };
    }
    return {
      y: now.getFullYear(),
      m: now.getMonth() + 1,
      day: now.getDate(),
      h: now.getHours(),
      min: now.getMinutes(),
    };
  }, [value, isJalali, open]);

  const [y, setY] = useState(initial.y);
  const [m, setM] = useState(initial.m);
  const [day, setDay] = useState(initial.day);
  const [h, setH] = useState(initial.h);
  const [min, setMin] = useState(initial.min);

  useEffect(() => {
    if (open) {
      setY(initial.y);
      setM(initial.m);
      setDay(initial.day);
      setH(initial.h);
      setMin(initial.min);
    }
  }, [open, initial]);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) {
      setMenuPos(null);
      setVisible(false);
      return;
    }
    const rect = btnRef.current.getBoundingClientRect();
    const width = 288;
    const gap = 6;
    const margin = 12;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    // prefer below; if not enough room, open above
    const preferBelow = spaceBelow >= 220 || spaceBelow >= spaceAbove;
    const maxHeight = Math.min(360, Math.max(180, preferBelow ? spaceBelow : spaceAbove));
    let top: number;
    if (preferBelow) {
      top = rect.bottom + gap;
    } else {
      top = Math.max(margin, rect.top - maxHeight - gap);
    }
    let left = rect.left;
    if (left + width > window.innerWidth - margin) left = window.innerWidth - width - margin;
    if (left < margin) left = margin;
    setMenuPos({ top, left, maxHeight });
    requestAnimationFrame(() => setVisible(true));
  }, [open, includeTime]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (document.querySelector("[data-datetime-portal]")?.contains(t)) return;
      setVisible(false);
      setTimeout(() => setOpen(false), 100);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const maxDay = isJalali ? daysInPersianMonth(y, m) : new Date(y, m, 0).getDate();

  function apply() {
    let d: Date;
    if (isJalali) {
      d = persianToGregorian(y, m, Math.min(day, maxDay));
    } else {
      d = new Date(y, m - 1, Math.min(day, maxDay));
    }
    if (includeTime) d.setHours(h, min, 0, 0);
    else d.setHours(0, 0, 0, 0);
    onChange(d.toISOString());
    setVisible(false);
    setTimeout(() => setOpen(false), 100);
  }

  function clear() {
    onChange(null);
    setVisible(false);
    setTimeout(() => setOpen(false), 100);
  }

  const hasTime =
    !!value &&
    (new Date(value).getHours() !== 0 || new Date(value).getMinutes() !== 0);
  const display = formatDisplay(value, isJalali, hasTime);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[32px] w-full items-center gap-2 rounded px-1.5 py-1 text-start text-[12px] transition-colors duration-150"
        style={{ color: "var(--cs-text)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--cs-table-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Calendar size={13} style={{ color: "var(--cs-muted)", flexShrink: 0 }} />
        <span className="truncate">
          {display || (
            <span style={{ color: "var(--cs-muted)" }}>
              {t("trading.caseStudies.pickDate")}
            </span>
          )}
        </span>
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            data-datetime-portal
            className="fixed overflow-y-auto rounded-lg border shadow-2xl"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: 288,
              maxHeight: menuPos.maxHeight,
              zIndex: 10000,
              backgroundColor: "var(--cs-dropdown-bg)",
              borderColor: "var(--cs-dropdown-border)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.98)",
              transition: "opacity 120ms ease, transform 120ms ease",
            }}
          >
            <div className="p-3">
              <div className="mb-2.5 grid grid-cols-3 gap-2">
                <label className="text-[11px]" style={{ color: "var(--cs-muted)" }}>
                  {t("trading.caseStudies.year")}
                  <input
                    type="number"
                    value={y}
                    onChange={(e) => setY(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border px-2 py-1.5 text-[12px] outline-none"
                    style={{
                      backgroundColor: "var(--cs-input-bg)",
                      borderColor: "var(--cs-dropdown-border)",
                      color: "var(--cs-text)",
                    }}
                  />
                </label>
                <label className="text-[11px]" style={{ color: "var(--cs-muted)" }}>
                  {t("trading.caseStudies.month")}
                  {isJalali ? (
                    <select
                      value={m}
                      onChange={(e) => setM(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border px-1 py-1.5 text-[12px] outline-none"
                      style={{
                        backgroundColor: "var(--cs-input-bg)",
                        borderColor: "var(--cs-dropdown-border)",
                        color: "var(--cs-text)",
                      }}
                    >
                      {PERSIAN_MONTHS.map((name, i) => (
                        <option key={name} value={i + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={m}
                      onChange={(e) => setM(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border px-2 py-1.5 text-[12px] outline-none"
                      style={{
                        backgroundColor: "var(--cs-input-bg)",
                        borderColor: "var(--cs-dropdown-border)",
                        color: "var(--cs-text)",
                      }}
                    />
                  )}
                </label>
                <label className="text-[11px]" style={{ color: "var(--cs-muted)" }}>
                  {t("trading.caseStudies.day")}
                  <input
                    type="number"
                    min={1}
                    max={maxDay}
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border px-2 py-1.5 text-[12px] outline-none"
                    style={{
                      backgroundColor: "var(--cs-input-bg)",
                      borderColor: "var(--cs-dropdown-border)",
                      color: "var(--cs-text)",
                    }}
                  />
                </label>
              </div>

              <label
                className="mb-2 flex items-center gap-2 text-[12px]"
                style={{ color: "var(--cs-text-soft)" }}
              >
                <input
                  type="checkbox"
                  checked={includeTime}
                  onChange={(e) => setIncludeTime(e.target.checked)}
                  className="h-3.5 w-3.5 rounded"
                />
                <Clock size={12} />
                {t("trading.caseStudies.includeTime")}
              </label>

              {includeTime && (
                <div className="mb-2.5 flex gap-2">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={h}
                    onChange={(e) => setH(Number(e.target.value))}
                    className="w-full rounded-md border px-2 py-1.5 text-[12px] outline-none"
                    style={{
                      backgroundColor: "var(--cs-input-bg)",
                      borderColor: "var(--cs-dropdown-border)",
                      color: "var(--cs-text)",
                    }}
                    placeholder={t("trading.caseStudies.hour")}
                  />
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                    className="w-full rounded-md border px-2 py-1.5 text-[12px] outline-none"
                    style={{
                      backgroundColor: "var(--cs-input-bg)",
                      borderColor: "var(--cs-dropdown-border)",
                      color: "var(--cs-text)",
                    }}
                    placeholder={t("trading.caseStudies.min")}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={apply}
                  className="flex-1 rounded-md py-2 text-[12px] font-medium"
                  style={{ backgroundColor: "var(--cs-dropdown-border)", color: "var(--cs-text)" }}
                >
                  {t("trading.caseStudies.confirm")}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-md border px-3 py-2 text-[12px]"
                  style={{ borderColor: "var(--cs-dropdown-border)", color: "var(--cs-muted)" }}
                >
                  {t("trading.caseStudies.clear")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
