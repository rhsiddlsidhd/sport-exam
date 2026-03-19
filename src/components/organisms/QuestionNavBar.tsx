import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useNavigate, useParams } from "react-router";
import { useQuizNavigation } from "@/contexts/QuizNavigationContext";
import { useQuizAnswer } from "@/contexts/QuizAnswerContext";

const QuestionNavBar: React.FC = memo(() => {
  const navigate = useNavigate();
  const { subject, year } = useParams();
  const { currentIndex, totalCount, api, currentQuestionId } = useQuizNavigation();
  const { userAnswers } = useQuizAnswer();

  const isLastQuestion = currentIndex === totalCount - 1;
  const currentAnswer = userAnswers[currentQuestionId] ?? null;
  const lastAnswered = !!userAnswers[currentQuestionId];

  const handleGrade = () => {
    navigate(`/${subject}/${year}/review`, { state: { userAnswers } });
  };

  return (
    <div className="bg-card border-border flex h-16 shrink-0 items-center justify-between border-t px-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => api?.scrollPrev()}
        disabled={currentIndex === 0}
        className="text-muted-foreground gap-1.5 rounded-xl px-4 font-bold disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        이전
      </Button>

      {isLastQuestion ? (
        <Button
          onClick={handleGrade}
          disabled={!lastAnswered}
          className="h-10 rounded-xl px-7 font-black tracking-tight shadow-sm disabled:opacity-40"
        >
          채점하기
        </Button>
      ) : (
        <Button
          onClick={() => api?.scrollNext()}
          disabled={!currentAnswer}
          className="bg-foreground text-background hover:bg-foreground/90 h-10 gap-1.5 rounded-xl px-5 font-black shadow-sm disabled:opacity-40"
        >
          다음
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

export default QuestionNavBar;
