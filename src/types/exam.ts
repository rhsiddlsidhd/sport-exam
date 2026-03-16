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
  id: number;      // 1 ~ 4 고정
  content: string;
}

export interface ExamContextItem {
  id: string;      // "ㄱ" | "ㄴ" | "가" | "나" | "㉠" 등
  content: string;
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  type: ExamQuestionType;
  question: string;
  context: string[] | null;
  contextItems: ExamContextItem[] | null;
  options: ExamOption[];
  answer: number | number[];
}

export interface ExamSubject {
  subject: SubjectCode;
  subjectCode: string;
  questions: ExamQuestion[];
}

export interface Exam {
  exam: string;
  date: string;
  subjects: ExamSubject[];
}
