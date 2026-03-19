import { useState, useEffect } from "react";
import type { ExamQuestion, SubjectExam } from "@/types/exam-schema";
import type { SubjectCode } from "@/types/subject";
import { shuffleArray } from "@/utils/shuffle";

async function loadSubjectExam(
  subject: SubjectCode,
  year: string,
): Promise<SubjectExam> {
  const module = await import(
    `../data/exam/${subject}_${year}_sports_instructor_exam.json`
  );
  const data: SubjectExam = module.default;
  return data;
}

interface UseSubjectExamResult {
  questions: ExamQuestion[];
  loading: boolean;
  error: string | null;
}

export function useSubjectExam(
  subject: SubjectCode,
  year: string | null,
  options?: { shuffle?: boolean },
): UseSubjectExamResult {
  const shuffle = options?.shuffle ?? true;
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!year) {
      setLoading(false);
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadSubjectExam(subject, year);
        const loaded = data.questions.map((q) => ({
          ...q,
          options: shuffle ? shuffleArray(q.options) : q.options,
        }));
        setQuestions(loaded);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subject, year]);

  return { questions, loading, error };
}
