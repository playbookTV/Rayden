import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";

// ─── Table ─────────────────────────────────────────────────────────
export type TableProps = HTMLAttributes<HTMLTableElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...rest }, ref) => (
  <div
    role="region"
    aria-label={rest["aria-label"] ?? "Data table"}
    tabIndex={0}
    // `relative` is load-bearing, not decoration. It makes this scroller the containing
    // block for absolutely positioned descendants — above all the `sr-only` headings that
    // label icon-only columns. Without it those resolve against the initial containing
    // block, so their overflow widens the *document* instead of this element's own scroll
    // area, and a correctly bounded table still drags the whole page sideways at 320px.
    className="relative w-full min-w-0 max-w-full overflow-x-auto rounded focus-visible:outline-2 focus-visible:outline-action-primary-text"
  >
    <table ref={ref} className={cn("w-full border-collapse", className)} {...rest} />
  </div>
));
Table.displayName = "Table";

// ─── TableHeader ───────────────────────────────────────────────────
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...rest }, ref) => <thead ref={ref} className={cn("", className)} {...rest} />
);
TableHeader.displayName = "TableHeader";

// ─── TableBody ─────────────────────────────────────────────────────
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

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
      className={cn("transition-colors", selected ? "bg-primary-50" : "bg-surface", className)}
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
        "h-11 px-6 py-3 text-left text-body-xs font-medium text-on-surface-body border-b border-grey-200",
        "bg-surface hover:bg-grey-50 transition-colors",
        sortable && "cursor-pointer select-none",
        className
      )}
      {...rest}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="flex w-full items-center gap-1 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
        >
          {children}
          {sortable && (
            <Icon
              name={sortDirection === "asc" ? "chevron-up" : "chevron-down"}
              size="sm"
              aria-hidden="true"
              className={cn(
                "shrink-0",
                sortDirection ? "text-on-surface-body" : "text-on-surface-muted"
              )}
            />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  )
);
TableHead.displayName = "TableHead";

// ─── TableCell ─────────────────────────────────────────────────────
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...rest }, ref) => (
    <td
      ref={ref}
      className={cn(
        "h-[72px] px-6 py-4 border-b border-grey-200 text-body-sm text-on-surface",
        className
      )}
      {...rest}
    />
  )
);
TableCell.displayName = "TableCell";
