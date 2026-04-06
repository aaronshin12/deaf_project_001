"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import WordItem from "@/components/WordItem";
import { useNotes, useReviewMarks } from "@/lib/useUserData";

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
  const { isMarked, toggleMark } = useReviewMarks();

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

  const reviewCount = week.words.filter((w) => isMarked(w.text)).length;

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <div className="pt-4">
          <TopNav />
        </div>

        {/* Week header */}
        <div className="mt-2 mb-5">
          <h1 className="text-xl font-bold text-text-main tracking-tight">{week.title}</h1>
          {week.description && (
            <p className="text-sm text-text-sub mt-1.5 leading-relaxed">{week.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-text-light font-medium">
              총 {week.words.length}개 단어
            </span>
            {reviewCount > 0 && (
              <span className="text-xs text-clay flex items-center gap-1 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                복습 {reviewCount}개
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
              isReviewed={isMarked(word.text)}
              hasNote={hasNote(word.text)}
              onToggleReview={() => toggleMark(word.text)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
