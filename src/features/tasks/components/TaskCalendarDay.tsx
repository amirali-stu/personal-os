// TaskCalendarDay.tsx

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Task } from "../hooks/useTasks";
import { TaskTooltip } from "./TaskTooltip";

type TaskCalendarDayProps = {
  dateKey: string;
  dayNumber: string;
  dayTasks: Task[];
  isToday: boolean;
  isSelected: boolean;
  isHoliday: boolean;
  holidayName?: string | null;
  onSelect: () => void;
};

export function TaskCalendarDay({
  dayNumber,
  dayTasks,
  isToday,
  isSelected,
  isHoliday,
  holidayName,
  onSelect,
}: TaskCalendarDayProps) {
  const { t } = useTranslation();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDayHovered, setIsDayHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  const completed = dayTasks.filter((task) => task.completed).length;
  const total = dayTasks.length;

  const showTooltip = total > 0 || Boolean(holidayName);
  const shouldShowTooltip = showTooltip && (isDayHovered || isTooltipHovered);

  function clearCloseTimeout() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function handleDayMouseEnter() {
    clearCloseTimeout();
    setIsDayHovered(true);
  }

  function handleDayMouseLeave() {
    setIsDayHovered(false);

    clearCloseTimeout();

    closeTimeoutRef.current = setTimeout(() => {
      if (!isTooltipHovered) {
        setIsTooltipHovered(false);
      }
    }, 250);
  }

  function handleTooltipMouseEnter() {
    clearCloseTimeout();
    setIsTooltipHovered(true);
  }

  function handleTooltipMouseLeave() {
    setIsTooltipHovered(false);

    clearCloseTimeout();

    closeTimeoutRef.current = setTimeout(() => {
      setIsDayHovered(false);
    }, 150);
  }

  const anchorRect = buttonRef.current?.getBoundingClientRect() ?? null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={onSelect}
        onMouseEnter={handleDayMouseEnter}
        onMouseLeave={handleDayMouseLeave}
        className={[
          "group relative min-w-0 overflow-visible rounded-xl border text-right transition-all",
          "min-h-[72px] p-2",
          "sm:min-h-[82px] sm:p-2.5",
          "md:min-h-[88px]",
          "hover:-translate-y-0.5",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40",
          isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
            : isHoliday
              ? "border-red-500/60 bg-red-500/10 hover:border-red-500 hover:bg-red-500/15"
              : "border-[var(--color-border)] bg-[var(--color-bg)]",
          isToday && !isSelected ? "ring-1 ring-[var(--color-primary)]" : "",
        ].join(" ")}
      >
        {isHoliday && (
          <span
            className="absolute inset-x-0 top-0 mx-1 h-1 rounded-t-xl bg-red-500"
            aria-hidden="true"
          />
        )}

        <div className="flex items-start justify-between gap-1">
          <span
            className={[
              "text-base font-bold leading-none sm:text-lg",
              isHoliday
                ? "text-red-400"
                : isSelected
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)]",
            ].join(" ")}
          >
            {dayNumber}
          </span>

          {isHoliday && (
            <span
              className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              title={holidayName ?? t("tasks.calendar.officialHoliday")}
            />
          )}
        </div>

        {isToday && (
          <div className="mt-1">
            <span className="text-[9px] font-medium text-[var(--color-primary)] sm:text-[10px]">
              {t("tasks.calendar.today")}
            </span>
          </div>
        )}

        {isHoliday && holidayName && (
          <p className="mt-2 hidden truncate text-[10px] font-semibold text-red-400 sm:block">
            {holidayName}
          </p>
        )}

        {isHoliday && (
          <p className="mt-2 text-[10px] font-semibold text-red-400 sm:hidden">
            {t("tasks.calendar.holidayShort")}
          </p>
        )}

        {total > 0 && (
          <div className="absolute inset-x-2 bottom-2 sm:inset-x-2.5 sm:bottom-2.5">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 text-[10px] font-medium text-[var(--color-text-muted)] sm:text-[11px]">
                {completed}/{total}
              </span>

              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{
                    width: `${(completed / total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </button>

      {shouldShowTooltip && (
        <TaskTooltip
          anchorRect={anchorRect}
          tasks={dayTasks}
          holidayName={holidayName}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        />
      )}
    </>
  );
}
