import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { TradingSubNav } from "../components/TradingSubNav";
import { useSetups } from "./hooks/useSetups";
import type { SetupRecord } from "./services/setupsDb";
import { SetupImageSection } from "./components/SetupImageSection";

export function SetupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const { getSetup, updateSetup, deleteSetup } = useSetups();

  const [setup, setSetup] = useState<SetupRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [conditions, setConditions] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const numId = Number(id);
      if (!numId) {
        setLoading(false);
        return;
      }
      const data = await getSetup(numId);
      if (cancelled) return;
      if (!data) {
        setLoading(false);
        return;
      }
      setSetup(data);
      setTitleDraft(data.title);
      setConditions(data.conditions);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, getSetup]);

  async function saveConditions() {
    if (!setup?.id) return;
    setSaving(true);
    try {
      await updateSetup(setup.id, { conditions });
      setSetup((s) => (s ? { ...s, conditions } : s));
    } finally {
      setSaving(false);
    }
  }

  async function saveTitle() {
    if (!setup?.id) return;
    const t = titleDraft.trim();
    if (!t) {
      setTitleDraft(setup.title);
      setEditingTitle(false);
      return;
    }
    await updateSetup(setup.id, { title: t });
    setSetup((s) => (s ? { ...s, title: t } : s));
    setEditingTitle(false);
  }

  async function handleDiagramChange(images: (string | null)[]) {
    if (!setup?.id) return;
    const diagram = images[0] ?? null;
    await updateSetup(setup.id, { diagram });
    setSetup((s) => (s ? { ...s, diagram } : s));
  }

  async function handleExamplesChange(images: (string | null)[]) {
    if (!setup?.id) return;
    await updateSetup(setup.id, { exampleImages: images });
    setSetup((s) => (s ? { ...s, exampleImages: images } : s));
  }

  async function handleDelete() {
    if (!setup?.id) return;
    if (!window.confirm(`«${setup.title}» حذف شود؟`)) return;
    await deleteSetup(setup.id);
    navigate("/trading/setups");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-text-muted)]">
        در حال بارگذاری...
      </div>
    );
  }

  if (!setup) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="text-[var(--color-text-muted)]">ستاپ پیدا نشد.</p>
        <Link
          to="/trading/setups"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
        >
          <ArrowRight size={16} className={isRtl ? "" : "rotate-180"} />
          بازگشت به لیست
        </Link>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex flex-col gap-4">
        <Link
          to="/trading/setups"
          className="inline-flex w-fit items-center gap-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:text-white"
        >
          <ArrowRight size={14} className={isRtl ? "" : "rotate-180"} />
          بازگشت به ستاپ‌ها
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-lg font-bold text-white">
              {setup.order}
            </span>

            {editingTitle ? (
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setTitleDraft(setup.title);
                    setEditingTitle(false);
                  }
                }}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xl font-bold text-white outline-none focus:border-[var(--color-primary)]"
              />
            ) : (
              <h1
                className="cursor-pointer text-2xl font-bold tracking-tight text-white"
                onDoubleClick={() => {
                  setTitleDraft(setup.title);
                  setEditingTitle(true);
                }}
              >
                {setup.title}
              </h1>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTitleDraft(setup.title);
                setEditingTitle(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-white"
            >
              <Pencil size={14} />
              ویرایش عنوان
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-red-500/20 hover:text-red-400"
            >
              <Trash2 size={14} />
              حذف
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-start text-sm font-semibold text-white">
            شرایط استراتژی
          </h2>
          <button
            type="button"
            onClick={saveConditions}
            disabled={saving || conditions === setup.conditions}
            className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs text-white transition-opacity disabled:opacity-40 hover:opacity-90"
          >
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
        <p className="text-start text-xs text-[var(--color-text-muted)]">
          از قسمت تریدینگ پلن اینجا کپی کنید
        </p>
        <textarea
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          placeholder="شرایط استراتژی این مدل ورود را بنویسید..."
        />
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <SetupImageSection
          label="دیاگرام"
          images={[setup.diagram]}
          onChange={handleDiagramChange}
          single
        />
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <SetupImageSection
          label="تریدهای مثال"
          images={setup.exampleImages ?? [null, null, null]}
          onChange={handleExamplesChange}
        />
      </div>
    </div>
  );
}
