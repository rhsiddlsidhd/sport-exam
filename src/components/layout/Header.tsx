import { Outlet, Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const isQuizActive = segments.length >= 2 || location.pathname === "/review";

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      {/* 고정 헤더 */}
      <header className="bg-primary z-10 flex h-14 shrink-0 items-center justify-between px-5">
        <Link to="/" className="transition-opacity hover:opacity-85">
          <div className="flex flex-col gap-0.5">
            <span className="text-primary-foreground/50 text-[9px] leading-none font-bold tracking-widest uppercase">
              생활체육지도자 2급
            </span>
            <span className="text-primary-foreground text-base leading-none font-black tracking-tight">
              스포츠 기출
            </span>
          </div>
        </Link>
      </header>

      {/* 가변 컨텐츠 영역 */}
      <main className="relative flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* 하단 푸터 */}
      <footer
        className={cn(
          "text-muted-foreground/50 border-border bg-card flex h-10 shrink-0 items-center justify-center border-t text-[10px]",
          isQuizActive && "hidden",
        )}
      >
        © 2025 스포츠 기출문제
      </footer>
    </div>
  );
};

export default Header;
