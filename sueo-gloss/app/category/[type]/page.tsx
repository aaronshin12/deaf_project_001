"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { getWordsByCategory, CONSONANT_GROUPS, filterByConsonantGroup } from "@/lib/signData";
import { useWordBook } from "@/lib/useUserData";
import { getEmoji } from "@/lib/categoryEmojis";

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.type as string);
  const allWords = useMemo(() => getWordsByCategory(category), [category]);
  const { isInWordBook, toggleWord } = useWordBook();
  const emoji = getEmoji(category);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const isEtc = category === "기타";

  const words = useMemo(() => {
    if (!isEtc || activeGroup === null) return allWords;
    return filterByConsonantGroup(allWords, CONSONANT_GROUPS[activeGroup].consonants)
      .sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }, [allWords, activeGroup, isEtc]);

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <TopNav />

        <div className="mt-2 mb-4">
          <h1 className="text-xl font-bold text-text-main tracking-tight">{emoji} {category}</h1>
          <p className="text-sm text-text-sub mt-1">{words.length}개 단어</p>
        </div>

        {/* Consonant filter for 기타 */}
        {isEtc && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveGroup(null)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeGroup === null
                  ? "bg-accent text-white"
                  : "bg-card border border-card-border text-text-sub hover:border-accent/30"
              }`}
            >
              전체
            </button>
            {CONSONANT_GROUPS.map((group, i) => (
              <button
                key={group.label}
                onClick={() => setActiveGroup(i)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  activeGroup === i
                    ? "bg-accent text-white"
                    : "bg-card border border-card-border text-text-sub hover:border-accent/30"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2.5">
          {words.map((word) => (
            <div key={word.title} className="flex items-center gap-3 bg-card border border-card-border rounded-card p-3.5 card-shadow hover:border-accent/30 transition-colors">
              <button
                onClick={() => toggleWord(word.title)}
                className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                  isInWordBook(word.title)
                    ? "bg-accent border-accent"
                    : "border-card-border hover:border-accent/50"
                }`}
              >
                {isInWordBook(word.title) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
              <Link href={`/word/${encodeURIComponent(word.title)}`} className="flex-1 min-w-0">
                <span className="text-base font-bold text-text-main">{word.title}</span>
              </Link>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#A69E94" className="flex-shrink-0">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
