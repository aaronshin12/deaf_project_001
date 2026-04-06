"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import HandMascot from "@/components/HandMascot";
import { searchWords, getCategories, getTotalCount } from "@/lib/signData";
import { useWordBook } from "@/lib/useUserData";
import { getEmoji } from "@/lib/categoryEmojis";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ title: string }[]>([]);
  const { allWords } = useWordBook();
  const categories = useMemo(() => {
    const cats = getCategories();
    // "기타"를 항상 마지막으로
    const etc = cats.filter((c) => c.name === "기타");
    const rest = cats.filter((c) => c.name !== "기타");
    return [...rest, ...etc];
  }, []);
  const totalCount = useMemo(() => getTotalCount(), []);

  useEffect(() => {
    if (query.trim()) {
      const results = searchWords(query, 10);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <main className="min-h-screen bg-bg pb-8">
      {/* Dark header: mascot + search */}
      <div className="bg-gradient-to-br from-[#2D1B69] via-[#1E2A5E] to-[#162447] rounded-b-[2rem] px-4 pb-6 relative overflow-hidden">
        {/* Forest background illustration with enhanced colors */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 280" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Moon - glowing, left side */}
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8DC" stopOpacity="1" />
              <stop offset="60%" stopColor="#F5D87A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F5D87A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moonSurface" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBE8" />
              <stop offset="100%" stopColor="#F5D87A" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="40" r="35" fill="url(#moonGlow)" />
          <circle cx="100" cy="40" r="20" fill="url(#moonSurface)" opacity="0.95" />
          <circle cx="108" cy="35" r="16" fill="#1E2A5E" />

          {/* Animated stars - scattered */}
          <circle cx="50" cy="25" r="2" fill="#F5D87A" className="star-twinkle" />
          <circle cx="170" cy="18" r="1.8" fill="#B8A5FF" className="star-float" />
          <circle cx="250" cy="30" r="2.2" fill="#F5D87A" className="star-twinkle-delay" />
          <circle cx="320" cy="15" r="1.5" fill="#B8A5FF" className="star-float-slow" />
          <circle cx="400" cy="28" r="2" fill="#F5D87A" className="star-twinkle-delay-2" />
          <circle cx="460" cy="45" r="1.8" fill="#B8A5FF" className="star-twinkle" />
          <circle cx="30" cy="60" r="1.2" fill="#F5D87A" className="star-float-slow" />
          <circle cx="210" cy="50" r="1.5" fill="#B8A5FF" className="star-twinkle-delay" />
          <circle cx="490" cy="20" r="2" fill="#F5D87A" className="star-float" />
          <circle cx="140" cy="55" r="1.2" fill="#B8A5FF" className="star-twinkle-delay-2" />
          <circle cx="370" cy="50" r="1.5" fill="#F5D87A" className="star-float-slow" />
          <circle cx="70" cy="45" r="1.3" fill="#B8A5FF" className="star-twinkle" />
          {/* Extra stars for density */}
          <circle cx="190" cy="38" r="1" fill="#F5D87A" className="star-twinkle-delay" />
          <circle cx="430" cy="12" r="1.5" fill="#B8A5FF" className="star-float" />
          <circle cx="280" cy="55" r="1.2" fill="#F5D87A" className="star-twinkle-delay-2" />
          <circle cx="510" cy="50" r="1" fill="#B8A5FF" className="star-float-slow" />

          {/* Far trees - deep purple tones */}
          <path d="M-10 280 L30 110 L70 280Z" fill="#251850" />
          <path d="M40 280 L80 130 L120 280Z" fill="#221648" />
          <path d="M370 280 L410 120 L450 280Z" fill="#251850" />
          <path d="M430 280 L465 140 L500 280Z" fill="#221648" />
          <path d="M200 280 L225 180 L250 280Z" fill="#1F1440" />
          <path d="M280 280 L310 170 L340 280Z" fill="#1D1238" />
          {/* Near trees - darker, closer */}
          <path d="M-30 280 L10 150 L50 280Z" fill="#2A1D55" />
          <path d="M470 280 L505 145 L540 280Z" fill="#2A1D55" />
          {/* Ground bushes */}
          <ellipse cx="50" cy="268" rx="45" ry="18" fill="#231750" />
          <ellipse cx="470" cy="265" rx="40" ry="16" fill="#231750" />
          <ellipse cx="260" cy="275" rx="50" ry="12" fill="#1E1340" />
          {/* Leaves - subtle purple tint */}
          <path d="M95 235 Q105 220 115 235 Q105 228 95 235Z" fill="#2E1F5A" />
          <path d="M400 245 Q410 230 420 245 Q410 238 400 245Z" fill="#2E1F5A" />
          <path d="M60 215 Q68 205 76 215 Q68 210 60 215Z" fill="#291A52" />
          <path d="M450 225 Q458 215 466 225 Q458 220 450 225Z" fill="#291A52" />
        </svg>
        <div className="max-w-app mx-auto relative z-10">
          {/* Share button */}
          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "수엉이", url: window.location.origin });
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  alert("링크가 복사되었습니다!");
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors opacity-60 hover:opacity-90"
              aria-label="공유하기"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>
          </div>
          <HandMascot state="idle" />

          {/* Search - glassmorphism */}
          <div className="relative">
            <div className="flex items-center glass-search rounded-2xl px-4 py-3.5 shadow-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)" className="flex-shrink-0 mr-3">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={totalCount > 0 ? `${totalCount.toLocaleString()}개 수어 단어 검색...` : "수어 단어 검색..."}
                className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none font-medium"
              />
              {query && (
                <button onClick={() => setQuery("")} className="ml-2 text-white/40 hover:text-white/70 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-card border border-card-border rounded-2xl shadow-card-hover overflow-hidden max-h-64 overflow-y-auto">
                {searchResults.map((word) => (
                  <Link
                    key={word.title}
                    href={`/word/${encodeURIComponent(word.title)}`}
                    className="block px-4 py-3 text-sm text-text-main hover:bg-bg-warm transition-colors border-b border-card-border last:border-0"
                    onClick={() => setQuery("")}
                  >
                    <span className="font-bold">{word.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-app mx-auto px-4">
        {/* My wordbook link - gradient button */}
        <Link href="/my-words" className="block mt-5 mb-5">
          <div className="wordbook-gradient rounded-2xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-white">내 단어장</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-semibold bg-white/15 px-2.5 py-1 rounded-full">{allWords.length}개</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.7">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Categories - 3 col grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {categories.map(({ name }, index) => (
              <Link key={name} href={`/category/${encodeURIComponent(name)}`}>
                <div className={`cat-gradient-${index % 16} border border-white/60 rounded-2xl p-4 card-shadow text-center card-lift`}>
                  <span className="text-[1.7rem] block mb-1.5 drop-shadow-sm">{getEmoji(name)}</span>
                  <span className="text-[13px] font-bold text-text-main block leading-tight">{name}</span>
                </div>
              </Link>
            ))}
            {/* Fill remaining grid cells with owls on branch */}
            {categories.length % 3 !== 0 && (
              <div className={`rounded-2xl p-2 flex items-end justify-center ${categories.length % 3 === 1 ? "col-span-2" : ""}`}>
                <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-80">
                  {/* Branch */}
                  <path d="M0 60 Q40 50 70 55 Q100 60 140 52" stroke="#7C5CFC" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />
                  <path d="M60 55 Q55 45 50 35" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />
                  {/* Leaves on branch */}
                  <path d="M45 38 Q50 30 55 38 Q50 34 45 38Z" fill="#5B8C6F" opacity="0.5" />
                  <path d="M48 32 Q53 24 58 32 Q53 28 48 32Z" fill="#5B8C6F" opacity="0.35" />
                  {/* Owl 1 - big */}
                  <ellipse cx="40" cy="46" rx="12" ry="12" fill="#7C5CFC" />
                  <ellipse cx="40" cy="50" rx="8" ry="8" fill="#B8A5FF" />
                  <circle cx="36" cy="43" r="4.5" fill="white" />
                  <circle cx="44" cy="43" r="4.5" fill="white" />
                  <circle cx="37" cy="43" r="2.2" fill="#1A1625" />
                  <circle cx="45" cy="43" r="2.2" fill="#1A1625" />
                  <path d="M38 47 L40 50 L42 47Z" fill="#C4956A" />
                  <path d="M30 36 L33 30 L37 37" fill="#5A3ED9" />
                  <path d="M43 37 L47 30 L50 36" fill="#5A3ED9" />
                  {/* Owl 2 - small */}
                  <ellipse cx="75" cy="48" rx="9" ry="9" fill="#7C5CFC" />
                  <ellipse cx="75" cy="51" rx="6" ry="6" fill="#B8A5FF" />
                  <circle cx="72" cy="46" r="3.5" fill="white" />
                  <circle cx="78" cy="46" r="3.5" fill="white" />
                  <circle cx="73" cy="46" r="1.8" fill="#1A1625" />
                  <circle cx="79" cy="46" r="1.8" fill="#1A1625" />
                  <path d="M74 49 L75 51 L76 49Z" fill="#C4956A" />
                  <path d="M67 40 L69 36 L72 41" fill="#5A3ED9" />
                  <path d="M78 41 L81 36 L83 40" fill="#5A3ED9" />
                  {/* Owl 3 - tiny, sleeping */}
                  <ellipse cx="105" cy="49" rx="7" ry="7" fill="#7C5CFC" />
                  <ellipse cx="105" cy="51" rx="5" ry="5" fill="#B8A5FF" />
                  <path d="M101 47 Q103 49 105 47" stroke="#1A1625" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M105 47 Q107 49 109 47" stroke="#1A1625" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M104 50 L105 51.5 L106 50Z" fill="#C4956A" />
                  <path d="M99 42 L101 39 L103 43" fill="#5A3ED9" />
                  <path d="M107 43 L109 39 L111 42" fill="#5A3ED9" />
                  {/* Zzz */}
                  <text x="112" y="40" fontSize="8" fill="#9B93AD" opacity="0.6">z</text>
                  <text x="117" y="35" fontSize="6" fill="#9B93AD" opacity="0.4">z</text>
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {totalCount === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-text-sub mb-2">수어 데이터가 아직 없습니다</p>
            <p className="text-xs text-text-light">스크립트를 실행하여 데이터를 다운로드하세요</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center pb-4 space-y-1.5">
          <p className="text-xs text-text-light">
            수어 데이터 출처:{" "}
            <a href="https://sldict.korean.go.kr/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              국립국어원 한국수어사전
            </a>
          </p>
          <p className="text-[10px] text-text-light">
            © 2026 수엉이. 비상업적 용도로만 사용 가능합니다.
          </p>
        </footer>
      </div>
    </main>
  );
}
