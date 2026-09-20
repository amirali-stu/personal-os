import { useTranslation } from "react-i18next";
import { Pause, Play, RotateCcw, Focus } from "lucide-react";

import { useSettingsStore } from "../../app/store/settingsStore";
import {
  useFocusStore,
  FOCUS_SECONDS,
  BREAK_SECONDS,
} from "../../app/store/focusStore";
import { ProgressRing } from "../../components/ui/ProgressRing";

export function PomodoroPanel({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const mode = useFocusStore((s) => s.mode);
  const secondsLeft = useFocusStore((s) => s.secondsLeft);
  const running = useFocusStore((s) => s.running);
  const sessions = useFocusStore((s) => s.sessions);
  const toggle = useFocusStore((s) => s.toggle);
  const reset = useFocusStore((s) => s.reset);

  const total = mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  const progress = Math.round(((total - secondsLeft) / total) * 100);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <section
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Focus size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold">
            {t("focus.title", {
              defaultValue: isRtl ? "حالت تمرکز (Pomodoro)" : "Focus Mode",
            })}
          </h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {mode === "focus"
              ? t("focus.focusMode", {
                  defaultValue: isRtl ? "زمان تمرکز" : "Focus session",
                })
              : t("focus.breakMode", {
                  defaultValue: isRtl ? "استراحت کوتاه" : "Short break",
                })}
            {" · "}
            {sessions}{" "}
            {t("focus.sessions", {
              defaultValue: isRtl ? "جلسه" : "sessions",
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <ProgressRing
            progress={progress}
            size={compact ? 100 : 120}
            strokeWidth={7}
            showLabel={false}
          />
          <span className="pointer-events-none absolute text-xl font-bold tabular-nums tracking-wider">
            {timeStr}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="flex h-11 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running
              ? t("focus.pause", { defaultValue: isRtl ? "توقف" : "Pause" })
              : t("focus.start", { defaultValue: isRtl ? "شروع" : "Start" })}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            aria-label="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
