import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  description?: string;
  value: string;
  options: Option[];
  onChange?: (value: string) => void;
};

export function SettingsSelect({
  label,
  description,
  value,
  options,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium text-white">{label}</p>

        {description && (
          <p className="mt-1 text-[10px] leading-5 text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>

      <div ref={wrapperRef} className="relative w-full sm:w-48">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-[var(--color-bg)] px-3 text-xs transition-all ${
            open
              ? "border-[var(--color-primary)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
          }`}
        >
          <span className="truncate text-white">
            {selectedOption?.label ?? "انتخاب کنید"}
          </span>

          <ChevronDown
            size={15}
            className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-2xl shadow-black/40">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-white"
                  }`}
                >
                  <span>{option.label}</span>

                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
