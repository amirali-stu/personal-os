import { CalendarDays, Clock3 } from "lucide-react";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { formatPersianDate } from "../../../lib/dateUtils";

export function TradingHeader() {
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const timezone = useSettingsStore((state) => state.timezone);

  const today = new Date();

  const formattedDate = formatPersianDate(today, dateFormat, timezone);

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <CalendarDays size={15} />
        <span>ژورنال شخصی</span>
      </div>

      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ژورنال ترید
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            ثبت معاملات و بررسی کیفیت اجرای پلن
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <Clock3 size={16} className="text-[var(--color-primary)]" />

          <span className="text-xs text-[var(--color-text-secondary)]">
            امروز
          </span>

          <span className="text-sm font-semibold text-white">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
