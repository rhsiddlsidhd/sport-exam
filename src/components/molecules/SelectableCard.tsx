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
          "p-5 border border-border rounded-2xl bg-card text-center break-keep",
          "hover:border-primary hover:bg-primary/5 transition-all duration-300",
          "shadow-sm hover:shadow-md flex flex-col items-center justify-center",
          className,
        )}
      >
        {children}
      </div>
    </Link>
  );
});

export default SelectableCard;
