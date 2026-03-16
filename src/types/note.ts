import type { SubjectCode } from "./subject";

export interface Note {
  id: string;
  year: string;
  subject: SubjectCode;
  questionText: string;
  correctAnswerContent: string;
  savedAt: string;
}
