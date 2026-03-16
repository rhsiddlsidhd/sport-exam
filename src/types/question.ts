import type { SubjectCode } from './subject';

export type QuestionType = 'BASIC' | 'PASSAGE' | 'COMBINATION';

export interface SubItem {
  id: string; // "ㄱ", "ㄴ", "ㄷ", "ㄹ" 등
  content: string;
}

export interface Option {
  id: number; // 1, 2, 3, 4
  content: string;
}

export interface Question {
  id: string;
  year: number; // 출제 연도
  category: SubjectCode; // 과목 코드 (SOC, ETH 등)
  type: QuestionType; // 유형 구분
  questionText: string; // 발문 (예: 다음 중 옳은 것은?)
  passage?: string[]; // <보기> 내의 설명 텍스트 (여러 줄 대응)
  subItems?: SubItem[]; // <보기> 내의 (ㄱ, ㄴ, ㄷ) 리스트
  options: Option[]; // 4지선다 선택지
  answer: number | number[]; // 정답 선택지의 고정 ID (1-4), 중복 정답 가능
  explanation?: string; // 해설
}
