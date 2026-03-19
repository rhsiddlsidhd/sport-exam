import { createContext, useContext } from "react";

interface QuizAnswerContextValue {
  userAnswers: Record<string, number>;
  answeredCount: number;
  handleSelectOption: (questionId: string, optionId: number) => void;
}

export const QuizAnswerContext = createContext<QuizAnswerContextValue | null>(null);

export function useQuizAnswer(): QuizAnswerContextValue {
  const ctx = useContext(QuizAnswerContext);
  if (!ctx) throw new Error("useQuizAnswer must be used within QuizAnswerContext");
  return ctx;
}
