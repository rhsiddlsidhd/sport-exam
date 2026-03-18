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
| `subject` | `SubjectCode` | ✅ | 과목 코드. `"SOC"` \| `"ETH"` \| `"PSY"` \| `"HIS"` \| `"PHY"` |
| `exam` | `string` | ✅ | 시험명. 예: `"2025년도 2급류 체육지도자 필기시험"` |
| `date` | `string` | ✅ | 시험일. `YYYY-MM-DD` 형식 |
| `questions` | `ExamQuestion[]` | ✅ | 문제 목록 |

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

### ExamView (보기 영역 데이터)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `QuestionViewType` | ✅ | 보기 렌더링 타입 |
| `passage` | `string[]` | ❌ | 지문 데이터 (줄바꿈 단위 배열) |
| `items` | `ExamViewItem[]` | ❌ | 기호 기반 항목 데이터 ({ label, content }) |
| `media` | `ExamMedia` | ❌ | 이미지 또는 도표 정보 |

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
  - 예: `PHY_2024_17.png`
- **데이터 입력**: `/exam/{FILENAME}` 형식으로 입력
  - 예: `"url": "/exam/PHY_2024_17.png"`

---

## 파일 구조 예시

### 1. 복합형 (COMPOSITE - 이미지 + 항목 리스트)
```json
{
  "logicType": "SINGLE_CHOICE",
  "question": "〈표〉는 참가자의 폐환기 검사 결과이다. 〈보기〉에서 옳은 것을 모두 고른 것은?",
  "view": {
    "type": "COMPOSITE",
    "media": {
      "type": "IMAGE",
      "url": "/exam/PHY_2024_17.png",
      "alt": "폐환기 검사 결과 데이터 표"
    },
    "items": [
      { "label": "ㄱ", "content": "세 참가자의 분당환기량은 동일하다." },
      { "label": "ㄴ", "content": "다영의 폐포 환기량은 분당 6L/min이다." }
    ]
  },
  "answer": 4
}
```
