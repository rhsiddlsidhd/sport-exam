export const INITIAL_YEAR = 2025;
export const VALID_YEARS = new Set(
  Array.from({ length: 7 }, (_, i) => String(INITIAL_YEAR - i)),
);
