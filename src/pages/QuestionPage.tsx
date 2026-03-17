import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ExamQuestion, SubjectExam } from "../types/exam-schema";
import type { SubjectCode } from "../types/subject";
import { INITIAL_YEAR } from "../constants/number";
import { cn } from "@/lib/utils";

import NotFound from "./NotFound";
import { Button } from "../components/atoms/Button";
import { TypographySmall } from "../components/atoms/Typography";
import QuestionCard from "../components/organisms/QuestionCard";
import EmptyState from "../components/molecules/EmptyState";

const VALID_YEARS = new Set(
  Array.from({ length: 7 }, (_, i) => String(INITIAL_YEAR - i)),
);

async function loadSubjectExam(
  subject: SubjectCode,
  year: string,
): Promise<SubjectExam> {
  const module = await import(
    `../data/exam/${subject}_${year}_sports_instructor_exam.json`
  );
  const data: SubjectExam = module.default;
  return data;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuestionPage = () => {
  const navigate = useNavigate();
  const subject = useOutletContext<SubjectCode>();
  const { year } = useParams<{ year: string }>();

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const validYear = year && VALID_YEARS.has(year) ? year : null;

  useEffect(() => {
    if (!validYear) {
      setLoading(false);
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadSubjectExam(subject, validYear);
        const loaded = data.questions.map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(loaded);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subject, validYear]);

  if (!validYear) return <NotFound />;

  const handleBack = () => navigate(`/${subject}`);
  const handleSelectOption = (questionId: string, optionId: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };
  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };
  const handleGrade = () => {
    navigate("/review", {
      state: { year: validYear, subject, questions, userAnswers },
    });
  };

  const isAllAnswered =
    questions.length > 0 && questions.every((q) => userAnswers[q.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-60 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-muted border-t-primary animate-spin" />
        <TypographySmall className="text-muted-foreground">
          문제를 불러오는 중...
        </TypographySmall>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-3xl">📭</span>}
        title={error ?? "등록된 기출문제가 없습니다."}
        action={
          <Button onClick={handleBack} className="rounded-xl font-bold">
            돌아가기
          </Button>
        }
        className="h-full min-h-60"
      />
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* 상단 컨트롤 바 */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-card border-b border-border gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1 rounded-lg text-muted-foreground hover:text-primary font-bold shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          뒤로
        </Button>

        {/* 진행 바 */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* 데스크탑: 도트 */}
          <div className="hidden sm:flex gap-0.5 justify-center flex-wrap">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  idx === currentIndex
                    ? "w-3 h-1.5 bg-primary"
                    : userAnswers[q.id]
                      ? "w-1.5 h-1.5 bg-primary/40"
                      : "w-1.5 h-1.5 bg-muted-foreground/20",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-xs font-black text-foreground tabular-nums">
            <span className="text-primary">{currentIndex + 1}</span>
            <span className="text-muted-foreground/60">/{questions.length}</span>
          </span>
          <span className="text-[9px] text-muted-foreground font-medium">
            {answeredCount}개 선택됨
          </span>
        </div>
      </div>

      {/* 문제 컨테이너 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-xl mx-auto py-3">
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            selectedOption={userAnswers[questions[currentIndex].id] || null}
            onSelect={(id) => handleSelectOption(questions[currentIndex].id, id)}
          />
        </div>
      </div>

      {/* 하단 내비게이션 바 */}
      <div className="h-16 shrink-0 flex items-center justify-between px-5 bg-card border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-1.5 rounded-xl px-4 font-bold text-muted-foreground disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          이전
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleGrade}
            disabled={!isAllAnswered}
            className="rounded-xl px-7 h-10 font-black tracking-tight shadow-sm disabled:opacity-40"
          >
            채점하기
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="rounded-xl gap-1.5 px-5 h-10 bg-foreground text-background hover:bg-foreground/90 font-black shadow-sm"
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
