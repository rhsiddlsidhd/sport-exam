<!-- 
가이드: JSON 데이터의 상세 구조, 문제 유형별 정의, 채점 로직 및 데이터 타입을 명시하는 문서입니다. 
데이터 관련 오류 방지를 위한 핵심 참조 문서입니다.
-->

# 03. Data Schema

## 개요

문제 데이터는 두 가지 포맷으로 존재한다.

| 포맷 | 위치 | 용도 |
|------|------|------|
| **과목별 포맷** | `src/data/questions/{CODE}.json` | 실제 퀴즈 앱에서 사용 |
| **시험지 포맷** | `src/data/exam/{YEAR}_*.json` | PDF 파싱 결과 원본 보관 |

---

## 과목별 포맷 (`Question[]`)

`src/types/question.ts` 기준.

### 필드 명세

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✅ | `{CODE}-{YEAR}-{번호 2자리}` 형식. 예: `SOC-2025-01` |
| `year` | `number` | ✅ | 출제 연도. 예: `2025` |
| `category` | `SubjectCode` | ✅ | 과목 코드. `SOC` \| `ETH` \| `PSY` \| `HIS` \| `PHY` |
| `type` | `QuestionType` | ✅ | 문제 유형 (아래 참조) |
| `questionText` | `string` | ✅ | 문제 본문 |
| `passage` | `string[] \| null` | ✅ | 지문 (줄 단위 배열). 없으면 `null` |
| `subItems` | `SubItem[] \| null` | ✅ | 보기 항목 목록. 없으면 `null` |
| `options` | `Option[]` | ✅ | 4지선다 선택지 (id: 1~4 고정) |
| `answer` | `number` | ✅ | 정답 `option.id` (1~4) |
| `explanation` | `string` | ✅ | 해설. 미작성 시 `""` |

### SubItem

```ts
{ id: string; content: string }
// id: "ㄱ" | "ㄴ" | "ㄷ" | "ㄹ" | "가" | "나" | "다" | "라" 등
```

### Option

```ts
{ id: number; content: string }
// id: 1 ~ 4 고정
```

### 문제 ID 규칙

```
{CATEGORY}-{YEAR}-{번호 2자리}
예: SOC-2025-01, PHY-2025-20
```

번호는 반드시 두 자리: `01`, `02`, ..., `20`.
같은 연도/과목 내 중복 ID 불가.

---

## 시험지 포맷 (`Exam`)

`src/types/exam.ts` 기준. PDF 파싱 후 생성되는 원본 포맷.

### Exam

```ts
{
  exam: string;       // 시험명. 예: "2025년도 2급류 체육지도자 필기시험"
  date: string;       // 시험일. YYYY-MM-DD 형식
  subjects: ExamSubject[];
}
```

### ExamSubject

```ts
{
  subject: SubjectCode;   // "SOC" | "ETH" | "PSY" | "HIS" | "PHY"
  subjectCode: string;    // 시험지 과목 번호. 예: "11", "22", "33"
  questions: ExamQuestion[];
}
```

### ExamQuestion

```ts
{
  id: string;                        // "{subjectCode}-{questionNumber}". 예: "11-1"
  questionNumber: number;            // 시험지 내 문제 번호
  type: ExamQuestionType;            // 문제 유형
  question: string;                  // 문제 본문
  context: string[] | null;          // 지문 (줄 단위 배열)
  contextItems: ExamContextItem[] | null;  // 보기 항목
  options: ExamOption[];             // 선택지
  answer: number;                    // 정답 option.id
}
```

### ExamOption / ExamContextItem

```ts
interface ExamOption { id: number; content: string; }         // id: 1~4
interface ExamContextItem { id: string; content: string; }    // id: "ㄱ", "나" 등
```

---

## 문제 유형 (`ExamQuestionType`)

```ts
"BASIC" | "PASSAGE" | "COMBINATION_SELECT" | "COMBINATION_MATCH" | "COMBINATION_LINK"
```

| 유형 | 설명 | `context` | `contextItems` |
|------|------|-----------|----------------|
| `BASIC` | 일반 4지선다 | `null` | `null` |
| `PASSAGE` | 지문 읽고 답하기 | `string[]` | `null` |
| `COMBINATION_SELECT` | 보기 중 옳은 것 모두 고르기 | `null` | `ㄱ/ㄴ/ㄷ/ㄹ` 항목 |
| `COMBINATION_MATCH` | 보기 ㄱ/ㄴ 각각에 해당하는 것 연결 | `null` | `ㄱ/ㄴ` 시나리오 항목 |
| `COMBINATION_LINK` | 보기 항목과 선택지를 연결 | `null` | `가/나/다` 항목 |

### PASSAGE — context 작성 규칙

지문을 `"."` 기준으로 분리해 `string[]` 로 저장. 한 문장도 배열로 감싼다.

```json
"context": [
  "NBA 팀의 정보를 얻으려고 인터넷 검색을 한다",
  "스포츠뉴스를 시청하며 이정후 선수가 속한 팀의 경기 결과와 리그 순위를 확인한다"
],
"contextItems": null
```

### COMBINATION_SELECT — contextItems 작성 규칙

ㄱ/ㄴ/ㄷ/ㄹ 레이블별로 독립된 항목. 선택지는 이 레이블의 조합.

```json
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
```

### COMBINATION_MATCH — contextItems 작성 규칙

ㄱ/ㄴ 각각이 독립된 시나리오나 사례. 하나의 긴 문단도 `content` 안에 그대로 저장.
**주의**: 문장 끝 `"다."` 는 ㄷ 레이블이 아님 — 절대 분리하지 않는다.

```json
"context": null,
"contextItems": [
  { "id": "ㄱ", "content": "민철이는 취미로 골프를 시작하려 했지만..." },
  { "id": "ㄴ", "content": "선영이는 요트에 흥미가 없지만 주변 지인들에게..." }
]
```

시나리오가 없고 단일 표/개념 설명인 경우: `context: [string]`, `contextItems: null`.

### COMBINATION_LINK — contextItems 작성 규칙

가/나/다 항목 각각을 선택지의 레이블(㉠/㉡/㉢ 등)에 연결하는 유형.

```json
"contextItems": [
  { "id": "가", "content": "100m 달리기 출발신호에 달려 나가는 상황" },
  { "id": "나", "content": "타자가 다양한 구질 중 직구에만 타격하는 상황" },
  { "id": "다", "content": "수비수들의 움직임에 따라 공격수가 각각 다르게 대응하는 상황" }
],
"options": [
  { "id": 1, "content": "가-㉠(단순반응시간) / 나-㉡(선택반응시간) / 다-㉢(변별반응시간)" },
  { "id": 2, "content": "가-㉠ / 나-㉢ / 다-㉡" }
]
```

---

## Claude AI PDF 파싱 프롬프트 요약

PDF 기출문제를 JSON으로 변환할 때 AI에게 전달할 핵심 지침:

```
- subject: 과목명 → SubjectCode (SOC/ETH/PSY/HIS/PHY)
- type: 한국어 유형 → ExamQuestionType (BASIC/PASSAGE/COMBINATION_SELECT/COMBINATION_MATCH/COMBINATION_LINK)
- options: string[] → { id: number (1~4), content: string }[]
- context: 지문이 있으면 "."로 split → string[], 없으면 null
- contextItems: 레이블(ㄱ/ㄴ/가/나 등) 기준으로 분리 → { id, content }[], 없으면 null
- answer: 정답 번호 → 해당 option.id (1~4)
- COMBINATION_MATCH: "다."는 레이블 ㄷ이 아님 — 문장 끝임. 분리 금지
```
