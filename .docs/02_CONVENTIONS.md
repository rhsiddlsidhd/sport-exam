<!-- 
가이드: 코딩 스타일, 명명 규칙, UI/UX 원칙 및 커밋 규칙 등 개발 표준을 정의하는 문서입니다. 
AI가 코드를 작성할 때 반드시 준수해야 하는 규칙을 담고 있습니다.
-->

# 02. Conventions

## 파일 및 폴더 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `QuestionCard.tsx`, `Header.tsx` |
| 페이지 파일 | PascalCase | `Subject.tsx`, `Result.tsx` |
| 훅/유틸 파일 | camelCase | `useQuiz.ts`, `shuffle.ts` |
| 상수/타입 파일 | camelCase | `label.ts`, `subject.ts` |
| JSON 데이터 파일 | 과목: 대문자, 시험지: snake_case | `SOC.json`, `2025_sports_instructor_exam.json` |
| CSS 클래스 (커스텀) | kebab-case | `.scrollbar-hide` |

## 컴포넌트 작성 규칙

```tsx
// Props 인터페이스는 컴포넌트명 + Props
interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (id: number) => void;
}

// 함수형 컴포넌트 + React.FC 명시
const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedOption, onSelect }) => {
  return (...);
};

export default QuestionCard;
```

## TypeScript 규칙

- `any` 사용 금지 — 타입 불명확 시 `unknown` 또는 제네릭 사용
- 외부 데이터(JSON) 사용 시 반드시 타입 캐스팅: `data.default as Question[]`
- `as const` + `typeof` 패턴으로 enum 대체:
  ```ts
  export const SUBJECT_CODES = ["SOC", "ETH"] as const;
  export type SubjectCode = (typeof SUBJECT_CODES)[number];
  ```
- 타입 import는 `import type` 사용

## Tailwind CSS 규칙

- 반응형 작성 순서: 모바일 기본 → `sm:` → `md:` → `lg:`
- 커스텀 유틸리티 클래스는 `src/index.css` 에 정의
  ```css
  .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  ```
- 조건부 className은 `clsx` 사용 (문자열 템플릿 리터럴 혼용 지양)
- 높이 체인: 전체 높이 레이아웃 필요 시 `h-screen flex-col` → `flex-1` → `h-full` 순으로 전달

## Typography 컴포넌트 사용 규칙

원시 HTML 태그(`<h1>`, `<p>`, `<small>`) 대신 `src/components/atoms/Typography.tsx` 사용.

| 컴포넌트 | 사용 상황 |
|----------|----------|
| `TypographyH1` | 페이지 최상위 제목 (Hero, 랜딩) |
| `TypographyH2` | 섹션 제목 (구분선 포함) |
| `TypographyH3` | 서브 섹션 / 카드 그룹 헤더 |
| `TypographyH4` | 폼 섹션, 리스트 아이템 타이틀 |
| `TypographyP` | 일반 본문 단락 |
| `TypographyLarge` | 강조된 텍스트 (카드 제목, 문제 텍스트) |
| `TypographySmall` | 날짜, 태그, 캡션 등 보조 정보 |
| `TypographyMuted` | 비활성 상태 메시지, 힌트 |
| `TypographyLead` | 히어로 아래 부제목, 페이지 요약 |
| `TypographyBlockquote` | 인용문, 강조 노트 |

## import 순서

```ts
// 1. React / 외부 라이브러리
import React, { useState } from "react";
import { useNavigate } from "react-router";

// 2. 내부 컴포넌트
import QuestionCard from "../QuestionCard";

// 3. 타입 (import type)
import type { Question } from "../../types/question";

// 4. 상수 / 유틸
import { subjectLabel } from "../../constants/label";
```
