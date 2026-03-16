import { INITIAL_YEAR } from "../../constants/number";

interface YearSelectorProps {
  onYearSelect: (year: number) => void;
}

const YearSelector = ({ onYearSelect }: YearSelectorProps) => {
  const years = Array.from({ length: 7 }, (_, i) => INITIAL_YEAR - i);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearSelect(year)}
          className="flex flex-col items-center justify-center p-5 sm:p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer group active:scale-95"
        >
          <span className="text-xl sm:text-lg font-bold">{year}년</span>
          <span className="text-xs text-gray-400 group-hover:text-blue-400 mt-0.5">
            기출문제
          </span>
        </button>
      ))}
    </div>
  );
};

export default YearSelector;
