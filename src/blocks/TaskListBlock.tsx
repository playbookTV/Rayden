import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Checkbox } from "../components/FormControl";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type TaskListHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TaskListAssignee {
  id: string;
  name: string;
  avatarSrc?: string;
  initials?: string;
}

export interface TaskListTask {
  id: string;
  title: string;
  completed: boolean;
  /** Assignee id. Resolved against {@link TaskListBlockProps.assignees}. */
  assigneeId?: string;
  /** Calendar date as `YYYY-MM-DD`. Parsed in local time, never UTC-shifted. */
  dueDate?: string;
  /** One line of supporting context shown under the title. */
  note?: string;
}

export type TaskListStatusFilter = "all" | "active" | "completed";

export type TaskListStatus = "idle" | "loading" | "error";

export type TaskListAddStatus = "idle" | "submitting" | "error";

export interface TaskListAddInput {
  title: string;
  assigneeId?: string;
  dueDate?: string;
}

/** Everything needed to phrase a due date in the consumer's own words. */
export interface TaskListDueContext {
  /** Whole days from today. Negative means overdue. */
  daysFromToday: number;
  date: Date;
  completed: boolean;
}

export interface TaskListBlockProps {
  title?: string;
  description?: string;
  /** Heading element for {@link title}. @default "h2" */
  headingLevel?: TaskListHeadingLevel;
  /** The complete task set for the current page. */
  tasks: TaskListTask[];
  /** Required: a completion control is never rendered without an action. */
  onToggleComplete: (id: string, completed: boolean) => void;
  /** When omitted, the add form is not rendered. */
  onAddTask?: (input: TaskListAddInput) => void;
  /** When omitted, no delete control is rendered. */
  onDeleteTask?: (id: string) => void;
  /** When omitted, the assignee is shown but cannot be changed. */
  onAssignTask?: (id: string, assigneeId: string) => void;
  /** People tasks can be assigned to. Also drives the assignee filter. */
  assignees?: TaskListAssignee[];
  /** Controlled selection. Selection controls render only with a handler. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Bulk controls render only when their handler is supplied. */
  onBulkComplete?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
  /** @default "idle" */
  status?: TaskListStatus;
  errorMessage?: string;
  onRetry?: () => void;
  /** @default "idle" */
  addStatus?: TaskListAddStatus;
  addErrorMessage?: string;
  /**
   * Permission-aware editing. When false, completion controls are disabled and
   * the add, delete, assign and bulk controls are not rendered.
   * @default true
   */
  canEdit?: boolean;
  readOnlyMessage?: string;
  /** Reference date for due-date context. Pass it to make output deterministic. */
  today?: Date;
  /** BCP-47 tag used to format absolute dates. @default "en-GB" */
  locale?: string;
  /** Replaces the built-in due-date phrasing. */
  formatDueDate?: (isoDate: string, context: TaskListDueContext) => string;
  /** Shown when there are no tasks at all. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Shown when tasks exist but none match the current filters. */
  noMatchesTitle?: string;
  noMatchesDescription?: string;
  /** Extra content below the list. */
  footer?: ReactNode;
  className?: string;
}

