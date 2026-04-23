/**
 * A 유형 위반 자동 수정: 번호 패턴만 제거
 * (1회만 등장하는 (1)~(4), ①~④, 1번~4번)
 */

import fs from "fs";
import path from "path";

const DIR = "src/data/exam";
const NUMBER_PATTERN = /\s*[①②③④]|\s*[1-4]번|\s*\([1-4]\)|\s*선택지\s*[1-4]|\s*답지\s*[1-4]/g;

function countMatches(text) {
  return (text.match(NUMBER_PATTERN) ?? []).length;
}

function stripNumbers(text) {
  return text.replace(NUMBER_PATTERN, "").replace(/\s{2,}/g, " ").trim();
}

let fixed = 0;

for (const file of fs.readdirSync(DIR).sort()) {
  if (!file.endsWith(".json")) continue;

  const fp = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  let changed = false;

  for (const q of data.questions) {
    if (!q.explanation) continue;

    const { correct, distractors, summary } = q.explanation;

    // correct
    if (correct && countMatches(correct) === 1) {
      q.explanation.correct = stripNumbers(correct);
      changed = true;
      fixed++;
    }

    // distractors
    for (const d of distractors ?? []) {
      if (countMatches(d.reason) === 1) {
        d.reason = stripNumbers(d.reason);
        changed = true;
        fixed++;
      }
    }

    // summary
    if (summary && countMatches(summary) === 1) {
      q.explanation.summary = stripNumbers(summary);
      changed = true;
      fixed++;
    }
  }

  if (changed) fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf8");
}

console.log(`A 유형 수정 완료: ${fixed}건`);
