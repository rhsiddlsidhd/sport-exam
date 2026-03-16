import { INITIAL_YEAR } from "./constants/number";
import { TypographyH3, TypographySmall } from "./components/atoms/Typography";
import SelectableCard from "./components/molecules/SelectableCard";

function App() {
  const years = Array.from({ length: 7 }, (_, i) => INITIAL_YEAR - i);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 text-left">
        <TypographyH3 className="font-black text-foreground mb-1">
          연도를 선택하세요
        </TypographyH3>
        <TypographySmall className="text-muted-foreground">
          응시하실 연도의 기출문제를 선택하세요.
        </TypographySmall>
      </div>

      <main className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {years.map((year) => (
          <SelectableCard key={year} to={`/${year}`} className="min-h-20">
            <span className="text-sm font-bold text-foreground group-hover:text-primary">
              {year}년
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
}

export default App;
