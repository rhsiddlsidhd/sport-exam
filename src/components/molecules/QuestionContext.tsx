import React from "react";
import type { ExamView } from "@/types/exam-schema";
import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { TypographySmall } from "@/components/atoms/typography";
import { renderTextWithHighlight } from "@/utils/highlight";
import TableView from "@/components/molecules/TableView";

interface QuestionContextProps {
  view: ExamView;
}

const QuestionContext: React.FC<QuestionContextProps> = React.memo(
  ({ view }) => {
    const { type, passage, items, media, table } = view;

    if (type === "NONE") return null;

    return (
      <Card className="bg-muted ring-border mb-4 rounded-xl shadow-inner ring-1">
        <CardContent className="px-3 pt-3 pb-3">
          <TypographySmall className="text-muted-foreground mb-2.5 block text-center font-black tracking-[0.2em] uppercase">
            &lt;보 기&gt;
          </TypographySmall>

          {/* 0. 표 영역 (TABLE) */}
          {table && (
            <div className="mb-1">
              <TableView table={table} />
            </div>
          )}

          {/* 1. 지문 영역 (PASSAGE, BLANK, COMPOSITE, VISUAL) */}
          {passage && passage.length > 0 && (
            <div className="mb-2.5 space-y-1.5">
              {passage.map((line, idx) => (
                <TypographySmall
                  key={idx}
                  className={[
                    "text-muted-foreground block leading-normal font-medium break-keep",
                    line.underline ? "underline underline-offset-2" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {type === "BLANK" ? renderTextWithHighlight(line.text) : line.text}
                </TypographySmall>
              ))}
            </div>
          )}

          {/* 2. 시각 자료 영역 (VISUAL) */}
          {media && (
            <div className="mb-3 flex justify-center">
              {media.type === "IMAGE" && (
                <img
                  src={media.url}
                  alt={media.alt || "문제 시각 자료"}
                  className="border-border h-auto max-w-full rounded-lg border bg-white shadow-sm"
                />
              )}
              {/* SVG나 CHART 확장이 필요한 경우 여기에 추가 */}
            </div>
          )}

          {/* 3. 항목 리스트 영역 (ITEMIZED, COMPOSITE) */}
          {items && items.length > 0 && (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-start gap-2"
                >
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/20 bg-background pointer-events-none flex h-5 min-w-6 items-center justify-center px-1.5 font-black"
                  >
                    {item.label}
                  </Badge>
                  <div className="flex flex-col gap-0.5">
                    {item.content.map((line, i) => (
                      <TypographySmall key={i} className="text-muted-foreground pt-0.5 font-medium break-keep">
                        {line}
                      </TypographySmall>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

export default QuestionContext;
