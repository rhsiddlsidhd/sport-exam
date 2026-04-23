import { memo } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/atoms/button";
import ProgressBar from "@/components/molecules/ProgressBar";
import { useQuizNavigation } from "@/contexts/QuizNavigationContext";

interface QuestionControlBarProps {
  onBack: () => void;
}

const QuestionControlBar: React.FC<QuestionControlBarProps> = memo(
  ({ onBack }) => {
    const { currentIndex, totalCount } = useQuizNavigation();

    return (
      <div className="bg-card border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-primary shrink-0 gap-1 rounded-lg font-bold"
        >
          <ChevronLeft className="h-4 w-4" />
          뒤로
        </Button>

        <ProgressBar current={currentIndex + 1} total={totalCount} />

        <div className="flex shrink-0 flex-col items-end">
          <span className="text-foreground text-xs font-black tabular-nums">
            <span className="text-primary">{currentIndex + 1}</span>
            <span className="text-muted-foreground/60">/{totalCount}</span>
          </span>
        </div>
      </div>
    );
  },
);

export default QuestionControlBar;
