import fs from 'fs';
import path from 'path';

const dir = 'src/data/exam';
const counts = {};
const samples = {};

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.json')) continue;
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.view) continue;
    const t = q.view.type;
    counts[t] = (counts[t] || 0) + 1;
    if (!samples[t]) samples[t] = q.view;
  }
}

console.log('=== 타입별 개수 ===');
console.log(JSON.stringify(counts, null, 2));
console.log('\n=== 타입별 샘플 ===');
for (const [t, v] of Object.entries(samples)) {
  console.log('\n[' + t + '] keys:', Object.keys(v).join(', '));
  console.log(JSON.stringify(v, null, 2));
}
