import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/atoms/button";
import { subjectLabel } from "@/constants/label";
import type { SubjectCode } from "@/types/subject";

interface ScoreSummaryProps {
  subject: SubjectCode;
  year: string;
  score: number;
  correctCount: number;
  total: number;
  onRetry: () => void;
}

const CIRCLE_RADIUS = 36;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  subject,
  year,
  score,
  correctCount,
  total,
  onRetry,
}: ScoreSummaryProps) => {
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="bg-card border-border border-b px-5 py-8">
      <div className="mb-6 text-center">
        <span className="text-primary text-[10px] font-black tracking-widest uppercase">
          {subjectLabel[subject]} · {year}년
        </span>
      </div>

      <div className="mb-7 flex flex-col items-center gap-5">
        <div className="relative">
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            className="-rotate-90"
          >
            <circle
              cx="48"
              cy="48"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              className="text-muted"
              strokeWidth="7"
            />
            <circle
              cx="48"
              cy="48"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              className="text-primary transition-all duration-700"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-foreground text-2xl leading-none font-black tabular-nums">
              {score}
            </span>
            <span className="text-muted-foreground text-[10px] font-bold">
              점
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-success/8 border-success/20 flex min-w-18 flex-col items-center rounded-2xl border px-5 py-3">
            <span className="text-success/70 mb-1 text-[9px] font-black tracking-wider uppercase">
              정답
            </span>
            <span className="text-success text-xl font-black tabular-nums">
              {correctCount}
            </span>
          </div>
          <div className="bg-destructive/8 border-destructive/20 flex min-w-18 flex-col items-center rounded-2xl border px-5 py-3">
            <span className="text-destructive/70 mb-1 text-[9px] font-black tracking-wider uppercase">
              오답
            </span>
            <span className="text-destructive text-xl font-black tabular-nums">
              {total - correctCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2.5">
        <Button
          onClick={onRetry}
          className="bg-foreground text-background hover:bg-foreground/90 h-10 rounded-xl px-6 font-black shadow-sm"
        >
          다시 풀기
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-xl border-2 px-6 font-bold"
        >
          <Link to="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
};

export default ScoreSummary;
