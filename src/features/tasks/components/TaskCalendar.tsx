import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Holidays from "date-holidays";

import { useSettingsStore } from "../../../app/store/settingsStore";
import type { DateFormat, Timezone } from "../../../lib/dateUtils";
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

const persianMonthFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "long",
  year: "numeric",
});

const gregorianMonthFormatter = new Intl.DateTimeFormat("fa-IR", {
  calendar: "gregory",
  month: "long",
  year: "numeric",
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

const weekdays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

function formatGregorianDay(date: Date) {
  return new Intl.NumberFormat("fa-IR").format(date.getDate());
}

function formatPersianDay(date: Date) {
  const persian = getPersianDate(date);

  return new Intl.NumberFormat("fa-IR").format(persian.day);
}

export function TaskCalendar({
  tasks,
  selectedDate,
  onSelectDate,
}: TaskCalendarProps) {
  const dateFormat = useSettingsStore((state) => state.dateFormat);

  const timezone = useSettingsStore((state) => state.timezone);

  const selectedDateObject = parseDateKey(selectedDate);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      selectedDateObject.getFullYear(),
      selectedDateObject.getMonth(),
      1,
    ),
  );

  /*
   * وقتی فرمت تاریخ در Settings تغییر می‌کند،
   * تقویم را روی ماه مربوط به تاریخ انتخاب‌شده
   * دوباره تنظیم می‌کنیم.
   */
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
      ? persianMonthFormatter.format(currentMonth)
      : gregorianMonthFormatter.format(currentMonth);

  return (
    <section
      className="
        relative z-20
        overflow-visible
        rounded-2xl
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold">تقویم تسک‌ها</h2>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            وضعیت کارها در طول ماه
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="ماه قبل"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-surface-hover)]
              hover:text-white
            "
          >
            <ChevronRight size={18} />
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
            امروز
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="ماه بعد"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-surface-hover)]
              hover:text-white
            "
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {/* Month */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold">{monthTitle}</h3>
      </div>

      {/* Weekdays */}
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

      {/* Days */}
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
              ? formatPersianDay(date)
              : formatGregorianDay(date);

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

      {/* Holiday explanation */}
      <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />

        <span className="text-xs text-[var(--color-text-secondary)]">
          تعطیل رسمی
        </span>

        <span className="text-xs text-[var(--color-text-muted)]">
          — برای مشاهده علت تعطیلی روی روز هاور کن
        </span>
      </div>

      {/* Legend */}
      <div
        className="
          mt-5 flex flex-wrap items-center gap-4
          border-t border-[var(--color-border)]
          pt-4
        "
      >
        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          انجام شده
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]" />
          باقی‌مانده
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
          <span className="h-2.5 w-2.5 rounded-md border border-red-500/50 bg-red-500/20" />
          تعطیلی رسمی
        </div>

        <div className="mr-auto text-[10px] text-[var(--color-text-muted)]">
          برای مشاهده جزئیات روی روز هاور کن
        </div>
      </div>
    </section>
  );
}
