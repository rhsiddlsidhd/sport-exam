import { Bookmark, Trash2 } from "lucide-react";
import { subjectLabel } from "../constants/label";
import { useNotes } from "../hooks/useNotes";
import { Badge } from "../components/atoms/badge";
import { Button } from "../components/atoms/Button";
import { TypographySmall } from "../components/atoms/Typography";
import { cn } from "../lib/utils";
import SectionHeader from "../components/molecules/SectionHeader";
import EmptyState from "../components/molecules/EmptyState";

const NotesPage = () => {
  const { notes, remove } = useNotes();

  const sorted = [...notes].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );

  if (sorted.length === 0) {
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
              {sorted.length}
            </Badge>
          </SectionHeader>
        </div>

        <div className="space-y-3">
          {sorted.map((note) => (
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

                <div className="flex flex-col gap-1 p-3 bg-success/8 rounded-xl border border-success/20">
                  <span className="text-[9px] font-black text-success/60 uppercase tracking-wider">
                    정답
                  </span>
                  <span className="text-xs font-bold text-success break-keep">
                    {note.correctAnswerContent}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
