import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn("inline-flex", className)} role="group">
      {children}
    </div>
  );
}
