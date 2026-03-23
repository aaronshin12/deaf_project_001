"use client";

interface TokenChipProps {
  token: string;
  isGrammar: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function TokenChip({
  token,
  isGrammar,
  isSelected,
  onClick,
}: TokenChipProps) {
  const baseClasses =
    "px-4 py-2 rounded-full text-base font-semibold transition-all duration-150 cursor-pointer select-none";

  const colorClasses = isGrammar
    ? isSelected
      ? "bg-purple text-white shadow-[0_3px_0_#9B4DCC]"
      : "bg-transparent border-2 border-purple text-purple hover:bg-purple/10"
    : isSelected
      ? "bg-blue text-white shadow-[0_3px_0_#0E8ACB]"
      : "bg-transparent border-2 border-blue text-blue hover:bg-blue/10";

  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      {token}
    </button>
  );
}
