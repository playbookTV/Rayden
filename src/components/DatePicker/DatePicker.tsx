import { forwardRef, useCallback, useMemo, useState, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type DatePickerMode = "single" | "range" | "year";

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Picker mode */
  mode?: DatePickerMode;
  /** Selected date (single/year mode) */
  value?: Date | null;
  /** Selected range (range mode) */
  rangeValue?: [Date | null, Date | null];
  /** Called when a single date is selected */
  onChange?: (date: Date | null) => void;
  /** Called when a date range is selected */
  onRangeChange?: (range: [Date | null, Date | null]) => void;
  /** Show footer with Clear/Done buttons */
  showFooter?: boolean;
  /** Called when Done is clicked */
  onDone?: () => void;
  /** Called when Clear is clicked */
  onClear?: () => void;
  /** Disable dates before this */
  minDate?: Date;
  /** Disable dates after this */
  maxDate?: Date;
}

/* ─── Calendar Utilities ───────────────────────────────────────────────── */

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date) {
  return isSameDay(date, new Date());
}

function isBetween(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const t = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return t > s && t < e;
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
}

/* ─── Icons ────────────────────────────────────────────────────────────── */

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3L5 7l4 4" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 3l4 4-4 4" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ─── Day Cell ─────────────────────────────────────────────────────────── */

type DayCellState =
  | "default"
  | "selected"
  | "today"
  | "disabled"
  | "mid-range"
  | "start-range"
  | "end-range";

interface DayCellProps {
  day: number;
  state: DayCellState;
  fullDate: Date;
  onClick?: () => void;
}

