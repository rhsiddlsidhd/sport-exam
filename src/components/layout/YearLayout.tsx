import { Outlet, useParams, Link } from "react-router";
import NotFound from "../../pages/NotFound";
import { INITIAL_YEAR } from "../../constants/number";
import { ChevronLeft } from "lucide-react";

const VALID_YEARS = new Set(
  Array.from({ length: 7 }, (_, i) => INITIAL_YEAR - i),
);

const isValidYear = (value: string | undefined): value is string => {
  if (!value) return false;
  const num = parseInt(value, 10);
  return !isNaN(num) && VALID_YEARS.has(num);
};

const YearLayout = () => {
  const { year } = useParams<{ year: string }>();

  if (!isValidYear(year)) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 연도 컨텍스트 바 */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
        <Link
          to="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-foreground">{year}년도</span>
          <span className="text-[10px] text-muted-foreground font-medium">
            생활체육지도자 2급
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Outlet context={year} />
      </div>
    </div>
  );
};

export default YearLayout;
