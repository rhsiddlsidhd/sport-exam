<!--
가이드: JSON 데이터의 상세 구조, 문제 유형별 정의, 채점 로직 및 데이터 타입을 명시하는 문서입니다.
데이터 관련 오류 방지를 위한 핵심 참조 문서입니다.
-->

# 03. Data Schema

## 개요

문제 데이터는 **과목 + 연도** 단위로 분리된 파일로 관리하며, **채점 로직(Logic)**과 **시각적 형태(View)**를 분리하여 설계한다.

| 포맷 | 위치 | 타입 정의 |
|------|------|----------|
| 과목+연도 포맷 | `src/data/exam/{SUBJECT}_{year}_sports_instructor_exam.json` | `src/types/exam-schema.ts` |

---

## 필드 명세

### SubjectExam (최상위)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `subject` | `SubjectCode` | ✅ | 과목 코드. `"SSO"` \| `"SET"` \| `"SPS"` \| `"KHS"` \| `"EPH"` |
| `exam` | `string` | ✅ | 시험명. 예: `"2025년도 2급류 체육지도자 필기시험"` |
| `date` | `string` | ✅ | 시험일. `YYYY-MM-DD` 형식 |
| `questions` | `ExamQuestion[]` | ✅ | 문제 목록 |

---

### ExamQuestion (문제 단위)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✅ | 문제 고유 ID. `"{SUBJECT}-{YEAR}-{문제번호}"` 형식. 예: `"SSO-2023-1"` |
| `questionNumber` | `number` | ✅ | 문제 번호. 예: `1` |
| `logicType` | `QuestionLogicType` | ✅ | 채점 로직 타입 |
| `question` | `string` | ✅ | 문제 본문 |
| `view` | `ExamView` | ✅ | 보기 영역 데이터 (`type: "NONE"`이면 나머지 필드 불필요) |
| `options` | `ExamOption[]` | ✅ | 선택지 목록 |
| `answer` | `number \| number[]` | ✅ | 정답 선택지 id. 단일 정답은 숫자, 복수 정답은 배열 |
| `explanation` | `ExamExplanation` | ❌ | 해설 (추출 시 생략) |

### ExamOption (선택지)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `number` | ✅ | 선택지 번호. 예: `1`, `2`, `3`, `4` |
| `content` | `string` | ✅ | 선택지 텍스트 |

---

## 세부 타입 정의

### QuestionLogicType (채점 로직)
- `SINGLE_CHOICE`: 일반적인 4지선다 (정답 1개)
- `MULTIPLE_CHOICE`: 중복 정답 허용 (여러 정답 후보 중 하나만 선택해도 정답으로 인정)
- `MATCHING`: 항목 간 연결 (가-㉠ 등)
- `ORDERING`: 발생 순서 나열

### QuestionViewType (시각적 형태)
- `NONE`: 보기 영역 없음
- `PASSAGE`: 지문 서술형 (텍스트 블록)
- `ITEMIZED`: 항목 나열형 (ㄱ, ㄴ, ㄷ 리스트)
- `BLANK`: 빈칸/마커형 (텍스트 내 (ㄱ), (ㄴ) 포함 및 강조 필요)
- `VISUAL`: 시각 자료형 (이미지, 도표 중심)
- `COMPOSITE`: 복합형 (지문/이미지 + 항목 리스트 조합)
- `TABLE`: 표 데이터형 (병합 헤더, ○/× 기호 포함)

### PassageLine (지문 한 줄)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `text` | `string` | ✅ | 줄 텍스트 |
| `underline` | `boolean` | ❌ | 밑줄 여부 (기본 `false`) |

### ExamViewItem (항목 리스트 한 항목)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `label` | `string` | ✅ | 항목 기호. 예: `"ㄱ"`, `"㉠"`, `"가"` |
| `content` | `string[]` | ✅ | 항목 내용 (줄바꿈 단위 배열) |

### ExamView (보기 영역 데이터)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `QuestionViewType` | ✅ | 보기 렌더링 타입 |
| `passage` | `PassageLine[]` | ❌ | 지문 데이터 (줄바꿈 단위 배열) |
| `items` | `ExamViewItem[]` | ❌ | 기호 기반 항목 데이터 |
| `media` | `ExamMedia` | ❌ | 이미지 또는 도표 정보 |
| `table` | `ExamTable` | ❌ | 표 데이터 (TABLE 타입에서 사용) |

### ExamTable / ExamTableRow / ExamTableCell (표 데이터)

