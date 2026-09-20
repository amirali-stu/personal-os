import { BarChart3, CalendarCheck, LineChart, ListTodo } from "lucide-react";

type Props = {
  onSelect: (text: string) => void;
};

const actions = [
  {
    label: "بررسی کارهای امروز",
    icon: ListTodo,
    prompt: "کارهای امروز من را بررسی کن",
  },
  {
    label: "تحلیل عملکرد ترید",
    icon: BarChart3,
    prompt: "عملکرد ترید من را تحلیل کن",
  },
  {
    label: "تحلیل بازار",
    icon: LineChart,
    prompt: "وضعیت بازار را بررسی کن",
  },
  {
    label: "برنامه امروز",
    icon: CalendarCheck,
    prompt: "برای امروز یک برنامه پیشنهادی بساز",
  },
];

export function AIQuickActions({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onSelect(action.prompt)}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-right transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] active:scale-[0.98]"
          >
            <Icon size={15} className="shrink-0 text-[var(--color-primary)]" />

            <span className="truncate text-[10px] font-medium text-[var(--color-text-secondary)]">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
