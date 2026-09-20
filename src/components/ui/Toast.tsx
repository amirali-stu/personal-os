import { useEffect } from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useToastStore, type Toast as ToastItem } from "../../app/store/toastStore";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/40 bg-red-500/10 text-red-400",
  info: "border-[var(--color-primary)]/40 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const Icon = icons[toast.type];

  return (
    <div
      className={`flex min-w-[280px] max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300 ${colors[toast.type]}`}
      role="alert"
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm leading-relaxed text-[var(--color-text)]">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="shrink-0 rounded-md p-0.5 text-[var(--color-text-muted)] transition hover:text-white"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  return {
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
    warning: (msg: string) => addToast(msg, "warning"),
  };
}
