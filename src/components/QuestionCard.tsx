import React from "react";
import type { ExamQuestion } from "../types/exam";
import { TypographyLarge } from "./atoms/Typography";

interface QuestionCardProps {
  question: ExamQuestion;
  selectedOption: number | null;
  onSelect: (id: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="p-5 border-y sm:border border-gray-100 rounded-none sm:rounded-2xl text-left bg-white shadow-sm sm:transition-all sm:hover:shadow-lg">
      <div className="flex items-center justify-end mb-3">
        <div className="text-[10px] font-bold text-gray-300">{question.id}</div>
      </div>

      <TypographyLarge className="font-bold text-gray-800 mb-4 leading-snug break-keep">
        {question.question}
      </TypographyLarge>

      {/* <보기> 섹션 (지문 또는 항목 리스트) */}
      {(question.context ||
        (question.contextItems && question.contextItems.length > 0)) && (
        <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl mb-4 shadow-inner">
          <div className="font-black mb-2 text-center text-gray-400 text-[10px] tracking-[0.2em] uppercase">
            &lt;보 기&gt;
          </div>
          {question.context && (
            <div className="mb-2 space-y-1.5">
              {question.context.map((line, idx) => (
                <div
                  key={idx}
                  className="text-gray-600 leading-normal break-keep text-xs font-medium"
                >
                  {line}
                </div>
              ))}
            </div>
          )}
          {question.contextItems && (
            <div className="space-y-1.5">
              {question.contextItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="text-gray-600 flex gap-2 text-xs font-medium"
                >
                  <span className="font-black text-blue-500 whitespace-nowrap">
                    {item.id}.
                  </span>
                  <span className="break-keep">{item.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4지선다 선택지 */}
      <div className="grid grid-cols-1 gap-2 ">
        {question.options.map((option, idx) => (
          <button
            key={`${question.id}-opt-${idx}`}
            onClick={() => onSelect(option.id)}
            className={`group p-3 border-2 rounded-xl text-left transition-all duration-300 flex items-center gap-3 ${
              selectedOption === option.id
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-50"
                : "border-gray-50 bg-white hover:border-blue-200 hover:bg-gray-50/50"
            }`}
          >
            <div
              className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                selectedOption === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`flex-1 text-sm font-bold break-keep ${
                selectedOption === option.id ? "text-blue-700" : "text-gray-600"
              }`}
            >
              {option.content}
            </span>
            {selectedOption === option.id && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300 shrink-0">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
