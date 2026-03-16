import { Link, useOutletContext } from "react-router";
import { SUBJECT_CODES } from "../types/subject";
import { subjectLabel } from "../constants/label";
import { TypographyH3, TypographySmall } from "../components/atoms/Typography";

const Subject = () => {
  const year = useOutletContext<string>();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 text-left">
        <TypographyH3 className="font-black text-gray-900 mb-1">
          과목을 선택하세요
        </TypographyH3>
        <TypographySmall className="text-gray-400">
          준비하신 과목의 기출문제를 통해 실전 감각을 익혀보세요.
        </TypographySmall>
      </div>

      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {SUBJECT_CODES.map((s) => (
          <Link key={s} to={`/${year}/${s}`} className="group">
            <div className="p-5 border border-gray-100 rounded-2xl bg-white text-center break-keep hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center justify-center min-h-30">
              <div className="w-10 h-10 bg-gray-50 rounded-xl mb-3 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <span className="text-lg font-bold opacity-30">{s[0]}</span>
              </div>
              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700">
                {subjectLabel[s]}
              </span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default Subject;
