type Props = {
  label: string;
  description?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-white">{label}</p>

        {description && (
          <p className="mt-1 text-[10px] leading-5 text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-all ${
          checked ? "bg-[var(--color-primary)]" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
            checked ? "right-1" : "right-6"
          }`}
        />
      </button>
    </div>
  );
}
