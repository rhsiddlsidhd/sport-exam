import { Outlet, Link, useLocation, NavLink } from "react-router";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const isQuizActive = segments.length >= 2 || location.pathname === "/review";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* 고정 헤더 */}
      <header className="h-16 flex-shrink-0 px-6 bg-primary text-primary-foreground shadow-md flex justify-between items-center z-10">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <h1 className="text-xl font-black tracking-tighter">
            스포츠 지도사 <span className="text-primary-foreground/60 uppercase">Exam</span>
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-xs font-medium opacity-70 hidden sm:block">
            2026년 대비 기출문제 정복
          </span>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
              )
            }
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={2.5} />
            오답노트
          </NavLink>
        </nav>
      </header>

      {/* 가변 컨텐츠 영역 (내부 스크롤 가능) */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* 하단 푸터 (선택 사항, 공간 절약을 위해 작게 배치) */}
      <footer className={cn("h-10 flex-shrink-0 flex items-center justify-center text-[10px] text-muted-foreground border-t border-border bg-card", isQuizActive && "hidden")}>
        © 2025 스포츠 지도사 기출문제 서비스
      </footer>
    </div>
  );
};

export default Header;
