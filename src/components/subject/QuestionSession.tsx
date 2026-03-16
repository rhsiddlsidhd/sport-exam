import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import type { ExamQuestion, Exam } from "../../types/exam";
import { isSubjectCode } from "../../utils/subject";
import QuestionCard from "../QuestionCard";
import NotFound from "../../pages/NotFound";
import { TypographySmall } from "../atoms/Typography";

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuestionSession = () => {
  const navigate = useNavigate();
  const year = useOutletContext<string>();
  const { subject } = useParams<{ subject: string }>();

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const validSubject = isSubjectCode(subject) ? subject : null;

  useEffect(() => {
    if (!validSubject) {
      setLoading(false);
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = (await import(
          `../../data/exam/${year}_sports_instructor_exam.json`
        )) as { default: Exam };
        const examSubject = data.default.subjects.find(
          (s) => s.subject === validSubject,
        );
        if (!examSubject) return setQuestions([]);
        const loaded = examSubject.questions.map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(loaded);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [year, validSubject]);

  if (!validSubject) {
    return <NotFound />;
  }

  const handleBack = () => {
    navigate(`/${year}`);
  };

  const handleSelectOption = (questionId: string, optionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleGrade = () => {
    navigate("/result", {
      state: {
        year,
        subject: validSubject,
        questions,
        userAnswers,
      },
    });
  };

  const isAllAnswered =
    questions.length > 0 && questions.every((q) => userAnswers[q.id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <TypographySmall className="mt-4 text-gray-500 block">
          기출문제 로딩 중...
        </TypographySmall>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 h-full text-center min-h-100">
        <div className="text-2xl mb-4">📭</div>
        <TypographySmall className="text-gray-500 font-bold mb-6 block">
          {error || "등록된 기출문제가 없습니다."}
        </TypographySmall>
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md"
        >
          이전으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative ">
      {/* 상단 컨트롤 바 */}
      <div className="h-10 shrink-0 flex items-center justify-between px-4 bg-white border-b border-gray-100 shadow-sm z-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors text-xs font-bold"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로
        </button>
        {/* 모바일: progress bar */}
        <div className="sm:hidden flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
        {/* 데스크탑: dots */}
        <div className="hidden sm:flex gap-1">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-4 bg-blue-500"
                  : userAnswers[q.id]
                    ? "bg-blue-200"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-gray-400">
          <span className="text-blue-500">{currentIndex + 1}</span> /{" "}
          {questions.length}
        </span>
      </div>

      {/* 문제 컨테이너 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide ">
        <div className="w-full max-w-xl mx-auto py-3">
          <QuestionCard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            selectedOption={userAnswers[questions[currentIndex].id] || null}
            onSelect={(id) =>
              handleSelectOption(questions[currentIndex].id, id)
            }
          />
        </div>
      </div>

      {/* 하단 내비게이션 바 */}
      <div className="h-14 shrink-0 flex items-center justify-between px-4 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.02)] z-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            currentIndex === 0
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-50 active:scale-95"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          이전
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleGrade}
            disabled={!isAllAnswered}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${
              !isAllAnswered
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-100"
            }`}
          >
            최종 채점하기
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-md"
          >
            다음 문제
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionSession;
