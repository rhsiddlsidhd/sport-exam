import "./App.css";
import { Link } from "react-router";
import { INITIAL_YEAR } from "./constants/number";
import { TypographyH3, TypographySmall } from "./components/atoms/Typography";

function App() {
  const years = Array.from({ length: 7 }, (_, i) => INITIAL_YEAR - i);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 text-left">
        <TypographyH3 className="font-black text-gray-900 mb-1">
          연도를 선택하세요
        </TypographyH3>
        <TypographySmall className="text-gray-400">
          응시하실 연도의 기출문제를 선택하세요.
        </TypographySmall>
      </div>

      <main className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {years.map((year) => (
          <Link key={year} to={`/${year}`} className="group">
            <div className="p-5 border border-gray-100 rounded-2xl bg-white text-center break-keep hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center justify-center min-h-20">
              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700">
                {year}년
              </span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default App;
