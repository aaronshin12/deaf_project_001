"use client";

interface OwlMascotProps {
  state: "idle" | "loading" | "success" | "error";
}

const messages = {
  idle: "문장을 입력해 봐! 🤟",
  loading: "수어로 바꾸는 중...",
  success: "토큰을 눌러서 수어를 확인해!",
  error: "앗, 다시 시도해 볼까?",
};

export default function OwlMascot({ state }: OwlMascotProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="relative">
        {/* Owl SVG */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={state === "loading" ? "animate-bounce" : ""}
        >
          {/* Body */}
          <ellipse cx="40" cy="48" rx="28" ry="28" fill="#58CC02" />
          {/* Belly */}
          <ellipse cx="40" cy="54" rx="18" ry="18" fill="#89E219" />
          {/* Left eye white */}
          <circle cx="30" cy="36" r="12" fill="white" />
          {/* Right eye white */}
          <circle cx="50" cy="36" r="12" fill="white" />
          {/* Left pupil */}
          <circle
            cx={state === "loading" ? "32" : "31"}
            cy={state === "error" ? "38" : "36"}
            r="6"
            fill="#131F24"
          />
          {/* Right pupil */}
          <circle
            cx={state === "loading" ? "52" : "51"}
            cy={state === "error" ? "38" : "36"}
            r="6"
            fill="#131F24"
          />
          {/* Beak */}
          <path d="M36 42 L40 48 L44 42 Z" fill="#FF9600" />
          {/* Left eyebrow */}
          <path
            d="M20 26 Q30 20 38 26"
            stroke="#46A302"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right eyebrow */}
          <path
            d="M42 26 Q50 20 60 26"
            stroke="#46A302"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Feet */}
          <path d="M28 74 L24 80 M32 74 L28 80 M36 74 L32 80" stroke="#FF9600" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 74 L48 80 M48 74 L52 80 M52 74 L56 80" stroke="#FF9600" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      {/* Speech bubble */}
      <div className="relative bg-card border-2 border-card-border rounded-2xl px-4 py-2 max-w-[260px]">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l-2 border-t-2 border-card-border rotate-45" />
        <p className="text-sm text-text-sub text-center">{messages[state]}</p>
      </div>
    </div>
  );
}
