<!-- 
가이드: 기술 스택, 폴더 구조, 데이터 흐름 및 핵심 라이브러리 구성을 설명하는 문서입니다. 
AI가 파일 생성 위치와 모듈 간 관계를 파악하는 용도로 사용합니다.
-->

# 01. Architecture

## 폴더 구조

```
src/
├── App.tsx                        # 홈 화면 (과목 선택 그리드)
├── main.tsx                       # 라우팅 루트 정의
├── index.css                      # 전역 CSS (scrollbar-hide 포함)
├── components/
│   ├── atoms/
│   │   └── Typography.tsx         # 재사용 타이포그래피 컴포넌트 모음
│   ├── layout/
│   │   ├── Header.tsx             # 공통 헤더 + 푸터 (퀴즈 모드 시 숨김)
│   │   └── Subjectlayout.tsx      # 과목 페이지 공통 레이아웃 (Outlet 감싸기)
│   ├── subject/
│   │   ├── YearSelector.tsx       # 연도 선택 버튼 목록
│   │   └── QuestionSession.tsx    # 문제 풀기 세션 (로딩/에러/풀기/채점)
│   └── QuestionCard.tsx           # 단일 문제 카드 (선택지 포함)
├── pages/
│   ├── Subject.tsx                # /:sid 페이지 (YearSelector ↔ QuestionSession 전환)
│   ├── Result.tsx                 # /result 페이지 (채점 결과)
│   └── NotFound.tsx               # /* 404 페이지
├── types/
│   ├── subject.ts                 # SubjectCode 타입
│   ├── question.ts                # Question 타입 (기존 문제 포맷)
│   └── exam.ts                    # ExamQuestion 타입 (새 시험지 포맷)
├── constants/
│   └── label.ts                   # subjectLabel 맵 (코드 → 한국어)
└── data/
    ├── questions/
    │   ├── SOC.json               # 과목별 문제 (기존 포맷)
    │   ├── ETH.json
    │   ├── PSY.json
    │   ├── HIS.json
    │   └── PHY.json
    └── exam/
        └── 2025_sports_instructor_exam.json  # 시험지 단위 포맷 (새 포맷)
```

## 라우팅 구조

```
<Header>                           # Outlet 포함 (layout route)
  /                  → <App />
  <Subjectlayout>                  # Outlet 포함 (layout route)
    /:sid            → <Subject />
  /result            → <Result />
  /*                 → <NotFound />
```

## 컴포넌트 계층

```
Header (layout route)
└── App (/)
└── Subjectlayout (layout route)
    └── Subject (/:sid)
        ├── YearSelector  (year 미선택 시)
        └── QuestionSession (year 선택 시)
            └── QuestionCard (현재 문제 1개)
└── Result (/result)
```

## 데이터 흐름

```
main.tsx
  └── Subjectlayout
        ├── useParams() → sid 추출 + 유효성 검사
        └── <Outlet context={sid} />  → Subject에서 useOutletContext<SubjectCode>() 로 수신

Subject (/sid?year=...)
  ├── useSearchParams() → year 상태 관리
  ├── year 없음 → YearSelector (onYearSelect → setSearchParams)
  └── year 있음 → QuestionSession (year prop 전달)
        ├── dynamic import(`../../data/questions/${sid}.json`)
        ├── Fisher-Yates shuffle → options 순서 랜덤화
        ├── userAnswers: Record<questionId, optionId>
        └── 채점 완료 → navigate("/result", { state: { sid, year, questions, userAnswers } })

Result (/result)
  └── useLocation().state → { sid, year, questions, userAnswers }
      ├── 유효성 검사 실패 → navigate("/")
      └── 다시 풀기 → navigate(`/${sid}?year=${year}`)
```

## 상태 관리

| 상태 | 위치 | 설명 |
|------|------|------|
| `selectedYear` | `Subject` (useSearchParams) | URL 파라미터로 유지 |
| `questions` | `QuestionSession` (useState) | JSON 로드 후 셔플된 문제 배열 |
| `currentIndex` | `QuestionSession` (useState) | 현재 보여주는 문제 인덱스 |
| `userAnswers` | `QuestionSession` (useState) | 문제 ID → 선택한 option.id |
| `sid` | `Subjectlayout` → `useOutletContext` | 유효성 검사된 과목 코드 |
