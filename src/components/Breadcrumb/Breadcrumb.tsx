import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  active?: boolean;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export function Breadcrumb({
  items,
  separator = "/",
  className,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "border-y border-grey-200 px-4 py-2.5",
        className
      )}
      {...rest}
    >
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-grey-400" aria-hidden>
                {separator}
              </span>
            )}
            {item.icon && (
              <span className="size-4 shrink-0">{item.icon}</span>
            )}
            {item.href && !item.disabled && !item.active ? (
              <a
                href={item.href}
                className={cn(
                  "text-grey-500 hover:text-primary-300 transition-colors"
                )}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  item.active && "text-primary-500 font-medium",
                  item.disabled && "text-grey-400 cursor-not-allowed",
                  !item.active && !item.disabled && "text-grey-500"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
