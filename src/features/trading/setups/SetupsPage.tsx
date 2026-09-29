import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Rocket, Trash2 } from "lucide-react";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { TradingSubNav } from "../components/TradingSubNav";
import { useSetups } from "./hooks/useSetups";

export function SetupsPage() {
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const { setups, loading, addSetup, deleteSetup } = useSetups();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  async function handleAdd() {
    const title = newTitle.trim() || undefined;
    await addSetup(title ?? "");
    setNewTitle("");
    setAdding(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-start">
          <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Rocket size={14} />
            <span>ستاپ‌ها</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ستاپ‌ها
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            مدل‌های ورود — روی هر کدام کلیک کن تا جزئیات و عکس‌ها رو ببینی
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {setups.map((setup, index) => (
          <div
            key={setup.id}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface-hover)]"
          >
            <Link
              to={`/trading/setups/${setup.id}`}
              className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="truncate text-start text-sm font-medium text-white">
                {setup.title}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`«${setup.title}» حذف شود؟`)) {
                  deleteSetup(setup.id!);
                }
              }}
              className="me-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
              title="حذف"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setAdding(false);
                setNewTitle("");
              }
            }}
            placeholder="عنوان مدل ورود جدید..."
            className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90"
            >
              افزودن
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setNewTitle("");
              }}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            >
              لغو
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-white"
        >
          <Plus size={18} />
          افزودن مدل ورود جدید
        </button>
      )}
    </div>
  );
}
