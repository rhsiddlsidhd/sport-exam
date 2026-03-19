import { createContext, useContext } from "react";

interface QuizAnswerContextValue {
  userAnswers: Record<string, number>;
  currentAnswer: number | null;
  isAllAnswered: boolean;
  answeredCount: number;
  handleSelectOption: (questionId: string, optionId: number) => void;
  handleGrade: () => void;
}

export const QuizAnswerContext = createContext<QuizAnswerContextValue | null>(null);

export function useQuizAnswer(): QuizAnswerContextValue {
  const ctx = useContext(QuizAnswerContext);
  if (!ctx) throw new Error("useQuizAnswer must be used within QuizAnswerContext");
  return ctx;
}
