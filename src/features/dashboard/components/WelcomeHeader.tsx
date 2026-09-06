import { useSettingsStore } from "../../../app/store/settingsStore";
import { formatFullDate } from "../../../lib/dateUtils";

type Props = {
  isOnline: boolean;
};

export function WelcomeHeader({ isOnline }: Props) {
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const timezone = useSettingsStore((state) => state.timezone);

  const today = formatFullDate(new Date(), dateFormat, timezone);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-[var(--color-primary)]">{today}</p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            داشبورد
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            نمای کلی از وضعیت امروزت
          </p>
        </div>

        <div
          className={[
            "text-sm",
            isOnline
              ? "text-[var(--color-success)]"
              : "text-[var(--color-warning)]",
          ].join(" ")}
        >
          وضعیت سیستم: {isOnline ? "آنلاین" : "آفلاین"}
        </div>
      </div>
    </section>
  );
}
