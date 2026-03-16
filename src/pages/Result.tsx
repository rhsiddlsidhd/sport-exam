import { useLocation, useNavigate, Link } from "react-router";
import type { ExamQuestion } from "../types/exam";
import type { SubjectCode } from "../types/subject";
import { subjectLabel } from "../constants/label";
import {
  TypographyH3,
  TypographyH4,
  TypographyLarge,
  TypographySmall,
} from "../components/atoms/Typography";

interface LocationState {
  year: string;
  subject: SubjectCode;
  questions: ExamQuestion[];
  userAnswers: Record<string, number>;
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (
    !state?.subject ||
    !state?.year ||
    !Array.isArray(state?.questions) ||
    !state?.userAnswers
  ) {
    return (
      <div className="p-10 text-center">
        <TypographyH4 className="mb-4 text-gray-800">
          결과 데이터가 없습니다.
        </TypographyH4>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const { year, subject, questions, userAnswers } = state;

  const results = questions.map((q) => {
    const userAnswerId = userAnswers[q.id];
    const userOption = q.options.find((opt) => opt.id === userAnswerId);
    
    // 중복 정답 여부 체크
    const isCorrect = Array.isArray(q.answer)
      ? q.answer.includes(userAnswerId)
      : userAnswerId === q.answer;

    // 정답 텍스트 구성 (중복 정답인 경우 콤마로 연결)
    const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
    const correctAnswerContent = q.options
      .filter((opt) => correctAnswers.includes(opt.id))
      .map((opt) => opt.content)
      .join(", ");

    return {
      id: q.id,
      questionText: q.question,
      isCorrect,
      userAnswerContent: userOption?.content || "미선택",
      correctAnswerContent,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="min-h-full bg-gray-50 pb-10">
      {/* 상단 결과 요약 */}
      <div className="bg-white border-b border-gray-100 px-6 py-6 text-center shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="text-[10px] font-black text-blue-500 mb-1 uppercase tracking-widest">
            {subjectLabel[subject]} ({year}년)
          </div>
          <TypographyH3 className="font-black text-gray-900 mb-6">
            시험 결과
          </TypographyH3>

          <div className="flex flex-row items-center justify-center gap-10 mb-6">
            <div className="flex gap-2 items-baseline">
              <TypographyH4>{score} 점</TypographyH4>
            </div>

            <div className="flex gap-3">
              <div className="bg-green-50 px-4 py-3 rounded-xl border border-green-100 text-center min-w-[80px]">
                <div className="text-[10px] font-bold text-green-600 mb-0.5 uppercase">
                  정답
                </div>
                <div className="text-xl font-black text-green-700">
                  {correctCount} <span className="text-xs font-medium">개</span>
                </div>
              </div>
              <div className="bg-red-50 px-4 py-3 rounded-xl border border-red-100 text-center min-w-[80px]">
                <div className="text-[10px] font-bold text-red-600 mb-0.5 uppercase">
                  오답
                </div>
                <div className="text-xl font-black text-red-700">
                  {questions.length - correctCount}{" "}
                  <span className="text-xs font-medium">개</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(`/${year}/${subject}`)}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md"
            >
              다시 풀기
            </button>
            <Link
              to="/"
              className="px-6 py-2.5 bg-white border-2 border-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>

      {/* 오답 노트 / 상세 리뷰 */}
      <div className="max-w-2xl mx-auto px-6 mt-8">
        <TypographyLarge className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
          상세 리뷰
        </TypographyLarge>

        <div className="space-y-4">
          {results.map((res, idx) => (
            <div
              key={res.id}
              className={`p-5 rounded-2xl border transition-all ${
                res.isCorrect
                  ? "bg-white border-gray-100 shadow-sm"
                  : "bg-red-50/20 border-red-100 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                      res.isCorrect
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-black tracking-tight ${
                      res.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {res.isCorrect ? "CORRECT" : "INCORRECT"}
                  </span>
                </div>
                {!res.isCorrect && <span className="text-lg">🚨</span>}
              </div>

              <TypographySmall className="text-gray-800 font-bold mb-4 leading-tight break-keep block">
                {res.questionText}
              </TypographySmall>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-black text-gray-400 uppercase mb-0.5 tracking-wider">
                    나의 선택
                  </span>
                  <span
                    className={`text-xs font-bold ${res.isCorrect ? "text-blue-600" : "text-red-600"}`}
                  >
                    {res.userAnswerContent}
                  </span>
                </div>
                {!res.isCorrect && (
                  <div className="flex flex-col p-3 bg-green-50/30 rounded-xl border border-green-100">
                    <span className="text-[9px] font-black text-green-400 uppercase mb-0.5 tracking-wider">
                      정답
                    </span>
                    <span className="text-xs font-bold text-green-700">
                      {res.correctAnswerContent}
                    </span>
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

export default Result;
