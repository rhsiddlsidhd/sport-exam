/**
 * 카테고리 분류용 question + view 추출 스크립트
 *
 * 사용법:
 *   node scripts/extract-questions.mjs                    # 전체 파일
 *   node scripts/extract-questions.mjs --subject SSO      # 과목 필터
 *   node scripts/extract-questions.mjs --year 2025        # 연도 필터
 *   node scripts/extract-questions.mjs --subject SSO --year 2025
 */

import fs from "fs";
import path from "path";

const DIR = "src/data/exam";

// ── CLI 인자 파싱 ──────────────────────────────────────
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const subjectFilter = get("--subject");
const yearFilter = get("--year");

// ── 파일 순회 ──────────────────────────────────────────
const files = fs.readdirSync(DIR).sort().filter((f) => {
  if (!f.endsWith(".json")) return false;
  if (subjectFilter && !f.startsWith(subjectFilter)) return false;
  if (yearFilter && !f.includes(yearFilter)) return false;
  return true;
});

if (files.length === 0) {
  console.error("해당하는 파일이 없습니다.");
  process.exit(1);
}

// ── 추출 ──────────────────────────────────────────────
const output = {};

for (const file of files) {
  const fp = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  const year = file.match(/(\d{4})/)?.[1] ?? "?";
  const key = `${data.subject}_${year}`;

  output[key] = data.questions.map((q) => ({
    n: q.questionNumber,
    q: q.question,
    ...(q.view ? { v: q.view } : {}),
    ...(q.category ? { category: q.category } : {}),
  }));
}

console.log(JSON.stringify(output, null, 2));
