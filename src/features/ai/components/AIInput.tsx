import { ArrowUp, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function AIInput({
  value,
  disabled = false,
  onChange,
  onSubmit,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [value]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  }

  return (
    <div
      className={`rounded-2xl border bg-[var(--color-surface)] p-2 transition-all ${
        focused
          ? "border-[var(--color-primary)]/60 shadow-lg shadow-purple-500/5"
          : "border-[var(--color-border)]"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="پیامت را برای دستیار بنویس..."
        className="block max-h-[140px] min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-xs leading-6 text-white outline-none placeholder:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          disabled={disabled}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="افزودن فایل"
          title="افزودن فایل"
        >
          <Paperclip size={16} />
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-all hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="ارسال پیام"
          title="ارسال"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
