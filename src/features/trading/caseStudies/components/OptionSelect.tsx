import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import {
  Check,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
  Pencil,
  Palette,
  Search,
} from "lucide-react";
import type { OptionItem, TagColor } from "../types";
import { TAG_COLORS } from "../types";
import { TagPill } from "./TagPill";
import { enforceTrendMutex } from "../data/defaults";

type Props = {
  options: OptionItem[];
  value: string | null;
  multiValue?: string[];
  multi?: boolean;
  isTrends?: boolean;
  onChange: (id: string | null) => void;
  onMultiChange?: (ids: string[]) => void;
  onOptionsChange: (opts: OptionItem[]) => void;
  placeholder?: string;
};

export function OptionSelect({
  options,
  value,
  multiValue = [],
  multi = false,
  isTrends = false,
  onChange,
  onMultiChange,
  onOptionsChange,
  placeholder = "انتخاب...",
}: Props) {
  const { t } = useTranslation();
  const ph = placeholder ?? t("trading.caseStudies.select");
  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuBtnRect, setMenuBtnRect] = useState<DOMRect | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [colorPickId, setColorPickId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [search, setSearch] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);


  const sorted = [...options]
    .sort((a, b) => a.order - b.order)
    .filter(
      (o) =>
        !search.trim() ||
        o.label.toLowerCase().includes(search.trim().toLowerCase()),
    );

  useLayoutEffect(() => {
    if (!open || !btnRef.current) {
      setMenuPos(null);
      setVisible(false);
      return;
    }
    const rect = btnRef.current.getBoundingClientRect();
    const width = Math.max(rect.width, 280);
    let left = rect.left;
    if (left + width > window.innerWidth - 8)
      left = window.innerWidth - width - 8;
    if (left < 8) left = 8;
    let top = rect.bottom + 6;
    if (top + 320 > window.innerHeight) top = Math.max(8, rect.top - 320);
    setMenuPos({ top, left, width });
    requestAnimationFrame(() => setVisible(true));
  }, [open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (document.querySelector("[data-option-select-portal]")?.contains(t))
        return;
      if (document.querySelector("[data-option-submenu-portal]")?.contains(t))
        return;
      closeAll();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function closeAll() {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      setMenuId(null);
      setColorPickId(null);
      setSearch("");
      setAdding(false);
      setMenuBtnRect(null);
    }, 120);
  }

  function selectOne(id: string) {
    if (multi && onMultiChange) {
      let next = [...multiValue];
      if (next.includes(id)) next = next.filter((x) => x !== id);
      else if (isTrends) next = enforceTrendMutex(next, id);
      else next.push(id);
      onMultiChange(next);
    } else {
      onChange(value === id ? null : id);
      closeAll();
    }
  }

  function addOption(labelOverride?: string) {
    const label = (labelOverride ?? (newLabel || search)).trim();
    if (!label) return;
    const maxOrder = options.reduce((m, o) => Math.max(m, o.order), -1);
    const item: OptionItem = {
      id: `opt_${Date.now()}`,
      label,
      color: "blue",
      order: maxOrder + 1,
    };
    onOptionsChange([...options, item]);
    setNewLabel("");
    setSearch("");
    setAdding(false);
    if (multi && onMultiChange) onMultiChange([...multiValue, item.id]);
    else {
      onChange(item.id);
      closeAll();
    }
  }

  function rename(id: string) {
    const label = editLabel.trim();
    if (!label) return;
    onOptionsChange(options.map((o) => (o.id === id ? { ...o, label } : o)));
    setEditingId(null);
  }

  function setColor(id: string, color: TagColor) {
    onOptionsChange(options.map((o) => (o.id === id ? { ...o, color } : o)));
    setColorPickId(null);
    setMenuId(null);
    setMenuBtnRect(null);
  }

  function remove(id: string) {
    onOptionsChange(options.filter((o) => o.id !== id));
    if (value === id) onChange(null);
    if (multi && onMultiChange)
      onMultiChange(multiValue.filter((x) => x !== id));
    setMenuId(null);
    setMenuBtnRect(null);
  }

  function onDragOver(e: { preventDefault: () => void }, overId: string) {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const full = [...options].sort((a, b) => a.order - b.order);
    const from = full.findIndex((o) => o.id === dragId);
    const to = full.findIndex((o) => o.id === overId);
    if (from < 0 || to < 0) return;
    const next = [...full];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onOptionsChange(next.map((o, i) => ({ ...o, order: i })));
  }

  const selectedSingle = options.find((o) => o.id === value);
  const selectedMulti = options
    .filter((o) => multiValue.includes(o.id))
    .sort((a, b) => a.order - b.order);

  let submenuStyle: CSSProperties | undefined;
  if (menuBtnRect) {
    const width = 176;
    const estimatedH = colorPickId === menuId ? 220 : 130;
    const gap = 4;
    const margin = 8;
    const spaceBelow = window.innerHeight - menuBtnRect.bottom - margin;
    const spaceAbove = menuBtnRect.top - margin;
    const openAbove = spaceBelow < estimatedH && spaceAbove > spaceBelow;
    const maxH = Math.max(
      120,
      Math.min(estimatedH + 40, openAbove ? spaceAbove : spaceBelow),
    );
    const top = openAbove
      ? Math.max(margin, menuBtnRect.top - Math.min(estimatedH, maxH) - gap)
      : menuBtnRect.bottom + gap;
    const left = Math.min(
      Math.max(margin, menuBtnRect.right - width),
      window.innerWidth - width - margin,
    );
    submenuStyle = {
      position: "fixed",
      top,
      left,
      width,
      maxHeight: maxH,
      zIndex: 10001,
      backgroundColor: "var(--cs-table-hover)",
      borderColor: "var(--cs-dropdown-border)",
      overflowY: "auto",
    };
  }

  return (
    <div ref={rootRef} className="relative min-w-0 w-full">
      <div
        ref={btnRef}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (open) closeAll();
          else setOpen(true);
        }}
        className="flex min-h-[32px] w-full flex-wrap items-center gap-1 rounded px-1.5 py-1 text-start transition-colors duration-150"
        style={{
          backgroundColor: open ? "var(--cs-table-hover)" : "transparent",
          cursor: "pointer",
        }}
      >
        {multi ? (
          selectedMulti.length ? (
            selectedMulti.map((o) => (
              <TagPill
                key={o.id}
                item={o}
                onRemove={() => {
                  if (onMultiChange) {
                    onMultiChange(multiValue.filter((id) => id !== o.id));
                  }
                }}
              />
            ))
          ) : (
            
            <span className="text-[12px]" style={{ color: "var(--cs-muted)" }}>
              
              {ph}
            </span>
          )
        ) : selectedSingle ? (
          <TagPill item={selectedSingle} />
        ) : (
          <span className="text-[12px]" style={{ color: "var(--cs-muted)" }}>
            {ph}
          </span>
        )}
      </div>

      {open &&
        menuPos &&
        createPortal(
          <div
            data-option-select-portal
            className="fixed overflow-hidden rounded-lg border shadow-2xl "
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              zIndex: 10000,
              backgroundColor: "var(--cs-dropdown-bg)",
              borderColor: "var(--cs-dropdown-border)",
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0) scale(1)"
                : "translateY(-6px) scale(0.98)",
              transition: "opacity 120ms ease, transform 120ms ease",
            }}
          >
            <div
              className="border-b px-2.5 py-2.5"
              style={{ borderColor: "var(--cs-dropdown-hover)" }}
            >
              <div
                className="flex items-center gap-2 rounded-md px-2.5 py-2"
                style={{ backgroundColor: "var(--cs-input-bg)" }}
              >
                <Search size={13} style={{ color: "var(--cs-muted)" }} />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      search.trim() &&
                      sorted.length === 0
                    ) {
                      addOption(search);
                    }
                    if (e.key === "Escape") closeAll();
                  }}
                  placeholder={t("trading.caseStudies.searchOption")}
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
                  style={{ color: "var(--cs-text)" }}
                />
              </div>
              <div className="mt-1.5 text-[11px]" style={{ color: "var(--cs-muted)" }}>
                {t("trading.caseStudies.selectOrCreate")}
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto py-1">
              {sorted.map((opt) => {
                const isSelected = multi
                  ? multiValue.includes(opt.id)
                  : value === opt.id;
                return (
                  <div
                    key={opt.id}
                    draggable
                    onDragStart={() => setDragId(opt.id)}
                    onDragOver={(e) => onDragOver(e, opt.id)}
                    onDragEnd={() => setDragId(null)}
                    className="group relative flex items-center gap-0.5 px-1.5"
                  >
                    <GripVertical
                      size={14}
                      className="shrink-0 cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ color: "var(--cs-muted)" }}
                    />
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-1 rounded-md px-1.5 py-1.5 text-start transition-colors duration-100"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      onClick={() => selectOne(opt.id)}
                    >
                      {editingId === opt.id ? (
                        <input
                          autoFocus
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") rename(opt.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full rounded border px-2 py-1 text-[12px] outline-none"
                          style={{
                            backgroundColor: "var(--cs-input-bg)",
                            borderColor: "var(--cs-dropdown-border)",
                            color: "var(--cs-text)",
                          }}
                        />
                      ) : (
                        <>
                          <TagPill item={opt} />
                          {isSelected && (
                            <Check
                              size={13}
                              className="ms-auto shrink-0"
                              style={{ color: "var(--color-success)" }}
                            />
                          )}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = (
                          e.currentTarget as HTMLElement
                        ).getBoundingClientRect();
                        if (menuId === opt.id) {
                          setMenuId(null);
                          setColorPickId(null);
                          setMenuBtnRect(null);
                        } else {
                          setMenuId(opt.id);
                          setColorPickId(null);
                          setMenuBtnRect(rect);
                        }
                      }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ color: "var(--cs-muted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
                        e.currentTarget.style.color = "var(--cs-text-soft)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--cs-muted)";
                      }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                );
              })}

              {sorted.length === 0 && search.trim() && (
                <button
                  type="button"
                  onClick={() => addOption(search)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-[12px]"
                  style={{ color: "var(--cs-text-soft)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Plus size={13} />
                  {t("trading.caseStudies.createNamed", { name: search.trim() })}
                </button>
              )}
            </div>

            <div className="border-t py-1" style={{ borderColor: "var(--cs-dropdown-hover)" }}>
              {adding ? (
                <div className="flex gap-1.5 px-2.5 py-1.5">
                  <input
                    autoFocus
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addOption();
                      if (e.key === "Escape") {
                        setAdding(false);
                        setNewLabel("");
                      }
                    }}
                    placeholder="نام جدید..."
                    className="min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-[12px] outline-none"
                    style={{
                      backgroundColor: "var(--cs-input-bg)",
                      borderColor: "var(--cs-dropdown-border)",
                      color: "var(--cs-text)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addOption()}
                    className="rounded-md px-2.5 text-[12px]"
                    style={{ backgroundColor: "var(--cs-dropdown-border)", color: "var(--cs-text)" }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-[12px]"
                  style={{ color: "var(--cs-text-soft)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
                    e.currentTarget.style.color = "var(--cs-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--cs-text-soft)";
                  }}
                >
                  <Plus size={13} /> {t("trading.caseStudies.addOption")}
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}

      {menuId &&
        menuBtnRect &&
        createPortal(
          <div
            data-option-submenu-portal
            className="overflow-y-auto rounded-lg border shadow-2xl"
            style={submenuStyle}
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-[12px]"
              style={{ color: "var(--cs-text)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() => {
                const opt = options.find((o) => o.id === menuId);
                if (opt) {
                  setEditingId(opt.id);
                  setEditLabel(opt.label);
                }
                setMenuId(null);
                setMenuBtnRect(null);
              }}
            >
              <Pencil size={12} /> {t("trading.caseStudies.edit")}
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-[12px]"
              style={{ color: "var(--cs-text)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() =>
                setColorPickId(colorPickId === menuId ? null : menuId)
              }
            >
              <Palette size={12} /> {t("trading.caseStudies.bgColor")}
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-[12px]"
              style={{ color: "var(--cs-danger-text)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--cs-dropdown-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onClick={() => remove(menuId)}
            >
              <Trash2 size={12} /> {t("trading.caseStudies.delete")}
            </button>

            {colorPickId === menuId && (
              <div
                className="border-t px-2.5 py-2.5"
                style={{ borderColor: "var(--cs-dropdown-hover)" }}
              >
                <div
                  className="mb-1.5 text-[10px]"
                  style={{ color: "var(--cs-muted)" }}
                >
                  Background
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {TAG_COLORS.map((c) => {
                    const opt = options.find((o) => o.id === menuId);
                    const active = opt?.color === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        title={c.id}
                        onClick={() => setColor(menuId, c.id)}
                        style={{
                          backgroundColor: c.bg,
                          boxShadow: active
                            ? "0 0 0 2px var(--cs-dropdown-bg), 0 0 0 3.5px var(--cs-text)"
                            : undefined,
                        }}
                        className="h-6 w-6 rounded-full transition-transform duration-100 hover:scale-110"
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
