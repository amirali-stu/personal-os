// src/features/trading/components/DailyLimit.tsx

import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../../app/store/settingsStore";

type Props = {
  count: number;
  limit: number;
};

export function DailyLimit({ count, limit }: Props) {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const reached = count >= limit;

  const formatNumber = (value: number) =>
    value.toLocaleString(isRtl ? "fa-IR" : "en-US");

  const title = t("tasks.dailyLimit.title", {
    defaultValue: isRtl ? "محدودیت معاملات روزانه" : "Daily Trading Limit",
  });

  const description = t("tasks.dailyLimit.description", {
    defaultValue: isRtl
      ? `حداکثر ${formatNumber(limit)} معامله در هر روز مجاز است.`
      : `Up to ${formatNumber(limit)} trades are allowed each day.`,
  });

  const countText = isRtl
    ? `${formatNumber(count)} از ${formatNumber(limit)}`
    : `${formatNumber(count)} of ${formatNumber(limit)}`;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={[
        "rounded-2xl border p-4",
        reached
          ? "border-[rgba(234,179,8,0.25)] bg-[rgba(234,179,8,0.06)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <div className="text-sm font-semibold text-white">{title}</div>

          <div className="mt-1 text-xs text-[var(--color-text-muted)]">
            {description}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className={[
                "h-2.5 w-16 rounded-full",
                index < count
                  ? "bg-[var(--color-primary)] shadow-[0_0_10px_rgba(168,85,247,0.35)]"
                  : "bg-[var(--color-surface-hover)]",
              ].join(" ")}
            />
          ))}

          <span className="ms-1 text-xs text-[var(--color-text-secondary)]">
            {countText}
          </span>
        </div>
      </div>
    </div>
  );
}
