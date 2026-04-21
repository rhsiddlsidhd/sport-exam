export const renderBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-foreground font-black">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
};
