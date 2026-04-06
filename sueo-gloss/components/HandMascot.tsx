"use client";

import { useState } from "react";

interface HandMascotProps {
  state: "idle" | "loading" | "success" | "error";
}

export default function HandMascot({ state }: HandMascotProps) {
  const [tapped, setTapped] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = () => {
    setTapCount((c) => c + 1);
    setTapped(true);
    setTimeout(() => setTapped(false), 800);
  };

  const isWink = tapped && tapCount % 4 === 1;
  const isDizzy = tapped && tapCount % 4 === 2;
  const isHeart = tapped && tapCount % 4 === 3;
  const isJump = tapped && tapCount % 4 === 0;

  return (
    <div className="flex justify-center items-center gap-3 pt-8 pb-4 select-none">
      {/* Speech bubble - appears on tap, left side */}
      <div className="w-20 flex justify-end">
        {tapped && (
          <div className="relative bg-white rounded-2xl px-3 py-1.5 shadow-sm animate-fade-in">
            <div className="absolute top-1/2 -right-[6px] -translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45" />
            <p className="text-base font-bold text-accent whitespace-nowrap">수엉수엉</p>
          </div>
        )}
      </div>

      {/* Owl */}
      <div
        onClick={handleTap}
        className="cursor-pointer"
        style={{
          transform: tapped
            ? isJump
              ? "translateY(-12px) rotate(5deg)"
              : isDizzy
                ? "rotate(-8deg)"
                : "scale(1.1)"
            : "none",
          transition: "transform 0.3s ease",
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={state === "loading" ? "animate-bounce" : ""}
        >
          {/* Left wing - folded against body */}
          <path d="M12 32 Q8 45 14 60 Q18 55 20 42 Z" fill="#C4623F" />
          <path d="M13 34 Q10 45 15 57 Q18 52 19 42 Z" fill="#D97757" />
          {/* Right wing - folded against body */}
          <path d="M60 32 Q64 45 58 60 Q54 55 52 42 Z" fill="#C4623F" />
          <path d="M59 34 Q62 45 57 57 Q54 52 53 42 Z" fill="#D97757" />

          {/* Body */}
          <ellipse cx="36" cy="42" rx="26" ry="26" fill="#D97757" />
          {/* Belly */}
          <ellipse cx="36" cy="48" rx="17" ry="17" fill="#F0B8A0" />

          {/* Left ear tuft */}
          <path d="M16 18 L20 10 L26 20" fill="#C4623F" />
          <path d="M18 18 L21 13 L25 20" fill="#D97757" />
          {/* Right ear tuft */}
          <path d="M46 20 L52 10 L56 18" fill="#C4623F" />
          <path d="M47 20 L51 13 L54 18" fill="#D97757" />

          {/* Left eye white */}
          <circle cx="27" cy="34" r="10" fill="white" />
          {/* Right eye white */}
          <circle cx="45" cy="34" r="10" fill="white" />

          {/* Pupils */}
          {isWink ? (
            <>
              <path d="M22 34 Q27 38 32 34" stroke="#2D2B2A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="46" cy="34" r="5" fill="#2D2B2A" />
            </>
          ) : isDizzy ? (
            <>
              <path d="M24 31 L30 37 M30 31 L24 37" stroke="#2D2B2A" strokeWidth="2" strokeLinecap="round" />
              <path d="M42 31 L48 37 M48 31 L42 37" stroke="#2D2B2A" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
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
            </>
          )}

          {/* Eye shine */}
          {!isWink && !isDizzy && (
            <>
              <circle cx="26" cy="32" r="2" fill="white" />
              <circle cx="44" cy="32" r="2" fill="white" />
            </>
          )}

          {/* Beak */}
          <path d="M32 39 L36 44 L40 39 Z" fill="#C4956A" />

          {/* Eyebrows */}
          <path
            d={
              isDizzy ? "M20 26 Q27 30 34 26" :
              isHeart ? "M20 23 Q27 18 34 23" :
              state === "error" ? "M18 27 Q27 31 34 27" :
              "M18 25 Q27 19 34 25"
            }
            stroke="#C4623F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={
              isDizzy ? "M38 26 Q45 30 52 26" :
              isHeart ? "M38 23 Q45 18 52 23" :
              state === "error" ? "M38 27 Q45 31 54 27" :
              "M38 25 Q45 19 54 25"
            }
            stroke="#C4623F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Blush */}
          <ellipse cx="20" cy="40" rx={tapped ? "5" : "4"} ry={tapped ? "3.5" : "2.5"} fill="#F0B8A0" opacity={tapped ? "0.8" : "0.5"} />
          <ellipse cx="52" cy="40" rx={tapped ? "5" : "4"} ry={tapped ? "3.5" : "2.5"} fill="#F0B8A0" opacity={tapped ? "0.8" : "0.5"} />

          {/* Heart */}
          {isHeart && (
            <text x="50" y="22" fontSize="14" className="animate-pulse">❤️</text>
          )}

          {/* Feet */}
          <path d="M25 66 L21 72 M29 66 L25 72 M33 66 L29 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 66 L43 72 M43 66 L47 72 M47 66 L51 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Right spacer for centering */}
      <div className="w-20" />
    </div>
  );
}
