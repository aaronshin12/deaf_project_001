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
        {/* Header */}
        <header className="pt-8 pb-1 text-center">
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            수어글로스
          </h1>
          <p className="text-sm text-text-sub mt-1">
            주차별 한국수어 복습 도구
          </p>
        </header>

        {/* Mascot */}
        <OwlMascot state={loading ? "loading" : "idle"} />

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
