import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";

// ─── Table ─────────────────────────────────────────────────────────
export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...rest }, ref) => (
  <table ref={ref} className={cn("w-full border-collapse", className)} {...rest} />
));
Table.displayName = "Table";

// ─── TableHeader ───────────────────────────────────────────────────
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...rest }, ref) => <thead ref={ref} className={cn("", className)} {...rest} />
);
TableHeader.displayName = "TableHeader";

// ─── TableBody ─────────────────────────────────────────────────────
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...rest }, ref) => <tbody ref={ref} className={cn("", className)} {...rest} />
);
TableBody.displayName = "TableBody";

// ─── TableRow ──────────────────────────────────────────────────────
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Whether this row is selected */
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected = false, className, ...rest }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(
        "transition-colors",
        selected ? "bg-primary-50" : "bg-white dark:bg-grey-50",
        className
      )}
      {...rest}
    />
  )
);
TableRow.displayName = "TableRow";

// ─── TableHead ─────────────────────────────────────────────────────
export type SortDirection = "asc" | "desc" | null;

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Enable sort indicator and click-to-sort behavior */
  sortable?: boolean;
  /** Current sort direction for this column */
  sortDirection?: SortDirection;
  /** Called when the sort indicator is clicked */
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable = false, sortDirection, onSort, children, className, ...rest }, ref) => (
    <th
      ref={ref}
      scope="col"
      aria-sort={
        sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : undefined
      }
      className={cn(
        "h-11 px-6 py-3 text-left text-body-xs font-medium text-grey-700 border-b border-grey-200",
        "bg-white dark:bg-grey-50 hover:bg-grey-50 transition-colors",
        sortable && "cursor-pointer select-none",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...rest}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <Icon
            name={sortDirection === "asc" ? "chevron-up" : "chevron-down"}
            size="sm"
            className={cn("shrink-0", sortDirection ? "text-grey-700" : "text-grey-400")}
          />
        )}
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

// ─── TableCell ─────────────────────────────────────────────────────
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...rest }, ref) => (
    <td
      ref={ref}
      className={cn(
        "h-[72px] px-6 py-4 border-b border-grey-200 text-body-sm text-grey-900",
        className
      )}
      {...rest}
    />
  )
);
TableCell.displayName = "TableCell";
