"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { useReviewMarks } from "@/lib/useUserData";

interface Word {
  text: string;
  description?: string;
}

interface Week {
  id: string;
  title: string;
  words: Word[];
}

interface Curriculum {
  weeks: Week[];
}

interface ReviewGroup {
  weekTitle: string;
  words: Word[];
}

export default function ReviewPage() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const { marks, isMarked, toggleMark } = useReviewMarks();

  useEffect(() => {
    fetch("/api/curriculum")
      .then((res) => res.json())
      .then((data) => {
        setCurriculum(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group reviewed words by week
  const reviewGroups: ReviewGroup[] = [];
  if (curriculum) {
    for (const week of curriculum.weeks) {
      const reviewedWords = week.words.filter((w) => isMarked(w.text));
      if (reviewedWords.length > 0) {
        reviewGroups.push({ weekTitle: week.title, words: reviewedWords });
      }
    }
  }

  const totalCount = reviewGroups.reduce((sum, g) => sum + g.words.length, 0);

  const clearAll = () => {
    if (!confirm("모든 복습 체크를 해제하시겠습니까?")) return;
    Object.keys(marks).forEach((word) => {
      if (marks[word]) toggleMark(word);
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="max-w-app mx-auto px-4">
          <TopNav />
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

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <TopNav />

        <div className="mt-2 mb-5">
          <h1 className="text-xl font-bold text-text-main tracking-tight">
            복습 목록
          </h1>
          <p className="text-sm text-text-sub mt-1">
            {totalCount > 0
              ? `${totalCount}개의 단어가 복습 목록에 있습니다`
              : "복습할 단어가 없습니다"}
          </p>
        </div>

        {totalCount === 0 ? (
          <div className="bg-card border border-card-border rounded-card p-8 card-shadow text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#E8E0D4" className="mx-auto mb-3">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="text-sm text-text-sub mb-4">
              주차별 단어 목록에서 별표를 눌러<br />복습할 단어를 추가해보세요
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:brightness-105 transition-all"
            >
              주차 목록으로 가기
            </Link>
          </div>
        ) : (
          <>
            {reviewGroups.map((group) => (
              <div key={group.weekTitle} className="mb-4">
                <h3 className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2 px-1">
                  {group.weekTitle}
                </h3>
                <div className="space-y-2">
                  {group.words.map((word) => (
                    <div
                      key={word.text}
                      className="flex items-center gap-3 bg-card border border-card-border rounded-card p-3.5 card-shadow"
                    >
                      <button
                        onClick={() => toggleMark(word.text)}
                        className="flex-shrink-0 w-7 h-7 rounded-lg bg-clay border-2 border-clay flex items-center justify-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                      <Link href={`/word/${encodeURIComponent(word.text)}`} className="flex-1 min-w-0">
                        <span className="text-base font-medium text-text-main">{word.text}</span>
                        {word.description && (
                          <p className="text-xs text-text-sub mt-0.5 line-clamp-1">{word.description}</p>
                        )}
                      </Link>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#A69E94" className="flex-shrink-0">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Clear all button */}
            <button
              onClick={clearAll}
              className="w-full mt-4 py-3 text-sm text-red font-medium border border-red/20 rounded-xl hover:bg-red/5 transition-colors"
            >
              전체 복습 체크 해제
            </button>
          </>
        )}
      </div>
    </main>
  );
}
