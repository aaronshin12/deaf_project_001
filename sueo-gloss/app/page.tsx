"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import HandMascot from "@/components/HandMascot";
import { searchWords, getCategories, getTotalCount } from "@/lib/signData";
import { useWordBook } from "@/lib/useUserData";

const categoryEmojis: Record<string, string> = {
  "개념": "💡",
  "경제생활": "💰",
  "교육": "📚",
  "동식물": "🐾",
  "문화": "🎭",
  "일상생활": "🏠",
  "식생활": "🍚",
  "의생활": "👕",
  "인사": "🤝",
  "감정": "😊",
  "직업": "💼",
  "장소": "📍",
  "교통": "🚌",
  "날씨": "🌤",
  "건강": "❤️",
  "가족": "👨‍👩‍👧",
  "시간": "⏰",
  "숫자": "🔢",
  "기타": "📋",
};

function getEmoji(category: string): string {
  for (const [key, emoji] of Object.entries(categoryEmojis)) {
    if (category.includes(key)) return emoji;
  }
  return "📋";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ title: string }[]>([]);
  const { allWords } = useWordBook();
  const categories = useMemo(() => getCategories(), []);
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
      <div className="max-w-app mx-auto px-4">
        {/* Mascot */}
        <HandMascot state="idle" />

        {/* Search */}
        <div className="relative mb-4">
          <div className="flex items-center bg-card border border-card-border rounded-xl px-4 py-3 card-shadow focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
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
                  <span className="font-serif font-bold">{word.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My wordbook link */}
        <Link href="/my-words" className="block mb-5">
          <div className="bg-card border border-card-border rounded-card px-4 py-3.5 card-shadow flex items-center justify-between hover:border-accent/40 transition-colors">
            <div className="flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#C4956A">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
              </svg>
              <span className="text-sm font-bold text-text-main">내 단어장</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-sub font-medium">{allWords.length}개</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#A69E94">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-sub mb-3 px-1">카테고리별 둘러보기</p>
            <div className="grid grid-cols-3 gap-2.5">
              {categories.map(({ name, count }) => (
                <Link key={name} href={`/category/${encodeURIComponent(name)}`}>
                  <div className="bg-card border border-card-border rounded-card p-3.5 card-shadow text-center hover:border-accent/40 transition-all active:scale-[0.97]">
                    <span className="text-2xl block mb-1">{getEmoji(name)}</span>
                    <span className="text-xs font-serif font-bold text-text-main block">{name}</span>
                    <span className="text-[10px] text-text-light">{count}개</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no data */}
        {totalCount === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-text-sub mb-2">수어 데이터가 아직 없습니다</p>
            <p className="text-xs text-text-light">
              스크립트를 실행하여 데이터를 다운로드하세요
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center pb-4">
          <p className="text-xs text-text-light">
            수어 데이터 출처:{" "}
            <a
              href="https://sldict.korean.go.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              국립국어원 한국수어사전
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
