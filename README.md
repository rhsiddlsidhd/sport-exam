# 스포츠지도사 기출문제 풀이

생활체육지도자 2급 필기시험 기출문제를 과목별·연도별로 풀어볼 수 있는 모바일 우선 웹 애플리케이션입니다.

**→ [sport-exam.vercel.app](https://sport-exam.vercel.app/)**

---

## 기능

- 5개 과목 선택 (스포츠사회학 · 스포츠윤리 · 스포츠심리학 · 한국체육사 · 운동생리학)
- 연도별 기출문제 (2019 ~ 2025)
- 선택지 셔플 + 진행 현황 표시
- 채점 결과 및 문제별 해설 리뷰

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript + Vite |
| 라우팅 | React Router v7 |
| 스타일링 | Tailwind CSS v4 + shadcn/ui |
| 배포 | Vercel |

## 로컬 실행

```bash
npm install
npm run dev
```

## 문서

| 문서 | 내용 |
|------|------|
| [00. Project Overview](.docs/00_PROJECT_OVERVIEW.md) | 프로젝트 목적, 기능, 과목 코드 |
| [01. Architecture](.docs/01_ARCHITECTURE.md) | 폴더 구조, 라우팅, 데이터 흐름 |
| [02. Conventions](.docs/02_CONVENTIONS.md) | 코딩 스타일, 네이밍, TypeScript 규칙 |
| [03. Data Schema](.docs/03_DATA_SCHEMA.md) | JSON 데이터 구조 및 타입 정의 |
| [04. Component Guide](.docs/04_COMPONENT_GUIDE.md) | 컴포넌트 설계 기준 |
| [05. PDF Conversion Guide](.docs/05_PDF_CONVERSION_GUIDE.md) | PDF → JSON 변환 판단 사례 |
