import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isSubjectCode } from "@/types/subject";
import { VALID_YEARS } from "@/constants/number";
import { shuffleArray } from "@/utils/shuffle";
import type { ExamQuestion } from "@/types/exam-schema";
import type { SubjectCode } from "@/types/subject";

export interface ExamLoaderData {
  subject: SubjectCode;
  year: string;
  questions: ExamQuestion[];
}

export async function examLoader({
  params,
}: LoaderFunctionArgs): Promise<ExamLoaderData | Response> {
  const { subject: rawSubject, year } = params;

  if (!isSubjectCode(rawSubject)) return redirect("/");
  if (!year || !VALID_YEARS.has(year)) return redirect(`/${rawSubject}`);

  const module = await import(
    `../data/exam/${rawSubject}_${year}_sports_instructor_exam.json`
  );
  const questions: ExamQuestion[] = module.default.questions.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));

  return { subject: rawSubject, year, questions };
}