**ExamTable**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `caption` | `string` | ❌ | 표 제목 (접근성용, `sr-only` 처리) |
| `headers` | `ExamTableRow[]` | ✅ | 헤더 행 목록 (2단 헤더는 2개 행) |
| `rows` | `ExamTableRow[]` | ✅ | 데이터 행 목록 |

**ExamTableRow**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `cells` | `ExamTableCell[]` | ✅ | 셀 목록 |

**ExamTableCell**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `content` | `string` | ✅ | 셀 내용 (`○`, `×`, 또는 텍스트) |
| `colSpan` | `number` | ❌ | 병합 열 수 (기본 1) |
| `rowSpan` | `number` | ❌ | 병합 행 수 (기본 1) |
| `isHeader` | `boolean` | ❌ | `<th>` 여부 |

> **렌더링 규칙**: `○` → 초록(text-green-600), `×` → 빨강(text-red-500), `㉠` 같은 기호 → primary 색상 강조

---

### ExamExplanation (해설 데이터)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `correct` | `string` | ✅ | 정답이 왜 맞는지 이론적 근거 서술. `**bold**` 마크다운 사용 가능 |
| `distractors` | `ExamDistractor[]` | ❌ | 오답 분석 (학습에 도움이 될 때만) |
| `summary` | `string` | ❌ | 핵심 정리 (개념 비교·확장이 필요할 때만) |

**ExamDistractor**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `term` | `string` | ✅ | 오답 선택지의 핵심 용어 또는 개념명 |
| `reason` | `string` | ✅ | 해당 선택지가 오답인 이유 |

> **주의**: 선택지 번호(`1번`, `(1)` 등) 절대 사용 금지. 반드시 용어·키워드를 직접 인용한다.

---

### ExamMedia (시각 매체 데이터)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `"IMAGE" \| "CHART" \| "SVG"` | ✅ | 매체 유형 |
| `url` | `string` | ✅ | `public/` 폴더 기준 절대 경로 |
| `alt` | `string` | ❌ | 이미지 설명 (웹 접근성) |

---

## 리소스 관리 규칙

### 이미지 (Images)
- **저장 위치**: `public/exam/`
- **파일명 규칙**: `{SUBJECT}_{YEAR}_{QuestionNumber}.png`
  - 예: `EPH-2024-17.webp`
- **데이터 입력**: `/exam/{FILENAME}` 형식으로 입력
  - 예: `"url": "/exam/EPH-2024-17.webp"`

---

## 파일 구조 예시

### 1. 표 데이터형 (TABLE - 2단 병합 헤더 + ○/× 셀)
```json
{
  "logicType": "MATCHING",
  "question": "운동 자극에 관한 신체 내 기관(organs)과 기능에 대한 설명이다. ㉠~㉢에 해당하는 것으로 옳은 것은?",
  "view": {
    "type": "TABLE",
    "table": {
      "caption": "기관별 기능 여부 표",
      "headers": [
        {
          "cells": [
            { "content": "기능", "rowSpan": 2, "isHeader": true },
            { "content": "기관", "colSpan": 3, "isHeader": true }
          ]
        },
        {
          "cells": [
            { "content": "뇌하수체", "isHeader": true },
            { "content": "부신", "isHeader": true },
            { "content": "㉠", "isHeader": true }
          ]
        }
      ],
      "rows": [
        {
          "cells": [
            { "content": "고온다습한 환경에서 운동 중 체액량 조절을 위한 호르몬을 분비한다" },
            { "content": "㉡" },
            { "content": "○" },
            { "content": "×" }
          ]
        }
      ]
    }
  },
  "answer": 1
}
```

> **rowSpan 주의**: `rowSpan: 2`인 셀이 있으면 다음 헤더 행의 cells에서 해당 열을 생략해야 한다.

---

### 2. 복합형 (COMPOSITE - 이미지 + 항목 리스트)
```json
{
  "logicType": "SINGLE_CHOICE",
  "question": "〈표〉는 참가자의 폐환기 검사 결과이다. 〈보기〉에서 옳은 것을 모두 고른 것은?",
  "view": {
    "type": "COMPOSITE",
    "media": {
      "type": "IMAGE",
      "url": "/exam/EPH-2024-17.webp",
      "alt": "폐환기 검사 결과 데이터 표"
    },
    "items": [
      { "label": "ㄱ", "content": ["세 참가자의 분당환기량은 동일하다."] },
      { "label": "ㄴ", "content": ["다영의 폐포 환기량은 분당 6L/min이다."] }
    ]
  },
  "answer": 4
}
```
