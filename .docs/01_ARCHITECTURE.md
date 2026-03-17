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
├── main.tsx                       # 라우팅 루트 정의
├── index.css                      # 전역 CSS (scrollbar-hide 포함)
├── components/
│   ├── atoms/                     # 최소 단위 UI (Button, Typography 등)
│   ├── molecules/                 # atoms 조합 단위
│   ├── organisms/                 # molecules 조합 단위
│   └── layout/                    # 레이아웃 컴포넌트 (Header, SubjectLayout 등)
├── pages/                         # 라우팅 단위 페이지
├── hooks/                         # 커스텀 훅
├── types/                         # 타입 정의
│   ├── exam-schema.ts             # Exam 관련 타입
│   └── subject.ts                 # SubjectCode 타입
├── constants/                     # 상수
│   └── label.ts                   # subjectLabel 맵 (코드 → 한국어)
└── data/                          # 정적 JSON
    └── exam/
        └── {SUBJECT}_{year}_sports_instructor_exam.json
```

## 라우팅 구조

```
<Header>                           # Outlet 포함 (layout route)
  /                  → <App />
  <SubjectLayout>                  # Outlet 포함 (layout route)
    /:subject        → <SubjectPage />
      /:subject/:year → <QuestionPage />
  </SubjectLayout>
  /review            → <ReviewPage />
  /notes             → <NotesPage />  # 오답노트
  /*                 → <NotFound />
</Header>
```

## 컴포넌트 계층

```
Header (layout route)
├── App (/)
├── SubjectLayout (layout route)
│   ├── SubjectPage (/:subject)
│   └── QuestionPage (/:subject/:year)
├── ReviewPage (/review)
├── NotesPage (/notes)
└── NotFound (/*)
```

## 상태 관리

| 상태 | 위치 | 설명 |
|------|------|------|
| `subject` | URL 파라미터 (`/:subject`) | SubjectLayout에서 추출 |
| `year` | URL 파라미터 (`/:subject/:year`) | QuestionPage에서 추출 |
| `questions` | `QuestionPage` (useState) | JSON 로드 후 셔플된 문제 배열 |
| `currentIndex` | `QuestionPage` (useState) | 현재 보여주는 문제 인덱스 |
| `userAnswers` | `QuestionPage` (useState) | 문제 ID → 선택한 option.id |
| 채점 결과 | `navigate state` | QuestionPage → ReviewPage로 전달 (새로고침 시 소멸) |
| 오답 데이터 | `localStorage` | ReviewPage에서 저장 → NotesPage에서 읽기 |
| `selectedDate` | `NotesPage` (useState) | 오답노트에서 선택된 복습 날짜 필터 |

## 데이터 흐름

```
QuestionPage
  └── 채점 완료 → navigate("/review", { state: { year, subject, questions, userAnswers } })

ReviewPage (/review)
  ├── useLocation().state 로 수신
  ├── state 없음 → navigate("/") 리다이렉트
  ├── 결과 카드 목록 렌더링
  └── 오답 북마크 버튼 클릭 → localStorage 저장

NotesPage (/notes)
  └── localStorage 읽기 → 저장된 오답 목록 렌더링
```
