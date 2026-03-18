export type SubjectCode = "SOC" | "ETH" | "PSY" | "HIS" | "PHY";

export type QuestionLogicType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "MATCHING"
  | "ORDERING";

export type QuestionViewType =
  | "NONE"
  | "PASSAGE"
  | "ITEMIZED"
  | "BLANK"
  | "VISUAL"
  | "COMPOSITE";

export interface ExamMedia {
  type: "IMAGE" | "CHART" | "SVG";
  url: string; // public 폴더 기준 경로 (예: /exam/PHY_2024_17.png)
  alt?: string;
}

export interface ExamViewItem {
  label: string;
  content: string;
}

export interface ExamView {
  type: QuestionViewType;
  passage?: string[];
  items?: ExamViewItem[];
  media?: ExamMedia;
}

export interface ExamOption {
  id: number;
  content: string;
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  logicType: QuestionLogicType;
  question: string;
  view: ExamView;
  options: ExamOption[];
  answer: number | number[];
  explanation?: string;
}

export interface SubjectExam {
  subject: SubjectCode;
  exam: string;
  date: string;
  questions: ExamQuestion[];
}
