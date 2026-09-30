import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import type { CaseStudy, CaseImage, ColumnDef, OptionLists } from "../types";
import { columnTitle } from "../types";
import { useSettingsStore } from "../../../../app/store/settingsStore";
import { DateTimeCell } from "./DateTimeCell";
import { OptionSelect } from "./OptionSelect";
import { ConfirmDialog } from "./ConfirmDialog";

type Props = {
  caseItem: CaseStudy;
  columns: ColumnDef[];
  optionLists: OptionLists;
  onBack: () => void;
  onUpdate: (id: number, patch: Partial<CaseStudy>) => void;
  onOptionsChange: (
    key: keyof OptionLists,
    items: OptionLists[keyof OptionLists],
  ) => void;
};

export function CaseFullView({
  caseItem,
  columns,
  optionLists,
  onBack,
  onUpdate,
  onOptionsChange,
}: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const fileRef = useRef<HTMLInputElement>(null);
  const [captionDraft, setCaptionDraft] = useState<Record<string, string>>({});
  const [pendingDeleteImg, setPendingDeleteImg] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  function addImages(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    const readers = list.map(
      (file) =>
        new Promise<CaseImage>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              dataUrl: reader.result as string,
              caption: "",
            });
          };
          reader.readAsDataURL(file);
        }),
    );
    Promise.all(readers).then((newImgs) => {
      onUpdate(caseItem.id!, {
        images: [...(caseItem.images ?? []), ...newImgs],
      });
    });
  }

  function removeImage(imgId: string) {
    onUpdate(caseItem.id!, {
      images: caseItem.images.filter((i) => i.id !== imgId),
    });
  }

  function saveCaption(imgId: string) {
    const cap = captionDraft[imgId];
    if (cap === undefined) return;
    onUpdate(caseItem.id!, {
      images: caseItem.images.map((i) =>
        i.id === imgId ? { ...i, caption: cap } : i,
      ),
    });
  }

  const sortedCols = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="flex min-h-0 flex-col">
      <div
        className="sticky -top-5! z-20 flex items-center justify-between gap-3 border-b py-3"
        style={{
          backgroundColor: "var(--cs-modal-bg)",
          borderColor: "var(--cs-dropdown-hover)",
        }}
      >
        <div className="min-w-0">
          <div className="text-xs text-[var(--color-text-muted)]">
            {t("trading.caseStudies.fullViewTitle")}
          </div>
          <h2 className="truncate text-lg font-bold text-white">
            {t("trading.caseStudies.tradeNum", { n: caseItem.tradeNumber })}
          </h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="space-y-4 pt-4">
        <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {sortedCols.map((col) => (
            <div
              key={col.id}
              className="grid grid-cols-[120px_1fr] items-start gap-3 px-3 py-2.5 sm:grid-cols-[140px_1fr]"
            >
              <div className="pt-1 text-xs font-medium text-[var(--color-text-muted)]">
                {columnTitle(col, language)}
              </div>
              <div className="min-w-0">{renderField(col)}</div>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {t("trading.caseStudies.images")}
            </h3>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white"
            >
              <ImagePlus size={14} />
              {t("trading.caseStudies.addImage")}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addImages(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {caseItem.images.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)]">
              {t("trading.caseStudies.noImages")}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {caseItem.images.map((img) => (
                <div
                  key={img.id}
                  className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"
                >
                  <div className="relative">
                    <img
                      src={img.dataUrl}
                      alt=""
                      onClick={() => setLightboxSrc(img.dataUrl)}
                      className="max-h-64 w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPendingDeleteImg(img.id)}
                      className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-red-300 hover:bg-red-500/80 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="p-2">
                    <textarea
                      value={captionDraft[img.id] ?? img.caption}
                      onChange={(e) =>
                        setCaptionDraft((s) => ({
                          ...s,
                          [img.id]: e.target.value,
                        }))
                      }
                      onBlur={() => saveCaption(img.id)}
                      placeholder={t("trading.caseStudies.imageCaption")}
                      rows={2}
                      className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-transparent px-2 py-1.5 text-xs text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pendingDeleteImg && (
        <ConfirmDialog
          open
          title={t("trading.caseStudies.deleteImage")}
          message={t("trading.caseStudies.deleteImageMsg")}
          onConfirm={() => {
            removeImage(pendingDeleteImg);
            setPendingDeleteImg(null);
          }}
          onCancel={() => setPendingDeleteImg(null)}
        />
      )}

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[12000] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.92)",
            padding: "8px 0",
          }}
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="بستن"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-200 contain-content block csLightboxIn"
          />
        </div>
      )}
    </div>
  );
  function renderField(col: ColumnDef) {
    const id = caseItem.id!;
    switch (col.key) {
      case "tradeNumber":
        return (
          <input
            type="number"
            value={caseItem.tradeNumber}
            onChange={(e) =>
              onUpdate(id, { tradeNumber: Number(e.target.value) })
            }
            className="w-24 text-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white"
          />
        );
      case "pairId":
        return (
          <OptionSelect
            options={optionLists.pairs}
            value={caseItem.pairId}
            onChange={(v) => onUpdate(id, { pairId: v })}
            onOptionsChange={(opts) => onOptionsChange("pairs", opts)}
          />
        );
      case "setupId":
        return (
          <OptionSelect
            options={optionLists.setups}
            value={caseItem.setupId}
            onChange={(v) => onUpdate(id, { setupId: v })}
            onOptionsChange={(opts) => onOptionsChange("setups", opts)}
          />
        );
      case "positionSize":
        return (
          <input
            type="number"
            step="0.01"
            value={caseItem.positionSize ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                positionSize:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="0.5"
            className="w-28 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white"
          />
        );
      case "rValue":
        return (
          <input
            type="number"
            step="0.1"
            value={caseItem.rValue ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                rValue: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white"
          />
        );
      case "status":
        return (
          <span
            className={
              caseItem.status === "win"
                ? "text-emerald-400"
                : caseItem.status === "loss"
                  ? "text-red-400"
                  : "text-[var(--color-text-muted)]"
            }
          >
            {caseItem.status ?? "—"}
          </span>
        );
      case "positionId":
        return (
          <OptionSelect
            options={optionLists.positions}
            value={caseItem.positionId}
            onChange={(v) => onUpdate(id, { positionId: v })}
            onOptionsChange={(opts) => onOptionsChange("positions", opts)}
          />
        );
      case "openedAt":
        return (
          <DateTimeCell
            value={caseItem.openedAt}
            onChange={(v) => onUpdate(id, { openedAt: v })}
          />
        );
      case "closedAt":
        return (
          <DateTimeCell
            value={caseItem.closedAt}
            onChange={(v) => onUpdate(id, { closedAt: v })}
          />
        );
      case "session":
        return (
          <span className="text-sm text-white">{caseItem.session ?? "—"}</span>
        );
      case "confluenceIds":
        return (
          <OptionSelect
            multi
            options={optionLists.confluences}
            value={null}
            multiValue={caseItem.confluenceIds}
            onChange={() => {}}
            onMultiChange={(ids) => onUpdate(id, { confluenceIds: ids })}
            onOptionsChange={(opts) => onOptionsChange("confluences", opts)}
          />
        );
      case "trendIds":
        return (
          <OptionSelect
            multi
            isTrends
            options={optionLists.trends}
            value={null}
            multiValue={caseItem.trendIds}
            onChange={() => {}}
            onMultiChange={(ids) => onUpdate(id, { trendIds: ids })}
            onOptionsChange={(opts) => onOptionsChange("trends", opts)}
          />
        );
      case "minSlPips":
        return (
          <input
            type="number"
            value={caseItem.minSlPips ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                minSlPips:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white"
          />
        );
      case "notes":
        return (
          <textarea
            value={caseItem.notes}
            onChange={(e) => onUpdate(id, { notes: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--color-primary)]"
          />
        );
      default:
        return (
          <input
            value={(caseItem.customFields[col.key] as string) ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                customFields: {
                  ...caseItem.customFields,
                  [col.key]: e.target.value,
                },
              })
            }
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-white"
          />
        );
    }
  }
}
