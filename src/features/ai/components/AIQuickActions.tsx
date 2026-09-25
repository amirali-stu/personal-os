import {
  BarChart3,
  CalendarX,
  Percent,
  ShieldAlert,
  TrendingDown,
} from "lucide-react";

type Props = {
  onSelect: (text: string) => void;
};

const actions = [
  {
    label: "تحلیل کلی ژورنال",
    icon: BarChart3,
    prompt: "کل ژورنال من را تحلیل کن و نقاط قوت و ضعفم را بگو",
  },
  {
    label: "علت استاپ‌ها",
    icon: TrendingDown,
    prompt: "علت اصلی استاپ‌ها و ضررهای من چیست؟ الگوها را پیدا کن",
  },
  {
    label: "پیشنهاد ریسک",
    icon: Percent,
    prompt: "با توجه به ژورنالم، چند درصد ریسک برای هر معامله پیشنهاد می‌دهی؟",
  },
  {
    label: "روزهای خطرناک",
    icon: CalendarX,
    prompt: "کدام روزهای هفته برای من خطرناک‌تر است و بهتر است ترید نکنم؟",
  },
  {
    label: "مدیریت احساسات",
    icon: ShieldAlert,
    prompt:
      "از روی ژورنالم بگو مشکل اصلی روانشناسی ترید من چیست و چطور درستش کنم",
  },
];

export function AIQuickActions({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
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
