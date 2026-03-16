export const SUBJECT_CODES = ["SOC", "PSY", "HIS", "PHY", "ETH"] as const;

export type SubjectCode = (typeof SUBJECT_CODES)[number];
