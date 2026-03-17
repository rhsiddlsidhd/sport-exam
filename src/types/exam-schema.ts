import type { SubjectCode } from "./subject";

export const EXAM_QUESTION_TYPES = [
  "BASIC",
  "PASSAGE",
  "COMBINATION_SELECT",
  "COMBINATION_MATCH",
  "COMBINATION_LINK",
] as const;

export type ExamQuestionType = (typeof EXAM_QUESTION_TYPES)[number];

export interface ExamOption {
  id: number; // 1 ~ 4 고정
  content: string;
}

export interface ExamContextItem {
  id: string; // "ㄱ" | "ㄴ" | "가" | "나" | "㉠" 등
  content: string;
}

export interface ExamQuestion {
  id: string; // "{subject}-{year}-{questionNumber}" 예: "SOC-2025-1"
  questionNumber: number;
  type: ExamQuestionType;
  question: string;
  context: string[] | null;
  contextItems: ExamContextItem[] | null;
  options: ExamOption[];
  answer: number | number[];
  explanation?: string | null;
}

export interface SubjectExam {
  subject: SubjectCode;
  exam: string;
  date: string;
  questions: ExamQuestion[];
}
