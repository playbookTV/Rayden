import { cn } from "../utils/cn";
import { Icon } from "../components/Icon";

// ─── Types ───────────────────────────────────────────────────────────
export type TransactionDirection = "incoming" | "outgoing";

export interface Transaction {
  id: string;
  /** "to" or "from" label */
  direction: TransactionDirection;
  /** Recipient or sender name */
  name: string;
  /** Transaction category */
  category: string;
  /** Amount string (e.g., "$11,000.00") */
  amount: string;
}

export interface RecentTransactionsBlockProps {
  /** Block title */
  title?: string;
  /** "See all" link label */
  seeAllLabel?: string;
  /** "See all" click handler */
  onSeeAll?: () => void;
  /** Transaction list */
  transactions: Transaction[];
  /** Transaction click handler */
  onTransactionClick?: (id: string) => void;
  /** Additional class names */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────
export function RecentTransactionsBlock({
  title = "Recent Transactions",
  seeAllLabel = "See all",
  onSeeAll,
  transactions,
  onTransactionClick,
  className,
}: RecentTransactionsBlockProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-grey-900">{title}</h3>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-500"
          >
            {seeAllLabel}
            <Icon name="chevron-right" size="xs" />
          </button>
        )}
      </div>

      {/* Transaction list */}
      <div className="bg-white border border-grey-100 rounded-[10px] px-5 py-6">
        <div className="flex flex-col gap-5">
          {transactions.map((tx) => {
            const isOutgoing = tx.direction === "outgoing";
            return (
              <button
                key={tx.id}
                type="button"
                onClick={() => onTransactionClick?.(tx.id)}
                className="flex items-center gap-3 group text-left"
              >
                {/* Direction icon */}
                <div
                  className={cn(
                    "flex items-center justify-center size-10 rounded-full shrink-0",
                    isOutgoing ? "bg-error-50" : "bg-success-50"
                  )}
                >
                  <Icon
                    name={isOutgoing ? "arrow-up" : "arrow-down"}
                    size="sm"
                    className={
                      isOutgoing ? "text-error-400" : "text-success-400"
                    }
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-grey-900 truncate">
                      <span className="font-normal">
                        {isOutgoing ? "to" : "from"}
                      </span>{" "}
                      <span className="font-semibold">{tx.name}</span>
                    </span>
                    <span className="text-xs font-medium text-grey-400">
                      {tx.category}
                    </span>
                  </div>

                  {/* Amount */}
                  <span className="text-sm font-semibold text-black shrink-0 ml-4">
                    {isOutgoing ? "-" : "+"} {tx.amount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
