import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/Table";
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
  /** Called when search value changes */
  onSearch?: (query: string) => void;
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
function KebabButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center size-8 rounded-md hover:bg-grey-50 text-grey-400"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
    if (sortKey === key) {
      const next: SortDirection =
        sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc";
      setSortDirection(next);
      if (next === null) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const allSelected = rows.length > 0 && selectedIds.size === rows.length;

  const toggleAll = () => {
    const next = allSelected ? new Set<string>() : new Set(rows.map((r) => r.id));
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
    <div className="flex items-center justify-between pb-5">
      <h3 className="text-xl font-semibold text-grey-900">{title}</h3>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-1 text-sm text-grey-500 hover:text-grey-700"
        >
          <Icon name="search" size="xs" />
          <span>Search</span>
        </button>
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
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-1 text-sm text-grey-500 hover:text-grey-700"
        >
          <Icon name="chevron-v" size="xs" />
          <span>Sort</span>
        </button>
      </div>
    </div>
  ) : (
    /* Search variant toolbar */
    <div className="flex items-center justify-between p-4 gap-3">
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          placeholder={searchPlaceholder}
          leadingIcon="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          wrapperClassName="w-[260px]"
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

      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-[52px]">
                <Checkbox
                  checked={allSelected || selectedIds.size > 0}
                  onChange={toggleAll}
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
            {onRowAction && <TableHead className="w-[60px]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={selectedIds.has(row.id)}>
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </TableCell>
              ))}
              {onRowAction && (
                <TableCell>
                  <KebabButton onClick={() => onRowAction(row.id)} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages != null && page != null && onPageChange && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
