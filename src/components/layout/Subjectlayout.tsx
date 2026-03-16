import { Outlet, useParams } from "react-router";
import NotFound from "../../pages/NotFound";
import { TypographyH4 } from "../atoms/Typography";
import { INITIAL_YEAR } from "../../constants/number";

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
    <div className="flex flex-col h-full text-start">
      <div className="mb-4 px-6 pt-4">
        <TypographyH4 className="text-gray-900">
          {year}년도 생활체육지도자 2급
        </TypographyH4>
      </div>

      <div className="flex-1 overflow-hidden">
        <Outlet context={year} />
      </div>
    </div>
  );
};

export default YearLayout;
