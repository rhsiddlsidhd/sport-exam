/**
 * BLANK 타입 보기 텍스트에서 (ㄱ), (ㄴ), ㉠: 등 기호를 강조 span으로 변환
 */
export const renderTextWithHighlight = (
  text: string,
): (string | React.ReactElement)[] => {
  const regex = /(\(\s*[ㄱ-ㅎㅏ-ㅣ가-힣\d㉠-㉿\s]+\s*\)|(?<![가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z])[ㄱ-ㅎㅏ-ㅣ가-힣㉠-㉿A-Z]\s*:)/;
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-primary mx-0.5 font-bold">
        {part}
      </span>
    ) : (
      part
    ),
  );
};
