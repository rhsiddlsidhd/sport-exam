import { Outlet, useParams, Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { isSubjectCode } from "../../types/subject";
import { subjectLabel } from "../../constants/label";
import NotFound from "../../pages/NotFound";

const SubjectLayout = () => {
  const { subject } = useParams<{ subject: string }>();

  if (!isSubjectCode(subject)) {
    return <NotFound />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* 과목 컨텍스트 바 */}
      <div className="border-border bg-card flex items-center gap-2 border-b px-5 py-3">
        <Link
          to="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <span className="text-foreground text-xs font-black">
          {subjectLabel[subject]}
        </span>
        <span className="text-muted-foreground text-[10px] font-medium">
          생활체육지도자 2급
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <Outlet context={subject} />
      </div>
    </div>
  );
};

export default SubjectLayout;
