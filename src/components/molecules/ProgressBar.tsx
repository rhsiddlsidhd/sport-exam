import { memo } from "react";
import { Progress } from "@/components/atoms/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = memo(({ current, total }) => {
  const value = total > 0 ? (current / total) * 100 : 0;
  return <Progress value={value} />;
});

export default ProgressBar;
