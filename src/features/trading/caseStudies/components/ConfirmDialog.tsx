import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = true,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[11000] flex items-center justify-center"
      style={{
        padding: 24,
        backgroundColor: visible ? "var(--cs-overlay)" : "rgba(0,0,0,0)",
        transition: "background-color 150ms ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl border shadow-2xl"
        style={{
          backgroundColor: "var(--cs-dropdown-bg)",
          borderColor: "var(--cs-dropdown-border)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.96) translateY(8px)",
          transition: "opacity 150ms ease, transform 150ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-2">
          <h3
            className="text-[15px] font-semibold"
            style={{ color: "var(--cs-text)" }}
          >
            {title}
          </h3>
          <p
            className="mt-2 text-[13px] leading-relaxed"
            style={{ color: "var(--cs-text-soft)" }}
          >
            {message}
          </p>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3.5 py-2 text-[13px]"
            style={{ color: "var(--cs-text-soft)", backgroundColor: "var(--cs-dropdown-hover)" }}
          >
            {cancelLabel ?? t("trading.caseStudies.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg px-3.5 py-2 text-[13px] font-medium"
            style={{
              color: "#ffffff",
              backgroundColor: danger ? "var(--cs-danger-btn)" : "var(--color-success)",
            }}
          >
            {confirmLabel ?? t("trading.caseStudies.delete")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
