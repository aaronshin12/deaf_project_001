"use client";

interface SuggestionChipsProps {
  onSelect: (sentence: string) => void;
}

const suggestions = [
  "나 오늘 점심에 짜장면 먹었어",
  "내일 학교에서 시험 봐요",
  "어제 친구랑 영화 봤어",
  "주말에 뭐 할 거야?",
  "수어 배우고 싶어요",
  "감사합니다",
];

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-sm rounded-full border-2 border-card-border bg-card text-text-sub hover:border-green hover:text-green transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
