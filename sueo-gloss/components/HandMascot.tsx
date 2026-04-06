"use client";

interface HandMascotProps {
  state: "idle" | "loading" | "success" | "error";
}

const messages = {
  idle: "어떤 수어를 배워볼까요?",
  loading: "찾고 있어요...",
  success: "단어를 눌러보세요!",
  error: "앗, 다시 해볼까요?",
};

export default function HandMascot({ state }: HandMascotProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      {/* Hand character SVG - Thing style */}
      <div className="flex-shrink-0">
        <svg
          width="68"
          height="76"
          viewBox="0 0 68 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={state === "loading" ? "animate-bounce" : ""}
        >
          {/* Palm (body) */}
          <rect x="16" y="20" width="36" height="32" rx="10" fill="#D97757" />

          {/* Thumb (left arm) */}
          <rect x="2" y="28" width="16" height="12" rx="6" fill="#E89A7A" />

          {/* Pinky (right arm) */}
          <rect x="50" y="30" width="16" height="10" rx="5" fill="#E89A7A" />

          {/* Index finger (left leg) */}
          <rect x="22" y="50" width="10" height="22" rx="5" fill="#E89A7A" />
          {/* Left foot */}
          <ellipse cx="27" cy="72" rx="6" ry="3" fill="#C4623F" />

          {/* Middle finger (right leg) */}
          <rect x="36" y="50" width="10" height="22" rx="5" fill="#E89A7A" />
          {/* Right foot */}
          <ellipse cx="41" cy="72" rx="6" ry="3" fill="#C4623F" />

          {/* Ring finger (slightly folded, behind) */}
          <rect x="44" y="46" width="8" height="10" rx="4" fill="#D48B6A" />

          {/* Eyes background */}
          <ellipse cx="28" cy="32" rx="7" ry="7" fill="white" />
          <ellipse cx="40" cy="32" rx="7" ry="7" fill="white" />

          {/* Pupils */}
          <circle
            cx={state === "loading" ? "30" : "29"}
            cy={state === "error" ? "34" : "32"}
            r="3.5"
            fill="#2D2B2A"
          />
          <circle
            cx={state === "loading" ? "42" : "41"}
            cy={state === "error" ? "34" : "32"}
            r="3.5"
            fill="#2D2B2A"
          />

          {/* Eye shine */}
          <circle cx="27" cy="30" r="1.5" fill="white" />
          <circle cx="39" cy="30" r="1.5" fill="white" />

          {/* Eyebrows */}
          <path
            d={state === "error" ? "M22 24 Q28 27 33 24" : "M22 24 Q28 20 33 24"}
            stroke="#C4623F"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={state === "error" ? "M35 24 Q40 27 46 24" : "M35 24 Q40 20 46 24"}
            stroke="#C4623F"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Smile */}
          <path
            d={state === "error" ? "M30 42 Q34 40 38 42" : "M29 41 Q34 46 39 41"}
            stroke="#C4623F"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Blush cheeks */}
          <ellipse cx="22" cy="38" rx="4" ry="2.5" fill="#F0B8A0" opacity="0.6" />
          <ellipse cx="46" cy="38" rx="4" ry="2.5" fill="#F0B8A0" opacity="0.6" />
        </svg>
      </div>

      {/* Speech bubble */}
      <div className="relative bg-card border border-card-border rounded-2xl px-4 py-3 card-shadow">
        <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-3 h-3 bg-card border-l border-b border-card-border rotate-45" />
        <p className="text-[1.3rem] text-text-sub leading-relaxed" style={{ fontFamily: "'Gaegu', cursive" }}>{messages[state]}</p>
      </div>
    </div>
  );
}
