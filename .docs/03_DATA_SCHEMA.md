<!--
가이드: JSON 데이터의 상세 구조, 문제 유형별 정의, 채점 로직 및 데이터 타입을 명시하는 문서입니다.
데이터 관련 오류 방지를 위한 핵심 참조 문서입니다.
-->

# 03. Data Schema

## 개요

문제 데이터는 **과목 + 연도** 단위로 분리된 파일로 관리한다.

| 포맷 | 위치 | 타입 정의 |
|------|------|----------|
| 과목+연도 포맷 | `src/data/exam/{SUBJECT}_{year}_sports_instructor_exam.json` | `src/types/exam-schema.ts` |

- 과목(5) × 연도(7) = **총 35개 파일**
- 파일명 예시: `SOC_2025_sports_instructor_exam.json`

---

## 필드 명세

### SubjectExam (최상위)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `subject` | `SubjectCode` | ✅ | 과목 코드. `"SOC"` \| `"ETH"` \| `"PSY"` \| `"HIS"` \| `"PHY"` |
| `exam` | `string` | ✅ | 시험명. 예: `"2025년도 2급류 체육지도자 필기시험"` |
| `date` | `string` | ✅ | 시험일. `YYYY-MM-DD` 형식. 예: `"2025-04-26"` |
| `questions` | `ExamQuestion[]` | ✅ | 문제 목록 |

### ExamQuestion

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✅ | `"{subject}-{year}-{questionNumber}"`. 예: `"SOC-2025-1"` |
| `questionNumber` | `number` | ✅ | 시험지 내 문제 번호. 예: `1`, `2` |
| `type` | `ExamQuestionType` | ✅ | 문제 유형 (아래 참조) |
| `question` | `string` | ✅ | 문제 본문 |
| `context` | `string[] \| null` | ✅ | 지문. 문장 단위 배열. 없으면 `null` |
| `contextItems` | `ExamContextItem[] \| null` | ✅ | 보기 항목 목록. 없으면 `null` |
| `options` | `ExamOption[]` | ✅ | 4지선다 선택지 |
| `answer` | `number \| number[]` | ✅ | 정답 `option.id`. 복수 정답 시 배열 |
| `explanation` | `string` | ❌ | 정답 및 오답에 대한 해설 |

### ExamOption

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `number` | `1` ~ `4` 고정 |
| `content` | `string` | 선택지 텍스트 |

### ExamContextItem

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | `"ㄱ"` \| `"ㄴ"` \| `"가"` \| `"나"` \| `"㉠"` 등 |
| `content` | `string` | 보기 항목 텍스트 |

### ExamQuestionType

```ts
"BASIC" | "PASSAGE" | "COMBINATION_SELECT" | "COMBINATION_MATCH" | "COMBINATION_LINK"
```

---

## 파일 구조 예시

```json
{
  "subject": "SOC",
  "exam": "2025년도 2급류 체육지도자 필기시험",
  "date": "2025-04-26",
  "questions": [
    {
      "id": "SOC-2025-1",
      "questionNumber": 1,
      "type": "BASIC",
      "question": "...",
      "context": null,
      "contextItems": null,
      "options": [...],
      "answer": 2
    }
  ]
}
```

---

## 문제 유형별 규칙

| 유형 | 설명 | `context` | `contextItems` |
|------|------|-----------|----------------|
| `BASIC` | 일반 4지선다 | `null` | `null` |
| `PASSAGE` | 지문 읽고 답하기 | `string[]` | `null` |
| `COMBINATION_SELECT` | 보기 중 옳은 것 모두 고르기 | `null` | `ㄱ/ㄴ/ㄷ/ㄹ` 항목 |
| `COMBINATION_MATCH` | 보기 ㄱ/ㄴ 각각의 시나리오에 해당하는 것 연결 | `null` | `ㄱ/ㄴ` 시나리오 항목 |
| `COMBINATION_LINK` | 보기 항목(가/나/다)을 선택지 레이블(㉠/㉡/㉢)에 연결 | `null` | `가/나/다` 항목 |

### BASIC

```json
{
  "type": "BASIC",
  "context": null,
  "contextItems": null,
  "options": [
    { "id": 1, "content": "..." },
    { "id": 2, "content": "..." },
    { "id": 3, "content": "..." },
    { "id": 4, "content": "..." }
  ]
}
```

### PASSAGE

지문을 문장 단위로 분리해 `string[]` 로 저장.

```json
{
  "type": "PASSAGE",
  "context": [
    "NBA 팀의 정보를 얻으려고 인터넷 검색을 한다",
    "스포츠뉴스를 시청하며 이정후 선수가 속한 팀의 경기 결과와 리그 순위를 확인한다"
  ],
  "contextItems": null
}
```

### COMBINATION_SELECT

ㄱ/ㄴ/ㄷ/ㄹ 레이블별 독립 항목. 선택지는 레이블의 조합.

```json
{
  "type": "COMBINATION_SELECT",
  "context": null,
  "contextItems": [
    { "id": "ㄱ", "content": "노년층 스포츠 참가에 대한 중요성이 증가한다." },
    { "id": "ㄴ", "content": "프로스포츠에서 스포츠과학의 중요성이 감소한다." },
    { "id": "ㄷ", "content": "정보 기술의 발달로 스포츠 참여 형태가 다양해진다." },
    { "id": "ㄹ", "content": "탄소배출을 최소화한 친환경스포츠의 중요성이 증가한다." }
  ],
  "options": [
    { "id": 1, "content": "ㄱ" },
    { "id": 2, "content": "ㄱ, ㄴ" },
    { "id": 3, "content": "ㄱ, ㄷ, ㄹ" },
    { "id": 4, "content": "ㄴ, ㄷ, ㄹ" }
  ]
}
```

### COMBINATION_MATCH

ㄱ/ㄴ 각각이 독립된 시나리오. 하나의 긴 문단도 `content` 안에 그대로 저장.
**주의**: 문장 끝 `"다."` 는 ㄷ 레이블이 아님 — 절대 분리하지 않는다.

```json
{
  "type": "COMBINATION_MATCH",
  "context": null,
  "contextItems": [
    { "id": "ㄱ", "content": "민철이는 취미로 골프를 시작하려 했지만..." },
    { "id": "ㄴ", "content": "선영이는 요트에 흥미가 없지만 주변 지인들에게..." }
  ],
  "options": [
    { "id": 1, "content": "영향성 / 자본론" },
    { "id": 2, "content": "영향성 / 유한계급론" },
    { "id": 3, "content": "역사성 / 자본론" },
    { "id": 4, "content": "역사성 / 유한계급론" }
  ]
}
```

### COMBINATION_LINK

가/나/다 항목 각각을 선택지의 레이블(㉠/㉡/㉢)에 연결하는 유형.

```json
{
  "type": "COMBINATION_LINK",
  "context": null,
  "contextItems": [
    { "id": "가", "content": "100m 달리기 출발신호에 달려 나가는 상황" },
    { "id": "나", "content": "타자가 다양한 구질 중 직구에만 타격하는 상황" },
    { "id": "다", "content": "수비수들의 움직임에 따라 공격수가 각각 다르게 대응하는 상황" }
  ],
  "options": [
    { "id": 1, "content": "가-㉠(단순반응시간) / 나-㉡(선택반응시간) / 다-㉢(변별반응시간)" },
    { "id": 2, "content": "가-㉠ / 나-㉢ / 다-㉡" },
    { "id": 3, "content": "가-㉡ / 나-㉢ / 다-㉠" },
    { "id": 4, "content": "가-㉢ / 나-㉠ / 다-㉡" }
  ]
}
```
