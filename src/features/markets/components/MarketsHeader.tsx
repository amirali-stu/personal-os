// components/MarketsHeader.tsx
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";

type Props = {
  isOnline: boolean;
};

export function MarketsHeader({ isOnline }: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="text-start">
        <h1 className="text-xl font-bold text-white">
          {t("markets.title", {
            defaultValue: isRtl ? "بازارها" : "Markets",
          })}
        </h1>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {t("markets.subtitle", {
            defaultValue: isRtl
              ? "بازارهای مهم و مورد علاقه شما"
              : "Important markets and your favorites",
          })}
        </p>
      </div>

      <div
        className={[
          "flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-[11px]",
          isOnline
            ? "border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.06)] text-[var(--color-success)]"
            : "border-[rgba(234,179,8,0.2)] bg-[rgba(234,179,8,0.06)] text-[var(--color-warning)]",
        ].join(" ")}
      >
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            isOnline
              ? "bg-[var(--color-success)]"
              : "bg-[var(--color-warning)]",
          ].join(" ")}
        />

        <Activity size={13} />

        {isOnline
          ? t("markets.online", {
              defaultValue: isRtl ? "اتصال آنلاین" : "Online connection",
            })
          : t("markets.cached", {
              defaultValue: isRtl ? "آخرین داده ذخیره‌شده" : "Last saved data",
            })}
      </div>
    </div>
  );
}
