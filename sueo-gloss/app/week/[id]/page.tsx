"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import WordItem from "@/components/WordItem";
import { useNotes, useWordBook } from "@/lib/useUserData";

interface Word {
  text: string;
  description?: string;
}

interface Week {
  id: string;
  title: string;
  description?: string;
  words: Word[];
}

interface Curriculum {
  weeks: Week[];
}

export default function WeekPage() {
  const params = useParams();
  const weekId = params.id as string;
  const [week, setWeek] = useState<Week | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasNote } = useNotes();
  const { isInWordBook, toggleWord } = useWordBook();

  useEffect(() => {
    fetch("/api/curriculum")
      .then((res) => res.json())
      .then((data: Curriculum) => {
        const found = data.weeks.find((w) => w.id === weekId);
        setWeek(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [weekId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="max-w-app mx-auto px-4 pt-6">
          <div className="flex justify-center py-16">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!week) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="max-w-app mx-auto px-4 pt-6">
          <TopNav />
          <div className="text-center py-16">
            <p className="text-text-sub">주차를 찾을 수 없습니다.</p>
          </div>
        </div>
      </main>
    );
  }

  const wordBookCount = week.words.filter((w) => isInWordBook(w.text)).length;

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <div className="pt-4">
          <TopNav />
        </div>

        {/* Week header */}
        <div className="mt-2 mb-5">
          <h1 className="text-xl font-serif font-bold text-text-main tracking-tight">{week.title}</h1>
          {week.description && (
            <p className="text-sm text-text-sub mt-1.5 leading-relaxed">{week.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-text-light font-medium">
              총 {week.words.length}개 단어
            </span>
            {wordBookCount > 0 && (
              <span className="text-xs text-clay flex items-center gap-1 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                </svg>
                단어장 {wordBookCount}개
              </span>
            )}
          </div>
        </div>

        {/* Word list — sorted alphabetically (가나다순) */}
        <div className="space-y-2.5">
          {[...week.words].sort((a, b) => a.text.localeCompare(b.text, 'ko')).map((word) => (
            <WordItem
              key={word.text}
              text={word.text}
              isReviewed={isInWordBook(word.text)}
              hasNote={hasNote(word.text)}
              onToggleReview={() => toggleWord(word.text)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
