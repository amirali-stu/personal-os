import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export type RecentActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
};

type Props = {
  activities: RecentActivityItem[];
};

export function RecentActivity({ activities }: Props) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div>
        <h2 className="font-bold">{t("dashboard.activity.title")}</h2>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {t("dashboard.activity.subtitle")}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center md:col-span-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t("dashboard.activity.empty")}
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {activity.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
