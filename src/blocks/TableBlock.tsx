import { cn } from "../utils/cn";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/Table";
import { useTableSelection } from "../components/Table/useTableSelection";
import { Checkbox } from "../components/FormControl";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Pagination } from "../components/Pagination";

// ─── Types ───────────────────────────────────────────────────────────
export interface TableBlockRow {
  id: string;
  name: string;
  email: string;
  initials: string;
  amount: string;
  paymentType: string;
  date: string;
  time: string;
  status: string;
  statusColor?: "success" | "warning" | "error" | "orange" | "blue" | "neutral";
}

export interface TableBlockProps {
  /** Table rows */
  rows: TableBlockRow[];
  /**
   * Controlled selection. Supply it to own selection yourself — the only way to keep a
   * selection across pages, since the block otherwise drops ids that leave `rows`.
   * See the reconciliation contract on `useTableSelection`.
   */
  selectedIds?: string[];
  /** Fired on user interaction with the full resulting selection. */
  onSelectionChange?: (ids: string[]) => void;
  /**
   * Row action handler (kebab menu). The actions column renders only when supplied —
   * the block does not show a control that has nowhere to go.
   */
  onRowAction?: (rowId: string) => void;
  /** Current page (1-indexed). Pagination needs `page`, `totalPages` and `onPageChange` together. */
  page?: number;
  /** Total pages. Pagination needs `page`, `totalPages` and `onPageChange` together. */
  totalPages?: number;
  /** Page change handler. Pagination needs `page`, `totalPages` and `onPageChange` together. */
  onPageChange?: (page: number) => void;
  /** Additional class names */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────
export function TableBlock({
  rows,
  selectedIds,
  onSelectionChange,
  onRowAction,
  page,
  totalPages,
  onPageChange,
  className,
}: TableBlockProps) {
  const rowIds = rows.map((row) => row.id);
  const selection = useTableSelection({ dataIds: rowIds, selectedIds, onSelectionChange });

  // Every visible control needs somewhere to go. Pagination without a page handler is a
  // row of buttons that silently do nothing, so it is omitted rather than rendered dead.
  const showPagination = page != null && totalPages != null && onPageChange != null;

  return (
    <div className={cn("flex flex-col", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[287px]">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selection.allSelected}
                  indeterminate={selection.someSelected}
                  onChange={selection.toggleAll}
                  aria-label="Select all rows"
                />
                <span>Name</span>
              </div>
            </TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            {onRowAction && (
              <TableHead className="w-[67px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={selection.isSelected(row.id)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selection.isSelected(row.id)}
                    onChange={() => selection.toggleRow(row.id)}
                    aria-label={`Select ${row.name}`}
                  />
                  <Avatar type="initials" initials={row.initials} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-grey-900">{row.name}</span>
                    <span className="text-xs text-grey-500 truncate max-w-[150px]">
                      {row.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-grey-700">{row.amount}</span>
              </TableCell>
              <TableCell>
                <Badge color="orange" type="accent" size="sm">
                  {row.paymentType}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-grey-700">
                  {row.date}
                  <span className="text-grey-500 mx-2">|</span>
                  {row.time}
                </span>
              </TableCell>
              <TableCell>
                <Badge color={row.statusColor ?? "orange"} type="accent" size="sm">
                  {row.status}
                </Badge>
              </TableCell>
              {onRowAction && (
                <TableCell>
                  <button
                    type="button"
                    onClick={() => onRowAction(row.id)}
                    aria-label={`Actions for ${row.name}`}
                    className="flex items-center justify-center size-8 rounded-md hover:bg-grey-50 text-grey-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                    </svg>
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && (
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={onPageChange} />
      )}
    </div>
  );
}
