import { CheckCircle2 } from "lucide-react";

type Props = {
  count: number;
  limit: number;
};

export function DailyLimit({ count, limit }: Props) {
  const reached = count >= limit;

  return (
    <div
      className={[
        "rounded-2xl border p-4",
        reached
          ? "border-[rgba(234,179,8,0.25)] bg-[rgba(234,179,8,0.06)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">
            محدودیت معاملات روزانه
          </div>

          <div className="mt-1 text-xs text-[var(--color-text-muted)]">
            حداکثر {limit} معامله در هر روز مجاز است.
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

          <span className="mr-1 text-xs text-[var(--color-text-secondary)]">
            {count} از {limit}
          </span>
        </div>
      </div>
    </div>
  );
}
