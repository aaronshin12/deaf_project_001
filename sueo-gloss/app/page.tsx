"use client";

import { useState, useEffect } from "react";
import OwlMascot from "@/components/OwlMascot";
import WeekCard from "@/components/WeekCard";
import Link from "next/link";

interface Word {
  text: string;
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
        <div className="mt-2 mb-6">
          <Link
            href="/review"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-clay-light border border-clay/30 rounded-card text-text-main font-bold text-sm hover:bg-clay/15 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C4956A">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
            내 단어장
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
          <div className="space-y-3">
            {curriculum.weeks.map((week) => (
              <WeekCard
                key={week.id}
                id={week.id}
                title={week.title}
              />
            ))}
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
