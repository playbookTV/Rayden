import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/Table";
import type { SortDirection } from "../components/Table";
import { Checkbox } from "../components/FormControl";
import { Pagination } from "../components/Pagination";

// ─── Types ───────────────────────────────────────────────────────────
export interface SearchableTableColumn {
  /** Unique column key — used to look up row values */
  key: string;
  /** Column header label */
  label: string;
  /** Enable sorting on this column */
  sortable?: boolean;
  /** Fixed column width (CSS string, e.g. "300px") */
  width?: string;
  /** Custom cell renderer; receives the cell value and full row */
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

export type SearchableTableRow = Record<string, unknown> & { id: string };

export interface SearchableTableBlockProps {
  /** When set, renders a title + icon toolbar. When absent, renders a search input toolbar. */
  title?: string;
  /** Column definitions */
  columns: SearchableTableColumn[];
  /** Row data — each must have an `id` field */
  rows: SearchableTableRow[];
  /** Search input placeholder */
  searchPlaceholder?: string;
  /**
   * Called when the search value changes. Supplying this puts search under your
   * control: the block stops filtering `rows` itself and renders exactly what you
   * pass. Omit it and the block filters `rows` locally.
   */
  onSearch?: (query: string) => void;
  /**
   * Called when a sortable header is activated. Supplying this puts ordering under
   * your control: the block only renders the indicator and expects you to reorder
   * `rows`. Omit it and the block sorts `rows` locally.
   */
  onSort?: (key: string, direction: SortDirection) => void;
  /** Title-variant toolbar: search action. The button renders only when supplied. */
  onSearchClick?: () => void;
  /** Title-variant toolbar: sort action. The button renders only when supplied. */
  onSortClick?: () => void;
  /** Show filter button */
  showFilter?: boolean;
  /** Filter click handler */
  onFilter?: () => void;
  /** Show date selector button */
  showDateSelector?: boolean;
  /** Date selector click handler */
  onDateSelect?: () => void;
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Selection change handler */
  onSelectionChange?: (ids: string[]) => void;
  /** Row kebab menu action handler */
  onRowAction?: (rowId: string) => void;
  /** Current page (1-indexed) */
  page?: number;
  /** Total pages */
  totalPages?: number;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Additional class names */
  className?: string;
}

// ─── Kebab Button ────────────────────────────────────────────────────
function KebabButton({ onClick, rowLabel }: { onClick?: () => void; rowLabel?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rowLabel ? `More actions for ${rowLabel}` : "More actions"}
      className="flex items-center justify-center size-8 rounded-md hover:bg-grey-50 text-grey-500"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="3" r="1.5" fill="currentColor" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="8" cy="13" r="1.5" fill="currentColor" />
      </svg>
    </button>
  );
}

// ─── Component ───────────────────────────────────────────────────────
export function SearchableTableBlock({
  title,
  columns,
  rows,
  searchPlaceholder = "Search here...",
  onSearch,
  onSort,
  onSearchClick,
  onSortClick,
  showFilter = true,
  onFilter,
  showDateSelector = false,
  onDateSelect,
  selectable = false,
  onSelectionChange,
  onRowAction,
  page,
  totalPages,
  onPageChange,
  className,
}: SearchableTableBlockProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ─── Handlers ────────────────────────────────────────────────────
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSort = (key: string) => {
    let nextKey: string | null = key;
    let nextDirection: SortDirection;
    if (sortKey === key) {
      nextDirection = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc";
      if (nextDirection === null) nextKey = null;
    } else {
      nextDirection = "asc";
    }
    setSortKey(nextKey);
    setSortDirection(nextDirection);
    onSort?.(key, nextDirection);
  };

  // Previously the indicator moved but the rows never did, so the table announced an
  // order it was not in. Unless the consumer takes control via onSearch / onSort, do
  // the filtering and ordering here so indicator and content always agree.
  const searched =
    onSearch || !searchQuery
      ? rows
      : rows.filter((row) =>
          columns.some((col) =>
            String(row[col.key] ?? "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        );

  const visibleRows =
    onSort || !sortKey || !sortDirection
      ? searched
      : [...searched].sort((a, b) => {
          const left = a[sortKey];
          const right = b[sortKey];
          if (left == null && right == null) return 0;
          if (left == null) return 1;
          if (right == null) return -1;
          const result =
            typeof left === "number" && typeof right === "number"
              ? left - right
              : String(left).localeCompare(String(right), undefined, { numeric: true });
          return sortDirection === "asc" ? result : -result;
        });

  const allSelected = visibleRows.length > 0 && visibleRows.every((row) => selectedIds.has(row.id));

  const toggleAll = () => {
    const next = allSelected ? new Set<string>() : new Set(visibleRows.map((r) => r.id));
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  };

  // ─── Toolbar ─────────────────────────────────────────────────────
  const toolbar = title ? (
    /* Title variant toolbar */
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-5">
      <h3 className="min-w-0 text-xl font-semibold text-grey-900">{title}</h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {onSearchClick && (
          <button
            type="button"
            onClick={onSearchClick}
            className="flex items-center gap-1 text-sm text-grey-500 hover:text-grey-700"
          >
            <Icon name="search" size="xs" />
            <span>Search</span>
          </button>
        )}
        {showFilter && (
          <button
            type="button"
            onClick={onFilter}
            className="flex items-center gap-1 text-sm text-grey-500 hover:text-grey-700"
          >
            <Icon name="filter" size="xs" />
            <span>Filter</span>
          </button>
        )}
        {onSortClick && (
          <button
            type="button"
            onClick={onSortClick}
            className="flex items-center gap-1 text-sm text-grey-500 hover:text-grey-700"
          >
            <Icon name="chevron-v" size="xs" />
            <span>Sort</span>
          </button>
        )}
      </div>
    </div>
  ) : (
    /* Search variant toolbar */
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <Input
          size="sm"
          placeholder={searchPlaceholder}
          leadingIcon="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          wrapperClassName="w-full min-w-0 sm:w-[260px]"
        />
        {showFilter && (
          <Button
            variant="grey"
            appearance="outlined"
            size="sm"
            icon="filter"
            iconPosition="leading"
            onClick={onFilter}
          >
            Filter
          </Button>
        )}
      </div>
      {showDateSelector && (
        <Button
          variant="grey"
          appearance="outlined"
          size="sm"
          icon="calendar"
          iconPosition="leading"
          onClick={onDateSelect}
        >
          Select dates
        </Button>
      )}
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col", className)}>
      {toolbar}

      <Table aria-label={title || "Data table"}>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-[52px]">
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && visibleRows.some((row) => selectedIds.has(row.id))}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={col.key}
                sortable={col.sortable}
                sortDirection={sortKey === col.key ? sortDirection : undefined}
                onSort={() => handleSort(col.key)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </TableHead>
            ))}
            {onRowAction && (
              <TableHead className="w-[60px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row) => {
            const rowLabel = columns[0] ? String(row[columns[0].key] ?? row.id) : row.id;
            return (
              <TableRow key={row.id} selected={selectedIds.has(row.id)}>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      aria-label={`Select ${rowLabel}`}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
                {onRowAction && (
                  <TableCell>
                    <KebabButton onClick={() => onRowAction(row.id)} rowLabel={rowLabel} />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages != null && page != null && onPageChange && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
