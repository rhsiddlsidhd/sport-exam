/**
 * TextLine[] → string[] 마이그레이션
 * - blank 패턴이 있는 text[] → blanks[]
 * - underline: true → view.underlines: [idx]
 * - 나머지 text[] → string[]
 */

import fs from "fs";
import path from "path";

const DIR = "src/data/exam";

// ( ㉠ ), ( ), ( A ) 등 빈칸 패턴
const BLANK_PATTERN = /\(\s*[㉠-㉿ㄱ-ㅎA-Za-z가-힣\d]?\s*\)/;

function hasBlank(lines) {
  return lines.some((line) => BLANK_PATTERN.test(line));
}

let migratedFiles = 0;
let blanksConverted = 0;
let textConverted = 0;
let underlinesExtracted = 0;

for (const file of fs.readdirSync(DIR).sort()) {
  if (!file.endsWith(".json")) continue;

  const fp = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  let changed = false;

  for (const q of data.questions) {
    if (!q.view?.text) continue;

    const rawLines = q.view.text;

    // TextLine[] → string[] 변환
    const underlineIndices = [];
    const plainStrings = rawLines.map((line, idx) => {
      if (typeof line === "string") return line; // 이미 string인 경우
      if (line.underline) underlineIndices.push(idx);
      return line.text;
    });

    if (hasBlank(plainStrings)) {
      q.view.blanks = plainStrings;
      delete q.view.text;
      blanksConverted++;
    } else {
      q.view.text = plainStrings;
      if (underlineIndices.length > 0) {
        q.view.underlines = underlineIndices;
        underlinesExtracted++;
      }
      textConverted++;
    }

    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf8");
    migratedFiles++;
  }
}

console.log(`파일: ${migratedFiles}개`);
console.log(`text → blanks: ${blanksConverted}개`);
console.log(`text → string[]: ${textConverted}개`);
console.log(`underlines 추출: ${underlinesExtracted}개`);
