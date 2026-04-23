/**
 * 해설(explanation) 품질 점검 스크립트
 *
 * 체크 항목:
 * 1. 선택지 번호 언급 금지 위반 (1번, (1), ① 등)
 * 2. explanation 존재하나 correct 필드 누락
 * 3. [추론 불가] 처리된 항목
 * 4. explanation 미작성 현황 (과목별 요약)
 */

import fs from "fs";
import path from "path";

const DIR = "src/data/exam";

const NUMBER_PATTERN =
  /[①②③④]|[1-4]번|\([1-4]\)|선택지\s*[1-4]|답지\s*[1-4]/;

const results = {
  numberViolations: [],
  missingCorrect: [],
  unresolvable: [],
  missingExplanation: {},
};

for (const file of fs.readdirSync(DIR).sort()) {
  if (!file.endsWith(".json")) continue;

  const fp = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  const subject = data.subject;
  const year = file.match(/(\d{4})/)?.[1] ?? "?";
  const label = `${subject} ${year}`;

  let missing = 0;

  for (const q of data.questions) {
    const loc = `${label} Q${q.questionNumber}`;

    if (!q.explanation) {
      missing++;
      continue;
    }

    const { correct, distractors, summary } = q.explanation;

    // 1. correct 누락
    if (!correct) {
      results.missingCorrect.push(loc);
      continue;
    }

    // 2. 추론 불가
    if (correct.includes("[추론 불가]")) {
      results.unresolvable.push(loc);
    }

    // 3. 번호 언급 위반 검사
    const textsToCheck = [
      { field: "correct", text: correct },
      ...(distractors ?? []).map((d, i) => ({
        field: `distractors[${i}].reason`,
        text: d.reason,
      })),
      ...(summary ? [{ field: "summary", text: summary }] : []),
    ];

    for (const { field, text } of textsToCheck) {
      if (NUMBER_PATTERN.test(text)) {
        results.numberViolations.push({ loc, field, excerpt: text.slice(0, 60) });
      }
    }
  }

  if (missing > 0) {
    results.missingExplanation[label] = missing;
  }
}

// ── 출력 ──────────────────────────────────────────

const total = Object.values(results.missingExplanation).reduce(
  (a, b) => a + b,
  0
);

console.log("=".repeat(56));
console.log("  해설 품질 점검 결과");
console.log("=".repeat(56));

// 1. 번호 언급 위반
console.log(`\n[1] 선택지 번호 언급 위반: ${results.numberViolations.length}건`);
for (const { loc, field, excerpt } of results.numberViolations) {
  console.log(`  ✗ ${loc} / ${field}`);
  console.log(`    → "${excerpt}..."`);
}

// 2. correct 누락
console.log(`\n[2] correct 필드 누락: ${results.missingCorrect.length}건`);
for (const loc of results.missingCorrect) {
  console.log(`  ✗ ${loc}`);
}

// 3. 추론 불가
console.log(`\n[3] 추론 불가 처리: ${results.unresolvable.length}건`);
for (const loc of results.unresolvable) {
  console.log(`  △ ${loc}`);
}

// 4. 미작성 현황
console.log(`\n[4] 해설 미작성: 총 ${total}문제`);
for (const [label, count] of Object.entries(results.missingExplanation)) {
  console.log(`  - ${label}: ${count}문제`);
}

console.log("\n" + "=".repeat(56));

const errorCount =
  results.numberViolations.length + results.missingCorrect.length;
if (errorCount > 0) {
  console.log(`  ❌ 오류 ${errorCount}건 발견`);
  process.exit(1);
} else {
  console.log("  ✅ 오류 없음");
}
console.log("=".repeat(56));
