"use client";

interface OwlMascotProps {
  state: "idle" | "loading" | "success" | "error";
}

const messages = {
  idle: "오늘도 수어 연습해 볼까요?",
  loading: "불러오는 중...",
  success: "단어를 눌러서 수어를 확인해요!",
  error: "앗, 다시 시도해 볼까요?",
};

export default function OwlMascot({ state }: OwlMascotProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      {/* Owl SVG - left */}
      <div className="flex-shrink-0">
        <svg
          width="64"
          height="64"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={state === "loading" ? "animate-bounce" : ""}
        >
          <ellipse cx="36" cy="42" rx="26" ry="26" fill="#D97757" />
          <ellipse cx="36" cy="48" rx="17" ry="17" fill="#F0B8A0" />
          <circle cx="27" cy="34" r="10" fill="white" />
          <circle cx="45" cy="34" r="10" fill="white" />
          <circle
            cx={state === "loading" ? "29" : "28"}
            cy={state === "error" ? "36" : "34"}
            r="5"
            fill="#2D2B2A"
          />
          <circle
            cx={state === "loading" ? "47" : "46"}
            cy={state === "error" ? "36" : "34"}
            r="5"
            fill="#2D2B2A"
          />
          <path d="M32 39 L36 44 L40 39 Z" fill="#C4956A" />
          <path d="M18 25 Q27 19 34 25" stroke="#C4623F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M38 25 Q45 19 54 25" stroke="#C4623F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M25 66 L21 72 M29 66 L25 72 M33 66 L29 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 66 L43 72 M43 66 L47 72 M47 66 L51 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Speech bubble - right */}
      <div className="relative bg-card border border-card-border rounded-2xl px-4 py-2.5 card-shadow">
        <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-3 h-3 bg-card border-l border-b border-card-border rotate-45" />
        <p className="text-[1.3rem] text-text-sub leading-relaxed" style={{ fontFamily: "'Gaegu', cursive" }}>{messages[state]}</p>
      </div>
    </div>
  );
}
