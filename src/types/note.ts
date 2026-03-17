import type { SubjectCode } from "./subject";
import type { ExamContextItem } from "./exam-schema";

export interface Note {
  id: string;
  year: string;
  subject: SubjectCode;
  questionText: string;
  context: string[] | null;
  contextItems: ExamContextItem[] | null;
  correctAnswerContent: string;
  explanation?: string;
  savedAt: string;
}
