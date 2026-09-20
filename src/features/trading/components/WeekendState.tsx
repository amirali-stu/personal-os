// src/features/trading/components/WeekendState.tsx

import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";

export function WeekendState() {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const text = (key: string, fa: string, en: string) =>
    t(key, {
      defaultValue: isRtl ? fa : en,
    });

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
    >
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-hover)] text-[var(--color-primary)]">
          <CalendarDays size={26} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-white">
          {text(
            "tasks.weekend.title",
            "بازار در تعطیلات است",
            "The market is closed for the weekend",
          )}
        </h2>

        <p className="mt-2 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          {text(
            "tasks.weekend.description",
            "از تعطیلات خود لذت ببر و برای شروع هفته آماده شو.",
            "Enjoy your weekend and get ready for the new week.",
          )}
        </p>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-xs leading-6 text-[var(--color-text-muted)]">
          {text(
            "tasks.weekend.notice",
            "ثبت معامله در شنبه و یکشنبه غیرفعال است.",
            "Trade entry is disabled on Saturday and Sunday.",
          )}

          <br />

          {text(
            "tasks.weekend.history",
            "معاملات قبلی همچنان پایین صفحه در دسترس هستند.",
            "Previous trades are still available below.",
          )}
        </div>
      </div>
    </section>
  );
}
