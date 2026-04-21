<!--
가이드: 기술 스택, 폴더 구조, 데이터 흐름 및 핵심 라이브러리 구성을 설명하는 문서입니다.
AI가 파일 생성 위치와 모듈 간 관계를 파악하는 용도로 사용합니다.
-->

# 01. Architecture

## 설계 패턴

| 구분 | 패턴 |
|------|------|
| 전체 구조 | Layer-based |
| UI 컴포넌트 | Atomic Design |

## 폴더 구조

```
src/
├── App.tsx                        # 홈 화면 (과목 선택 그리드)
├── main.tsx                       # 라우팅 루트 정의 (createBrowserRouter)
├── index.css                      # 전역 CSS (scrollbar-hide 포함)
├── components/
│   ├── atoms/                     # 최소 단위 UI (Button, Typography 등)
│   ├── molecules/                 # atoms 조합 단위
│   ├── organisms/                 # molecules 조합 단위
│   └── layout/                    # 레이아웃 컴포넌트 (Header, SubjectLayout 등)
├── pages/                         # 라우팅 단위 페이지
├── loaders/                       # React Router loader 함수
│   ├── examLoader.ts              # /:subject/:year 검증 + 문제 로드 (셔플 포함)
│   └── reviewLoader.ts            # /:subject/:year/review 검증 + 문제 로드 (셔플 없음)
├── hooks/                         # 커스텀 훅
├── types/                         # 타입 정의
│   ├── exam-schema.ts             # Exam 관련 타입
│   └── subject.ts                 # SubjectCode 타입
├── constants/                     # 상수
│   └── label.ts                   # subjectLabel 맵 (코드 → 한국어)
├── utils/                         # 프로젝트 전용 순수 함수
│   ├── shuffle.ts                 # Fisher-Yates 셔플
│   ├── highlight.tsx              # BLANK 타입 텍스트 하이라이트
│   ├── renderBold.tsx             # **bold** 마크다운 → <strong> 변환
│   └── computeResults.ts          # 채점 결과 계산 (정답 여부, 답안 내용)
├── lib/                           # 외부 라이브러리 설정/래핑
│   └── utils.ts                   # cn 함수 (shadcn/ui 자동 생성)
└── data/                          # 정적 JSON
    └── exam/
        └── {SUBJECT}_{year}_sports_instructor_exam.json
```

## 라우팅 구조

```
<Header>                                      # Outlet 포함 (layout route)
  /                        → <App />
  <SubjectLayout>                             # Outlet 포함 (layout route)
    /:subject              → <SubjectPage />
  </SubjectLayout>
  /:subject/:year          → <QuestionPage /> # loader: examLoader
  /:subject/:year/review   → <ReviewPage />   # loader: reviewLoader
  /*                       → <NotFound />
</Header>
```

## 컴포넌트 계층

```
Header (layout route)
├── App (/)
├── SubjectLayout (layout route)
│   └── SubjectPage (/:subject)
├── QuestionPage (/:subject/:year)
├── ReviewPage (/:subject/:year/review)
└── NotFound (/*)
```

## 상태 관리

| 상태 | 위치 | 설명 |
|------|------|------|
| `subject` | URL 파라미터 (`/:subject`) | loader에서 검증 후 loaderData로 전달 |
| `year` | URL 파라미터 (`/:subject/:year`) | loader에서 검증 후 loaderData로 전달 |
| `questions` | `loader → useLoaderData()` | JSON 로드 후 셔플된 문제 배열 (QuestionPage) / 셔플 없음 (ReviewPage) |
| `currentIndex` | `QuestionPage` (useState) | 현재 보여주는 문제 인덱스 |
| `userAnswers` | `QuizAnswerContext` | 문제 ID → 선택한 option.id |
| 채점 결과 | `navigate state` | QuestionPage → ReviewPage로 전달 (새로고침 시 소멸) |

## 데이터 흐름

```
examLoader (/:subject/:year)
  ├── subject, year 유효성 검증 → 실패 시 redirect
  └── JSON 동적 import → questions (셔플) → useLoaderData()

QuestionPage
  └── 채점 완료 → navigate("/:subject/:year/review", { state: { userAnswers } })

reviewLoader (/:subject/:year/review)
  ├── subject, year 유효성 검증 → 실패 시 redirect
  └── JSON 동적 import → questions (셔플 없음) → useLoaderData()

ReviewPage (/:subject/:year/review)
  ├── useLoaderData() 로 subject, year, questions 수신
  ├── useLocation().state 로 userAnswers 수신
  ├── state 없음 → 에러 메시지 표시
  └── computeResults(questions, userAnswers) → 결과 렌더링
```
