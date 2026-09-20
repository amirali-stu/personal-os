import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";
import { formatFullDate } from "../../../lib/dateUtils";

type Props = {
  isOnline: boolean;
};

export function WelcomeHeader({ isOnline }: Props) {
  const { t } = useTranslation();

  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const timezone = useSettingsStore((state) => state.timezone);
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";

  const today = formatFullDate(new Date(), dateFormat, timezone, language);

  return (
    <section dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
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
    </section>
  );
}
  