/* ─── Date helpers ───────────────────────────────────────────────────── */

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Parses `YYYY-MM-DD` in local time. `new Date("2026-09-22")` would be UTC. */
function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function pluralDays(count: number): string {
  return count === 1 ? "1 day" : `${count} days`;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function TaskListBlock({
  title = "Tasks",
  description,
  headingLevel = "h2",
  tasks,
  onToggleComplete,
  onAddTask,
  onDeleteTask,
  onAssignTask,
  assignees,
  selectedIds,
  onSelectionChange,
  onBulkComplete,
  onBulkDelete,
  status = "idle",
  errorMessage,
  onRetry,
  addStatus = "idle",
  addErrorMessage,
  canEdit = true,
  readOnlyMessage = "You can follow this list but not change it. Ask the list owner for edit access.",
  today,
  locale = "en-GB",
  formatDueDate,
  emptyTitle = "No tasks yet",
  emptyDescription = "Add the first task to start tracking this work.",
  noMatchesTitle = "No tasks match these filters",
  noMatchesDescription = "Nothing here matches your search and filter choices. The list still has tasks.",
  footer,
  className,
}: TaskListBlockProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const statusGroupName = `${uid}-status-filter`;
  const newTitleId = `${uid}-new-title`;
  const addErrorId = `${uid}-add-error`;

  const [statusFilter, setStatusFilter] = useState<TaskListStatusFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAssigneeId, setNewAssigneeId] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [addTouched, setAddTouched] = useState(false);

  const newTitleRef = useRef<HTMLInputElement>(null);

  const loading = status === "loading";
  const failed = status === "error";
  const adding = addStatus === "submitting";
  const editable = canEdit && !loading && !failed;

  const referenceDay = useMemo(() => startOfLocalDay(today ?? new Date()), [today]);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale]
  );

  const assigneeById = useMemo(() => {
    const map = new Map<string, TaskListAssignee>();
    assignees?.forEach((person) => map.set(person.id, person));
    return map;
  }, [assignees]);

  /* — Filtering ——————————————————————————————————————————— */

  const normalisedQuery = query.trim().toLowerCase();

  // Search + assignee first, so the status counts predict what each status
  // choice will actually show.
  const scoped = useMemo(
    () =>
      tasks.filter((task) => {
        if (assigneeFilter === "unassigned" && task.assigneeId) return false;
        if (
          assigneeFilter !== "all" &&
          assigneeFilter !== "unassigned" &&
          task.assigneeId !== assigneeFilter
        )
          return false;
        if (!normalisedQuery) return true;
        return (
          task.title.toLowerCase().includes(normalisedQuery) ||
          (task.note?.toLowerCase().includes(normalisedQuery) ?? false)
        );
      }),
    [tasks, assigneeFilter, normalisedQuery]
  );

  const counts = useMemo(
    () => ({
      all: scoped.length,
      active: scoped.filter((task) => !task.completed).length,
      completed: scoped.filter((task) => task.completed).length,
    }),
    [scoped]
  );

  const visible = useMemo(() => {
    if (statusFilter === "active") return scoped.filter((task) => !task.completed);
    if (statusFilter === "completed") return scoped.filter((task) => task.completed);
    return scoped;
  }, [scoped, statusFilter]);

  const filtersActive =
    statusFilter !== "all" || assigneeFilter !== "all" || normalisedQuery.length > 0;

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setAssigneeFilter("all");
    setQuery("");
  }, []);

  /* — Selection ——————————————————————————————————————————— */

  const selectionEnabled = Boolean(onSelectionChange) && editable;
  const selectedSet = useMemo(() => new Set(selectedIds ?? []), [selectedIds]);

  const visibleIds = useMemo(() => visible.map((task) => task.id), [visible]);
  // Membership against the *currently visible* ids. Comparing set sizes would
  // keep the header checked after the rows behind it were replaced.
  const selectedVisibleIds = useMemo(
    () => visibleIds.filter((id) => selectedSet.has(id)),
    [visibleIds, selectedSet]
  );
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleIds.length === visibleIds.length;
  const someVisibleSelected = selectedVisibleIds.length > 0 && !allVisibleSelected;

  const toggleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    const current = selectedIds ?? [];
    if (allVisibleSelected) {
      // Only drop the visible rows; selection made under other filters stays.
      const visibleSet = new Set(visibleIds);
      onSelectionChange(current.filter((id) => !visibleSet.has(id)));
      return;
    }
    onSelectionChange(Array.from(new Set([...current, ...visibleIds])));
  }, [allVisibleSelected, onSelectionChange, selectedIds, visibleIds]);

  const toggleOne = useCallback(
    (id: string, selected: boolean) => {
      if (!onSelectionChange) return;
      const current = selectedIds ?? [];
      onSelectionChange(
        selected ? Array.from(new Set([...current, id])) : current.filter((x) => x !== id)
      );
    },
    [onSelectionChange, selectedIds]
  );

  /* — Due-date context ———————————————————————————————————— */

  const describeDue = useCallback(
    (task: TaskListTask): { text: string; overdue: boolean } | null => {
      if (!task.dueDate) return null;
      const date = parseIsoDate(task.dueDate);
      if (!date) return null;
      const daysFromToday = Math.round(
        (startOfLocalDay(date).getTime() - referenceDay.getTime()) / 86_400_000
      );
      const overdue = !task.completed && daysFromToday < 0;
      if (formatDueDate) {
        return {
          text: formatDueDate(task.dueDate, {
            daysFromToday,
            date,
            completed: task.completed,
          }),
          overdue,
        };
      }
      if (task.completed) return { text: `Due ${dateFormatter.format(date)}`, overdue: false };
      if (daysFromToday < 0)
        return { text: `Overdue by ${pluralDays(Math.abs(daysFromToday))}`, overdue: true };
      if (daysFromToday === 0) return { text: "Due today", overdue: false };
      if (daysFromToday === 1) return { text: "Due tomorrow", overdue: false };
      if (daysFromToday <= 7)
        return { text: `Due in ${pluralDays(daysFromToday)}`, overdue: false };
      return { text: `Due ${dateFormatter.format(date)}`, overdue: false };
    },
    [dateFormatter, formatDueDate, referenceDay]
  );

  /* — Add ————————————————————————————————————————————————— */

  const trimmedNewTitle = newTitle.trim();
  const addError = addTouched && !trimmedNewTitle ? "Give the task a name." : undefined;

  const handleAdd = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Guard duplicate submission while an add is in flight.
      if (!onAddTask || adding || !editable) return;
      setAddTouched(true);
      if (!trimmedNewTitle) {
        newTitleRef.current?.focus();
        return;
      }
      onAddTask({
        title: trimmedNewTitle,
        assigneeId: newAssigneeId || undefined,
        dueDate: newDueDate || undefined,
      });
      setNewTitle("");
      setNewDueDate("");
      setAddTouched(false);
      newTitleRef.current?.focus();
    },
    [adding, editable, newAssigneeId, newDueDate, onAddTask, trimmedNewTitle]
  );

  const Heading = headingLevel;

  const statusOptions: { id: TaskListStatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "active", label: "To do", count: counts.active },
    { id: "completed", label: "Done", count: counts.completed },
  ];

  return (
    <section aria-labelledby={titleId} className={cn("@container w-full", className)}>
      <div className="flex flex-col gap-4 rounded-12 border border-surface-border bg-surface p-4 @min-[520px]:p-6">
        <header className="flex flex-col gap-2">
          <Heading id={titleId} className="text-h6 font-semibold text-grey-900">
            {title}
          </Heading>
          {description && <p className="text-body-sm text-grey-600">{description}</p>}
        </header>

        {!canEdit && (
          <Alert
            state="information"
            icon="lock"
            role="status"
            title="View only"
            description={readOnlyMessage}
            className="bg-surface dark:bg-surface"
          />
        )}

        {/* ── Add ──────────────────────────────────────────────────── */}
        {onAddTask && editable && (
          <form onSubmit={handleAdd} noValidate className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 @min-[760px]:flex-row @min-[760px]:items-end">
              <div className="min-w-0 flex-1">
                <Input
                  id={newTitleId}
                  ref={newTitleRef}
                  name="newTask"
                  size="md"
                  label="New task"
                  placeholder="What needs doing?"
                  value={newTitle}
                  disabled={adding}
                  error={addError}
                  onChange={(event) => setNewTitle(event.target.value)}
                />
              </div>
              {assignees && assignees.length > 0 && (
                <div className="flex min-w-0 flex-col gap-1 @min-[760px]:w-48">
                  <label
                    htmlFor={`${uid}-new-assignee`}
                    className="text-sm font-medium leading-[1.45] text-grey-900"
                  >
                    Assign to
                  </label>
                  <select
                    id={`${uid}-new-assignee`}
                    value={newAssigneeId}
                    disabled={adding}
                    onChange={(event) => setNewAssigneeId(event.target.value)}
                    className="h-12 w-full rounded-lg border border-grey-300 bg-surface px-3 text-sm text-grey-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text disabled:cursor-not-allowed disabled:bg-grey-50"
                  >
                    <option value="">Nobody yet</option>
                    {assignees.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1 @min-[760px]:w-44">
                <label
                  htmlFor={`${uid}-new-due`}
                  className="text-sm font-medium leading-[1.45] text-grey-900"
                >
                  Due date
                </label>
                <input
                  id={`${uid}-new-due`}
                  type="date"
                  value={newDueDate}
                  disabled={adding}
                  onChange={(event) => setNewDueDate(event.target.value)}
                  className="h-12 w-full rounded-lg border border-grey-300 bg-surface px-3 text-sm text-grey-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text disabled:cursor-not-allowed disabled:bg-grey-50"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={adding}
                className="@min-[760px]:h-12 @min-[760px]:shrink-0 @min-[760px]:py-0"
              >
                {adding ? "Adding…" : "Add task"}
              </Button>
            </div>
            {addStatus === "error" && addErrorMessage && (
              <p id={addErrorId} role="alert" className="text-body-sm text-feedback-error">
                {addErrorMessage}
              </p>
            )}
          </form>
        )}

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 border-t border-surface-border pt-4 @min-[640px]:flex-row @min-[640px]:flex-wrap @min-[640px]:items-end">
          <fieldset className="min-w-0 border-0 p-0">
            <legend className="mb-1 text-sm font-medium leading-[1.45] text-grey-900">
              Filter by status
            </legend>
            <div className="inline-flex flex-wrap gap-1 rounded-lg border border-surface-border-strong p-1">
              {statusOptions.map((option) => (
                <label key={option.id} className="relative">
                  <input
                    type="radio"
                    name={statusGroupName}
                    value={option.id}
                    checked={statusFilter === option.id}
                    onChange={() => setStatusFilter(option.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 text-body-sm font-medium text-grey-700",
                      "peer-checked:bg-primary-50 peer-checked:text-action-primary-text",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action-primary-text"
                    )}
                  >
                    {option.label}
                    <span className="text-body-xs text-grey-600">({option.count})</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {assignees && assignees.length > 0 && (
            <div className="flex min-w-0 flex-col gap-1 @min-[640px]:w-48">
              <label
                htmlFor={`${uid}-assignee-filter`}
                className="text-sm font-medium leading-[1.45] text-grey-900"
              >
                Filter by assignee
              </label>
              <select
                id={`${uid}-assignee-filter`}
                value={assigneeFilter}
                onChange={(event) => setAssigneeFilter(event.target.value)}
                className="h-10 w-full rounded-lg border border-grey-300 bg-surface px-3 text-sm text-grey-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
              >
                <option value="all">Everyone</option>
                <option value="unassigned">Unassigned</option>
                {assignees.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="min-w-0 flex-1 @min-[640px]:max-w-64">
            <Input
              id={`${uid}-search`}
              type="search"
              size="sm"
              label="Search tasks"
              placeholder="Search by name"
              leadingIcon="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {/* Result count, announced politely as filters change. */}
        <output className="text-body-sm text-grey-600">
          {loading
            ? `Loading tasks…`
            : `Showing ${visible.length} of ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}.`}
        </output>

        {/* ── Bulk bar ─────────────────────────────────────────────── */}
        {selectionEnabled && visible.length > 0 && (
          <div className="flex flex-col gap-3 rounded-8 border border-surface-border bg-surface-muted p-3 @min-[520px]:flex-row @min-[520px]:items-center @min-[520px]:justify-between">
            <span className="flex items-center gap-3">
              <Checkbox
                id={`${uid}-select-all`}
                checked={allVisibleSelected}
                indeterminate={someVisibleSelected}
                onChange={toggleSelectAll}
                aria-label={`Select all ${visible.length} shown ${visible.length === 1 ? "task" : "tasks"}`}
              />
              <span className="text-body-sm text-grey-700">
                {selectedVisibleIds.length > 0
                  ? `${selectedVisibleIds.length} of ${visible.length} shown selected`
                  : `Select all ${visible.length} shown`}
              </span>
            </span>
            {selectedVisibleIds.length > 0 && (onBulkComplete || onBulkDelete) && (
              <span className="flex flex-wrap gap-2">
                {onBulkComplete && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => onBulkComplete(selectedVisibleIds)}
                  >
                    Mark as done
                  </Button>
                )}
                {onBulkDelete && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    appearance="outlined"
                    onClick={() => onBulkDelete(selectedVisibleIds)}
                  >
                    Delete
                  </Button>
                )}
              </span>
            )}
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────── */}
        {failed ? (
          <div className="flex flex-col gap-3">
            <Alert
              state="error"
              icon="info-triangle"
              role="alert"
              title="These tasks could not be loaded"
              description={errorMessage ?? "The task service did not respond. Nothing was changed."}
              className="bg-surface dark:bg-surface"
            />
            {onRetry && (
              <div>
                <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
                  Try again
                </Button>
              </div>
            )}
          </div>
        ) : loading ? (
          <div
            aria-busy="true"
            className="flex min-h-32 items-center justify-center rounded-8 border border-dashed border-surface-border-strong p-6"
          >
            <Spinner size="md" label="Loading tasks…" labelPosition="below" />
          </div>
        ) : tasks.length === 0 ? (
          /* No tasks exist at all. */
          <div className="flex flex-col items-start gap-2 rounded-8 border border-dashed border-surface-border-strong p-6">
            <p className="text-body-md font-semibold text-grey-900">{emptyTitle}</p>
            <p className="text-body-sm text-grey-600">{emptyDescription}</p>
            {onAddTask && editable && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => newTitleRef.current?.focus()}
              >
                Add the first task
              </Button>
            )}
          </div>
        ) : visible.length === 0 ? (
          /* Tasks exist, but this filter combination matched none of them. */
          <div className="flex flex-col items-start gap-2 rounded-8 border border-dashed border-surface-border-strong p-6">
            <p className="text-body-md font-semibold text-grey-900">{noMatchesTitle}</p>
            <p className="text-body-sm text-grey-600">{noMatchesDescription}</p>
            {filtersActive && (
              <Button type="button" size="sm" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <ul role="list" className="flex list-none flex-col gap-2 p-0">
            {visible.map((task) => {
              const checkboxId = `${uid}-task-${task.id}`;
              const titleLabelId = `${checkboxId}-label`;
              const due = describeDue(task);
              const person = task.assigneeId ? assigneeById.get(task.assigneeId) : undefined;
              const selected = selectedSet.has(task.id);

              return (
                <li
                  key={task.id}
                  className={cn(
                    "relative flex flex-col gap-3 rounded-8 border p-3 @min-[560px]:flex-row @min-[560px]:items-start",
                    selected
                      ? "border-primary-200 bg-primary-50"
                      : "border-surface-border bg-surface"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {selectionEnabled && (
                      // A gutter keeps the row-selection control visually
                      // distinct from the completion control beside it.
                      <span className="flex self-stretch border-r border-surface-border pt-0.5 pr-3">
                        <Checkbox
                          checked={selected}
                          onChange={(event) => toggleOne(task.id, event.target.checked)}
                          aria-label={`Select ${task.title}`}
                        />
                      </span>
                    )}
                    <span className="pt-0.5">
                      <Checkbox
                        id={checkboxId}
                        checked={task.completed}
                        disabled={!canEdit}
                        aria-labelledby={titleLabelId}
                        onChange={(event) => onToggleComplete(task.id, event.target.checked)}
                      />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <label
                        id={titleLabelId}
                        htmlFor={checkboxId}
                        className={cn(
                          "text-body-sm font-medium break-words",
                          canEdit && "cursor-pointer",
                          task.completed ? "text-grey-600 line-through" : "text-grey-900"
                        )}
                      >
                        {task.title}
                      </label>
                      {task.note && (
                        <p className="text-body-xs break-words text-grey-600">{task.note}</p>
                      )}
                      {due && (
                        <span
                          className={cn(
                            "inline-flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-body-xs font-medium",
                            due.overdue ? "bg-error-50 text-error-700" : "text-grey-600"
                          )}
                        >
                          <Icon name={due.overdue ? "info-triangle" : "calendar"} size="xs" />
                          {due.text}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 @min-[560px]:justify-end">
                    {onAssignTask && canEdit && assignees && assignees.length > 0 ? (
                      <>
                        <label htmlFor={`${checkboxId}-assignee`} className="sr-only">
                          Assignee for {task.title}
                        </label>
                        <select
                          id={`${checkboxId}-assignee`}
                          value={task.assigneeId ?? ""}
                          onChange={(event) => onAssignTask(task.id, event.target.value)}
                          className="h-9 max-w-40 rounded-lg border border-grey-300 bg-surface px-2 text-body-xs text-grey-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
                        >
                          <option value="">Unassigned</option>
                          {assignees.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                              {candidate.name}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar
                          size="xs"
                          type={person?.avatarSrc ? "image" : person ? "initials" : "icon"}
                          src={person?.avatarSrc}
                          alt={person?.name ?? ""}
                          icon="user"
                          initials={
                            person?.initials ?? person?.name.slice(0, 2).toUpperCase() ?? "?"
                          }
                        />
                        <span className="truncate text-body-xs text-grey-600">
                          {person?.name ?? "Unassigned"}
                        </span>
                      </span>
                    )}

                    {onDeleteTask && canEdit && (
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-grey-300 text-grey-600 hover:bg-grey-100 hover:text-action-danger-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
                      >
                        <Icon name="bin" size="md" />
                        <span className="sr-only">Delete {task.title}</span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {footer && <div className="flex flex-wrap items-center gap-3">{footer}</div>}
      </div>
    </section>
  );
}
