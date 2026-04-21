import { useState, useEffect, memo } from "react";
import { useNavigate, useLoaderData } from "react-router";
import type { ExamQuestion } from "@/types/exam-schema";
import { useQuiz } from "@/hooks/useQuiz";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/atoms/carousel";
import QuestionCard from "@/components/organisms/QuestionCard";
import QuestionControlBar from "@/components/organisms/QuestionControlBar";
import QuestionNavBar from "@/components/organisms/QuestionNavBar";
import { QuizNavigationContext } from "@/contexts/QuizNavigationContext";
import { QuizAnswerContext } from "@/contexts/QuizAnswerContext";
import type { ExamLoaderData } from "@/loaders/examLoader";

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
  const { subject, questions } = useLoaderData<ExamLoaderData>();
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

  const handleBack = () => navigate(`/${subject}`);

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
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "Enter") {
                const currentQuestionId = questions[currentIndex]?.id;
                const isAnswered = !!userAnswers[currentQuestionId];
                if (!isAnswered) e.preventDefault();
              }
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
