import { type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";

// ─── Types ───────────────────────────────────────────────────────────
export interface QuickSendBeneficiary {
  id: string;
  name: string;
  handle: string;
  avatar?: ReactNode;
  initials?: string;
}

export interface QuickSendBlockProps {
  /** Block title */
  title?: string;
  /** "See all" link label */
  seeAllLabel?: string;
  /** "See all" click handler */
  onSeeAll?: () => void;
  /** Beneficiary list */
  beneficiaries: QuickSendBeneficiary[];
  /** Beneficiary click handler */
  onSelect?: (id: string) => void;
  /** Additional class names */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────
export function QuickSendBlock({
  title = "Quick Send",
  seeAllLabel = "See all beneficaries",
  onSeeAll,
  beneficiaries,
  onSelect,
  className,
}: QuickSendBlockProps) {
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

      {/* Beneficiaries */}
      <div className="bg-white border border-grey-100 rounded-[10px] px-6 py-6">
        <div className="flex gap-5 overflow-x-auto">
          {beneficiaries.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect?.(b.id)}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              {b.avatar ?? (
                <Avatar
                  type="initials"
                  initials={b.initials ?? b.name.slice(0, 2).toUpperCase()}
                  size="lg"
                />
              )}
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-grey-900 whitespace-nowrap max-w-[80px] truncate">
                  {b.name}
                </span>
                <span className="text-xs text-grey-400 whitespace-nowrap">
                  @{b.handle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
