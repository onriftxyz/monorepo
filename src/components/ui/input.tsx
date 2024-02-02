import * as React from "react";

import { cn } from "~/lib/utils";
import { Badge } from "./badge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  badge?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, badge = false, ...props }, ref) => {
    return (
      <span className={`${badge ? "relative" : ""}`}>
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {badge ? (
          <Badge
            variant={"secondary"}
            className="absolute right-1 top-[50%] -translate-y-[50%] text-muted-foreground"
          >
            ⌘ K
          </Badge>
        ) : null}
      </span>
    );
  },
);
Input.displayName = "Input";

export { Input };
