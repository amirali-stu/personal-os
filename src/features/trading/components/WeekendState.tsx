import { CalendarDays } from "lucide-react";

export function WeekendState() {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-hover)] text-[var(--color-primary)]">
          <CalendarDays size={26} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-white">
          بازار در تعطیلات است
        </h2>

        <p className="mt-2 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
          از تعطیلات خود لذت ببر و برای شروع هفته آماده شو.
        </p>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-xs leading-6 text-[var(--color-text-muted)]">
          ثبت معامله در شنبه و یکشنبه غیرفعال است.
          <br />
          معاملات قبلی همچنان پایین صفحه در دسترس هستند.
        </div>
      </div>
    </section>
  );
}
