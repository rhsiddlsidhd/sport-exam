<!-- 
가이드: 공통 UI 컴포넌트의 목록, 용도, Props 정의 및 재사용 가이드를 작성하는 문서입니다. 
기존 UI 시스템을 재사용하여 일관된 디자인을 유지하기 위해 참조합니다.
-->

# 04. Component Guide

## Typography (`src/components/atoms/Typography.tsx`)

모든 텍스트 출력에 원시 HTML 태그 대신 이 컴포넌트를 사용한다.
모든 컴포넌트는 `children: React.ReactNode`, `className?: string` Props를 받는다.

| 컴포넌트 | 태그 | 크기 | 굵기 | 주요 사용처 |
|----------|------|------|------|------------|
| `TypographyH1` | `<h1>` | 4xl | extrabold | 페이지 최상위 제목 |
| `TypographyH2` | `<h2>` | 3xl | semibold | 섹션 제목 (하단 보더) |
| `TypographyH3` | `<h3>` | 2xl | semibold | 서브 섹션, 카드 그룹 헤더 |
| `TypographyH4` | `<h4>` | xl | semibold | 항목 레이블, 폼 섹션 |
| `TypographyP` | `<p>` | base | normal | 일반 본문 단락 |
| `TypographyLarge` | `<div>` | lg (18px) | semibold | 카드 제목, 문제 텍스트 |
| `TypographySmall` | `<small>` | sm (14px) | medium | 날짜, 태그, 캡션 |
| `TypographyMuted` | `<p>` | sm | normal | 비활성 상태, 힌트 |
| `TypographyLead` | `<p>` | xl | normal | 히어로 부제목 |
| `TypographyBlockquote` | `<blockquote>` | base | italic | 인용문, 노트 |
| `TypographyInlineCode` | `<code>` | sm | semibold | 인라인 코드 |

```tsx
import { TypographyH3, TypographySmall } from "./components/atoms/Typography";

<TypographyH3 className="font-black text-gray-900 mb-1">과목을 선택하세요</TypographyH3>
<TypographySmall className="text-gray-400">실전 감각을 익혀보세요.</TypographySmall>
```

---

## QuestionCard (`src/components/QuestionCard.tsx`)

단일 문제 카드. 선택지 클릭 시 `onSelect(option.id)` 호출.

### Props

| Prop | 타입 | 설명 |
|------|------|------|
| `question` | `Question` | 문제 데이터 |
| `selectedOption` | `number \| null` | 현재 선택된 option.id |
| `onSelect` | `(id: number) => void` | 선택지 클릭 콜백 |

### 렌더링 규칙

- `question.passage` 있으면 `<보기>` 지문 섹션 표시 (줄 단위)
- `question.subItems` 있으면 `<보기>` 항목 리스트 표시 (ㄱ. / ㄴ. 레이블)
- `selectedOption === option.id` 로 선택 상태 판단 (option.content 비교 금지)
- 모바일: `border-y rounded-none`, 데스크탑: `sm:border sm:rounded-2xl`

```tsx
<QuestionCard
  key={questions[currentIndex].id}  // 문제 변경 시 remount
  question={questions[currentIndex]}
  selectedOption={userAnswers[questions[currentIndex].id] || null}
  onSelect={(id) => handleSelectOption(questions[currentIndex].id, id)}
/>
```

---

## QuestionSession (`src/components/subject/QuestionSession.tsx`)

문제 풀기 전체 세션 관리 컴포넌트.

### Props

| Prop | 타입 | 설명 |
|------|------|------|
| `year` | `string` | 선택된 연도 (URL searchParam에서 전달) |
| `onBack` | `() => void` | 뒤로가기 (YearSelector로 복귀) |

### 내부 상태

| 상태 | 타입 | 설명 |
|------|------|------|
| `questions` | `Question[]` | 로드 + 셔플된 문제 목록 |
| `loading` | `boolean` | 데이터 로딩 중 여부 |
| `error` | `string \| null` | 로딩 오류 메시지 |
| `currentIndex` | `number` | 현재 문제 인덱스 |
| `userAnswers` | `Record<string, number>` | questionId → 선택한 optionId |

### 데이터 로딩 흐름

```
useEffect([sid, year])
  → dynamic import(`../../data/questions/${sid}.json`)
  → filter by year
  → Fisher-Yates shuffle on options
  → setQuestions
```

### 상태별 렌더링

| 상태 | 렌더링 |
|------|--------|
| `loading === true` | 스피너 + "기출문제 로딩 중..." |
| `error` 또는 `questions.length === 0` | 에러 메시지 + 이전으로 버튼 |
| 정상 | 컨트롤바 + QuestionCard + 하단 네비게이션 |

### 진행 표시

- 모바일 (`sm:hidden`): 상단 progress bar (width % 스타일)
- 데스크탑 (`hidden sm:flex`): 클릭 가능한 dot 목록
  - 현재 문제: `w-4 bg-blue-500` (넓어짐)
  - 답변 완료: `bg-blue-200`
  - 미답변: `bg-gray-200`

---

## YearSelector (`src/components/subject/YearSelector.tsx`)

연도 선택 버튼 목록. 현재 연도 기준 동적 생성.

### Props

| Prop | 타입 | 설명 |
|------|------|------|
| `onYearSelect` | `(year: number) => void` | 연도 선택 콜백 |

### 동작

- `INITIAL_YEAR` 상수 기준으로 연도 목록 생성
- 버튼 클릭 → `onYearSelect(year)` → Subject에서 `setSearchParams({ year })`

---

## Header (`src/components/layout/Header.tsx`)

공통 헤더 + 푸터. 퀴즈 진행 중(URL에 `year=` 포함) 시 푸터 숨김.

```tsx
const isQuizActive = location.search.includes("year=");
// 푸터: className={isQuizActive ? "hidden" : ""}
```

---

## Subjectlayout (`src/components/layout/Subjectlayout.tsx`)

`/:sid` 라우트의 레이아웃. `sid` 유효성 검사 후 Outlet에 context 전달.

```tsx
// 자식 컴포넌트에서 수신:
const sid = useOutletContext<SubjectCode>();
```

### 높이 체인

```
<div className="flex flex-col h-full">   ← Subjectlayout 루트
  <div className="mb-4 px-6 pt-4">      ← 과목 제목 (shrink)
  <div className="flex-1 overflow-hidden"> ← Outlet 감싸기
    <Subject className="h-full">         ← Subject
      <QuestionSession className="flex flex-col h-full">  ← 세션
```

---

## Result (`src/pages/Result.tsx`)

`/result` 페이지. `navigate` state로 결과 데이터 수신.

### 수신 state 구조

```ts
{
  sid: SubjectCode;
  year: string;
  questions: Question[];
  userAnswers: Record<string, number>;  // questionId → optionId
}
```

### 유효성 검사

state 없거나 필드 누락 시 → `navigate("/")` 리다이렉트.

### 다시 풀기

```ts
navigate(`/${sid}?year=${year}`);  // navigate(-1) 사용 금지
```
