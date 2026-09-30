import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookMarked } from "lucide-react";
import { useSettingsStore } from "../../../app/store/settingsStore";
import { TradingSubNav } from "../components/TradingSubNav";
import { useCaseBoards } from "./hooks/useCaseBoards";
import { useCaseStudies } from "./hooks/useCaseStudies";
import { CaseTable } from "./components/CaseTable";
import { CaseFullView } from "./components/CaseFullView";
import type { OptionLists } from "./types";
import { CaseAnalysisPanel } from "./components/CaseAnalysisPanel";

export function CaseStudyDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const boardId = id ? Number(id) : null;

  const language = useSettingsStore((s) => s.language);
  const isRtl = language === "fa";

  const { boards, loading: boardsLoading } = useCaseBoards();
  const board = boards.find((b) => b.id === boardId);

  const {
    cases,
    columns,
    optionLists,
    loading,
    addCase,
    updateCase,
    deleteCase,
    updateOptionList,
    addCustomColumn,
    updateColumns,
  } = useCaseStudies(boardId);

  const [fullId, setFullId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fullCase = fullId != null ? cases.find((c) => c.id === fullId) : null;

  useEffect(() => {
    if (fullId != null) {
      requestAnimationFrame(() => setModalVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setModalVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullId]);

  function closeModal() {
    setModalVisible(false);
    setTimeout(() => setFullId(null), 180);
  }

  function handleOptionsChange(
    key: keyof OptionLists,
    items: OptionLists[keyof OptionLists],
  ) {
    updateOptionList(key, items);
  }

  if (boardsLoading || loading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ color: "var(--cs-muted)" }}
      >
        {t("trading.caseStudies.loading")}
      </div>
    );
  }

  if (!boardId || !board) {
    return (
      <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
        <TradingSubNav />
        <div className="text-center py-16">
          <p className="text-[var(--color-text-muted)] mb-4">
            {t("trading.caseStudies.notFound")}
          </p>
          <Link
            to="/trading/case-studies"
            className="text-[var(--color-primary)] hover:underline"
          >
            {t("trading.caseStudies.backToList")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <TradingSubNav />

      <div className="flex items-center gap-3">
        <Link
          to="/trading/case-studies"
          className="flex h-9 w-9 shrink-0 rotate-180 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 text-start">
          <div className="mb-0.5 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <BookMarked size={14} />
            <span>{t("trading.caseStudies.title")}</span>
          </div>
          <h1 className="truncate text-2xl font-bold tracking-tight text-white">
            {board.title}
          </h1>
        </div>
      </div>

      <CaseTable
        cases={cases}
        columns={columns}
        optionLists={optionLists}
        onUpdate={updateCase}
        onDelete={deleteCase}
        onOptionsChange={handleOptionsChange}
        onOpenFull={(rowId) => setFullId(rowId)}
        onAdd={addCase}
        onAddColumn={(title) => addCustomColumn(title)}
        onUpdateColumns={updateColumns}
      />

      <CaseAnalysisPanel
        cases={cases}
        columns={columns}
        optionLists={optionLists}
      />

      {fullCase && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center"
          style={{
            padding: 24,
            boxSizing: "border-box",
            backgroundColor: modalVisible
              ? "var(--cs-overlay)"
              : "rgba(0,0,0,0)",
            transition: "background-color 180ms ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              backgroundColor: "var(--cs-modal-bg)",
              borderColor: "var(--cs-dropdown-hover)",
              maxWidth: 720,
              maxHeight: "calc(100vh - 48px)",
              width: "100%",
              opacity: modalVisible ? 1 : 0,
              transform: modalVisible
                ? "scale(1) translateY(0)"
                : "scale(0.96) translateY(10px)",
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="cs-modal-scroll min-h-0 flex-1 overflow-y-auto"
              style={{ padding: 20 }}
            >
              <CaseFullView
                caseItem={fullCase}
                columns={columns}
                optionLists={optionLists}
                onBack={closeModal}
                onUpdate={updateCase}
                onOptionsChange={handleOptionsChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
