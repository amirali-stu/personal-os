import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
};

export function SettingsSection({ title, description, icon, children }: Props) {
  return (
    <section className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">{title}</h2>

          {description && (
            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="divide-y divide-[var(--color-border)]">{children}</div>
    </section>
  );
}
