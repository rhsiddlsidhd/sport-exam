import type { ExamQuestion } from "@/types/exam-schema";
import React from "react";
import { Check } from "lucide-react";
import { TypographyLarge } from "../atoms/typography";
import IconBadge from "../molecules/IconBadge";
import OptionButton from "../molecules/OptionButton";
import QuestionContext from "../molecules/QuestionContext";

interface QuestionCardProps {
  question: ExamQuestion;
  selectedOption: number | null;
  onSelect: (id: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="p-5 border-y sm:border border-border rounded-none sm:rounded-2xl text-left bg-card shadow-sm sm:transition-all sm:hover:shadow-lg">
      <TypographyLarge className="font-bold text-foreground mb-4 leading-snug break-keep">
        {question.question}
      </TypographyLarge>

      {/* <보기> 섹션 (시각적 렌더링 영역) */}
      <QuestionContext view={question.view} />

      {/* 4지선다 선택지 (미래에 MULTIPLE_CHOICE 등 logicType에 따라 UI 분기 가능) */}
      <div className="grid grid-cols-1 gap-2 ">
        {question.options.map((option, idx) => (
          <OptionButton
            key={`${question.id}-opt-${idx}`}
            index={idx + 1}
            content={option.content}
            selected={selectedOption === option.id}
            onSelect={() => onSelect(option.id)}
          >
            {selectedOption === option.id && (
              <IconBadge className="animate-in zoom-in duration-300">
                <Check strokeWidth={3} />
              </IconBadge>
            )}
          </OptionButton>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
