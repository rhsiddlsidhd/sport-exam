export const SUBJECT_CODES = ["SOC", "PSY", "HIS", "PHY", "ETH"] as const;

export type SubjectCode = (typeof SUBJECT_CODES)[number];

const SUBJECT_SET = new Set<string>(SUBJECT_CODES);

export const isSubjectCode = (
  value: string | undefined,
): value is SubjectCode => {
  if (!value) return false;
  return SUBJECT_SET.has(value);
};
