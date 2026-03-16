import { INITIAL_YEAR } from "./constants/number";
import SelectableCard from "./components/molecules/SelectableCard";

function App() {
  const years = Array.from({ length: 7 }, (_, i) => INITIAL_YEAR - i);

  return (
    <div className="p-5">
      {/* 헤더 섹션 */}
      <div className="mb-8 pt-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          기출문제 연도 선택
        </span>
        <h2 className="text-2xl font-black text-foreground tracking-tight leading-tight mb-1">
          어느 연도를
          <br />
          풀어볼까요?
        </h2>
        <p className="text-sm text-muted-foreground">
          총 {years.length}개년 기출문제 수록
        </p>
      </div>

      {/* 연도 그리드 — 최신 연도 강조 */}
      <main className="grid grid-cols-2 gap-3">
        {years.map((year) => (
          <SelectableCard key={year} to={`/${year}`} className="min-h-16">
            <span className="text-base font-black text-foreground group-hover:text-primary">
              {year}년
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
}

export default App;
