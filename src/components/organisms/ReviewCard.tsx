import React from "react";
import { cn } from "@/lib/utils";
import { TypographySmall } from "@/components/atoms/Typography";
import QuestionContext from "@/components/molecules/QuestionContext";
import { renderBold } from "@/utils/renderBold";
import type { QuestionResult } from "@/utils/computeResults";
import type { ExamExplanation } from "@/types/exam-schema";

interface ExplanationSectionProps {
  explanation: ExamExplanation;
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({ explanation }) => (
  <div className="mt-4 space-y-3">
    <div className="rounded-2xl border border-success/20 bg-success/5 p-4 shadow-sm">
      <span className="mb-2 inline-block rounded-lg bg-success/15 px-2 py-1 text-[9px] font-black tracking-widest text-success uppercase">
        정답 분석
      </span>
      <TypographySmall className="text-foreground/90 block leading-relaxed font-medium break-keep">
        {renderBold(explanation.correct)}
      </TypographySmall>
    </div>

    {explanation.distractors && explanation.distractors.length > 0 && (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
        <span className="mb-2 inline-block rounded-lg bg-destructive/15 px-2 py-1 text-[9px] font-black tracking-widest text-destructive uppercase">
          오답 분석
        </span>
        <div className="space-y-2">
          {explanation.distractors.map((d, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive/40" />
              <TypographySmall className="text-foreground/90 block leading-relaxed font-medium break-keep">
                <strong className="text-foreground font-black">{d.term}</strong>
                {": "}
                {renderBold(d.reason)}
              </TypographySmall>
            </div>
          ))}
        </div>
      </div>
    )}

    {explanation.summary && (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
        <span className="mb-2 inline-block rounded-lg bg-primary/15 px-2 py-1 text-[9px] font-black tracking-widest text-primary uppercase">
          핵심 정리
        </span>
        <TypographySmall className="text-foreground/90 block leading-relaxed font-medium break-keep">
          {renderBold(explanation.summary)}
        </TypographySmall>
      </div>
    )}
  </div>
);

interface ReviewCardProps {
  result: QuestionResult;
  index: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ result, index }) => {
  const { isCorrect } = result;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border",
        isCorrect ? "bg-card border-border" : "bg-destructive/5 border-destructive/15",
      )}
    >
      <div className="flex items-center border-b border-inherit px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black",
              isCorrect ? "bg-primary/10 text-primary" : "bg-destructive/15 text-destructive",
            )}
          >
            {index + 1}
          </span>
          <span
            className={cn(
              "text-[10px] font-black tracking-widest uppercase",
              isCorrect ? "text-success" : "text-destructive",
            )}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        <TypographySmall className="text-foreground mb-3 block leading-snug font-bold break-keep">
          {result.question}
        </TypographySmall>

        <QuestionContext view={result.view} />

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/60 flex flex-col gap-1 rounded-xl p-3">
            <span className="text-muted-foreground text-[9px] font-black tracking-wider uppercase">
              나의 선택
            </span>
            <span
              className={cn(
                "text-xs font-bold break-keep",
                isCorrect ? "text-primary" : "text-destructive",
              )}
            >
              {result.userAnswerContent}
            </span>
          </div>
          {!isCorrect && (
            <div className="bg-success/8 border-success/20 flex flex-col gap-1 rounded-xl border p-3">
              <span className="text-success/60 text-[9px] font-black tracking-wider uppercase">
                정답
              </span>
              <span className="text-success text-xs font-bold break-keep">
                {result.correctAnswerContent}
              </span>
            </div>
          )}
        </div>

        {result.explanation && (
          <ExplanationSection explanation={result.explanation} />
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
