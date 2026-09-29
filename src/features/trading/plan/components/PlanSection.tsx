import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type { PlanSection as PlanSectionType } from "../../services/tradingDb";
import { PlanImageGallery } from "./PlanImageGallery";

type Props = {
  section: PlanSectionType;
  onToggleItem: (itemId: string) => void;
  onAddItem: (text: string) => void;
  onUpdateItem: (itemId: string, text: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateTitle: (title: string) => void;
  onDeleteSection: () => void;
  onToggleCollapse: () => void;
  onSetImage: (index: number, dataUrl: string | null) => void;
  onAddImageSlot: () => void;
  onRemoveImageSlot: (index: number) => void;
};

export function PlanSection({
  section,
  onToggleItem,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onUpdateTitle,
  onDeleteSection,
  onToggleCollapse,
  onSetImage,
  onAddImageSlot,
  onRemoveImageSlot,
}: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title);
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemDraft, setItemDraft] = useState("");

  const collapsed = section.collapsed ?? false;

  function commitTitle() {
    const t = titleDraft.trim();

    if (t && t !== section.title) {
      onUpdateTitle(t);
    } else {
      setTitleDraft(section.title);
    }

    setEditingTitle(false);
  }

  function commitItem(itemId: string) {
    const t = itemDraft.trim();

    if (t) {
      onUpdateItem(itemId, t);
    }

    setEditingItemId(null);
  }

  function handleAddItem() {
    if (!newItemText.trim()) return;

    onAddItem(newItemText);
    setNewItemText("");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
        >
          {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>

        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitTitle();
              }

              if (e.key === "Escape") {
                setTitleDraft(section.title);
                setEditingTitle(false);
              }
            }}
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm font-semibold text-white outline-none focus:border-[var(--color-primary)]"
          />
        ) : (
          <h2
            className="min-w-0 flex-1 cursor-pointer text-start text-base font-bold text-white"
            onDoubleClick={() => {
              setTitleDraft(section.title);
              setEditingTitle(true);
            }}
          >
            {section.title}
          </h2>
        )}

        <button
          type="button"
          onClick={() => {
            setTitleDraft(section.title);
            setEditingTitle(true);
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
          title="ویرایش عنوان"
        >
          <Pencil size={14} />
        </button>

        <button
          type="button"
          onClick={onDeleteSection}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-red-500/20 hover:text-red-400"
          title="حذف بخش"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {!collapsed && (
        <div className="p-4">
          {/* Checklist */}
          {section.type === "checklist" && (
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  <button
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      item.checked
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-transparent text-transparent hover:border-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    <Check size={12} strokeWidth={3} />
                  </button>

                  {editingItemId === item.id ? (
                    <input
                      autoFocus
                      value={itemDraft}
                      onChange={(e) => setItemDraft(e.target.value)}
                      onBlur={() => commitItem(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          commitItem(item.id);
                        }

                        if (e.key === "Escape") {
                          setEditingItemId(null);
                        }
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setItemDraft(item.text);
                        setEditingItemId(item.id);
                      }}
                      className={[
                        "min-w-0 flex-1 cursor-pointer text-start text-sm leading-relaxed",
                        item.checked
                          ? "text-[var(--color-text-muted)] line-through"
                          : "text-[var(--color-text-secondary)]",
                      ].join(" ")}
                    >
                      {item.text}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-text-muted)] opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              <div className="mt-3 flex gap-2">
                <input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem();
                    }
                  }}
                  placeholder="افزودن مورد جدید..."
                  className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
                />

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Mapping */}
          {section.type === "mapping" && section.groups && (
            <div className="space-y-5">
              {section.groups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-2 text-start text-sm font-semibold text-white">
                    {group.title}
                  </h3>

                  <ul className="space-y-1.5">
                    {group.items.map((text) => (
                      <li
                        key={text}
                        className="flex items-start gap-2 text-start text-sm text-[var(--color-text-secondary)]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Images */}
          {section.type === "images" && (
            <PlanImageGallery
              images={section.images ?? []}
              onSetImage={onSetImage}
              onAddSlot={onAddImageSlot}
              onRemoveSlot={onRemoveImageSlot}
            />
          )}
        </div>
      )}
    </div>
  );
}