function DayCell({ day, state, fullDate, onClick }: DayCellProps) {
  const isInteractive = state !== "disabled";

  const cellClasses = cn(
    "flex items-center justify-center w-10 h-10 text-sm font-medium relative select-none",
    state === "selected" && "bg-primary-400 text-white rounded-[10px]",
    state === "start-range" && "bg-primary-400 text-white rounded-l-[10px]",
    state === "end-range" && "bg-primary-400 text-white rounded-r-[10px]",
    state === "mid-range" && "bg-primary-50 text-primary-400",
    state === "disabled" && "text-grey-300",
    state === "default" && "text-grey-900 hover:bg-grey-75 rounded-[10px]",
    state === "today" && "text-grey-900 hover:bg-grey-75 rounded-[10px]",
    isInteractive && "cursor-pointer"
  );

  // Build accessible label with full date and state context
  const dateLabel = fullDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const stateLabel =
    state === "today"
      ? "Today, "
      : state === "selected"
        ? "Selected, "
        : state === "start-range"
          ? "Start of range, "
          : state === "end-range"
            ? "End of range, "
            : state === "mid-range"
              ? "In selected range, "
              : "";

  return (
    <button
      type="button"
      className={cellClasses}
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      tabIndex={isInteractive ? 0 : -1}
      aria-label={`${stateLabel}${dateLabel}`}
      aria-current={state === "today" ? "date" : undefined}
      aria-pressed={
        state === "selected" || state === "start-range" || state === "end-range" ? true : undefined
      }
    >
      {day}
      {state === "today" && (
        <span
          className="absolute bottom-[5px] left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary-400"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

/* ─── Month Grid ───────────────────────────────────────────────────────── */

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  isRange?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onDayClick: (date: Date) => void;
}

function MonthGrid({
  year,
  month,
  selectedDate,
  rangeStart,
  rangeEnd,
  isRange,
  minDate,
  maxDate,
  onDayClick,
}: MonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const cells: { day: number; state: DayCellState; date: Date }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    cells.push({ day: d, state: "disabled", date: new Date(year, month - 1, d) });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    let state: DayCellState = "default";

    if (isDateDisabled(date, minDate, maxDate)) {
      state = "disabled";
    } else if (isRange && rangeStart && rangeEnd) {
      const start = rangeStart.getTime() <= rangeEnd.getTime() ? rangeStart : rangeEnd;
      const end = rangeStart.getTime() <= rangeEnd.getTime() ? rangeEnd : rangeStart;
      if (isSameDay(date, start)) state = "start-range";
      else if (isSameDay(date, end)) state = "end-range";
      else if (isBetween(date, start, end)) state = "mid-range";
    } else if (isRange && rangeStart && !rangeEnd && isSameDay(date, rangeStart)) {
      state = "selected";
    } else if (!isRange && isSameDay(date, selectedDate)) {
      state = "selected";
    }

    if (state === "default" && isToday(date)) {
      state = "today";
    }

    cells.push({ day: d, state, date });
  }

  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, state: "disabled", date: new Date(year, month + 1, d) });
  }

  // Only show 5 rows if last row is all disabled
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  // Remove last row if all disabled
  if (rows.length === 6 && rows[5].every((c) => c.state === "disabled")) {
    rows.pop();
  }

  const fullDayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex flex-col" role="grid" aria-label="Calendar">
      {/* Day headers */}
      <div className="flex h-10 items-center" role="row">
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            role="columnheader"
            aria-label={fullDayNames[i]}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-grey-400"
          >
            {label}
          </div>
        ))}
      </div>
      {/* Weeks */}
      {rows.map((row, ri) => (
        <div key={ri} className="flex h-10 items-center" role="row">
          {row.map((cell, ci) => (
            <DayCell
              key={ci}
              day={cell.day}
              state={cell.state}
              fullDate={cell.date}
              onClick={() => onDayClick(cell.date)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Year Grid ────────────────────────────────────────────────────────── */

interface YearGridProps {
  baseYear: number;
  selectedYear?: number;
  onYearClick: (year: number) => void;
}

function YearGrid({ baseYear, selectedYear, onYearClick }: YearGridProps) {
  const years: number[] = [];
  for (let i = 0; i < 20; i++) {
    years.push(baseYear + i);
  }

  const rows: number[][] = [];
  for (let i = 0; i < years.length; i += 4) {
    rows.push(years.slice(i, i + 4));
  }

  return (
    <div className="flex flex-col gap-2 w-full" role="grid" aria-label="Year selection">
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-4 h-10 items-center w-full" role="row">
          {row.map((year) => (
            <button
              key={year}
              type="button"
              aria-label={year === selectedYear ? `${year}, selected` : String(year)}
              aria-pressed={year === selectedYear || undefined}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 px-4 rounded-[10px] text-sm font-medium cursor-pointer select-none",
                year === selectedYear
                  ? "bg-primary-400 text-white"
                  : "text-grey-900 hover:bg-grey-75"
              )}
              onClick={() => onYearClick(year)}
            >
              {year}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Nav Button ───────────────────────────────────────────────────────── */

function NavButton({
  direction,
  onClick,
  hidden,
}: {
  direction: "left" | "right";
  onClick?: () => void;
  hidden?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous month" : "Next month"}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "flex items-center justify-center p-2 rounded-lg bg-grey-75 hover:bg-grey-200 transition-colors cursor-pointer",
        hidden && "opacity-0 pointer-events-none"
      )}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-3.5 text-grey-700" />
      ) : (
        <ChevronRight className="size-3.5 text-grey-700" />
      )}
    </button>
  );
}

/* ─── DatePicker ───────────────────────────────────────────────────────── */

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      mode = "single",
      value,
      rangeValue,
      onChange,
      onRangeChange,
      showFooter = false,
      onDone,
      onClear,
      minDate,
      maxDate,
      className,
      ...rest
    },
    ref
  ) => {
    const now = new Date();
    const initialDate = value ?? rangeValue?.[0] ?? now;

    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
    const [viewYear, setViewYear] = useState(initialDate.getFullYear());
    const [yearBase, setYearBase] = useState(Math.floor(initialDate.getFullYear() / 20) * 20);

    // Range selection state
    const [rangeStart, setRangeStart] = useState<Date | null>(rangeValue?.[0] ?? null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(rangeValue?.[1] ?? null);

    const goToPrevMonth = useCallback(() => {
      setViewMonth((m) => {
        if (m === 0) {
          setViewYear((y) => y - 1);
          return 11;
        }
        return m - 1;
      });
    }, []);

    const goToNextMonth = useCallback(() => {
      setViewMonth((m) => {
        if (m === 11) {
          setViewYear((y) => y + 1);
          return 0;
        }
        return m + 1;
      });
    }, []);

    const handleDayClick = useCallback(
      (date: Date) => {
        if (mode === "single") {
          onChange?.(date);
        } else if (mode === "range") {
          if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(date);
            setRangeEnd(null);
            onRangeChange?.([date, null]);
          } else {
            setRangeEnd(date);
            onRangeChange?.([rangeStart, date]);
          }
        }
      },
      [mode, onChange, onRangeChange, rangeStart, rangeEnd]
    );

    const handleYearClick = useCallback(
      (year: number) => {
        const newDate = new Date(year, value?.getMonth() ?? 0, 1);
        onChange?.(newDate);
        setViewYear(year);
      },
      [onChange, value]
    );

    const handleClear = useCallback(() => {
      if (mode === "range") {
        setRangeStart(null);
        setRangeEnd(null);
        onRangeChange?.([null, null]);
      } else {
        onChange?.(null);
      }
      onClear?.();
    }, [mode, onChange, onRangeChange, onClear]);

    // Second month for range mode
    const secondMonth = useMemo(() => {
      const m = viewMonth + 1;
      return { month: m > 11 ? 0 : m, year: m > 11 ? viewYear + 1 : viewYear };
    }, [viewMonth, viewYear]);

    const monthYearLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    const secondMonthLabel = `${MONTH_NAMES[secondMonth.month]} ${secondMonth.year}`;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-grey-50 border border-grey-75 rounded-2xl p-5 shadow-soft-xs",
          "flex flex-col gap-6",
          mode !== "range" && "w-[340px]",
          className
        )}
        {...rest}
      >
        {/* ── Single Date / Range Header + Grid ── */}
        {mode === "single" && (
          <>
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <NavButton direction="left" onClick={goToPrevMonth} />
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-medium text-grey-700 cursor-default"
                >
                  {monthYearLabel}
                  <ChevronDown className="size-6 text-grey-500" />
                </button>
                <NavButton direction="right" onClick={goToNextMonth} />
              </div>

              {/* Calendar grid */}
              <MonthGrid
                year={viewYear}
                month={viewMonth}
                selectedDate={value}
                minDate={minDate}
                maxDate={maxDate}
                onDayClick={handleDayClick}
              />
            </div>
          </>
        )}

        {mode === "range" && (
          <div className="flex gap-8">
            {/* Left month */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-10 w-[280px]">
                <NavButton direction="left" onClick={goToPrevMonth} />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-grey-700">{monthYearLabel}</span>
                  <ChevronDown className="size-6 text-grey-500" />
                </div>
                <NavButton direction="right" hidden />
              </div>
              <MonthGrid
                year={viewYear}
                month={viewMonth}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                isRange
                minDate={minDate}
                maxDate={maxDate}
                onDayClick={handleDayClick}
              />
            </div>

            {/* Right month */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between w-[280px]">
                <NavButton direction="left" hidden />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-grey-700">{secondMonthLabel}</span>
                  <ChevronDown className="size-6 text-grey-500" />
                </div>
                <NavButton direction="right" onClick={goToNextMonth} />
              </div>
              <MonthGrid
                year={secondMonth.year}
                month={secondMonth.month}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                isRange
                minDate={minDate}
                maxDate={maxDate}
                onDayClick={handleDayClick}
              />
            </div>
          </div>
        )}

        {mode === "year" && (
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-grey-700">
                {yearBase}–{yearBase + 19}
              </span>
              <ChevronDown className="size-6 text-grey-500" />
            </div>
            <YearGrid
              baseYear={yearBase}
              selectedYear={value?.getFullYear()}
              onYearClick={handleYearClick}
            />
            <div className="flex items-center gap-4 mt-2">
              <NavButton direction="left" onClick={() => setYearBase((b) => b - 20)} />
              <NavButton direction="right" onClick={() => setYearBase((b) => b + 20)} />
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        {showFooter && (
          <div className="flex items-center justify-between border-t border-grey-100 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-semibold text-grey-400 hover:text-grey-600 px-2 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onDone}
              className="bg-primary-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-500 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
