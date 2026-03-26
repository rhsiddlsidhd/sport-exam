import { useState, useMemo, useEffect } from "react";
import { Bookmark, Trash2, Calendar } from "lucide-react";
import { subjectLabel } from "../constants/label";
import { useNotes } from "../hooks/useNotes";
import { Badge } from "../components/atoms/badge";
import { Button } from "../components/atoms/Button";
import { TypographySmall } from "../components/atoms/Typography";
import { cn, formatDate, formatDisplayDate } from "../lib/utils";
import type { Note } from "../types/note";
import SectionHeader from "../components/molecules/SectionHeader";
import EmptyState from "../components/molecules/EmptyState";
import QuestionContext from "../components/molecules/QuestionContext";

const NotesPage = () => {
  const { notes, remove } = useNotes();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 날짜별 그룹화
  const groupedNotes = useMemo(() => {
    const groups: Record<string, Note[]> = {};
    notes.forEach((note) => {
      const dateKey = formatDate(note.savedAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(note);
    });
    return groups;
  }, [notes]);

  // 사용 가능한 날짜 리스트 (최신순)
  const availableDates = useMemo(() => {
    return Object.keys(groupedNotes).sort((a, b) => b.localeCompare(a));
  }, [groupedNotes]);

  // 선택된 날짜 초기화 (최신 날짜로)
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    } else if (availableDates.length > 0 && !availableDates.includes(selectedDate!)) {
      // 선택된 날짜의 마지막 북마크가 삭제된 경우
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const filteredNotes = useMemo(() => {
    if (!selectedDate) return [];
    return (groupedNotes[selectedDate] || []).sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );
  }, [groupedNotes, selectedDate]);

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="w-10 h-10 text-muted-foreground/30" />}
        title="오답노트가 비어있어요"
        description="채점 후 틀린 문제를 북마크하면 여기에 저장됩니다."
        className="h-full min-h-80"
      />
    );
  }

  return (
    <div className="min-h-full bg-background pb-10">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader>
            오답노트
            <Badge className="bg-primary/10 text-primary font-black text-xs border-0 rounded-full px-2">
              {notes.length}
            </Badge>
          </SectionHeader>
        </div>

        {/* 날짜 선택 필터 */}
        <div className="mb-6 -mx-5 px-5 overflow-x-auto scrollbar-hide flex gap-2 pb-2">
          {availableDates.map((date) => {
            const isSelected = selectedDate === date;
            return (
              <Button
                key={date}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "rounded-xl h-10 px-4 shrink-0 font-bold transition-all",
                  isSelected ? "shadow-md" : "text-muted-foreground border-muted",
                )}
              >
                <Calendar className={cn("w-3.5 h-3.5 mr-2", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                {formatDisplayDate(date)}
                <Badge 
                  variant={isSelected ? "secondary" : "outline"}
                  className={cn(
                    "ml-2 text-[10px] px-1.5 h-4 min-w-4 flex items-center justify-center rounded-full border-0",
                    isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {groupedNotes[date].length}
                </Badge>
              </Button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={`${note.id}-${note.savedAt}`}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* 카드 헤더 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn("text-[10px] font-black px-2 py-0.5 rounded-md")}
                  >
                    {note.year}년
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-muted-foreground"
                  >
                    {subjectLabel[note.subject]}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(note.id)}
                  className="rounded-lg shrink-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Button>
              </div>

              {/* 카드 본문 */}
              <div className="px-4 py-3">
                <TypographySmall className="text-foreground font-bold leading-snug break-keep block mb-3">
                  {note.questionText}
                </TypographySmall>

                {/* 새로운 QuestionContext 컴포넌트 재사용 */}
                <QuestionContext view={note.view} />

                <div className="flex flex-col gap-1 p-3 bg-success/8 rounded-xl border border-success/20">
                  <span className="text-[9px] font-black text-success/60 uppercase tracking-wider">
                    정답
                  </span>
                  <span className="text-xs font-bold text-success break-keep">
                    {note.correctAnswerContent}
                  </span>
                </div>

                {/* 해설 */}
                {note.explanation && (
                  <div className="mt-3 space-y-2">
                    <div className="rounded-xl border border-success/20 bg-success/5 p-3">
                      <span className="mb-1 block text-[9px] font-black tracking-wider text-success/60 uppercase">
                        정답 분석
                      </span>
                      <TypographySmall className="text-foreground/90 block leading-snug break-keep">
                        {note.explanation.correct}
                      </TypographySmall>
                    </div>
                    {note.explanation.distractors && note.explanation.distractors.length > 0 && (
                      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                        <span className="mb-1 block text-[9px] font-black tracking-wider text-destructive/60 uppercase">
                          오답 분석
                        </span>
                        <div className="space-y-1.5">
                          {note.explanation.distractors.map((d, i) => (
                            <TypographySmall key={i} className="text-foreground/90 block leading-snug break-keep">
                              <strong className="text-foreground font-black">{d.term}</strong>
                              {": "}
                              {d.reason}
                            </TypographySmall>
                          ))}
                        </div>
                      </div>
                    )}
                    {note.explanation.summary && (
                      <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                        <span className="mb-1 block text-[9px] font-black tracking-wider text-primary/60 uppercase">
                          핵심 정리
                        </span>
                        <TypographySmall className="text-foreground/90 block leading-snug break-keep">
                          {note.explanation.summary}
                        </TypographySmall>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
