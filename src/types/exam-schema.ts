export type SubjectCode = "SSO" | "SET" | "SPS" | "KHS" | "EPH";

// --- SubjectExam ---

export interface SubjectExam {
  subject: SubjectCode;
  exam: string;
  date: string;
  questions: ExamQuestion[];
}

// --- ExamQuestion ---

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  question: string;
  view?: ExamView;
  options: ExamOption[];
  answer: number[];
  explanation?: ExamExplanation;
}

export interface ExamOption {
  id: number;
  content: string;
}

// --- ExamView ---

export interface ExamView {
  text?: string[];
  blanks?: string[];
  underlines?: number[];
  list?: ListItem[];
  media?: ExamMedia;
  table?: ExamTable;
}

export interface ListItem {
  label: string;
  content: string[];
}

export interface ExamMedia {
  type: "IMAGE" | "CHART" | "SVG";
  url: string;
  alt?: string;
}

export interface ExamTable {
  caption?: string;
  headers: ExamTableRow[];
  rows: ExamTableRow[];
}

export interface ExamTableRow {
  cells: ExamTableCell[];
}

export interface ExamTableCell {
  content: string;
  colSpan?: number;
  rowSpan?: number;
  isHeader?: boolean;
}

// --- ExamExplanation ---

export interface ExamExplanation {
  correct: string;
  distractors?: ExamDistractor[];
  summary?: string;
}

export interface ExamDistractor {
  term: string;
  reason: string;
}
