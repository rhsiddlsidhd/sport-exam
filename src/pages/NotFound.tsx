import { Link } from "react-router";
import { TypographyH1, TypographyH3, TypographyP } from "../components/atoms/typography";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
      <TypographyH1 className="text-6xl text-primary mb-4">404</TypographyH1>
      <TypographyH3 className="font-bold text-foreground mb-2">페이지를 찾을 수 없습니다.</TypographyH3>
      <TypographyP className="text-muted-foreground mb-8 max-w-md">
        요청하신 주소가 유효하지 않거나, 삭제되어 찾을 수 없습니다.
        입력하신 주소를 다시 한번 확인해 주세요.
      </TypographyP>
      <Link 
        to="/" 
        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg"
      >
        메인 화면으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
