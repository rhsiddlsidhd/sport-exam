import React from "react";
import { Users, Brain, BookOpen, Activity, Scale } from "lucide-react";
import { SUBJECT_CODES } from "./types/subject";
import type { SubjectCode } from "./types/subject";
import { subjectLabel } from "./constants/label";
import SelectableCard from "./components/molecules/SelectableCard";

const SUBJECT_META: Record<
  SubjectCode,
  { icon: React.ReactNode; desc: string }
> = {
  SOC: { icon: <Users className="h-5 w-5" />, desc: "사회와 스포츠의 관계" },
  PSY: { icon: <Brain className="h-5 w-5" />, desc: "스포츠와 심리" },
  HIS: { icon: <BookOpen className="h-5 w-5" />, desc: "한국 체육의 역사" },
  PHY: { icon: <Activity className="h-5 w-5" />, desc: "운동과 신체 생리" },
  ETH: { icon: <Scale className="h-5 w-5" />, desc: "스포츠의 윤리 기준" },
};

function App() {
  return (
    <div className="p-5">
      <div className="mb-8 pt-2">
        <span className="text-primary mb-3 inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          과목 선택
        </span>
        <h2 className="text-foreground mb-1 text-2xl leading-tight font-black tracking-tight">
          어떤 과목을
          <br />
          풀어볼까요?
        </h2>
        <p className="text-muted-foreground text-sm">
          5개 과목 · 2019~2025년 수록
        </p>
      </div>

      <main className="flex flex-col gap-3">
        {SUBJECT_CODES.map((s) => (
          <SelectableCard
            key={s}
            to={`/${s}`}
            className="min-h-0 flex-row items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors">
                {SUBJECT_META[s].icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground group-hover:text-primary text-sm leading-tight font-black">
                  {subjectLabel[s]}
                </span>
                <span className="text-muted-foreground text-xs font-medium">
                  {SUBJECT_META[s].desc}
                </span>
              </div>
            </div>
            <span className="text-muted-foreground/40 group-hover:text-primary/50 shrink-0 text-sm font-bold transition-colors">
              →
            </span>
          </SelectableCard>
        ))}
      </main>
    </div>
  );
}

export default App;
