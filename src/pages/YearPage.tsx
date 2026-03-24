import { useOutletContext } from "react-router";
import { Users, Brain, BookOpen, Activity, Scale } from "lucide-react";
import { SUBJECT_CODES } from "../types/subject";
import type { SubjectCode } from "../types/subject";
import { subjectLabel } from "../constants/label";
import SelectableCard from "../components/molecules/SelectableCard";

const SUBJECT_META: Record<
  SubjectCode,
  { icon: React.ReactNode; desc: string }
> = {
  SSO: { icon: <Users className="w-5 h-5" />, desc: "사회와 스포츠의 관계" },
  SPS: { icon: <Brain className="w-5 h-5" />, desc: "스포츠와 심리" },
  KHS: { icon: <BookOpen className="w-5 h-5" />, desc: "한국 체육의 역사" },
  EPH: { icon: <Activity className="w-5 h-5" />, desc: "운동과 신체 생리" },
  SET: { icon: <Scale className="w-5 h-5" />, desc: "스포츠의 윤리 기준" },
};

import React from "react";
import { TypographyH3, TypographyMuted } from "@/components/atoms/Typography";

const YearPage = () => {
  const year = useOutletContext<string>();

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-8">
        <TypographyMuted className="text-primary text-xs pb-4 tracking-widest uppercase font-black">
          {year}년도 과목 선택
        </TypographyMuted>
        <TypographyH3 className="text-2xl font-black text-foreground tracking-tight leading-tight mb-1">
          어떤 과목을
          <br />
          풀어볼까요?
        </TypographyH3>
        <p className="text-sm text-muted-foreground">5개 과목 · 각 20문항</p>
      </div>

      <main className="flex flex-col gap-3 pb-4">
        {SUBJECT_CODES.map((s) => (
          <SelectableCard
            key={s}
            to={`/${year}/${s}`}
            className="flex-row items-center justify-between min-h-0 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                {SUBJECT_META[s].icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-black text-foreground group-hover:text-primary leading-tight">
                  {subjectLabel[s]}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {SUBJECT_META[s].desc}
                </span>
              </div>
            </div>
            <span className="text-muted-foreground/40 group-hover:text-primary/50 transition-colors text-sm font-bold shrink-0">
              →
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
};

export default YearPage;
