import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ImagePlus, Trash2, Hash, Percent, DollarSign } from "lucide-react";
import type { Section } from "../types";
import { computeNetPercent, computeNetProfit } from "../hooks/useForwardTests";
import { useSettingsStore } from "../../../../app/store/settingsStore";

type Props = {
  open: boolean;
  section: Section | null;
  onClose: () => void;
  onSave: (patch: Partial<Section>) => Promise<void>;
  onAddImage: (dataUrl: string) => Promise<void>;
  onRemoveImage: (imageId: string) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function SectionEditorModal({
  open,
  section,
  onClose,
  onSave,
  onAddImage,
  onRemoveImage,
  onDelete,
}: Props) {
  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const [title, setTitle] = useState("");
  const [totalR, setTotalR] = useState("");
  const [accountSize, setAccountSize] = useState(1000);
  const [riskPercent, setRiskPercent] = useState(0.4);
  const [content, setContent] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [visible, setVisible] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && section) {
      setTitle(section.title);
      setTotalR(section.totalR ?? "");
      setAccountSize(section.accountSize ?? 1000);
      setRiskPercent(section.riskPercent ?? 0.4);
      setContent(section.content ?? "");
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, section?.id]); // مهم: فقط id نه کل object

  useEffect(() => {
    if (contentRef.current && open && section) {
      contentRef.current.innerHTML = section.content || "";
    }
  }, [open, section?.id]);

  if (!open || !section) return null;

  const netPct = computeNetPercent(totalR, accountSize, riskPercent);
  const netProfit = computeNetProfit(totalR, accountSize, riskPercent);

  async function handleSave() {
    const html = contentRef.current?.innerHTML ?? content;
    await onSave({
      title: title.trim() || section!.title,
      totalR,
      accountSize,
      riskPercent,
      content: html,
    });
    onClose();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        void onAddImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[11000] flex items-start justify-center overflow-y-auto"
      style={{
        padding: "40px 16px",
        backgroundColor: visible ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
        transition: "background-color 150ms ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 150ms ease, transform 150ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — title editable */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isRtl ? "نام سکشن" : "Section title"}
            className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-white outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Properties */}
        <div className="space-y-3 border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex w-36 items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Hash size={14} />
              <span>TOTAL R</span>
            </div>
            <input
              value={totalR}
              onChange={(e) => setTotalR(e.target.value)}
              placeholder="Empty"
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-white outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-36 items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <DollarSign size={14} />
              <span>{isRtl ? "سایز حساب" : "Account Size"}</span>
            </div>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Number(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-white outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-36 items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Percent size={14} />
              <span>{isRtl ? "ریسک %" : "Risk %"}</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-white outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-36 items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Percent size={14} />
              <span>Net % Gain</span>
            </div>
            <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">
              {netPct.toFixed(2)}%
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-36 items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <DollarSign size={14} />
              <span>Net Profit</span>
            </div>
            <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">
              ${netProfit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {isRtl ? "تصاویر" : "Images"}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-white"
            >
              <ImagePlus size={14} />
              {isRtl ? "افزودن عکس" : "Add image"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {(section.images ?? []).map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-[var(--color-border)]"
              >
                <img
                  src={img.dataUrl}
                  alt=""
                  className="h-32 w-auto max-w-[240px] object-contain bg-white/5"
                />
                <button
                  type="button"
                  onClick={() => void onRemoveImage(img.id)}
                  className="absolute end-1 top-1 rounded-md bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {(section.images ?? []).length === 0 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-32 w-48 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-white"
              >
                <ImagePlus size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Rich text content */}
        <div className="px-5 py-4">
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              setContent(contentRef.current?.innerHTML ?? "");
            }}
            className="min-h-[120px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[var(--color-primary)] empty:before:text-[var(--color-text-muted)] empty:before:content-[attr(data-placeholder)]"
            data-placeholder={
              isRtl
                ? "یادداشت، تحلیل یا نکات کلیدی را بنویسید..."
                : "Write notes, analysis or key points..."
            }
          />
        </div>

        {/* Footer — delete for ALL sections */}
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
          {onDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              {isRtl ? "حذف سکشن" : "Delete section"}
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            >
              {isRtl ? "لغو" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
            >
              {isRtl ? "ذخیره" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/60 p-6"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-2">
              <h3 className="text-[15px] font-semibold text-white">
                {isRtl ? "حذف سکشن" : "Delete section"}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                {isRtl
                  ? "این سکشن و محتوای آن برای همیشه حذف می‌شود. مطمئنی؟"
                  : "This section and its content will be permanently deleted. Are you sure?"}
              </p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3.5 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              >
                {isRtl ? "لغو" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  void onDelete?.();
                }}
                className="rounded-lg bg-red-600 px-3.5 py-2 text-[13px] font-medium text-white hover:bg-red-500"
              >
                {isRtl ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
