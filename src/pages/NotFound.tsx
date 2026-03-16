import { Link } from "react-router";
import { TypographyH1, TypographyH3, TypographyP } from "../components/atoms/Typography";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
      <TypographyH1 className="text-6xl text-blue-500 mb-4">404</TypographyH1>
      <TypographyH3 className="font-bold text-gray-800 mb-2">페이지를 찾을 수 없습니다.</TypographyH3>
      <TypographyP className="text-gray-500 mb-8 max-w-md">
        요청하신 주소가 유효하지 않거나, 삭제되어 찾을 수 없습니다.
        입력하신 주소를 다시 한번 확인해 주세요.
      </TypographyP>
      <Link 
        to="/" 
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
      >
        메인 화면으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
