<!--
가이드: 코딩 스타일, 명명 규칙, UI/UX 원칙 및 커밋 규칙 등 개발 표준을 정의하는 문서입니다.
AI가 코드를 작성할 때 반드시 준수해야 하는 규칙을 담고 있습니다.
-->

# 02. Conventions

## 파일 및 폴더 네이밍

| 대상                | 규칙       | 예시                               |
| ------------------- | ---------- | ---------------------------------- |
| 컴포넌트 파일       | PascalCase | `Typography.tsx`, `Header.tsx`     |
| 페이지 파일         | PascalCase | `NotesPage.tsx`, `ReviewPage.tsx`  |
| 훅/유틸 파일        | camelCase  | `useQuiz.ts`, `shuffle.ts`         |
| 상수/타입 파일      | camelCase  | `label.ts`                         |
| JSON 데이터 파일    | snake_case | `2025_sports_instructor_exam.json` |
| CSS 클래스 (커스텀) | kebab-case | `.scrollbar-hide`                  |

## Atomic Design 분류 기준

| 계층        | 위치                    | 기준                                                   | 예시                              |
| ----------- | ----------------------- | ------------------------------------------------------ | --------------------------------- |
| `atoms`     | `components/atoms/`     | 더 이상 분리 불가한 단일 UI 요소. 자체 상태 없음       | `Button`, `Typography`, `Label`   |
| `molecules` | `components/molecules/` | atoms 2개 이상 조합. 단일 책임 유지. `React.memo` 적용 | `OptionButton`, `QuestionContext` |
| `organisms` | `components/organisms/` | molecules/atoms 조합으로 독립적인 UI 블록 구성         | `QuestionCard`                    |
| `layout`    | `components/layout/`    | 페이지 레이아웃 구조. Outlet 포함 가능                 | `Header`, `YearLayout`            |

**판단 순서**: 단일 요소인가? → `atoms` / atoms 조합인가? → `molecules` / 독립 UI 블록인가? → `organisms`

---

## TypeScript 규칙

- `any` 사용 금지 — 타입 불명확 시 `unknown` 또는 제네릭 사용
- Props 인터페이스는 컴포넌트명 + `Props` 네이밍. 함수형 컴포넌트 + `React.FC` 명시
  ```tsx
  interface QuestionCardProps {
    question: ExamQuestion;
    selectedOption: number | null;
    onSelect: (id: number) => void;
  }

  const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedOption, onSelect }) => {
    return (...);
  };

  export default QuestionCard;
  ```
- 동적 import 는 반환 타입이 명시된 함수로 감싸서 사용. `as` 사용 금지
  ```ts
  async function loadExam(year: string): Promise<Exam> {
    const module = await import(
      `../../data/exam/${year}_sports-instructor_exam.json`
    );
    const data: Exam = module.default;
    return data;
  }
  ```
- `as const` + `typeof` 패턴으로 enum 대체:
  ```ts
  export const SUBJECT_CODES = ["SOC", "ETH"] as const;
  export type SubjectCode = (typeof SUBJECT_CODES)[number];
  ```
- 타입 import는 `import type` 사용
- 타입 선언 위치 기준:
  - Props 타입 → 컴포넌트 파일 내부 선언
  - 2개 이상 파일에서 사용되는 타입 → `src/types/` 로 분리
  - Props 에서 공통 타입 필요 시 → `extends` 로 확장
  ```ts
  // src/types/exam.ts
  export interface ExamQuestion { ... }

  // components/organisms/QuestionCard.tsx
  interface QuestionCardProps extends Pick<ExamQuestion, 'id' | 'question'> {
    selectedOption: number | null;
    onSelect: (id: number) => void;
  }
  ```

## Tailwind CSS 규칙

- 컬러는 shadcn 테마 변수 사용. 하드코딩 컬러(`bg-blue-500`, `text-gray-600` 등) 사용 금지
  ```ts
  // ❌
  className="bg-blue-500 text-gray-600"
  // ✅
  className="bg-primary text-muted-foreground"
  ```
- 다크모드 미지원. `dark:` 접두사 사용 금지
- 반응형 작성 순서: 모바일 기본 → `sm:` → `md:` → `lg:`
- 커스텀 유틸리티 클래스는 `src/index.css` 에 정의
  ```css
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  ```
- className 조합은 `cn` 사용 (`src/lib/utils.ts`). `clsx` 직접 사용 및 문자열 템플릿 리터럴 혼용 금지
  ```ts
  import { cn } from "@/lib/utils";

  className={cn("base-class", isActive && "active-class", className)}
  ```
- 높이 체인: 전체 높이 레이아웃 필요 시 `h-screen flex-col` → `flex-1` → `h-full` 순으로 전달

## localStorage 규칙

- 키 네이밍: `sport-exam:{feature}` 형식
  ```ts
  "sport-exam:notes"   // 오답노트 저장
  ```
- 직접 접근 금지. 반드시 커스텀 훅으로 감싸서 사용
  ```ts
  // hooks/useNotes.ts
  const STORAGE_KEY = "sport-exam:notes";

  export function useNotes() {
    const save = (data: Note[]) =>
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const load = (): Note[] => {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Note[]) : [];
    };

    return { save, load };
  }
  ```
- 저장 시 `JSON.stringify`, 읽기 시 `JSON.parse` + 타입 선언으로 처리
- localStorage 접근 실패 대비 `try/catch` 필수

---

## Hooks 규칙

- 파일명 및 함수명은 `use` 접두사 필수. `hooks/` 폴더에만 위치
- 반환 형태는 객체로 통일
  ```ts
  // ❌
  return [value, setValue];
  // ✅
  return { value, setValue };
  ```
- 하나의 훅은 하나의 관심사만 담당
- 외부 의존(localStorage, API 등) 또는 연관 상태 2개 이상이면 반드시 훅으로 분리
- 아래 조건을 모두 만족하면 컴포넌트 내 `useState` 직접 사용 허용
  - 해당 컴포넌트에서만 사용
  - 외부 의존 없음
  - 상태 변환 로직 없이 값만 저장

  ```ts
  // 허용 — UI 상태, 단순 토글
  const [isOpen, setIsOpen] = useState(false);

  // 훅으로 분리 — localStorage 접근
  const { save, load } = useNotes();
  ```

---

## Typography 컴포넌트 사용 규칙

원시 HTML 태그(`<h1>`, `<p>`, `<small>`) 대신 `src/components/atoms/Typography.tsx` 사용.

| 컴포넌트               | 사용 상황                              |
| ---------------------- | -------------------------------------- |
| `TypographyH1`         | 페이지 최상위 제목 (Hero, 랜딩)        |
| `TypographyH2`         | 섹션 제목 (구분선 포함)                |
| `TypographyH3`         | 서브 섹션 / 카드 그룹 헤더             |
| `TypographyH4`         | 폼 섹션, 리스트 아이템 타이틀          |
| `TypographyP`          | 일반 본문 단락                         |
| `TypographyLarge`      | 강조된 텍스트 (카드 제목, 문제 텍스트) |
| `TypographySmall`      | 날짜, 태그, 캡션 등 보조 정보          |
| `TypographyMuted`      | 비활성 상태 메시지, 힌트               |
| `TypographyLead`       | 히어로 아래 부제목, 페이지 요약        |
| `TypographyBlockquote` | 인용문, 강조 노트                      |

