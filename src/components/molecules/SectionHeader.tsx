import React from "react";
import { cn } from "@/lib/utils";
import { TypographyLarge } from "@/components/atoms/typography";

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = React.memo(({ children, className }) => {
  return (
    <TypographyLarge className={cn("font-black text-foreground flex items-center gap-2", className)}>
      <span className="w-1 h-5 bg-primary rounded-full shrink-0" />
      {children}
    </TypographyLarge>
  );
});

export default SectionHeader;
