export type SubjectCode = "SSO" | "SET" | "SPS" | "KHS" | "EPH";

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
  | "COMPOSITE"
  | "TABLE";

export interface ExamTableCell {
  content: string;
  colSpan?: number;
  rowSpan?: number;
  isHeader?: boolean;
}

export interface ExamTableRow {
  cells: ExamTableCell[];
}

export interface ExamTable {
  caption?: string;
  headers: ExamTableRow[];
  rows: ExamTableRow[];
}

export interface ExamMedia {
  type: "IMAGE" | "CHART" | "SVG";
  url: string; // public 폴더 기준 경로 (예: /exam/PHY_2024_17.png)
  alt?: string;
}

export interface ExamViewItem {
  label: string;
  content: string;
}

export interface PassageLine {
  text: string;
  underline?: boolean;
}

export interface ExamView {
  type: QuestionViewType;
  passage?: PassageLine[];
  items?: ExamViewItem[];
  media?: ExamMedia;
  table?: ExamTable;
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
