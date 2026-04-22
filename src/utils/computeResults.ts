import type { ExamQuestion } from "@/types/exam-schema";

export interface QuestionResult extends ExamQuestion {
  isCorrect: boolean;
  userAnswerContent: string;
  correctAnswerContent: string;
}

export function computeResults(
  questions: ExamQuestion[],
  userAnswers: Record<string, number>,
): QuestionResult[] {
  return questions.map((q) => {
    const userAnswerId = userAnswers[q.id];

    const isCorrect = q.answer.includes(userAnswerId);

    const userAnswerContent =
      userAnswerId === undefined || userAnswerId === null
        ? "미선택"
        : (q.options.find((opt) => opt.id === userAnswerId)?.content ?? "미선택");

    const correctAnswerContent = q.options
      .filter((opt) => q.answer.includes(opt.id))
      .map((opt) => opt.content)
      .join(", ");

    return { ...q, isCorrect, userAnswerContent, correctAnswerContent };
  });
}
