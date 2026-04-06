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
      <div className="bg-[#2D2B2A] rounded-b-3xl px-4 pb-5">
        <div className="max-w-app mx-auto">
          {/* Share button - subtle, top right */}
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
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-xl card-shadow overflow-hidden max-h-64 overflow-y-auto">
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
        {/* My wordbook link - accent color */}
        <Link href="/my-words" className="block mt-5 mb-5">
          <div className="bg-accent/10 border-2 border-accent/30 rounded-card px-4 py-3.5 flex items-center justify-between hover:bg-accent/15 transition-colors">
            <div className="flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#D97757">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
              </svg>
              <span className="text-sm font-bold text-accent">내 단어장</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-accent font-medium">{allWords.length}개</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97757">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Categories - 3 col grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5">
            {categories.map(({ name }) => (
              <Link key={name} href={`/category/${encodeURIComponent(name)}`}>
                <div className="bg-card border border-card-border rounded-card p-3.5 card-shadow text-center hover:border-accent/40 transition-all active:scale-[0.97]">
                  <span className="text-2xl block mb-1">{getEmoji(name)}</span>
                  <span className="text-sm font-bold text-text-main block">{name}</span>
                </div>
              </Link>
            ))}
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
        <footer className="mt-8 text-center pb-4">
          <p className="text-xs text-text-light">
            수어 데이터 출처:{" "}
            <a href="https://sldict.korean.go.kr/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              국립국어원 한국수어사전
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
