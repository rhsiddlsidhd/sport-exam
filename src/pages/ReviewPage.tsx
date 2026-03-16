import { useLocation, useNavigate, Link } from "react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { ExamQuestion } from "../types/exam-schema";
import type { SubjectCode } from "../types/subject";
import { subjectLabel } from "../constants/label";
import { TypographySmall } from "../components/atoms/Typography";
import { Button } from "../components/atoms/Button";
import { useNotes } from "../hooks/useNotes";
import { cn } from "../lib/utils";
import SectionHeader from "../components/molecules/SectionHeader";

interface LocationState {
  year: string;
  subject: SubjectCode;
  questions: ExamQuestion[];
  userAnswers: Record<string, number>;
}

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const { add, remove, isBookmarked } = useNotes();

  if (!state?.subject || !state?.year || !Array.isArray(state?.questions) || !state?.userAnswers) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <p className="text-sm font-bold text-foreground">결과 데이터가 없습니다.</p>
        <Button asChild className="rounded-xl font-bold">
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  const { year, subject, questions, userAnswers } = state;

  const results = questions.map((q) => {
    const userAnswerId = userAnswers[q.id];
    const userOption = q.options.find((opt) => opt.id === userAnswerId);
    const isCorrect = Array.isArray(q.answer)
      ? q.answer.includes(userAnswerId)
      : userAnswerId === q.answer;
    const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
    const correctAnswerContent = q.options
      .filter((opt) => correctAnswers.includes(opt.id))
      .map((opt) => opt.content)
      .join(", ");
    return {
      id: q.id,
      questionText: q.question,
      isCorrect,
      userAnswerContent: userOption?.content || "미선택",
      correctAnswerContent,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleToggleBookmark = (res: (typeof results)[number]) => {
    if (isBookmarked(res.id)) {
      remove(res.id);
    } else {
      add({
        id: res.id,
        year,
        subject,
        questionText: res.questionText,
        correctAnswerContent: res.correctAnswerContent,
        savedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-full bg-background pb-10">
      {/* 결과 요약 */}
      <div className="bg-card border-b border-border px-5 py-8">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black text-primary tracking-widest uppercase">
            {subjectLabel[subject]} · {year}년
          </span>
        </div>

        {/* 원형 점수 게이지 */}
        <div className="flex flex-col items-center gap-5 mb-7">
          <div className="relative">
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              <circle
                cx="48" cy="48" r="36"
                fill="none"
                stroke="currentColor"
                className="text-muted"
                strokeWidth="7"
              />
              <circle
                cx="48" cy="48" r="36"
                fill="none"
                stroke="currentColor"
                className="text-primary transition-all duration-700"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-foreground leading-none tabular-nums">
                {score}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">점</span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center px-5 py-3 bg-success/8 rounded-2xl border border-success/20 min-w-[72px]">
              <span className="text-[9px] font-black text-success/70 uppercase tracking-wider mb-1">정답</span>
              <span className="text-xl font-black text-success tabular-nums">{correctCount}</span>
            </div>
            <div className="flex flex-col items-center px-5 py-3 bg-destructive/8 rounded-2xl border border-destructive/20 min-w-[72px]">
              <span className="text-[9px] font-black text-destructive/70 uppercase tracking-wider mb-1">오답</span>
              <span className="text-xl font-black text-destructive tabular-nums">
                {questions.length - correctCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2.5">
          <Button
            onClick={() => navigate(`/${year}/${subject}`)}
            className="rounded-xl px-6 h-10 bg-foreground text-background hover:bg-foreground/90 font-black shadow-sm"
          >
            다시 풀기
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl px-6 h-10 border-2 font-bold"
          >
            <Link to="/">홈으로</Link>
          </Button>
        </div>
      </div>

      {/* 상세 리뷰 */}
      <div className="px-5 mt-7">
        <SectionHeader className="mb-4">상세 리뷰</SectionHeader>

        <div className="space-y-3">
          {results.map((res, idx) => (
            <div
              key={res.id}
              className={cn(
                "rounded-2xl border overflow-hidden",
                res.isCorrect ? "bg-card border-border" : "bg-destructive/5 border-destructive/15",
              )}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px]",
                      res.isCorrect ? "bg-primary/10 text-primary" : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-black tracking-widest uppercase",
                      res.isCorrect ? "text-success" : "text-destructive",
                    )}
                  >
                    {res.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                {!res.isCorrect && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleToggleBookmark(res)}
                    className={cn(
                      "rounded-lg",
                      isBookmarked(res.id)
                        ? "text-primary bg-primary/10 hover:bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                    )}
                  >
                    {isBookmarked(res.id)
                      ? <BookmarkCheck className="w-4 h-4" strokeWidth={2.5} />
                      : <Bookmark className="w-4 h-4" strokeWidth={2.5} />}
                  </Button>
                )}
              </div>

              {/* 문제 텍스트 */}
              <div className="px-4 py-3">
                <TypographySmall className="text-foreground font-bold leading-snug break-keep block mb-3">
                  {res.questionText}
                </TypographySmall>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1 p-3 bg-muted/60 rounded-xl">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                      나의 선택
                    </span>
                    <span className={cn("text-xs font-bold break-keep", res.isCorrect ? "text-primary" : "text-destructive")}>
                      {res.userAnswerContent}
                    </span>
                  </div>
                  {!res.isCorrect && (
                    <div className="flex flex-col gap-1 p-3 bg-success/8 rounded-xl border border-success/20">
                      <span className="text-[9px] font-black text-success/60 uppercase tracking-wider">정답</span>
                      <span className="text-xs font-bold text-success break-keep">
                        {res.correctAnswerContent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
