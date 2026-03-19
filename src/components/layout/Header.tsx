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
      <header className="h-14 shrink-0 px-5 bg-primary flex justify-between items-center z-10">
        <Link to="/" className="hover:opacity-85 transition-opacity">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-primary-foreground/50 tracking-widest uppercase leading-none">
              생활체육지도자 2급
            </span>
            <span className="text-base font-black text-primary-foreground tracking-tight leading-none">
              스포츠 기출
            </span>
          </div>
        </Link>

        <NavLink
          to="/notes"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
              isActive
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10",
            )
          }
        >
          <Bookmark className="w-3.5 h-3.5" strokeWidth={2.5} />
          오답노트
        </NavLink>
      </header>

      {/* 가변 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* 하단 푸터 */}
      <footer
        className={cn(
          "h-10 shrink-0 flex items-center justify-center text-[10px] text-muted-foreground/50 border-t border-border bg-card",
          isQuizActive && "hidden",
        )} 
      >
        © 2025 스포츠 기출문제
      </footer>
    </div>
  );
};

export default Header;
