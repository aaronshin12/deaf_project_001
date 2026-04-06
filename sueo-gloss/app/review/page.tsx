"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { useWordBook } from "@/lib/useUserData";

export default function WordBookPage() {
  const { allWords, customWords, removeWord, addCustomWord, removeCustomWord } = useWordBook();
  const [newWord, setNewWord] = useState("");

  const handleAddCustom = () => {
    if (newWord.trim()) {
      addCustomWord(newWord.trim());
      setNewWord("");
    }
  };

  const sortedWords = [...allWords].sort((a, b) => a.localeCompare(b, "ko"));

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <TopNav />

        <div className="mt-2 mb-5">
          <h1 className="text-xl font-serif font-bold text-text-main tracking-tight">
            내 단어장
          </h1>
          <p className="text-sm text-text-sub mt-1">
            {sortedWords.length > 0
              ? `${sortedWords.length}개의 단어가 저장되어 있습니다`
              : "단어장이 비어 있습니다"}
          </p>
        </div>

        {/* Custom word input */}
        <div className="bg-card border border-card-border rounded-card p-4 card-shadow mb-5">
          <p className="text-sm font-semibold text-text-main mb-2.5">단어 직접 추가</p>
          <div className="flex gap-2">
            <input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
              placeholder="추가할 단어를 입력하세요"
              className="flex-1 bg-bg border border-card-border rounded-xl p-3 text-sm text-text-main placeholder-text-light outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            <button
              onClick={handleAddCustom}
              disabled={!newWord.trim()}
              className="px-5 py-3 bg-accent text-white font-bold text-sm rounded-xl disabled:opacity-40 hover:brightness-105 transition-all"
            >
              추가
            </button>
          </div>
        </div>

        {/* Word list */}
        {sortedWords.length === 0 ? (
          <div className="bg-card border border-card-border rounded-card p-8 card-shadow text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#E8E0D4" className="mx-auto mb-3">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
            <p className="text-sm text-text-sub mb-4">
              주차별 단어 옆의 &quot;단어장 추가&quot; 버튼을 눌러<br />단어를 저장하거나, 위에서 직접 입력해보세요
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:brightness-105 transition-all"
            >
              주차 목록으로 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedWords.map((word) => {
              const isCustom = customWords.includes(word);
              return (
                <div
                  key={word}
                  className="flex items-center gap-3 bg-card border border-card-border rounded-card p-3.5 card-shadow"
                >
                  <Link href={`/word/${encodeURIComponent(word)}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-serif font-medium text-text-main">{word}</span>
                      {isCustom && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">직접추가</span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => isCustom ? removeCustomWord(word) : removeWord(word)}
                    className="flex-shrink-0 text-xs text-text-light hover:text-red transition-colors font-medium"
                  >
                    삭제
                  </button>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#A69E94" className="flex-shrink-0">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
