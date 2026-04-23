/**
 * 번호 언급 위반을 A/B 유형으로 분류
 *
 * A 유형: (1) 이 1회만 등장 → 번호만 제거하면 문장이 자연스러움
 * B 유형: (1)(2)... 가 2회 이상 등장 → 구조 자체가 잘못, 재작성 필요
 */

import fs from "fs";
import path from "path";

const DIR = "src/data/exam";
const NUMBER_PATTERN = /[①②③④]|[1-4]번|\([1-4]\)|선택지\s*[1-4]|답지\s*[1-4]/g;

const typeA = [];
const typeB = [];

for (const file of fs.readdirSync(DIR).sort()) {
  if (!file.endsWith(".json")) continue;

  const data = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
  const year = file.match(/(\d{4})/)?.[1] ?? "?";
  const label = `${data.subject} ${year}`;

  for (const q of data.questions) {
    if (!q.explanation) continue;

    const { correct, distractors, summary } = q.explanation;
    const loc = `${label} Q${q.questionNumber}`;

    const textsToCheck = [
      { field: "correct", text: correct ?? "" },
      ...(distractors ?? []).map((d, i) => ({
        field: `distractors[${i}].reason`,
        text: d.reason,
      })),
      ...(summary ? [{ field: "summary", text: summary }] : []),
    ];

    for (const { field, text } of textsToCheck) {
      const matches = text.match(NUMBER_PATTERN);
      if (!matches) continue;

      const entry = { loc, field, text };
      if (matches.length >= 2) {
        typeB.push(entry);
      } else {
        typeA.push(entry);
      }
    }
  }
}

console.log("=".repeat(60));
console.log(`  A 유형 (번호 단순 제거 가능): ${typeA.length}건`);
console.log("=".repeat(60));
for (const { loc, field, text } of typeA) {
  console.log(`  ${loc} / ${field}`);
  console.log(`  → "${text.slice(0, 80)}"`);
  console.log();
}

console.log("=".repeat(60));
console.log(`  B 유형 (재작성 필요): ${typeB.length}건`);
console.log("=".repeat(60));
for (const { loc, field, text } of typeB) {
  console.log(`  ${loc} / ${field}`);
  console.log(`  → "${text.slice(0, 80)}"`);
  console.log();
}
