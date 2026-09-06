import type { LucideIcon } from "lucide-react";

type StatType = "default" | "success" | "danger";

type Props = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  type?: StatType;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  type = "default",
}: Props) {
  const iconClass =
    type === "success"
      ? "bg-[rgba(34,197,94,0.1)] text-[var(--color-success)]"
      : type === "danger"
        ? "bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]"
        : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]";

  const descriptionClass =
    type === "success"
      ? "text-[var(--color-success)]"
      : type === "danger"
        ? "text-[var(--color-danger)]"
        : "text-[var(--color-text-muted)]";

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-border-hover)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>

          <p
            dir="ltr"
            className="mt-3 text-right text-2xl font-bold tracking-tight"
          >
            {value}
          </p>

          <p className={["mt-1 text-xs", descriptionClass].join(" ")}>
            {description}
          </p>
        </div>

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            iconClass,
          ].join(" ")}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
