import { useState, useEffect, memo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import type { SubjectCode } from "@/types/subject";
import type { ExamQuestion } from "@/types/exam-schema";
import { VALID_YEARS } from "@/constants/number";
import { useSubjectExam } from "@/hooks/useSubjectExam";
import { useQuiz } from "@/hooks/useQuiz";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/atoms/carousel";
import { Button } from "@/components/atoms/Button";
import { TypographySmall } from "@/components/atoms/Typography";
import QuestionCard from "@/components/organisms/QuestionCard";
import QuestionControlBar from "@/components/organisms/QuestionControlBar";
import QuestionNavBar from "@/components/organisms/QuestionNavBar";
import EmptyState from "@/components/molecules/EmptyState";
import NotFound from "./NotFound";
import { QuizNavigationContext } from "@/contexts/QuizNavigationContext";
import { QuizAnswerContext } from "@/contexts/QuizAnswerContext";

interface QuestionCarouselItemProps {
  question: ExamQuestion;
  selectedOption: number | null;
  onSelect: (questionId: string, optionId: number) => void;
}

const QuestionCarouselItem = memo(
  ({ question, selectedOption, onSelect }: QuestionCarouselItemProps) => (
    <CarouselItem className="scrollbar-hide h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-xl py-3">
        <QuestionCard
          question={question}
          selectedOption={selectedOption}
          onSelect={(id) => onSelect(question.id, id)}
        />
      </div>
    </CarouselItem>
  ),
);

const QuestionPage = () => {
  const navigate = useNavigate();
  const subject = useOutletContext<SubjectCode>();
  const { year } = useParams<{ year: string }>();
  const validYear = year && VALID_YEARS.has(year) ? year : null;
  const { questions, loading, error } = useSubjectExam(subject, validYear);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
    return () => {
      api.off("select", () => setCurrentIndex(api.selectedScrollSnap()));
    };
  }, [api]);

  const { userAnswers, answeredCount, handleSelectOption } = useQuiz();

  if (!validYear) return <NotFound />;

  const handleBack = () => navigate(`/${subject}`);

  if (loading) {
    return (
      <div className="flex h-full min-h-60 flex-col items-center justify-center gap-4">
        <div className="border-muted border-t-primary h-10 w-10 animate-spin rounded-full border-2" />
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

  return (
    <QuizNavigationContext.Provider
      value={{
        currentIndex,
        totalCount: questions.length,
        api,
        currentQuestionId: questions[currentIndex]?.id ?? "",
      }}
    >
      <QuizAnswerContext.Provider
        value={{ userAnswers, answeredCount, handleSelectOption }}
      >
        <div className="bg-background flex h-full flex-col overflow-hidden">
          <QuestionControlBar onBack={handleBack} />

          <Carousel
            setApi={setApi}
            opts={{ watchDrag: false }}
            onKeyDown={() => {
              questions.forEach((q) => {
                if (!userAnswers[q.id]) return;
              });
            }}
            className="flex-1 overflow-hidden **:data-[slot='carousel-content']:h-full"
          >
            <CarouselContent className="h-full">
              {questions.map((q) => (
                <QuestionCarouselItem
                  key={q.id}
                  question={q}
                  selectedOption={userAnswers[q.id] ?? null}
                  onSelect={handleSelectOption}
                />
              ))}
            </CarouselContent>
          </Carousel>

          <QuestionNavBar />
        </div>
      </QuizAnswerContext.Provider>
    </QuizNavigationContext.Provider>
  );
};

export default QuestionPage;
