import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import type { ExamQuestion } from "@/types/exam-schema";
import type { SubjectCode } from "@/types/subject";

interface UseQuizResult {
  userAnswers: Record<string, number>;
  currentAnswer: number | null;
  isAllAnswered: boolean;
  answeredCount: number;
  handleSelectOption: (questionId: string, optionId: number) => void;
  handleGrade: () => void;
}

export function useQuiz(
  questions: ExamQuestion[],
  subject: SubjectCode,
  year: string,
  currentIndex: number,
): UseQuizResult {
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentIndex] ?? null;
  const currentAnswer = currentQuestion ? (userAnswers[currentQuestion.id] ?? null) : null;
  const isAllAnswered = questions.length > 0 && questions.every((q) => !!userAnswers[q.id]);
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = useCallback((questionId: string, optionId: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleGrade = () => {
    navigate("/review", { state: { year, subject, questions, userAnswers } });
  };

  return {
    userAnswers,
    currentAnswer,
    isAllAnswered,
    answeredCount,
    handleSelectOption,
    handleGrade,
  };
}
