import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  GripVertical,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
import { TradingSubNav } from "../components/TradingSubNav";
import { useMarkups } from "./hooks/useForwardTests";
import { useSettingsStore } from "../../../app/store/settingsStore";

export function ForwardTestsPage() {
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";
  const { markups, loading, addMarkup, updateMarkup, deleteMarkup, reorderMarkups } =
    useMarkups();

  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [dragId, setDragId] = useState<number | null>(null);

  async function handleAdd() {
    await addMarkup(newTitle.trim() || undefined);
    setNewTitle("");
    setAdding(false);
  }

  async function handleRename(id: number) {
    if (editTitle.trim()) {
      await updateMarkup(id, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle("");
  }

  function handleDragStart(id: number) {
    setDragId(id);
  }

  async function handleDrop(targetId: number) {
    if (dragId == null || dragId === targetId) {
      setDragId(null);
      return;
    }
    const ids = markups.map((m) => m.id!).filter(Boolean);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) {
      setDragId(null);
      return;
    }
    ids.splice(from, 1);
    ids.splice(to, 0, dragId);
    await reorderMarkups(ids);
    setDragId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        {isRtl ? "در حال بارگذاری..." : "Loading..."}
      </div>
    );
  }

  // Empty state matching screenshot
  if (markups.length === 0 && !adding) {
    return (
      <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
        <TradingSubNav />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-fuchsia-600/40 shadow-[0_0_40px_rgba(168,85,247,0.35)]">
            <Sparkles size={32} className="text-purple-300" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            {isRtl ? "فوروارد تست" : "Forward Tests"}
          </h1>
          <p className="mb-8 max-w-md text-sm text-[var(--color-text-secondary)]">
            {isRtl
              ? "مارک‌آپ‌های فوروارد تست خود را بسازید و تحلیل‌های هفتگی را ثبت کنید."
              : "Create your forward test markups and log weekly analysis."}
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-white"
          >
            <Plus size={16} />
            {isRtl ? "ساخت مارک‌آپ جدید" : "Generate New Markups Template"}
          </button>
          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <LayoutTemplate size={14} />
            <span>{isRtl ? "مارک‌آپ‌ها" : "Markups"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-start">
          <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Sparkles size={14} />
            <span>{isRtl ? "فوروارد تست" : "Forward Tests"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isRtl ? "مارک‌آپ‌ها" : "Markups"}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {isRtl
              ? "مارک‌آپ‌های خود را مدیریت کنید — روی هر کدام کلیک کنید تا تمپلیت‌ها را ببینید"
              : "Manage your markups — click one to view year templates"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {markups.map((m) => (
          <div
            key={m.id}
            draggable
            onDragStart={() => handleDragStart(m.id!)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => void handleDrop(m.id!)}
            className={[
              "group flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface-hover)]",
              dragId === m.id ? "opacity-50" : "",
            ].join(" ")}
          >
            <span className="cursor-grab px-2 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100">
              <GripVertical size={16} />
            </span>

            {editingId === m.id ? (
              <div className="flex min-w-0 flex-1 items-center gap-2 px-2 py-3">
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleRename(m.id!);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditTitle("");
                    }
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => void handleRename(m.id!)}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs text-white"
                >
                  {isRtl ? "ذخیره" : "Save"}
                </button>
              </div>
            ) : (
              <Link
                to={`/trading/forward-tests/${m.id}`}
                className="flex min-w-0 flex-1 items-center gap-3 py-4 pe-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300">
                  <Sparkles size={16} />
                </span>
                <span className="truncate text-start text-sm font-medium text-white">
                  {m.title}
                </span>
              </Link>
            )}

            {editingId !== m.id && (
              <div className="flex items-center gap-1 pe-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(m.id!);
                    setEditTitle(m.title);
                  }}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-white"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        isRtl
                          ? "مارک‌آپ و تمام محتوای آن حذف شود؟"
                          : "Delete this markup and all its content?",
                      )
                    ) {
                      void deleteMarkup(m.id!);
                    }
                  }}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}

        {adding ? (
          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAdd();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewTitle("");
                }
              }}
              placeholder={
                isRtl ? "عنوان مارک‌آپ جدید..." : "New markup title..."
              }
              className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleAdd()}
                className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
              >
                {isRtl ? "ایجاد" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setNewTitle("");
                }}
                className="rounded-xl px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              >
                {isRtl ? "لغو" : "Cancel"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-4 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-white"
          >
            <Plus size={16} />
            {isRtl ? "ساخت مارک‌آپ جدید" : "Generate New Markups Template"}
          </button>
        )}
      </div>
    </div>
  );
}
