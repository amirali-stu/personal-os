// TaskCalendar.tsx

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Holidays from "date-holidays";

import { useSettingsStore } from "../../../app/store/settingsStore";
import type { Task } from "../hooks/useTasks";
import { TaskCalendarDay } from "./TaskCalendarDay";

type TaskCalendarProps = {
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

type PersianDate = {
  year: number;
  month: number;
  day: number;
};

const persianFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const iranHolidays = new Holidays("IR");

function getHolidayInfo(date: Date) {
  const holidays = iranHolidays.getHolidays(date.getFullYear());

  const dateKey = getDateKey(date);

  const holiday = holidays.find((item) => {
    return getDateKey(new Date(item.date)) === dateKey;
  });

  if (!holiday) {
    return null;
  }

  return {
    name: holiday.name,
  };
}

function getPersianDate(date: Date): PersianDate {
  const parts = persianFormatter.formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getPersianMonthKey(date: Date) {
  const { year, month } = getPersianDate(date);

  return `${year}-${month}`;
}

function getPersianMonthDays(anchorDate: Date) {
  const target = getPersianDate(anchorDate);

  const days: Date[] = [];

  const start = new Date(anchorDate);
  start.setDate(start.getDate() - 40);

  for (let i = 0; i < 100; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const persian = getPersianDate(date);

    if (persian.year === target.year && persian.month === target.month) {
      days.push(date);
    }
  }

  return days;
}

function getGregorianMonthDays(anchorDate: Date) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    return new Date(year, month, index + 1);
  });
}

function shiftPersianMonth(date: Date, amount: number) {
  const result = new Date(date);

  result.setDate(result.getDate() + amount * 40);

  const targetMonth = getPersianMonthKey(result);

  for (let i = -31; i <= 31; i++) {
    const candidate = new Date(result);
    candidate.setDate(result.getDate() + i);

    if (getPersianMonthKey(candidate) === targetMonth) {
      return candidate;
    }
  }

  return result;
}

