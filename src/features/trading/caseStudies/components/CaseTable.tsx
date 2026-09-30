import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import {
  ArrowDownUp,
  Filter,
  Maximize2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { CaseStudy, ColumnDef, OptionLists, OptionItem } from "../types";
import { columnTitle } from "../types";
import { OptionSelect } from "./OptionSelect";
import { DateTimeCell } from "./DateTimeCell";
import { ConfirmDialog } from "./ConfirmDialog";

import { useSettingsStore } from "../../../../app/store/settingsStore";

type Props = {
  cases: CaseStudy[];
  columns: ColumnDef[];
  optionLists: OptionLists;
  onUpdate: (id: number, patch: Partial<CaseStudy>) => void;
  onDelete: (id: number) => void;
  onOptionsChange: (key: keyof OptionLists, items: OptionItem[]) => void;
  onOpenFull: (id: number) => void;
  onAdd: () => void;
  onAddColumn: (title: string) => void;
  onUpdateColumns: (cols: ColumnDef[]) => void;
};

type SortKey = string;
type SortDir = "asc" | "desc";

const T = {
  surface: "var(--cs-table-bg)",
  header: "var(--cs-table-header)",
  border: "var(--cs-table-border)",
  rowHover: "var(--cs-table-hover)",
  rowAlt: "var(--cs-table-alt)",
  muted: "var(--cs-muted)",
  text: "var(--cs-text)",
  textSoft: "var(--cs-text-soft)",
};

export function CaseTable({
  cases,
  columns,
  optionLists,
  onUpdate,
  onDelete,
  onOptionsChange,
  onOpenFull,
  onAdd,
  onAddColumn,
  onUpdateColumns,
}: Props) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const isEn = language === "en";

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tradeNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterSession, setFilterSession] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [addingCol, setAddingCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");
  const [headerMenuId, setHeaderMenuId] = useState<string | null>(null);
  const [headerMenuPos, setHeaderMenuPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [renamingColId, setRenamingColId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [dragColId, setDragColId] = useState<string | null>(null);

  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    if (!headerMenuId) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (document.querySelector("[data-header-menu-portal]")?.contains(t))
        return;
      setHeaderMenuId(null);
      setHeaderMenuPos(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [headerMenuId]);

  const sortedCols = useMemo(
    () => [...columns].sort((a, b) => a.order - b.order),
    [columns],
  );

  const filtered = useMemo(() => {
    let list = [...cases];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => {
        const pair =
          optionLists.pairs.find((p) => p.id === c.pairId)?.label ?? "";
        const setup =
          optionLists.setups.find((p) => p.id === c.setupId)?.label ?? "";
        return (
          String(c.tradeNumber).includes(q) ||
          pair.toLowerCase().includes(q) ||
          setup.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q) ||
          (c.session ?? "").toLowerCase().includes(q) ||
          (c.status ?? "").includes(q)
        );
      });
    }

    if (filterSession) list = list.filter((c) => c.session === filterSession);
    if (filterStatus) list = list.filter((c) => c.status === filterStatus);

    list.sort((a, b) => {
      const av = getSortValue(a, sortKey, optionLists);
      const bv = getSortValue(b, sortKey, optionLists);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv), isEn ? "en" : "fa");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [
    cases,
    search,
    sortKey,
    sortDir,
    filterSession,
    filterStatus,
    optionLists,
    isEn,
  ]);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function cellInputClass() {
    return "h-8 w-full min-w-[56px] rounded px-2 text-[12px] outline-none";
  }

  function renderCell(row: CaseStudy, col: ColumnDef) {
    const id = row.id!;
    const inputStyle = { backgroundColor: "transparent", color: T.text };

    switch (col.type) {
      case "number":
        if (col.key === "tradeNumber") {
          return (
            <span
              className="inline-flex h-8 items-center px-2 text-[12px]"
              style={{ color: T.text }}
            >
              {row.tradeNumber}
            </span>
          );
        }
        return null;
      case "singleSelect": {
        const listKey = col.optionListKey!;
        const val =
          col.key === "pairId"
            ? row.pairId
            : col.key === "setupId"
              ? row.setupId
              : col.key === "positionId"
                ? row.positionId
                : null;
        return (
          <OptionSelect
            options={optionLists[listKey]}
            value={val}
            onChange={(v) => {
              if (col.key === "pairId") onUpdate(id, { pairId: v });
              else if (col.key === "setupId") onUpdate(id, { setupId: v });
              else if (col.key === "positionId")
                onUpdate(id, { positionId: v });
            }}
            onOptionsChange={(opts) => onOptionsChange(listKey, opts)}
          />
        );
      }
      case "multiSelect": {
        const listKey = col.optionListKey!;
        const vals =
          col.key === "confluenceIds"
            ? row.confluenceIds
            : col.key === "trendIds"
              ? row.trendIds
              : [];
        return (
          <OptionSelect
            multi
            isTrends={col.key === "trendIds"}
            options={optionLists[listKey]}
            value={null}
            multiValue={vals}
            onChange={() => {}}
            onMultiChange={(ids) => {
              if (col.key === "confluenceIds")
                onUpdate(id, { confluenceIds: ids });
              else if (col.key === "trendIds") onUpdate(id, { trendIds: ids });
            }}
            onOptionsChange={(opts) => onOptionsChange(listKey, opts)}
          />
        );
      }
      case "dateTime":
        return (
          <DateTimeCell
            value={col.key === "openedAt" ? row.openedAt : row.closedAt}
            onChange={(v) => {
              if (col.key === "openedAt") onUpdate(id, { openedAt: v });
              else onUpdate(id, { closedAt: v });
            }}
          />
        );
      case "autoStatus":
        return (
          <span
            className="inline-flex h-7 items-center rounded px-2 text-[12px] font-medium"
            style={
              row.status === "win"
                ? { backgroundColor: "var(--cs-success-tag)", color: "var(--cs-text)" }
                : row.status === "loss"
                  ? { backgroundColor: "var(--cs-loss-tag)", color: "var(--cs-text)" }
                  : { color: T.muted }
            }
          >
            {row.status === "win"
              ? isEn
                ? "win"
                : "win"
              : row.status === "loss"
                ? isEn
                  ? "loss"
                  : "loss"
                : ""}
          </span>
        );
      case "autoSession": {
        const light =
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("light-mode");
        const colors: Record<string, { bg: string; color: string }> = light
          ? {
              ASIA: { bg: "#dcfce7", color: "#166534" },
              LONDON: { bg: "#fee2e2", color: "#b91c1c" },
              NEWYORK: { bg: "#dbeafe", color: "#1e40af" },
              OVERLAP: { bg: "#f3e8ff", color: "#6b21a8" },
            }
          : {
              ASIA: { bg: "#2b593f", color: "#f1f1ef" },
              LONDON: { bg: "#6e3630", color: "#f1f1ef" },
              NEWYORK: { bg: "#28456c", color: "#f1f1ef" },
              OVERLAP: { bg: "#492f64", color: "#f1f1ef" },
            };
        if (!row.session) {
          return (
            <span
              className="inline-flex h-7 items-center px-2 text-[12px]"
              style={{ color: T.muted }}
            ></span>
          );
        }
        const c = colors[row.session] ?? { bg: "var(--cs-btn-bg)", color: "var(--cs-text)" };
        return (
          <span
            className="inline-flex h-7 items-center rounded px-2 text-[11px] font-medium"
            style={{ backgroundColor: c.bg, color: c.color }}
          >
            {row.session}
          </span>
        );
      }
      case "positionSize":
        return (
          <input
            type="number"
            step="0.01"
            value={row.positionSize ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                positionSize:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder=""
            className={cellInputClass()}
            style={inputStyle}
          />
        );
      case "rValue":
        return (
          <input
            type="number"
            step="0.1"
            value={row.rValue ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                rValue: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder=""
            className={cellInputClass()}
            style={inputStyle}
          />
        );
      case "slPips":
        return (
          <input
            type="number"
            value={row.minSlPips ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                minSlPips:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder=""
            className={cellInputClass()}
            style={inputStyle}
          />
        );
      case "text":
        if (col.key === "notes") {
          return (
            <input
              value={row.notes}
              onChange={(e) => onUpdate(id, { notes: e.target.value })}
              placeholder={t("trading.caseStudies.empty")}
              className={cellInputClass() + " min-w-[100px]"}
              style={inputStyle}
            />
          );
        }
        return (
          <input
            value={(row.customFields[col.key] as string) ?? ""}
            onChange={(e) =>
              onUpdate(id, {
                customFields: {
                  ...row.customFields,
                  [col.key]: e.target.value,
                },
              })
            }
            className={cellInputClass()}
            style={inputStyle}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2"
            style={{ color: T.muted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("trading.caseStudies.search")}
            className="w-full rounded-md border py-2 pe-3 ps-9 text-[13px] outline-none"
            style={{
              backgroundColor: T.surface,
              borderColor: T.border,
              color: T.text,
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px]"
          style={{
            borderColor: showFilters ? "var(--color-border-hover)" : T.border,
            backgroundColor: showFilters ? "var(--cs-table-hover)" : T.surface,
            color: T.textSoft,
          }}
        >
          <Filter size={13} />
          {t("trading.caseStudies.filter")}
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: "var(--cs-dropdown-border)", color: T.text }}
        >
          <Plus size={13} />
          {t("trading.caseStudies.new")}
        </button>
      </div>

      {showFilters && (
        <div
          className="flex flex-wrap gap-3 rounded-md border p-3"
          style={{ backgroundColor: T.surface, borderColor: T.border }}
        >
          <label
            className="flex items-center gap-2 text-[12px]"
            style={{ color: T.muted }}
          >
            {t("trading.caseStudies.session")}
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="rounded border px-2 py-1.5 text-[12px]"
              style={{
                backgroundColor: "var(--cs-input-bg)",
                borderColor: T.border,
                color: T.text,
              }}
            >
              <option value="">{t("trading.caseStudies.all")}</option>
              <option value="ASIA">ASIA</option>
              <option value="LONDON">LONDON</option>
              <option value="NEWYORK">NEWYORK</option>
              <option value="OVERLAP">OVERLAP</option>
            </select>
          </label>
          <label
            className="flex items-center gap-2 text-[12px]"
            style={{ color: T.muted }}
          >
            {t("trading.caseStudies.status")}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded border px-2 py-1.5 text-[12px]"
              style={{
                backgroundColor: "var(--cs-input-bg)",
                borderColor: T.border,
                color: T.text,
              }}
            >
              <option value="">{t("trading.caseStudies.all")}</option>
              <option value="win">{t("trading.caseStudies.win")}</option>
              <option value="loss">{t("trading.caseStudies.loss")}</option>
            </select>
          </label>
        </div>
      )}

      <div
        className="cs-table-scroll overflow-x-auto rounded-md border"
        style={{ backgroundColor: T.surface, borderColor: T.border }}
      >
        <table className="w-full min-w-[1400px] border-collapse text-[13px]">
          <thead>
            <tr
              style={{
                backgroundColor: T.header,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <th
                className="w-10 px-2 py-2.5 text-center text-[11px] font-medium"
                style={{ color: T.muted }}
              >
                #
              </th>
              {sortedCols.map((col) => (
                <th
                  key={col.id}
                  style={{ minWidth: col.width ?? 110, color: T.muted }}
                  className="group/h relative px-2 py-2.5 text-start text-[11px] font-medium"
                  draggable
                  onDragStart={() => setDragColId(col.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!dragColId || dragColId === col.id) return;
                    const list = [...sortedCols];
                    const from = list.findIndex((c) => c.id === dragColId);
                    const to = list.findIndex((c) => c.id === col.id);
                    if (from < 0 || to < 0) return;
                    const next = [...list];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved);
                    onUpdateColumns(next.map((c, i) => ({ ...c, order: i })));
                  }}
                  onDragEnd={() => setDragColId(null)}
                >
                  {renamingColId === col.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => {
                        const v = renameValue.trim();
                        if (v) {
                          onUpdateColumns(
                            columns.map((c) =>
                              c.id === col.id
                                ? {
                                    ...c,
                                    title: v,
                                    titleEn: language === "en" ? v : c.titleEn,
                                  }
                                : c,
                            ),
                          );
                        }
                        setRenamingColId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setRenamingColId(null);
                      }}
                      className="w-full rounded border px-1.5 py-0.5 text-[11px] outline-none"
                      style={{
                        backgroundColor: "var(--cs-input-bg)",
                        borderColor: "var(--cs-dropdown-border)",
                        color: "var(--cs-text)",
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex min-w-0 items-center gap-1 hover:opacity-80"
                        style={{ color: T.textSoft }}
                      >
                        <span className="truncate">
                          {columnTitle(col, language)}
                        </span>
                        {sortKey === col.key && (
                          <ArrowDownUp size={10} className="shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-70 hover:opacity-100"
                        style={{ color: T.muted }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (headerMenuId === col.id) {
                            setHeaderMenuId(null);
                            setHeaderMenuPos(null);
                            return;
                          }
                          const rect = (
                            e.currentTarget as HTMLElement
                          ).getBoundingClientRect();
                          setHeaderMenuId(col.id);
                          setHeaderMenuPos({
                            top: rect.bottom + 4,
                            left: rect.left,
                          });
                        }}
                      >
                        ···
                      </button>
                    </div>
                  )}
                </th>
              ))}
              <th className="w-12 px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={sortedCols.length + 2}
                  className="px-4 py-12 text-center text-[13px]"
                  style={{ color: T.muted }}
                >
                  {t("trading.caseStudies.emptyRows")}
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  className="group"
                  style={{
                    backgroundColor: idx % 2 === 0 ? T.surface : T.rowAlt,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = T.rowHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? T.surface : T.rowAlt;
                  }}
                >
                  <td className="px-2 py-1.5 text-center">
                    <button
                      type="button"
                      title={t("trading.caseStudies.fullView")}
                      onClick={() => onOpenFull(row.id!)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded"
                      style={{ color: T.muted }}
                    >
                      <Maximize2 size={13} />
                    </button>
                  </td>
                  {sortedCols.map((col) => (
                    <td key={col.id} className="px-1.5 py-1 align-middle">
                      {renderCell(row, col)}
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmState({
                          title: "حذف ردیف",
                          message: `ترید شماره ${row.tradeNumber} حذف شود؟`,
                          onConfirm: () => {
                            onDelete(row.id!);
                            setConfirmState(null);
                          },
                        });
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded opacity-0 group-hover:opacity-100"
                      style={{ color: "var(--cs-danger-text)" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-2 px-1 text-[12px]"
        style={{ color: T.muted }}
      >
        <span>
          {t("trading.caseStudies.count")} {filtered.length}
        </span>
        {addingCol ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newColTitle.trim()) {
                  onAddColumn(newColTitle.trim());
                  setNewColTitle("");
                  setAddingCol(false);
                }
                if (e.key === "Escape") setAddingCol(false);
              }}
              placeholder={t("trading.caseStudies.columnTitle")}
              className="rounded border px-2 py-1.5 text-[12px] outline-none"
              style={{
                backgroundColor: T.surface,
                borderColor: T.border,
                color: T.text,
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (newColTitle.trim()) {
                  onAddColumn(newColTitle.trim());
                  setNewColTitle("");
                  setAddingCol(false);
                }
              }}
              className="rounded px-2.5 py-1.5 text-[12px]"
              style={{ backgroundColor: "var(--cs-dropdown-border)", color: T.text }}
            >
              {t("trading.caseStudies.addColumn")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingCol(true)}
            style={{ color: T.textSoft }}
          >
            + {t("trading.caseStudies.property")}
          </button>
        )}
      </div>

      {/* منوی هدر — فقط یک‌بار بیرون از map */}
      {headerMenuId &&
        headerMenuPos &&
        createPortal(
          <div
            data-header-menu-portal
            className="fixed z-[10050] w-40 overflow-hidden rounded-lg border py-1 shadow-2xl"
            style={{
              top: headerMenuPos.top,
              left: headerMenuPos.left,
              backgroundColor: "var(--cs-table-hover)",
              borderColor: "var(--cs-dropdown-border)",
            }}
          >
            <button
              type="button"
              className="flex w-full px-3 py-2 text-start text-[12px]"
              style={{ color: "var(--cs-text)" }}
              onClick={() => {
                const col = columns.find((c) => c.id === headerMenuId);
                if (col) {
                  setRenamingColId(col.id);
                  setRenameValue(columnTitle(col, language));
                }
                setHeaderMenuId(null);
                setHeaderMenuPos(null);
              }}
            >
              {t("trading.caseStudies.rename")}
            </button>
            <button
              type="button"
              className="flex w-full px-3 py-2 text-start text-[12px]"
              style={{ color: "var(--cs-text)" }}
              onClick={() => {
                const col = columns.find((c) => c.id === headerMenuId);
                if (col) toggleSort(col.key);
                setHeaderMenuId(null);
                setHeaderMenuPos(null);
              }}
            >
              {t("trading.caseStudies.sort")}
            </button>
            <button
              type="button"
              className="flex w-full px-3 py-2 text-start text-[12px]"
              style={{ color: "var(--cs-danger-text)" }}
              onClick={() => {
                const idToDelete = headerMenuId;
                setHeaderMenuId(null);
                setHeaderMenuPos(null);
                setConfirmState({
                  title: "حذف ستون",
                  message: "این ستون حذف شود؟",
                  onConfirm: () => {
                    if (idToDelete) {
                      onUpdateColumns(
                        columns.filter((c) => c.id !== idToDelete),
                      );
                    }
                    setConfirmState(null);
                  },
                });
              }}
            >
              {t("trading.caseStudies.delete")}
            </button>
          </div>,
          document.body,
        )}

      {confirmState && (
        <ConfirmDialog
          open={!!confirmState}
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}

function getSortValue(
  c: CaseStudy,
  key: string,
  lists: OptionLists,
): string | number | null {
  switch (key) {
    case "tradeNumber":
      return c.tradeNumber;
    case "pairId":
      return lists.pairs.find((p) => p.id === c.pairId)?.label ?? "";
    case "setupId":
      return lists.setups.find((p) => p.id === c.setupId)?.label ?? "";
    case "positionSize":
      return c.positionSize;
    case "rValue":
      return c.rValue;
    case "status":
      return c.status;
    case "positionId":
      return lists.positions.find((p) => p.id === c.positionId)?.label ?? "";
    case "openedAt":
      return c.openedAt ? new Date(c.openedAt).getTime() : null;
    case "closedAt":
      return c.closedAt ? new Date(c.closedAt).getTime() : null;
    case "session":
      return c.session;
    case "minSlPips":
      return c.minSlPips;
    case "notes":
      return c.notes;
    default:
      return (c.customFields[key] as string) ?? null;
  }
}
