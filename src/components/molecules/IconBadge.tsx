import React from "react";
import { Badge, type badgeVariants } from "@/components/atoms/badge";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface IconBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

const IconBadge: React.FC<IconBadgeProps> = React.memo(({
  children,
  variant = "default",
  className,
}) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        "h-4 w-4 shrink-0 rounded-full p-0 flex items-center justify-center [&_svg]:size-2.5",
        className,
      )}
    >
      {children}
    </Badge>
  );
});

export default IconBadge;
