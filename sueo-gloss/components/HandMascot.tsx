"use client";

interface HandMascotProps {
  state: "idle" | "loading" | "success" | "error";
}

export default function HandMascot({ state }: HandMascotProps) {
  return (
    <div className="flex justify-center py-5">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={state === "loading" ? "animate-bounce" : ""}
      >
        {/* Body */}
        <ellipse cx="36" cy="42" rx="26" ry="26" fill="#D97757" />
        {/* Belly */}
        <ellipse cx="36" cy="48" rx="17" ry="17" fill="#F0B8A0" />
        {/* Left eye white */}
        <circle cx="27" cy="34" r="10" fill="white" />
        {/* Right eye white */}
        <circle cx="45" cy="34" r="10" fill="white" />
        {/* Left pupil */}
        <circle
          cx={state === "loading" ? "29" : "28"}
          cy={state === "error" ? "36" : "34"}
          r="5"
          fill="#2D2B2A"
        />
        {/* Right pupil */}
        <circle
          cx={state === "loading" ? "47" : "46"}
          cy={state === "error" ? "36" : "34"}
          r="5"
          fill="#2D2B2A"
        />
        {/* Eye shine */}
        <circle cx="26" cy="32" r="2" fill="white" />
        <circle cx="44" cy="32" r="2" fill="white" />
        {/* Beak */}
        <path d="M32 39 L36 44 L40 39 Z" fill="#C4956A" />
        {/* Left eyebrow */}
        <path
          d={state === "error" ? "M18 27 Q27 31 34 27" : "M18 25 Q27 19 34 25"}
          stroke="#C4623F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right eyebrow */}
        <path
          d={state === "error" ? "M38 27 Q45 31 54 27" : "M38 25 Q45 19 54 25"}
          stroke="#C4623F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Blush */}
        <ellipse cx="20" cy="40" rx="4" ry="2.5" fill="#F0B8A0" opacity="0.5" />
        <ellipse cx="52" cy="40" rx="4" ry="2.5" fill="#F0B8A0" opacity="0.5" />
        {/* Feet */}
        <path d="M25 66 L21 72 M29 66 L25 72 M33 66 L29 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
        <path d="M39 66 L43 72 M43 66 L47 72 M47 66 L51 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
