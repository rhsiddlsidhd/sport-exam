import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isSubjectCode } from "@/types/subject";
import { VALID_YEARS } from "@/constants/number";
import type { ExamQuestion } from "@/types/exam-schema";
import type { SubjectCode } from "@/types/subject";

export interface ReviewLoaderData {
  subject: SubjectCode;
  year: string;
  questions: ExamQuestion[];
}

export async function reviewLoader({
  params,
}: LoaderFunctionArgs): Promise<ReviewLoaderData | Response> {
  const { subject: rawSubject, year } = params;

  if (!isSubjectCode(rawSubject)) return redirect("/");
  if (!year || !VALID_YEARS.has(year)) return redirect(`/${rawSubject}`);

  const module = await import(
    `../data/exam/${rawSubject}_${year}_sports_instructor_exam.json`
  );
  const questions: ExamQuestion[] = module.default.questions;

  return { subject: rawSubject, year, questions };
}
