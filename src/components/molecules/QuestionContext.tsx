import React from "react";
import type { ExamContextItem } from "@/types/exam-schema";
import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { TypographySmall } from "@/components/atoms/Typography";

interface QuestionContextProps {
  context: string[] | null;
  contextItems: ExamContextItem[] | null;
}

const QuestionContext: React.FC<QuestionContextProps> = React.memo(({
  context,
  contextItems,
}) => {
  return (
    <Card className="mb-4 rounded-xl bg-muted ring-1 ring-border shadow-inner">
      <CardContent className="pt-3 pb-2 px-3">
        <TypographySmall className="block text-center font-black text-muted-foreground tracking-[0.2em] uppercase mb-2">
          &lt;보 기&gt;
        </TypographySmall>

        {context && (
          <div className="mb-2 space-y-1.5">
            {context.map((line, idx) => (
              <TypographySmall
                key={idx}
                className="block text-muted-foreground leading-normal break-keep font-medium"
              >
                {line}
              </TypographySmall>
            ))}
          </div>
        )}

        {contextItems && (
          <div className="space-y-1.5">
            {contextItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-2 items-start">
                <Badge
                  variant="ghost"
                  className="text-primary font-black px-0 whitespace-nowrap bg-transparent hover:bg-transparent"
                >
                  {item.id}.
                </Badge>
                <TypographySmall className="break-keep text-muted-foreground font-medium">
                  {item.content}
                </TypographySmall>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default QuestionContext;
