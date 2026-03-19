import { createContext, useContext } from "react";
import type { CarouselApi } from "@/components/atoms/carousel";

interface QuizNavigationContextValue {
  currentIndex: number;
  totalCount: number;
  api: CarouselApi | undefined;
  currentQuestionId: string;
}

export const QuizNavigationContext = createContext<QuizNavigationContextValue | null>(null);

export function useQuizNavigation(): QuizNavigationContextValue {
  const ctx = useContext(QuizNavigationContext);
  if (!ctx) throw new Error("useQuizNavigation must be used within QuizNavigationContext");
  return ctx;
}
