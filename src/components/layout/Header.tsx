import { Outlet, Link, useLocation } from "react-router";

const Header = () => {
  const location = useLocation();
  const isQuizActive = location.search.includes("year=");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* 고정 헤더 */}
      <header className="h-16 flex-shrink-0 px-6 bg-blue-600 text-white shadow-md flex justify-between items-center z-10">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <h1 className="text-xl font-black tracking-tighter">
            스포츠 지도사 <span className="text-blue-200 uppercase">Exam</span>
          </h1>
        </Link>
        <nav className="text-xs font-medium opacity-70 hidden sm:block">
          2026년 대비 기출문제 정복
        </nav>
      </header>

      {/* 가변 컨텐츠 영역 (내부 스크롤 가능) */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* 하단 푸터 (선택 사항, 공간 절약을 위해 작게 배치) */}
      <footer className={`h-10 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 border-t border-gray-100 bg-white ${isQuizActive ? "hidden" : ""}`}>
        © 2025 스포츠 지도사 기출문제 서비스
      </footer>
    </div>
  );
};

export default Header;
