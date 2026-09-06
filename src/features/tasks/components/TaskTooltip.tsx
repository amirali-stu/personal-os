import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Circle, X } from "lucide-react";

import type { Task } from "../hooks/useTasks";

type TaskTooltipProps = {
  anchorRect: DOMRect | null;
  tasks: Task[];
  holidayName?: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export function TaskTooltip({
  anchorRect,
  tasks,
  holidayName,
  onMouseEnter,
  onMouseLeave,
}: TaskTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (!mounted || !anchorRect) {
    return null;
  }

  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;

  const tooltipWidth = 280;

  let left = anchorRect.left + anchorRect.width / 2 - tooltipWidth / 2;

  left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));

  const top = anchorRect.bottom;

  return createPortal(
    <div
      className="fixed z-[99999] w-[280px] pt-1"
      style={{
        left,
        top,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      dir="rtl"
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-right shadow-2xl">
        {/* Header / Holiday */}
        {holidayName && (
          <div className="border-b border-red-500/20 bg-red-500/10 p-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                <X size={16} strokeWidth={2.5} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-red-400">تعطیل رسمی</p>

                <p className="mt-1 text-sm font-bold leading-6 text-red-300">
                  {holidayName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tasks header */}
        {tasks.length > 0 && (
          <div className="border-b border-[var(--color-border)] px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                کارهای این روز
              </span>

              <span className="text-[11px] text-[var(--color-text-muted)]">
                {completed} از {total} انجام شده
              </span>
            </div>
          </div>
        )}

        {/* Scrollable tasks */}
        {tasks.length > 0 && (
          <div
            className={[
              "max-h-52 overflow-y-auto px-2 py-2",
              "[scrollbar-width:thin]",
              "[scrollbar-color:var(--color-primary)_transparent]",
              "[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)]",
              "[&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-primary-hover)]",
            ].join(" ")}
          >
            <div className="space-y-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  {task.completed ? (
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-[var(--color-primary)]"
                    />
                  ) : (
                    <Circle
                      size={15}
                      className="shrink-0 text-[var(--color-text-muted)]"
                    />
                  )}

                  <span
                    className={[
                      "min-w-0 flex-1 text-xs leading-5",
                      task.completed
                        ? "text-[var(--color-text-muted)] line-through"
                        : "text-[var(--color-text-secondary)]",
                    ].join(" ")}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
