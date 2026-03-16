import { SUBJECT_CODES, type SubjectCode } from "../types/subject";

/**
 * 입력받은 값이 유효한 SubjectCode인지 확인하는 타입 가드 함수
 */

const SUBJECT_SET = new Set<string>(SUBJECT_CODES);

export const isSubjectCode = (
  value: string | undefined,
): value is SubjectCode => {
  if (!value) return false;
  return SUBJECT_SET.has(value);
};
