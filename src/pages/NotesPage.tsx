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
        title="저장된 오답노트가 없습니다"
        description="채점 후 틀린 문제를 북마크하면 여기에 저장됩니다."
        className="h-full min-h-80"
      />
    );
  }

  return (
    <div className="min-h-full bg-background pb-10">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader>
            오답노트
            <Badge className="bg-primary/10 text-primary font-black text-xs border-0">
              {sorted.length}
            </Badge>
          </SectionHeader>
        </div>

        <div className="space-y-3">
          {sorted.map((note) => (
            <div
              key={`${note.id}-${note.savedAt}`}
              className="p-4 rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-md",
                    )}
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
                  className="rounded-lg shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Button>
              </div>

              <TypographySmall className="text-foreground font-bold leading-snug break-keep block mb-3">
                {note.questionText}
              </TypographySmall>

              <div className="flex flex-col p-2.5 bg-success/5 rounded-xl border border-success/20">
                <span className="text-[9px] font-black text-success/70 uppercase mb-0.5 tracking-wider">
                  정답
                </span>
                <span className="text-xs font-bold text-success break-keep">
                  {note.correctAnswerContent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
