import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type DatePickerMode = "single" | "range" | "year";

export interface DatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Picker mode */
  mode?: DatePickerMode;
  /** Selected date (single/year mode) */
  value?: Date | null;
  /** Initial date for uncontrolled usage. */
  defaultValue?: Date | null;
  /** Selected range (range mode) */
  rangeValue?: [Date | null, Date | null];
  defaultRangeValue?: [Date | null, Date | null];
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

function dayTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && dayTime(date) < dayTime(minDate)) return true;
  if (maxDate && dayTime(date) > dayTime(maxDate)) return true;
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
  tabStop: boolean;
  onFocus: () => void;
}

function DayCell({ day, state, fullDate, onClick, tabStop, onFocus }: DayCellProps) {
  const isInteractive = state !== "disabled";

  const cellClasses = cn(
    "flex items-center justify-center w-full min-w-0 h-10 text-sm font-medium relative select-none",
    state === "selected" && "bg-action-primary text-white rounded-[10px]",
    state === "start-range" && "bg-action-primary text-white rounded-l-[10px]",
    state === "end-range" && "bg-action-primary text-white rounded-r-[10px]",
    state === "mid-range" && "bg-primary-50 text-action-primary-text",
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
    <div
      role="gridcell"
      className="flex-1 min-w-0"
      aria-selected={state === "selected" || state.endsWith("range")}
    >
      <button
        type="button"
        data-day={dayTime(fullDate)}
        onFocus={onFocus}
        className={cn(
          cellClasses,
          "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-action-primary-text"
        )}
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        tabIndex={isInteractive && tabStop ? 0 : -1}
        aria-label={`${stateLabel}${dateLabel}`}
        aria-current={state === "today" ? "date" : undefined}
        aria-pressed={
          state === "selected" || state === "start-range" || state === "end-range"
            ? true
            : undefined
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
    </div>
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
  focusedDate: Date;
  onDayFocus: (date: Date) => void;
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
  focusedDate,
  onDayFocus,
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

  const tabDate =
    cells.find((cell) => cell.state !== "disabled" && isSameDay(cell.date, focusedDate))?.date ??
    cells.find((cell) => cell.state !== "disabled")?.date;
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
    <div className="flex flex-col" role="grid" aria-label={`${MONTH_NAMES[month]} ${year}`}>
      {/* Day headers */}
      <div className="flex h-10 items-center" role="row">
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            role="columnheader"
            aria-label={fullDayNames[i]}
            className="flex items-center justify-center flex-1 min-w-0 h-10 text-sm font-medium text-grey-600"
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
              tabStop={isSameDay(cell.date, tabDate)}
              onFocus={() => onDayFocus(cell.date)}
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
  minYear?: number;
  maxYear?: number;
}

function YearGrid({ baseYear, selectedYear, onYearClick, minYear, maxYear }: YearGridProps) {
  const [focusedYear, setFocusedYear] = useState(selectedYear ?? baseYear);
  const firstYear = Math.max(baseYear, minYear ?? baseYear);
  const lastYear = Math.min(baseYear + 19, maxYear ?? baseYear + 19);
  const tabYear = Math.min(lastYear, Math.max(firstYear, focusedYear));
  const years: number[] = [];
  for (let i = 0; i < 20; i++) {
    years.push(baseYear + i);
  }

  const rows: number[][] = [];
  for (let i = 0; i < years.length; i += 4) {
    rows.push(years.slice(i, i + 4));
  }

  return (
    <div
      className="flex flex-col gap-2 w-full"
      role="grid"
      aria-label="Year selection"
      onKeyDown={(event) => {
        const target = event.target as HTMLButtonElement;
        if (!target.dataset.year) return;
        const current = Number(target.dataset.year);
        const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 }[event.key];
        const next =
          event.key === "Home"
            ? firstYear
            : event.key === "End"
              ? lastYear
              : delta !== undefined
                ? Math.min(lastYear, Math.max(firstYear, current + delta))
                : null;
        if (next === null) return;
        event.preventDefault();
        setFocusedYear(next);
        event.currentTarget.querySelector<HTMLButtonElement>(`[data-year="${next}"]`)?.focus();
      }}
    >
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-4 h-10 items-center w-full" role="row">
          {row.map((year) => (
            <div
              key={year}
              role="gridcell"
              className="flex-1 min-w-0"
              aria-selected={year === selectedYear}
            >
              <button
                type="button"
                data-year={year}
                tabIndex={year === tabYear ? 0 : -1}
                onFocus={() => setFocusedYear(year)}
                disabled={year < firstYear || year > lastYear}
                aria-label={year === selectedYear ? `${year}, selected` : String(year)}
                aria-pressed={year === selectedYear || undefined}
                className={cn(
                  "w-full flex items-center justify-center py-2.5 px-1 rounded-[10px] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-action-primary-text text-sm font-medium cursor-pointer select-none",
                  year === selectedYear
                    ? "bg-action-primary text-white"
                    : "text-grey-900 hover:bg-grey-75"
                )}
                onClick={() => onYearClick(year)}
              >
                {year}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Nav Button ───────────────────────────────────────────────────────── */

function NavButton({
  direction,
  label,
  onClick,
  hidden,
  className,
}: {
  direction: "left" | "right";
  label?: string;
  onClick?: () => void;
  hidden?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? (direction === "left" ? "Previous month" : "Next month")}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "flex items-center justify-center p-2 rounded-lg bg-grey-75 hover:bg-grey-200 transition-colors cursor-pointer",
        hidden && "opacity-0 pointer-events-none",
        className
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
      defaultValue = null,
      rangeValue,
      defaultRangeValue = [null, null],
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
    const [internalDate, setInternalDate] = useState<Date | null>(defaultValue);
    const [internalRange, setInternalRange] =
      useState<[Date | null, Date | null]>(defaultRangeValue);
    const selectedDate = value === undefined ? internalDate : value;
    const [rangeStart, rangeEnd] = rangeValue === undefined ? internalRange : rangeValue;
    const candidate = selectedDate ?? rangeStart ?? now;
    const initialDate =
      minDate && dayTime(candidate) < dayTime(minDate)
        ? minDate
        : maxDate && dayTime(candidate) > dayTime(maxDate)
          ? maxDate
          : candidate;
    const [focusedDate, setFocusedDate] = useState(initialDate);
    const calendarRef = useRef<HTMLDivElement>(null);
    const focusRequested = useRef(false);
    useEffect(() => {
      if (!focusRequested.current) return;
      calendarRef.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${dayTime(focusedDate)}"]:not(:disabled)`)
        ?.focus();
      focusRequested.current = false;
    }, [focusedDate]);

    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
    const [viewYear, setViewYear] = useState(initialDate.getFullYear());
    const [yearBase, setYearBase] = useState(Math.floor(initialDate.getFullYear() / 20) * 20);

    const goToPrevMonth = useCallback(() => {
      const previous = new Date(viewYear, viewMonth - 1, 1);
      setViewMonth(previous.getMonth());
      setViewYear(previous.getFullYear());
    }, [viewMonth, viewYear]);

    const goToNextMonth = useCallback(() => {
      const next = new Date(viewYear, viewMonth + 1, 1);
      setViewMonth(next.getMonth());
      setViewYear(next.getFullYear());
    }, [viewMonth, viewYear]);

    const selectDate = (date: Date | null) => {
      if (value === undefined) setInternalDate(date);
      onChange?.(date);
    };
    const selectRange = (range: [Date | null, Date | null]) => {
      if (rangeValue === undefined) setInternalRange(range);
      onRangeChange?.(range);
    };
    const handleDayClick = (date: Date) => {
      if (isDateDisabled(date, minDate, maxDate)) return;
      if (mode === "single") selectDate(date);
      else if (mode === "range") {
        if (!rangeStart || rangeEnd) selectRange([date, null]);
        else selectRange(date < rangeStart ? [date, rangeStart] : [rangeStart, date]);
      }
    };
    const handleYearClick = (year: number) => {
      let date = new Date(year, selectedDate?.getMonth() ?? 0, 1);
      if (minDate && date < minDate) date = minDate;
      if (maxDate && date > maxDate) date = maxDate;
      selectDate(date);
      setViewYear(year);
    };
    const handleClear = () => {
      if (mode === "range") selectRange([null, null]);
      else selectDate(null);
      onClear?.();
    };
    const handleCalendarKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (!target.dataset.day) return;
      const date = new Date(Number(target.dataset.day));
      const next = new Date(date);
      const weekday = (date.getDay() + 6) % 7;
      switch (event.key) {
        case "ArrowRight":
          next.setDate(date.getDate() + 1);
          break;
        case "ArrowLeft":
          next.setDate(date.getDate() - 1);
          break;
        case "ArrowDown":
          next.setDate(date.getDate() + 7);
          break;
        case "ArrowUp":
          next.setDate(date.getDate() - 7);
          break;
        case "Home":
          next.setDate(date.getDate() - weekday);
          break;
        case "End":
          next.setDate(date.getDate() + 6 - weekday);
          break;
        case "PageUp":
        case "PageDown": {
          const month =
            date.getMonth() + (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1);
          next.setDate(1);
          next.setMonth(month);
          next.setDate(
            Math.min(date.getDate(), getDaysInMonth(next.getFullYear(), next.getMonth()))
          );
          break;
        }
        default:
          return;
      }
      event.preventDefault();
      const bounded =
        minDate && dayTime(next) < dayTime(minDate)
          ? new Date(dayTime(minDate))
          : maxDate && dayTime(next) > dayTime(maxDate)
            ? new Date(dayTime(maxDate))
            : next;
      focusRequested.current = true;
      setViewMonth(bounded.getMonth());
      setViewYear(bounded.getFullYear());
      setFocusedDate(bounded);
    };

    // Second month for range mode
    const secondMonth = useMemo(() => {
      const m = viewMonth + 1;
      return { month: m > 11 ? 0 : m, year: m > 11 ? viewYear + 1 : viewYear };
    }, [viewMonth, viewYear]);

    const monthYearLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    const secondMonthLabel = `${MONTH_NAMES[secondMonth.month]} ${secondMonth.year}`;

    return (
      <div
        {...rest}
        ref={(node) => {
          calendarRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onKeyDown={(event) => {
          rest.onKeyDown?.(event);
          if (!event.defaultPrevented) handleCalendarKey(event);
        }}
        className={cn(
          "bg-surface border border-grey-75 rounded-2xl p-5 shadow-soft-xs",
          "flex flex-col gap-6",
          mode !== "range" && "w-full max-w-[340px]",
          className
        )}
      >
        {/* ── Single Date / Range Header + Grid ── */}
        {mode === "single" && (
          <>
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <NavButton direction="left" onClick={goToPrevMonth} />
                <span aria-live="polite" className="text-sm font-medium text-grey-700">
                  {monthYearLabel}
                </span>
                <NavButton direction="right" onClick={goToNextMonth} />
              </div>

              {/* Calendar grid */}
              <MonthGrid
                year={viewYear}
                month={viewMonth}
                selectedDate={selectedDate}
                minDate={minDate}
                maxDate={maxDate}
                onDayClick={handleDayClick}
                focusedDate={
                  focusedDate.getMonth() === viewMonth && focusedDate.getFullYear() === viewYear
                    ? focusedDate
                    : new Date(viewYear, viewMonth, 1)
                }
                onDayFocus={setFocusedDate}
              />
            </div>
          </>
        )}

        {mode === "range" && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left month */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between w-full md:w-[280px]">
                <NavButton direction="left" onClick={goToPrevMonth} />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-grey-700">{monthYearLabel}</span>
                </div>
                <NavButton direction="right" onClick={goToNextMonth} className="md:hidden" />
                <NavButton direction="right" hidden className="hidden md:flex" />
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
                focusedDate={
                  focusedDate.getMonth() === viewMonth && focusedDate.getFullYear() === viewYear
                    ? focusedDate
                    : new Date(viewYear, viewMonth, 1)
                }
                onDayFocus={setFocusedDate}
              />
            </div>

            {/* Right month - hidden on mobile, shown on md+ */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="flex items-center justify-between w-[280px]">
                <NavButton direction="left" hidden />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-grey-700">{secondMonthLabel}</span>
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
                focusedDate={focusedDate}
                onDayFocus={setFocusedDate}
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
              selectedYear={selectedDate?.getFullYear()}
              onYearClick={handleYearClick}
              minYear={minDate?.getFullYear()}
              maxYear={maxDate?.getFullYear()}
            />
            <div className="flex items-center gap-4 mt-2">
              <NavButton
                direction="left"
                label="Previous 20 years"
                onClick={() => setYearBase((b) => b - 20)}
              />
              <NavButton
                direction="right"
                label="Next 20 years"
                onClick={() => setYearBase((b) => b + 20)}
              />
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        {showFooter && (
          <div className="flex items-center justify-between border-t border-grey-100 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-semibold text-grey-700 hover:text-grey-900 px-2 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onDone}
              className="bg-action-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-action-primary-hover cursor-pointer"
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
