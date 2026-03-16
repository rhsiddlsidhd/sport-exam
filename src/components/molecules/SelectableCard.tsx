import React from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const SelectableCard: React.FC<SelectableCardProps> = React.memo(({ to, children, className }) => {
  return (
    <Link to={to} className="group">
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "border border-border rounded-2xl bg-card",
          "p-4 text-center break-keep",
          "hover:border-primary/40 hover:bg-primary/5 hover:shadow-md",
          "transition-all duration-200 shadow-sm",
          className,
        )}
      >
        {children}
      </div>
    </Link>
  );
});

export default SelectableCard;
