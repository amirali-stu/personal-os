import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookMarked, Plus, Trash2, Pencil } from "lucide-react";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { TradingSubNav } from "../components/TradingSubNav";
import { useCaseBoards } from "./hooks/useCaseBoards";
import { ConfirmDialog } from "./components/ConfirmDialog";

export function CaseStudiesPage() {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const { boards, loading, addBoard, updateBoard, deleteBoard } =
    useCaseBoards();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleAdd() {
    await addBoard(newTitle.trim() || undefined);
    setNewTitle("");
    setAdding(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        {t("trading.caseStudies.loading")}
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="text-start">
        <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <BookMarked size={14} />
          <span>{t("trading.caseStudies.title")}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t("trading.caseStudies.title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {t("trading.caseStudies.subtitle")}
        </p>
      </div>

      <div className="space-y-2">
        {boards.map((board, index) => (
          <div
            key={board.id}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface-hover)]"
          >
            {editingId === board.id ? (
              <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3">
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editTitle.trim()) {
                      updateBoard(board.id!, { title: editTitle.trim() });
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (editTitle.trim()) {
                      updateBoard(board.id!, { title: editTitle.trim() });
                      setEditingId(null);
                    }
                  }}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs text-white"
                >
                  {t("trading.caseStudies.save")}
                </button>
              </div>
            ) : (
              <Link
                to={`/trading/case-studies/${board.id}`}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="truncate text-start text-sm font-medium text-white">
                  {board.title}
                </span>
              </Link>
            )}

            <div className="flex items-center gap-1 pe-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => {
                  setEditingId(board.id!);
                  setEditTitle(board.title);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(board.id!)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder={
              t("trading.caseStudies.titlePlaceholder")
            }
            className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white"
          >
            {t("trading.caseStudies.add")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-4 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-white"
        >
          <Plus size={16} />
          {t("trading.caseStudies.newBoard")}
        </button>
      )}

      {deleteId != null && (
        <ConfirmDialog
          open
          title={t("trading.caseStudies.deleteBoard")}
          message={
            t("trading.caseStudies.deleteBoardMsg")
          }
          onConfirm={() => {
            deleteBoard(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
