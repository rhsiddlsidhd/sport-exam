import { useOutletContext } from "react-router";
import { SUBJECT_CODES } from "../types/subject";
import { subjectLabel } from "../constants/label";
import { TypographyH3, TypographySmall } from "../components/atoms/Typography";
import SelectableCard from "../components/molecules/SelectableCard";

const YearPage = () => {
  const year = useOutletContext<string>();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 text-left">
        <TypographyH3 className="font-black text-foreground mb-1">
          과목을 선택하세요
        </TypographyH3>
        <TypographySmall className="text-muted-foreground">
          준비하신 과목의 기출문제를 통해 실전 감각을 익혀보세요.
        </TypographySmall>
      </div>

      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {SUBJECT_CODES.map((s) => (
          <SelectableCard key={s} to={`/${year}/${s}`} className="min-h-30">
            <div className="w-10 h-10 bg-muted rounded-xl mb-3 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <span className="text-lg font-bold opacity-30">{s[0]}</span>
            </div>
            <span className="text-sm font-bold text-foreground group-hover:text-primary">
              {subjectLabel[s]}
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
};

export default YearPage;
