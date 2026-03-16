import { useLocation, useNavigate, Link } from "react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { ExamQuestion } from "../types/exam-schema";
import type { SubjectCode } from "../types/subject";
import { subjectLabel } from "../constants/label";
import {
  TypographyH3,
  TypographyH4,
  TypographySmall,
} from "../components/atoms/Typography";
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

  if (
    !state?.subject ||
    !state?.year ||
    !Array.isArray(state?.questions) ||
    !state?.userAnswers
  ) {
    return (
      <div className="p-10 text-center">
        <TypographyH4 className="mb-4 text-foreground">
          결과 데이터가 없습니다.
        </TypographyH4>
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
      {/* 상단 결과 요약 */}
      <div className="bg-card border-b border-border px-6 py-6 text-center shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">
            {subjectLabel[subject]} ({year}년)
          </div>
          <TypographyH3 className="font-black text-foreground mb-6">
            시험 결과
          </TypographyH3>

          <div className="flex flex-row items-center justify-center gap-10 mb-6">
            <div className="flex gap-2 items-baseline">
              <TypographyH4>{score} 점</TypographyH4>
            </div>

            <div className="flex gap-3">
              <div className="bg-success/5 px-4 py-3 rounded-xl border border-success/20 text-center min-w-[80px]">
                <div className="text-[10px] font-bold text-success mb-0.5 uppercase">
                  정답
                </div>
                <div className="text-xl font-black text-success">
                  {correctCount} <span className="text-xs font-medium">개</span>
                </div>
              </div>
              <div className="bg-destructive/5 px-4 py-3 rounded-xl border border-destructive/20 text-center min-w-[80px]">
                <div className="text-[10px] font-bold text-destructive mb-0.5 uppercase">
                  오답
                </div>
                <div className="text-xl font-black text-destructive">
                  {questions.length - correctCount}{" "}
                  <span className="text-xs font-medium">개</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              onClick={() => navigate(`/${year}/${subject}`)}
              className="rounded-xl px-6 h-auto py-2.5 bg-foreground text-background hover:bg-foreground/90 shadow-md font-bold"
            >
              다시 풀기
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl px-6 h-auto py-2.5 border-2 font-bold"
            >
              <Link to="/">홈으로 가기</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 상세 리뷰 */}
      <div className="max-w-2xl mx-auto px-6 mt-8">
        <SectionHeader className="mb-4">상세 리뷰</SectionHeader>

        <div className="space-y-4">
          {results.map((res, idx) => (
            <div
              key={res.id}
              className={cn(
                "p-5 rounded-2xl border transition-all shadow-sm",
                res.isCorrect
                  ? "bg-card border-border"
                  : "bg-destructive/5 border-destructive/20",
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px]",
                      res.isCorrect
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-black tracking-tight",
                      res.isCorrect ? "text-success" : "text-destructive",
                    )}
                  >
                    {res.isCorrect ? "CORRECT" : "INCORRECT"}
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
                    {isBookmarked(res.id) ? (
                      <BookmarkCheck className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <Bookmark className="w-4 h-4" strokeWidth={2.5} />
                    )}
                  </Button>
                )}
              </div>

              <TypographySmall className="text-foreground font-bold mb-4 leading-tight break-keep block">
                {res.questionText}
              </TypographySmall>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col p-3 bg-muted/50 rounded-xl border border-border">
                  <span className="text-[9px] font-black text-muted-foreground uppercase mb-0.5 tracking-wider">
                    나의 선택
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      res.isCorrect ? "text-primary" : "text-destructive",
                    )}
                  >
                    {res.userAnswerContent}
                  </span>
                </div>
                {!res.isCorrect && (
                  <div className="flex flex-col p-3 bg-success/5 rounded-xl border border-success/20">
                    <span className="text-[9px] font-black text-success/70 uppercase mb-0.5 tracking-wider">
                      정답
                    </span>
                    <span className="text-xs font-bold text-success">
                      {res.correctAnswerContent}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
