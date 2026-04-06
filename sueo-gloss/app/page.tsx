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
      <div className="bg-[#2D2B2A] px-4 pb-5 relative overflow-visible" style={{ zIndex: 20 }}>
        {/* Forest background illustration */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 280" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Moon - yellow, left side */}
          <circle cx="100" cy="40" r="20" fill="#F5D87A" opacity="0.9" />
          <circle cx="108" cy="35" r="16" fill="#2D2B2A" />
          {/* Stars - scattered */}
          <circle cx="50" cy="25" r="2" fill="#F5D87A" opacity="0.7" />
          <circle cx="170" cy="18" r="1.5" fill="#F5D87A" opacity="0.5" />
          <circle cx="250" cy="30" r="2" fill="#F5D87A" opacity="0.6" />
          <circle cx="320" cy="15" r="1.5" fill="#F5D87A" opacity="0.4" />
          <circle cx="400" cy="28" r="2" fill="#F5D87A" opacity="0.7" />
          <circle cx="460" cy="45" r="1.5" fill="#F5D87A" opacity="0.5" />
          <circle cx="30" cy="60" r="1" fill="#F5D87A" opacity="0.4" />
          <circle cx="210" cy="50" r="1.5" fill="#F5D87A" opacity="0.5" />
          <circle cx="490" cy="20" r="2" fill="#F5D87A" opacity="0.6" />
          <circle cx="140" cy="55" r="1" fill="#F5D87A" opacity="0.3" />
          <circle cx="370" cy="50" r="1.5" fill="#F5D87A" opacity="0.4" />
          <circle cx="70" cy="45" r="1" fill="#F5D87A" opacity="0.5" />
          {/* Far trees - more visible */}
          <path d="M-10 280 L30 110 L70 280Z" fill="#3D3A38" />
          <path d="M40 280 L80 130 L120 280Z" fill="#3A3836" />
          <path d="M370 280 L410 120 L450 280Z" fill="#3D3A38" />
          <path d="M430 280 L465 140 L500 280Z" fill="#3A3836" />
          <path d="M200 280 L225 180 L250 280Z" fill="#363433" />
          <path d="M280 280 L310 170 L340 280Z" fill="#343231" />
          {/* Near trees - darker, closer */}
          <path d="M-30 280 L10 150 L50 280Z" fill="#434140" />
          <path d="M470 280 L505 145 L540 280Z" fill="#434140" />
          {/* Ground bushes */}
          <ellipse cx="50" cy="268" rx="45" ry="18" fill="#3F3D3B" />
          <ellipse cx="470" cy="265" rx="40" ry="16" fill="#3F3D3B" />
          <ellipse cx="260" cy="275" rx="50" ry="12" fill="#383635" />
          {/* Leaves */}
          <path d="M95 235 Q105 220 115 235 Q105 228 95 235Z" fill="#454240" />
          <path d="M400 245 Q410 230 420 245 Q410 238 400 245Z" fill="#454240" />
          <path d="M60 215 Q68 205 76 215 Q68 210 60 215Z" fill="#403E3C" />
          <path d="M450 225 Q458 215 466 225 Q458 220 450 225Z" fill="#403E3C" />
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
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#3D3B3A] transition-colors opacity-50 hover:opacity-80"
              aria-label="공유하기"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#8A8480">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>
          </div>
          <HandMascot state="idle" />

          {/* Search - white box */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#A69E94" className="flex-shrink-0 mr-3">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={totalCount > 0 ? `${totalCount.toLocaleString()}개 수어 단어 검색...` : "수어 단어 검색..."}
                className="flex-1 bg-transparent text-text-main placeholder-text-light text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="ml-2 text-text-light hover:text-text-sub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
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
      {/* Wave transition */}
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full -mt-1" preserveAspectRatio="none" style={{ display: 'block' }}>
        <path d="M0 0 L0 40 Q360 80 720 40 Q1080 0 1440 40 L1440 0 Z" fill="#2D2B2A" />
      </svg>

      <div className="max-w-app mx-auto px-4 mt-6">
        {/* Categories - emoji + title, no box around icon */}
        {categories.length > 0 && (
          <div className="grid grid-cols-4 gap-x-3 gap-y-7">
            {categories.map(({ name }) => (
              <Link key={name} href={`/category/${encodeURIComponent(name)}`} className="flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-transform">
                <span className="text-2xl">{getEmoji(name)}</span>
                <span className="text-sm font-bold text-text-main text-center leading-tight">{name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Wordbook + Recently viewed — below categories */}
        <div className="grid grid-cols-2 gap-2.5 mt-6 mb-5">
          <Link href="/my-words">
            <div className="bg-accent/10 border-2 border-accent/30 rounded-xl px-3 py-2.5 hover:bg-accent/15 transition-colors flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#D97757" className="flex-shrink-0">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
              </svg>
              <span className="text-sm font-bold text-accent">내 단어장</span>
            </div>
          </Link>
          <Link href="/recent">
            <div className="bg-card border border-card-border rounded-xl px-3 py-2.5 card-shadow hover:border-accent/30 transition-colors flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#7A7168" className="flex-shrink-0">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
              </svg>
              <span className="text-sm font-bold text-text-main">최근 본 단어</span>
            </div>
          </Link>
        </div>

        {/* Empty state */}
        {totalCount === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-text-sub mb-2">수어 데이터가 아직 없습니다</p>
            <p className="text-xs text-text-light">스크립트를 실행하여 데이터를 다운로드하세요</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center pb-4 space-y-1.5">
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
