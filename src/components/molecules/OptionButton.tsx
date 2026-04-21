import React from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { TypographySmall } from "@/components/atoms/typography";
import { cn } from "@/lib/utils";

interface OptionButtonProps {
  content: string;
  selected: boolean;
  onSelect: () => void;
  index?: number;
  children?: React.ReactNode;
}

const OptionButton: React.FC<OptionButtonProps> = React.memo(
  ({ content, selected, onSelect, index, children }) => {
    return (
      <Button
        variant="outline"
        onClick={onSelect}
        className={cn(
          "group h-auto w-full justify-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-300 whitespace-normal",
          selected
            ? "border-primary bg-primary/5 ring-2 ring-primary/10 hover:bg-primary/5"
            : "border-muted bg-card hover:border-primary/30 hover:bg-muted/50",
        )}
      >
        {/* 번호 뱃지 */}
        {index !== undefined && (
          <Badge
            className={cn(
              "h-6 w-6 shrink-0 rounded-lg text-xs font-bold transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
            )}
          >
            {index}
          </Badge>
        )}

        {/* 선택지 텍스트 */}
        <TypographySmall
          className={cn(
            "flex-1 break-keep font-bold leading-snug",
            selected ? "text-primary" : "text-muted-foreground",
          )}
        >
          {content}
        </TypographySmall>

        {children}
      </Button>
    );
  },
);

export default OptionButton;
