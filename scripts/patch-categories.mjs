/**
 * 카테고리 패치 스크립트
 *
 * 사용법:
 *   node scripts/patch-categories.mjs --subject SSO --year 2025 --categories '{"1":"스포츠사회학 개론","2":"스포츠와 교육",...}'
 *
 * --categories : questionNumber(문자열 키) → category 매핑 JSON
 * --dry-run    : 실제 파일 변경 없이 결과만 출력
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
const subject = get("--subject");
const year = get("--year");
const categoriesRaw = get("--categories");
const dryRun = args.includes("--dry-run");

if (!subject || !year || !categoriesRaw) {
  console.error("사용법: node scripts/patch-categories.mjs --subject <코드> --year <연도> --categories '<JSON>'");
  process.exit(1);
}

let mapping;
try {
  mapping = JSON.parse(categoriesRaw);
} catch {
  console.error("--categories 값이 올바른 JSON이 아닙니다.");
  process.exit(1);
}

// ── 대상 파일 탐색 ─────────────────────────────────────
const file = fs.readdirSync(DIR).find(
  (f) => f.startsWith(subject) && f.includes(year) && f.endsWith(".json")
);

if (!file) {
  console.error(`파일을 찾을 수 없습니다: ${subject}_${year}_*.json`);
  process.exit(1);
}

const fp = path.join(DIR, file);
const data = JSON.parse(fs.readFileSync(fp, "utf8"));

// ── 패치 ──────────────────────────────────────────────
let patched = 0;
let skipped = 0;

for (const q of data.questions) {
  const category = mapping[String(q.questionNumber)];
  if (!category) {
    skipped++;
    continue;
  }
  if (q.category === category) {
    skipped++;
    continue;
  }
  q.category = category;
  patched++;
}

// ── 결과 출력 ──────────────────────────────────────────
console.log(`파일: ${file}`);
console.log(`패치: ${patched}문제 / 스킵: ${skipped}문제`);

if (dryRun) {
  console.log("\n[dry-run] 파일을 변경하지 않았습니다.");
  console.log(JSON.stringify(data.questions.map(q => ({ n: q.questionNumber, category: q.category })), null, 2));
} else {
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf8");
  console.log("✅ 저장 완료");
}
