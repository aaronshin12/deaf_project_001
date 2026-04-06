"use client";

import { useState, useEffect } from "react";
import OwlMascot from "@/components/OwlMascot";
import WeekCard from "@/components/WeekCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
        {/* Top nav: 내 단어장 (left) + refresh (right) */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <Link
            href="/review"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-card border border-card-border text-text-main hover:border-clay/40 transition-colors card-shadow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C4956A">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
            내 단어장
          </Link>
          <button
            onClick={() => { router.refresh(); window.location.reload(); }}
            className="w-10 h-10 rounded-xl bg-card border border-card-border flex items-center justify-center hover:border-accent/40 transition-colors card-shadow"
            aria-label="새로고침"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#7A7168">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
          </button>
        </div>

        {/* Mascot - left aligned with speech bubble on right */}
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
          <div className="flex flex-col gap-3.5 mt-4">
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
