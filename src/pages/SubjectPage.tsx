import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ExamQuestion, Exam } from "../types/exam-schema";
import { isSubjectCode } from "../types/subject";
import { cn } from "@/lib/utils";

import NotFound from "./NotFound";
import { Button } from "../components/atoms/Button";
import { TypographySmall } from "../components/atoms/Typography";
import QuestionCard from "../components/organisms/QuestionCard";
import EmptyState from "../components/molecules/EmptyState";

async function loadExam(year: string): Promise<Exam> {
  const module = await import(`../data/exam/${year}_sports_instructor_exam.json`);
  const data: Exam = module.default;
  return data;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SubjectPage = () => {
  const navigate = useNavigate();
  const year = useOutletContext<string>();
  const { subject } = useParams<{ subject: string }>();

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const validSubject = isSubjectCode(subject) ? subject : null;

  useEffect(() => {
    if (!validSubject) {
      setLoading(false);
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadExam(year);
        const examSubject = data.subjects.find(
          (s) => s.subject === validSubject,
        );
        if (!examSubject) return setQuestions([]);
        const loaded = examSubject.questions.map((q) => ({
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
  }, [year, validSubject]);

  if (!validSubject) {
    return <NotFound />;
  }

  const handleBack = () => {
    navigate(`/${year}`);
  };

  const handleSelectOption = (questionId: string, optionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleGrade = () => {
    navigate("/review", {
      state: {
        year,
        subject: validSubject,
        questions,
        userAnswers,
      },
    });
  };

  const isAllAnswered =
    questions.length > 0 && questions.every((q) => userAnswers[q.id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <TypographySmall className="mt-4 text-muted-foreground block">
          기출문제 로딩 중...
        </TypographySmall>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-2xl">📭</span>}
        title={error ?? "등록된 기출문제가 없습니다."}
        action={
          <Button onClick={handleBack} className="rounded-xl shadow-md font-bold">
            이전으로 돌아가기
          </Button>
        }
        className="flex-1 h-full min-h-100"
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* 상단 컨트롤 바 */}
      <div className="h-10 shrink-0 flex items-center justify-between px-4 bg-card border-b border-border shadow-sm z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1.5 rounded-lg text-muted-foreground hover:text-primary font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          뒤로
        </Button>

        {/* 모바일: progress bar */}
        <div className="sm:hidden flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
        {/* 데스크탑: dots */}
        <div className="hidden sm:flex gap-1">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-4 bg-primary"
                  : userAnswers[q.id]
                    ? "bg-primary/30"
                    : "bg-muted",
              )}
            />
          ))}
        </div>
        <span className="text-xs font-black text-muted-foreground">
          <span className="text-primary">{currentIndex + 1}</span> /{" "}
          {questions.length}
        </span>
      </div>

      {/* 문제 컨테이너 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-xl mx-auto py-3">
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            selectedOption={userAnswers[questions[currentIndex].id] || null}
            onSelect={(id) =>
              handleSelectOption(questions[currentIndex].id, id)
            }
          />
        </div>
      </div>

      {/* 하단 내비게이션 바 */}
      <div className="h-14 shrink-0 flex items-center justify-between px-4 bg-card border-t border-border shadow-[0_-2px_8px_rgba(0,0,0,0.02)] z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-1.5 rounded-lg px-4 font-bold text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          이전
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleGrade}
            disabled={!isAllAnswered}
            className="rounded-xl px-8 h-auto py-2.5 shadow-md font-bold"
          >
            최종 채점하기
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="rounded-xl gap-1.5 px-6 h-auto py-2.5 bg-foreground text-background hover:bg-foreground/90 active:scale-95 shadow-md font-bold"
          >
            다음 문제
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
