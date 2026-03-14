import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  siblingCount?: number;
}

function range(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | "...")[] {
  const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 dots
  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, "...", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [1, "...", ...rightRange];
  }

  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [1, "...", ...middleRange, "...", totalPages];
}

const ChevronLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
    <path d="M12 5l-5 5 5 5" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
    <path d="M8 5l5 5-5 5" />
  </svg>
);

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  siblingCount = 1,
  className,
  ...rest
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label="Pagination"
      {...rest}
    >
      {showPrevNext && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-2 rounded-lg border border-grey-300 bg-white px-3 py-2 text-sm font-semibold text-grey-700 cursor-pointer hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft />
          <span>Previous</span>
        </button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`dots-${i}`}
              className="flex items-center justify-center size-6 text-sm text-grey-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "flex items-center justify-center size-6 rounded-md text-sm cursor-pointer",
                page === currentPage
                  ? "border border-primary-400 text-black font-medium"
                  : "text-grey-400 hover:bg-grey-50"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {showPrevNext && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-2 rounded-lg border border-grey-300 bg-white px-3 py-2 text-sm font-semibold text-grey-700 cursor-pointer hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight />
        </button>
      )}
    </nav>
  );
}