function shiftGregorianMonth(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getSaturdayBasedWeekday(date: Date) {
  return (date.getDay() + 1) % 7;
}

function formatGregorianDay(date: Date, language: string) {
  return new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(
    date.getDate(),
  );
}

function formatPersianDay(date: Date, language: string) {
  const persian = getPersianDate(date);

  return new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(
    persian.day,
  );
}

export function TaskCalendar({
  tasks,
  selectedDate,
  onSelectDate,
}: TaskCalendarProps) {
  const { t, i18n } = useTranslation();

  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const timezone = useSettingsStore((state) => state.timezone);
  const language = useSettingsStore((state) => state.language);

  const isRtl = language === "fa";

  const selectedDateObject = parseDateKey(selectedDate);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      selectedDateObject.getFullYear(),
      selectedDateObject.getMonth(),
      1,
    ),
  );

  useEffect(() => {
    setCurrentMonth(
      new Date(
        selectedDateObject.getFullYear(),
        selectedDateObject.getMonth(),
        1,
      ),
    );
  }, [dateFormat, selectedDate]);

  const monthDays = useMemo(() => {
    if (dateFormat === "jalali") {
      return getPersianMonthDays(currentMonth);
    }

    return getGregorianMonthDays(currentMonth);
  }, [currentMonth, dateFormat]);

  const firstDayOffset = monthDays.length
    ? getSaturdayBasedWeekday(monthDays[0])
    : 0;

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    for (const task of tasks) {
      if (!grouped[task.date]) {
        grouped[task.date] = [];
      }

      grouped[task.date].push(task);
    }

    return grouped;
  }, [tasks]);

  const today = useMemo(() => {
    const now = new Date();

    if (timezone === "utc") {
      const formatter = new Intl.DateTimeFormat("en-CA", {
        calendar: "gregory",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      });

      return formatter.format(now);
    }

    return getDateKey(now);
  }, [timezone]);

  function goToPreviousMonth() {
    setCurrentMonth((current) => {
      if (dateFormat === "jalali") {
        return shiftPersianMonth(current, -1);
      }

      return shiftGregorianMonth(current, -1);
    });
  }

  function goToNextMonth() {
    setCurrentMonth((current) => {
      if (dateFormat === "jalali") {
        return shiftPersianMonth(current, 1);
      }

      return shiftGregorianMonth(current, 1);
    });
  }

  function goToToday() {
    const now = new Date();

    const todayKey = getDateKey(now);

    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));

    onSelectDate(todayKey);
  }

  const monthTitle =
    dateFormat === "jalali"
      ? new Intl.DateTimeFormat(
          i18n.language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian",
          {
            month: "long",
            year: "numeric",
          },
        ).format(currentMonth)
      : new Intl.DateTimeFormat(i18n.language === "fa" ? "fa-IR" : "en-US", {
          calendar: "gregory",
          month: "long",
          year: "numeric",
        }).format(currentMonth);

  const weekdays =
    language === "fa"
      ? [
          t("tasks.calendar.weekdays.saturday"),
          t("tasks.calendar.weekdays.sunday"),
          t("tasks.calendar.weekdays.monday"),
          t("tasks.calendar.weekdays.tuesday"),
          t("tasks.calendar.weekdays.wednesday"),
          t("tasks.calendar.weekdays.thursday"),
          t("tasks.calendar.weekdays.friday"),
        ]
      : [
          t("tasks.calendar.weekdays.saturday"),
          t("tasks.calendar.weekdays.sunday"),
          t("tasks.calendar.weekdays.monday"),
          t("tasks.calendar.weekdays.tuesday"),
          t("tasks.calendar.weekdays.wednesday"),
          t("tasks.calendar.weekdays.thursday"),
          t("tasks.calendar.weekdays.friday"),
        ];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="
        relative z-20
        overflow-visible
        rounded-2xl
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold">{t("tasks.calendar.title")}</h2>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {t("tasks.calendar.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label={t("tasks.calendar.previousMonth")}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-surface-hover)]
              hover:text-white
            "
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            type="button"
            onClick={goToToday}
            className="
              rounded-lg
              bg-[var(--color-surface-hover)]
              px-3 py-2
              text-xs font-medium
              text-[var(--color-text-secondary)]
              transition-colors
              hover:text-white
            "
          >
            {t("tasks.calendar.today")}
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label={t("tasks.calendar.nextMonth")}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-surface-hover)]
              hover:text-white
            "
          >
            {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold">{monthTitle}</h3>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="
              py-2
              text-center
              text-[10px]
              font-semibold
              text-[var(--color-text-muted)]
              sm:py-2.5
              sm:text-xs
            "
          >
            {weekday}
          </div>
        ))}
      </div>

      <div
        className="
          relative z-30
          mt-2
          grid grid-cols-7 gap-1.5 sm:gap-2
          overflow-visible
        "
      >
        {Array.from({ length: firstDayOffset }).map((_, index) => (
          <div key={`empty-${index}`} className="min-h-20" />
        ))}

        {monthDays.map((date) => {
          const dateKey = getDateKey(date);
          const dayTasks = tasksByDate[dateKey] ?? [];

          const isToday = dateKey === today;
          const isSelected = dateKey === selectedDate;

          const holiday = getHolidayInfo(date);

          const dayNumber =
            dateFormat === "jalali"
              ? formatPersianDay(date, language)
              : formatGregorianDay(date, language);

          return (
            <TaskCalendarDay
              key={dateKey}
              dateKey={dateKey}
              dayNumber={dayNumber}
              dayTasks={dayTasks}
              isToday={isToday}
              isSelected={isSelected}
              isHoliday={Boolean(holiday)}
              holidayName={holiday?.name}
              onSelect={() => onSelectDate(dateKey)}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />

        <span className="text-xs text-[var(--color-text-secondary)]">
          {t("tasks.calendar.officialHoliday")}
        </span>

        <span className="text-xs text-[var(--color-text-muted)]">
          — {t("tasks.calendar.hoverHoliday")}
        </span>
      </div>

      <div
        className="
          mt-5 flex flex-wrap items-center gap-4
          border-t border-[var(--color-border)]
          pt-4
        "
      >
        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          {t("tasks.calendar.completed")}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]" />
          {t("tasks.calendar.remaining")}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="h-2.5 w-2.5 rounded-md border border-red-500/50 bg-red-500/20" />
          {t("tasks.calendar.officialHoliday")}
        </div>

        <div className={isRtl ? "mr-auto" : "ml-auto"}>
          <span className="text-[10px] text-[var(--color-text-muted)]">
            {t("tasks.calendar.hoverDetails")}
          </span>
        </div>
      </div>
    </section>
  );
}
