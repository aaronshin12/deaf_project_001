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
      {/* Realistic hand with cute eyes */}
      <div className="flex-shrink-0">
        <svg
          width="72"
          height="88"
          viewBox="0 0 72 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={state === "loading" ? "animate-bounce" : ""}
        >
          {/* Wrist */}
          <rect x="20" y="62" width="28" height="18" rx="6" fill="#E8B89D" />
          <rect x="22" y="62" width="24" height="4" rx="2" fill="#D9A68A" opacity="0.4" />

          {/* Palm */}
          <rect x="14" y="26" width="40" height="38" rx="12" fill="#F0C4A8" />
          {/* Palm shadow/crease */}
          <path d="M24 44 Q34 48 44 44" stroke="#D9A68A" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M22 50 Q34 53 46 50" stroke="#D9A68A" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* Thumb (left, angled out) */}
          <ellipse cx="8" cy="42" rx="8" ry="11" fill="#F0C4A8" transform="rotate(-15 8 42)" />
          <ellipse cx="5" cy="34" rx="5" ry="3" fill="#F5D5BF" opacity="0.5" />
          {/* Thumb nail */}
          <ellipse cx="5" cy="33" rx="3.5" ry="3" fill="#FDDDD2" />
          <ellipse cx="5" cy="32" rx="2.5" ry="1.5" fill="#FFE8E0" />

          {/* Index finger (left leg) */}
          <rect x="18" y="58" width="12" height="26" rx="6" fill="#F0C4A8" />
          {/* Index knuckle */}
          <ellipse cx="24" cy="60" rx="5" ry="2" fill="#E5B599" opacity="0.3" />
          {/* Index nail */}
          <rect x="20" y="80" width="8" height="6" rx="3" fill="#FDDDD2" />
          <rect x="21" y="80" width="6" height="3" rx="2" fill="#FFE8E0" />
          {/* Index foot */}
          <ellipse cx="24" cy="85" rx="7" ry="3" fill="#E5B599" />

          {/* Middle finger (right leg) */}
          <rect x="34" y="58" width="12" height="26" rx="6" fill="#F0C4A8" />
          {/* Middle knuckle */}
          <ellipse cx="40" cy="60" rx="5" ry="2" fill="#E5B599" opacity="0.3" />
          {/* Middle nail */}
          <rect x="36" y="80" width="8" height="6" rx="3" fill="#FDDDD2" />
          <rect x="37" y="80" width="6" height="3" rx="2" fill="#FFE8E0" />
          {/* Middle foot */}
          <ellipse cx="40" cy="85" rx="7" ry="3" fill="#E5B599" />

          {/* Ring finger (tucked, shorter) */}
          <rect x="48" y="36" width="10" height="16" rx="5" fill="#EBB99E" />
          {/* Ring nail */}
          <rect x="50" y="36" width="6" height="5" rx="2.5" fill="#FDDDD2" />
          <rect x="51" y="36" width="4" height="2.5" rx="1.5" fill="#FFE8E0" />

          {/* Pinky (tucked more) */}
          <rect x="54" y="42" width="9" height="13" rx="4.5" fill="#EBB99E" />
          {/* Pinky nail */}
          <rect x="56" y="42" width="5" height="4" rx="2" fill="#FDDDD2" />
          <rect x="57" y="42" width="3" height="2" rx="1" fill="#FFE8E0" />

          {/* === Cute face on palm === */}

          {/* Eyes - big and round */}
          <ellipse cx="27" cy="38" rx="6" ry="6.5" fill="white" />
          <ellipse cx="41" cy="38" rx="6" ry="6.5" fill="white" />

          {/* Pupils */}
          <circle
            cx={state === "loading" ? "29" : "28"}
            cy={state === "error" ? "40" : "38"}
            r="3.5"
            fill="#2D2B2A"
          />
          <circle
            cx={state === "loading" ? "43" : "42"}
            cy={state === "error" ? "40" : "38"}
            r="3.5"
            fill="#2D2B2A"
          />

          {/* Eye shine */}
          <circle cx="26" cy="36" r="1.5" fill="white" />
          <circle cx="40" cy="36" r="1.5" fill="white" />

          {/* Eyebrows */}
          <path
            d={state === "error" ? "M21 30 Q27 33 32 30" : "M21 30 Q27 27 32 30"}
            stroke="#C4956A"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={state === "error" ? "M36 30 Q41 33 47 30" : "M36 30 Q41 27 47 30"}
            stroke="#C4956A"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Blush */}
          <ellipse cx="21" cy="43" rx="3.5" ry="2" fill="#F0B8A0" opacity="0.5" />
          <ellipse cx="47" cy="43" rx="3.5" ry="2" fill="#F0B8A0" opacity="0.5" />

          {/* Smile */}
          <path
            d={state === "error" ? "M30 48 Q34 46 38 48" : "M29 47 Q34 52 39 47"}
            stroke="#C4956A"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Speech bubble */}
      <div className="relative bg-card border border-card-border rounded-2xl px-4 py-3 card-shadow">
        <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-3 h-3 bg-card border-l border-b border-card-border rotate-45" />
        <p className="text-[1.3rem] text-text-sub leading-relaxed" style={{ fontFamily: "'Poor Story', cursive" }}>{messages[state]}</p>
      </div>
    </div>
  );
}
