import { useOutletContext } from "react-router";
import type { SubjectCode } from "../types/subject";
import { subjectLabel } from "../constants/label";
import { INITIAL_YEAR } from "../constants/number";
import SelectableCard from "../components/molecules/SelectableCard";

const YEARS = Array.from({ length: 7 }, (_, i) => INITIAL_YEAR - i);

const SubjectPage = () => {
  const subject = useOutletContext<SubjectCode>();

  return (
    <div className="p-5">
      <div className="mb-8 pt-2">
        <span className="text-primary mb-3 inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          {subjectLabel[subject]} · 연도 선택
        </span>
        <h2 className="text-foreground mb-1 text-2xl leading-tight font-black tracking-tight">
          어느 연도를
          <br />
          풀어볼까요?
        </h2>
        <p className="text-muted-foreground text-sm">
          총 {YEARS.length}개년 기출문제 수록 · 각 20문항
        </p>
      </div>

      <main className="grid grid-cols-2 gap-3">
        {YEARS.map((year) => (
          <SelectableCard
            key={year}
            to={`/${subject}/${year}`}
            className="min-h-16"
          >
            <span className="text-foreground group-hover:text-primary text-base font-black">
              {year}년
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
};

export default SubjectPage;
