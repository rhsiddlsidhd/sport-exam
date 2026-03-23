import { useLocation, useNavigate, Link, useParams } from "react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { SubjectCode } from "../types/subject";
import { subjectLabel } from "../constants/label";
import { TypographySmall } from "../components/atoms/Typography";
import { Button } from "../components/atoms/Button";
import { useNotes } from "../hooks/useNotes";
import { useSubjectExam } from "../hooks/useSubjectExam";
import { cn } from "../lib/utils";
import SectionHeader from "../components/molecules/SectionHeader";
import QuestionContext from "../components/molecules/QuestionContext";

interface LocationState {
  userAnswers: Record<string, number>;
}

const ReviewPage = () => {
  const { subject: rawSubject, year } = useParams<{
    subject: string;
    year: string;
  }>();
  const subject = rawSubject as SubjectCode | undefined;
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const { add, remove, isBookmarked } = useNotes();

  const { questions, loading } = useSubjectExam(
    subject ?? ("" as SubjectCode),
    year ?? null,
    {
      shuffle: false,
    },
  );

  if (!state?.userAnswers || !subject || !year) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <p className="text-foreground text-sm font-bold">
          결과 데이터가 없습니다.
        </p>
        <Button asChild className="rounded-xl font-bold">
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-60 flex-col items-center justify-center gap-4">
        <div className="border-muted border-t-primary h-10 w-10 animate-spin rounded-full border-2" />
        <TypographySmall className="text-muted-foreground">
          결과를 불러오는 중...
        </TypographySmall>
      </div>
    );
  }

  const { userAnswers } = state;

  const results = questions.map((q) => {
    const userAnswerId = userAnswers[q.id];

    const isCorrect = Array.isArray(q.answer)
      ? q.answer.includes(userAnswerId)
      : userAnswerId === q.answer;

    const getUserAnswerContent = () => {
      if (userAnswerId === undefined || userAnswerId === null) return "미선택";
      return (
        q.options.find((opt) => opt.id === userAnswerId)?.content || "미선택"
      );
    };

    const getCorrectAnswerContent = () => {
      const correctIds = Array.isArray(q.answer) ? q.answer : [q.answer];
      return q.options
        .filter((opt) => correctIds.includes(opt.id))
        .map((opt) => opt.content)
        .join(", ");
    };

    return {
      ...q,
      isCorrect,
      userAnswerContent: getUserAnswerContent(),
      correctAnswerContent: getCorrectAnswerContent(),
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleToggleBookmark = (res: (typeof results)[number]) => {
    if (isBookmarked(res.id)) {
      remove(res.id);
    } else {
      add({
        id: res.id,
        year,
        subject,
        questionText: res.question,
        view: res.view,
        correctAnswerContent: res.correctAnswerContent,
        explanation: res.explanation,
        savedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="bg-background min-h-full pb-10">
      {/* 결과 요약 */}
      <div className="bg-card border-border border-b px-5 py-8">
        <div className="mb-6 text-center">
          <span className="text-primary text-[10px] font-black tracking-widest uppercase">
            {subjectLabel[subject]} · {year}년
          </span>
        </div>

        {/* 원형 점수 게이지 */}
        <div className="mb-7 flex flex-col items-center gap-5">
          <div className="relative">
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              className="-rotate-90"
            >
              <circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="currentColor"
                className="text-muted"
                strokeWidth="7"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="currentColor"
                className="text-primary transition-all duration-700"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-foreground text-2xl leading-none font-black tabular-nums">
                {score}
              </span>
              <span className="text-muted-foreground text-[10px] font-bold">
                점
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-success/8 border-success/20 flex min-w-[72px] flex-col items-center rounded-2xl border px-5 py-3">
              <span className="text-success/70 mb-1 text-[9px] font-black tracking-wider uppercase">
                정답
              </span>
              <span className="text-success text-xl font-black tabular-nums">
                {correctCount}
              </span>
            </div>
            <div className="bg-destructive/8 border-destructive/20 flex min-w-[72px] flex-col items-center rounded-2xl border px-5 py-3">
              <span className="text-destructive/70 mb-1 text-[9px] font-black tracking-wider uppercase">
                오답
              </span>
              <span className="text-destructive text-xl font-black tabular-nums">
                {questions.length - correctCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2.5">
          <Button
            onClick={() => navigate(`/${subject}/${year}`)}
            className="bg-foreground text-background hover:bg-foreground/90 h-10 rounded-xl px-6 font-black shadow-sm"
          >
            다시 풀기
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-xl border-2 px-6 font-bold"
          >
            <Link to="/">홈으로</Link>
          </Button>
        </div>
      </div>

      {/* 상세 리뷰 */}
      <div className="mt-7 px-5">
        <SectionHeader className="mb-4">상세 리뷰</SectionHeader>

        <div className="space-y-3">
          {results.map((res, idx) => (
            <div
              key={res.id}
              className={cn(
                "overflow-hidden rounded-2xl border",
                res.isCorrect
                  ? "bg-card border-border"
                  : "bg-destructive/5 border-destructive/15",
              )}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between border-b border-inherit px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black",
                      res.isCorrect
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-black tracking-widest uppercase",
                      res.isCorrect ? "text-success" : "text-destructive",
                    )}
                  >
                    {res.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                {!res.isCorrect && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleToggleBookmark(res)}
                    className={cn(
                      "rounded-lg",
                      isBookmarked(res.id)
                        ? "text-primary bg-primary/10 hover:bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                    )}
                  >
                    {isBookmarked(res.id) ? (
                      <BookmarkCheck className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Bookmark className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </Button>
                )}
              </div>

              {/* 문제 텍스트 + 지문/보기 */}
              <div className="px-4 py-3">
                <TypographySmall className="text-foreground mb-3 block leading-snug font-bold break-keep">
                  {res.question}
                </TypographySmall>

                <QuestionContext view={res.view} />

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/60 flex flex-col gap-1 rounded-xl p-3">
                    <span className="text-muted-foreground text-[9px] font-black tracking-wider uppercase">
                      나의 선택
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold break-keep",
                        res.isCorrect ? "text-primary" : "text-destructive",
                      )}
                    >
                      {res.userAnswerContent}
                    </span>
                  </div>
                  {!res.isCorrect && (
                    <div className="bg-success/8 border-success/20 flex flex-col gap-1 rounded-xl border p-3">
                      <span className="text-success/60 text-[9px] font-black tracking-wider uppercase">
                        정답
                      </span>
                      <span className="text-success text-xs font-bold break-keep">
                        {res.correctAnswerContent}
                      </span>
                    </div>
                  )}
                </div>

                {/* 해설 */}
                {res.explanation && (
                  <div className="mt-4 space-y-3">
                    {res.explanation.split("\n\n").map((block, bIdx) => {
                      const isCorrect = block.includes("[정답 분석]");
                      const isWrong = block.includes("[오답 분석]");
                      const isSummary = block.includes("[핵심 정리]");

                      const lines = block.split("\n");

                      return (
                        <div
                          key={bIdx}
                          className={cn(
                            "rounded-2xl border p-4 shadow-sm",
                            isCorrect && "bg-success/5 border-success/20",
                            isWrong && "bg-destructive/5 border-destructive/20",
                            isSummary && "bg-primary/5 border-primary/20",
                            !isCorrect &&
                              !isWrong &&
                              !isSummary &&
                              "bg-muted/30 border-border",
                          )}
                        >
                          {lines.map((line, lIdx) => {
                            // 태그 제거 및 본문 추출 (괄호 안의 내용까지 유연하게 매칭)
                            const content = line
                              .replace(
                                /\*\*\[(정답 분석|지문 분석|오답 분석|핵심 정리).*?\]\*\*:/g,
                                "",
                              )
                              .trim();
                            const hasHeader = line !== content;

                            // **텍스트** 패턴을 <strong> 태그로 변환하여 렌더링하는 함수
                            const renderText = (text: string) => {
                              const parts = text.split(/(\*\*.*?\*\*)/g);
                              return parts.map((part, i) => {
                                if (
                                  part.startsWith("**") &&
                                  part.endsWith("**")
                                ) {
                                  return (
                                    <strong
                                      key={i}
                                      className="text-foreground font-black"
                                    >
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              });
                            };

                            if (hasHeader) {
                              const fullHeader =
                                line.match(/\[(.*?)\]/)?.[1] || "";
                              const isFalseState =
                                fullHeader.includes("옳지 않은");
                              const isTrueState =
                                fullHeader.includes("옳은 설명");

                              return (
                                <div key={lIdx} className="mb-2 last:mb-0">
                                  <span
                                    className={cn(
                                      "mb-2 inline-block rounded-lg px-2 py-1 text-[9px] font-black tracking-widest uppercase",
                                      isTrueState &&
                                        "bg-success/15 text-success",
                                      isFalseState &&
                                        "bg-destructive/15 text-destructive",
                                      !isTrueState &&
                                        !isFalseState &&
                                        isSummary &&
                                        "bg-primary/15 text-primary",
                                      !isTrueState &&
                                        !isFalseState &&
                                        !isSummary &&
                                        "bg-muted text-muted-foreground",
                                    )}
                                  >
                                    {fullHeader}
                                  </span>
                                  {content && (
                                    <TypographySmall className="text-foreground/90 block leading-relaxed font-medium break-keep">
                                      {renderText(content)}
                                    </TypographySmall>
                                  )}
                                </div>
                              );
                            }

                            if (line.startsWith("- ")) {
                              const listItem = line.substring(2);
                              return (
                                <div
                                  key={lIdx}
                                  className="mb-1.5 flex gap-2.5 last:mb-0"
                                >
                                  <span
                                    className={cn(
                                      "mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full",
                                      isCorrect && "bg-success/40",
                                      isWrong && "bg-destructive/40",
                                      isSummary && "bg-primary/40",
                                      !isCorrect &&
                                        !isWrong &&
                                        !isSummary &&
                                        "bg-muted-foreground/40",
                                    )}
                                  />
                                  <TypographySmall className="text-foreground/90 block leading-relaxed font-medium break-keep">
                                    {renderText(listItem)}
                                  </TypographySmall>
                                </div>
                              );
                            }

                            return content ? (
                              <TypographySmall
                                key={lIdx}
                                className="text-foreground/90 mb-1.5 block leading-relaxed font-medium break-keep last:mb-0"
                              >
                                {renderText(content)}
                              </TypographySmall>
                            ) : null;
                          })}
                        </div>
                      );
                    })}
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

export default ReviewPage;
