<!--
가이드: 컴포넌트 생성 원칙과 기준을 정의합니다.
새 컴포넌트 생성 전 반드시 이 문서를 확인합니다.
-->

# 04. Component Guide

## 컴포넌트 생성 원칙

1. `src/components/` 하위에 재사용 가능한 컴포넌트가 있는지 먼저 확인
2. `src/types/` 에서 재사용 가능한 타입 확인 후 Props 확장
3. 없을 때만 새로 생성

---

## atoms 설계 기준

> ⚠️ **절대 규칙: `src/components/atoms/` 하위 파일은 절대 수정하지 않는다.**
> shadcn/ui가 자동 생성한 파일이며, 업그레이드 시 덮어쓰여진다.
> 스타일 변경이 필요하면 반드시 `className` 오버라이드로 처리한다.

- shadcn/ui 컴포넌트 우선 사용. 공식 문서 참조
- 스타일 변경은 `className` 오버라이드로 처리
- 자체 상태 없음
- 커스텀 atom 은 `Typography.tsx` 가 유일하며 원시 HTML 태그 대신 사용

## Typography 사용 가이드

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

---

## layout 설계 기준

- 페이지 레이아웃 구조 담당. `components/layout/` 에 위치
- `<Outlet />` 포함 가능 (React Router layout route)
- 비즈니스 로직 포함 금지
- 예시: `Header`, `SubjectLayout`

---

## molecules 설계 기준

- 특정 기능에 종속된 로직 하드코딩 금지 — 범용성 유지
- 부모가 결정할 렌더링은 `children` 또는 옵셔널 props 로 주입
  ```tsx
  // ❌ molecules 내부에서 결정
  {selected && <IconBadge><Check /></IconBadge>}

  // ✅ 부모에서 children 으로 주입
  <OptionButton ...>{selected && <IconBadge><Check /></IconBadge>}</OptionButton>
  ```
- `React.memo` 적용
- 확장 가능성을 고려한 옵셔널 props 설계

---

## organisms 설계 기준

- molecules/atoms 조합으로 완결된 독립 UI 블록
- 도메인 특화 가능 — 범용성 불필요
- 비즈니스 로직 포함 금지 — 데이터 처리는 `hooks/` 또는 `pages/` 에서 담당
- 상태 관리 기준:

| 상황 | 위치 |
|------|------|
| 단순 UI 변경 (토글, 열고닫기 등) | 컴포넌트 내 `useState` |
| organisms 내 여러 molecules 가 공유하는 상태 | organisms 에서 `Context API` + Provider |
| 페이지 단위 또는 여러 organisms 가 공유하는 상태 | 전역 상태 관리 또는 브라우저 저장소 |
