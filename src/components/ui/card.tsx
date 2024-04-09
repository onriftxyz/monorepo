import * as React from "react";

import { cn } from "~/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border-2 bg-card text-card-foreground",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Custom card component(s)
interface OverviewCardProps {
  title: string;
  data: string;
  variant: "success" | "destructive";
  icon: React.ReactNode;
}

const OverviewCard = ({ title, data, variant, icon }: OverviewCardProps) => {
  return (
    <Card className="relative w-full overflow-hidden">
      <CardHeader>
        <div className="pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border p-2">
            {icon}
          </div>
        </div>
        <CardTitle className="text-sm text-secondary-foreground">
          {title}
        </CardTitle>
        <CardContent>
          {<div className="flex items-center gap-2 text-3xl">{data}</div>}
        </CardContent>
      </CardHeader>
      <div
        className={cn(
          "absolute -bottom-[35%] -right-[35%] h-28 w-28 rounded-full blur-[100px]",
          variant === "success" ? "bg-green-500" : "bg-destructive",
        )}
      />
    </Card>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  // custom cards
  OverviewCard,
};
