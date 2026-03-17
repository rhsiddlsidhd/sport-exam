import React from "react";
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
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          {subjectLabel[subject]} · 연도 선택
        </span>
        <h2 className="text-2xl font-black text-foreground tracking-tight leading-tight mb-1">
          어느 연도를
          <br />
          풀어볼까요?
        </h2>
        <p className="text-sm text-muted-foreground">
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
            <span className="text-base font-black text-foreground group-hover:text-primary">
              {year}년
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
};

export default SubjectPage;
