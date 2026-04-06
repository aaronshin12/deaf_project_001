"use client";

import { useState, useEffect } from "react";
import OwlMascot from "@/components/OwlMascot";
import WeekCard from "@/components/WeekCard";
import { useNotes, useReviewMarks } from "@/lib/useUserData";
import Link from "next/link";

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

export default function Home() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasNote } = useNotes();
  const { isMarked } = useReviewMarks();

  useEffect(() => {
    fetch("/api/curriculum")
      .then((res) => res.json())
      .then((data) => {
        setCurriculum(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        {/* Mascot */}
        <div className="pt-6">
          <OwlMascot state={loading ? "loading" : "idle"} />
        </div>

        {/* Review button */}
        <div className="mt-2 mb-4">
          <Link
            href="/review"
            className="flex items-center justify-center gap-2 w-full py-3 bg-clay-light border border-clay/20 rounded-card text-clay font-semibold text-sm hover:bg-clay/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            복습 목록 보기
          </Link>
        </div>

        {/* Week list */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
            </div>
          </div>
        ) : curriculum?.weeks ? (
          <div className="mt-4 space-y-3">
            {curriculum.weeks.map((week) => {
              const reviewCount = week.words.filter((w) =>
                isMarked(w.text)
              ).length;
              const noteCount = week.words.filter((w) =>
                hasNote(w.text)
              ).length;

              return (
                <WeekCard
                  key={week.id}
                  id={week.id}
                  title={week.title}
                  description={week.description}
                  wordCount={week.words.length}
                  reviewCount={reviewCount}
                  noteCount={noteCount}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-sub">커리큘럼이 아직 없습니다.</p>
          </div>
        )}

        {/* Admin link */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="text-xs text-text-light hover:text-accent transition-colors"
          >
            관리자 페이지
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center pb-4">
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
