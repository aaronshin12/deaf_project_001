"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { useWordBook } from "@/lib/useUserData";
import { searchWords } from "@/lib/signData";

export default function MyWordsPage() {
  const { allWords, customWords, removeWord, addWord, removeCustomWord } = useWordBook();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ title: string }[]>([]);

  const sortedWords = [...allWords].sort((a, b) => a.localeCompare(b, "ko"));

  useEffect(() => {
    if (query.trim()) {
      const results = searchWords(query, 10);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleAddFromSearch = (word: string) => {
    addWord(word);
    setQuery("");
    setSearchResults([]);
  };

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <TopNav showBack />

        <div className="mt-2 mb-4">
          <h1 className="text-xl font-bold text-text-main tracking-tight">내 단어장</h1>
          <p className="text-sm text-text-sub mt-1">
            {sortedWords.length > 0 ? `${sortedWords.length}개의 단어` : "저장된 단어가 없습니다"}
          </p>
        </div>

        {/* Search to add */}
        <div className="relative mb-5">
          <div className="flex items-center bg-card border border-card-border rounded-xl px-4 py-3 card-shadow focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#A69E94" className="flex-shrink-0 mr-3">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="단어 검색하여 추가..."
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

          {/* Search results dropdown - tap to add */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-xl card-shadow overflow-hidden max-h-64 overflow-y-auto">
              {searchResults.map((word) => {
                const alreadyAdded = allWords.includes(word.title);
                return (
                  <button
                    key={word.title}
                    onClick={() => !alreadyAdded && handleAddFromSearch(word.title)}
                    className={`block w-full text-left px-4 py-3 text-sm border-b border-card-border last:border-0 transition-colors ${
                      alreadyAdded
                        ? "text-text-light bg-bg-warm"
                        : "text-text-main hover:bg-bg-warm"
                    }`}
                  >
                    <span className="font-bold">{word.title}</span>
                    {alreadyAdded && (
                      <span className="ml-2 text-xs text-accent">추가됨</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Word list */}
        {sortedWords.length === 0 ? (
          <div className="bg-card border border-card-border rounded-card p-8 card-shadow text-center">
            <p className="text-sm text-text-sub mb-4">
              위 검색창에서 단어를 검색하여 추가하거나<br />카테고리에서 단어를 저장해보세요
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:brightness-105 transition-all"
            >
              단어 검색하러 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedWords.map((word) => {
              const isCustom = customWords.includes(word);
              return (
                <div key={word} className="flex items-center gap-3 bg-card border border-card-border rounded-card p-3.5 card-shadow">
                  <Link href={`/word/${encodeURIComponent(word)}`} className="flex-1 min-w-0">
                    <span className="text-base font-bold text-text-main">{word}</span>
                  </Link>
                  <button
                    onClick={() => isCustom ? removeCustomWord(word) : removeWord(word)}
                    className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:brightness-90 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
