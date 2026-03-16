import { useState } from "react";
import { cn } from "../utils/cn";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/Table";
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
  /** Current page (1-indexed) */
  page?: number;
  /** Total pages */
  totalPages?: number;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Row action handler (kebab menu) */
  onRowAction?: (rowId: string) => void;
  /** Additional class names */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────
export function TableBlock({
  rows,
  page = 3,
  totalPages = 6,
  onPageChange,
  onRowAction,
  className,
}: TableBlockProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selectedIds.size === rows.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[287px]">
              <div className="flex items-center gap-3">
                <Checkbox checked={allSelected || someSelected} onChange={toggleAll} />
                <span>Name</span>
              </div>
            </TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[67px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={selectedIds.has(row.id)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Checkbox checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} />
                  <Avatar type="initials" initials={row.initials} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-grey-900">{row.name}</span>
                    <span className="text-xs text-grey-400 truncate max-w-[150px]">
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
                  <span className="text-grey-400 mx-2">|</span>
                  {row.time}
                </span>
              </TableCell>
              <TableCell>
                <Badge color={row.statusColor ?? "orange"} type="accent" size="sm">
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onRowAction?.(row.id)}
                  className="flex items-center justify-center size-8 rounded-md hover:bg-grey-50 text-grey-400"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={(p) => onPageChange?.(p)}
      />
    </div>
  );
}
