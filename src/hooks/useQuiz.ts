import { useState, useCallback } from "react";

interface UseQuizResult {
  userAnswers: Record<string, number>;
  answeredCount: number;
  handleSelectOption: (questionId: string, optionId: number) => void;
}

export function useQuiz(): UseQuizResult {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = useCallback((questionId: string, optionId: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  return { userAnswers, answeredCount, handleSelectOption };
}
