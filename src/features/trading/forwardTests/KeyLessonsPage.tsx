import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, Trash2, Pencil, BookOpen, Lightbulb } from "lucide-react";
import { TradingSubNav } from "../components/TradingSubNav";
import { useMarkupDetail } from "./hooks/useForwardTests";
import { useSettingsStore } from "../../../app/store/settingsStore";

export function KeyLessonsPage() {
  const { markupId: markupIdParam } = useParams();
  const markupId = markupIdParam ? Number(markupIdParam) : null;
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const {
    markup,
    keyLessons,
    loading,
    addKeyLesson,
    updateKeyLesson,
    deleteKeyLesson,
  } = useMarkupDetail(markupId);

  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  if (loading || !markup) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        {isRtl ? "در حال بارگذاری..." : "Loading..."}
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
        <Link to="/trading/forward-tests" className="hover:text-white">
          {isRtl ? "فوروارد تست" : "Forward Tests"}
        </Link>
        <span>/</span>
        <Link
          to={`/trading/forward-tests/${markupId}`}
          className="hover:text-white"
        >
          {markup.title}
        </Link>
        <span>/</span>
        <span className="text-white">
          {isRtl ? "نکات کلیدی" : "Key Lessons"}
        </span>
      </div>

      <div className="text-start">
        <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Lightbulb size={14} />
          <span>Key Lessons</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {isRtl ? "نکات کلیدی آموخته‌شده" : "Key Lessons"}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {isRtl
            ? "درس‌ها و نکاتی که از فوروارد تست‌ها یاد گرفته‌اید را اینجا ثبت کنید."
            : "Record the lessons and insights you gained from forward testing."}
        </p>
      </div>

      <div className="space-y-2">
        {keyLessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="group flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/20 text-xs font-bold text-[var(--color-primary)]">
              {index + 1}
            </span>

            {editingId === lesson.id ? (
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <textarea
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void updateKeyLesson(lesson.id!, editText);
                      setEditingId(null);
                    }}
                    className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs text-white"
                  >
                    {isRtl ? "ذخیره" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                  >
                    {isRtl ? "لغو" : "Cancel"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-white">
                  {lesson.text}
                </p>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(lesson.id!);
                      setEditText(lesson.text);
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
                          isRtl ? "این نکته حذف شود؟" : "Delete this lesson?",
                        )
                      ) {
                        void deleteKeyLesson(lesson.id!);
                      }
                    }}
                    className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {adding ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <textarea
              autoFocus
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={3}
              placeholder={
                isRtl
                  ? "نکته یا درس جدید را بنویسید..."
                  : "Write a new lesson..."
              }
              className="mb-3 w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (newText.trim()) {
                    void addKeyLesson(newText);
                    setNewText("");
                    setAdding(false);
                  }
                }}
                className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
              >
                {isRtl ? "افزودن" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setNewText("");
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
            {isRtl ? "افزودن نکته جدید" : "Add new lesson"}
          </button>
        )}

        {keyLessons.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen
              size={36}
              className="mb-3 text-[var(--color-text-muted)] opacity-40"
            />
            <p className="text-sm text-[var(--color-text-muted)]">
              {isRtl
                ? "هنوز نکته‌ای ثبت نشده است."
                : "No lessons recorded yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
