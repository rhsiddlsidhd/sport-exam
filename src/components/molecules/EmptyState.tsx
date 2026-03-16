import React from "react";
import { cn } from "@/lib/utils";
import { TypographyH4, TypographySmall } from "@/components/atoms/Typography";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({ icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-10 text-center", className)}>
      <div className="mb-4">{icon}</div>
      <TypographyH4 className="text-foreground mb-2">{title}</TypographyH4>
      {description && (
        <TypographySmall className="text-muted-foreground block">{description}</TypographySmall>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
});

export default EmptyState;
