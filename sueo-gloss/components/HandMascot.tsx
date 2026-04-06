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

  // Easter egg: different reactions based on tap count
  const isWink = tapped && tapCount % 4 === 1;
  const isDizzy = tapped && tapCount % 4 === 2;
  const isHeart = tapped && tapCount % 4 === 3;
  const isJump = tapped && tapCount % 4 === 0;

  return (
    <div className="flex justify-center py-5 select-none">
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

          {/* Pupils - wink: left eye closed */}
          {isWink ? (
            <>
              <path d="M22 34 Q27 38 32 34" stroke="#2D2B2A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="46" cy="34" r="5" fill="#2D2B2A" />
            </>
          ) : isDizzy ? (
            <>
              {/* Spinning eyes */}
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

          {/* Eye shine (hidden during wink/dizzy) */}
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
              state === "error" ? "M18 27 Q27 31 34 27" :
              isHeart ? "M20 23 Q27 18 34 23" :
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
              state === "error" ? "M38 27 Q45 31 54 27" :
              isHeart ? "M38 23 Q45 18 52 23" :
              "M38 25 Q45 19 54 25"
            }
            stroke="#C4623F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Blush - bigger when tapped */}
          <ellipse cx="20" cy="40" rx={tapped ? "5" : "4"} ry={tapped ? "3.5" : "2.5"} fill="#F0B8A0" opacity={tapped ? "0.8" : "0.5"} />
          <ellipse cx="52" cy="40" rx={tapped ? "5" : "4"} ry={tapped ? "3.5" : "2.5"} fill="#F0B8A0" opacity={tapped ? "0.8" : "0.5"} />

          {/* Heart (easter egg) */}
          {isHeart && (
            <text x="50" y="22" fontSize="14" className="animate-pulse">❤️</text>
          )}

          {/* Feet */}
          <path d="M25 66 L21 72 M29 66 L25 72 M33 66 L29 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 66 L43 72 M43 66 L47 72 M47 66 L51 72" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
