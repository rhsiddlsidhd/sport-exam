import { useLocation, useNavigate, Link } from "react-router";
import { useLoaderData } from "react-router";
import { TypographySmall } from "@/components/atoms/typography";
import { Button } from "@/components/atoms/button";
import SectionHeader from "@/components/molecules/SectionHeader";
import ScoreSummary from "@/components/organisms/ScoreSummary";
import ReviewCard from "@/components/organisms/ReviewCard";
import { computeResults } from "@/utils/computeResults";
import type { ReviewLoaderData } from "@/loaders/reviewLoader";

interface LocationState {
  userAnswers: Record<string, number>;
}

const ReviewPage = () => {
  const { subject, year, questions } = useLoaderData<ReviewLoaderData>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (!state?.userAnswers) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <TypographySmall className="text-foreground font-bold">
          결과 데이터가 없습니다.
        </TypographySmall>
        <Button asChild className="rounded-xl font-bold">
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  const results = computeResults(questions, state.userAnswers);
  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="bg-background min-h-full pb-10">
      <ScoreSummary
        subject={subject}
        year={year}
        score={score}
        correctCount={correctCount}
        total={questions.length}
        onRetry={() => navigate(`/${subject}/${year}`)}
      />

      <div className="mt-7 px-5">
        <SectionHeader className="mb-4">상세 리뷰</SectionHeader>
        <div className="space-y-3">
          {results.map((res, idx) => (
            <ReviewCard key={res.id} result={res} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
