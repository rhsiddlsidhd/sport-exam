import type { SubjectCode } from "./subject";
import type { ExamView } from "./exam-schema";

export interface Note {
  id: string;
  year: string;
  subject: SubjectCode;
  questionText: string;
  view: ExamView; // 새로운 view 구조 반영
  correctAnswerContent: string;
  explanation?: string;
  savedAt: string;
}
