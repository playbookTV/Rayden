import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";

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

const ChevronLeft = () => <Icon name="chevron-left" size="md" />;
const ChevronRight = () => <Icon name="chevron-right" size="md" />;

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
    <nav className={cn("rayden-pagination min-w-0", className)} aria-label="Pagination" {...rest}>
      <div className="flex w-full items-center justify-center gap-2">
        {showPrevNext && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-action-primary-text border border-grey-300 bg-white dark:bg-grey-50 px-3 py-2 text-sm font-semibold text-grey-700 cursor-pointer hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft />
            <span className="rayden-pagination-word">Previous</span>
          </button>
        )}

        <div
          className={cn(
            "items-center justify-center gap-1 flex-wrap",
            showPrevNext ? "rayden-pagination-pages" : "flex"
          )}
        >
          {pages.map((page, i) =>
            page === "..." ? (
              <span
                key={`dots-${i}`}
                className="flex items-center justify-center size-6 text-sm text-grey-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "flex items-center justify-center min-w-9 h-11 px-2 rounded-md text-sm cursor-pointer",
                  page === currentPage
                    ? "border border-action-primary-text text-action-primary-text font-medium"
                    : "text-grey-600 hover:bg-grey-100"
                )}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {showPrevNext && (
          <span className="rayden-pagination-compact text-sm text-grey-700" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
        )}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-action-primary-text border border-grey-300 bg-white dark:bg-grey-50 px-3 py-2 text-sm font-semibold text-grey-700 cursor-pointer hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <span className="rayden-pagination-word">Next</span>
            <ChevronRight />
          </button>
        )}
      </div>
    </nav>
  );
}
