import type { SubjectCode } from "./subject";
import type { ExamView, ExamExplanation } from "./exam-schema";

export interface Note {
  id: string;
  year: string;
  subject: SubjectCode;
  questionText: string;
  view: ExamView;
  correctAnswerContent: string;
  explanation?: ExamExplanation;
  savedAt: string;
}
