"use client";

import Link from "next/link";

interface WeekLinkInfo {
  id: string;
  title: string;
}

interface WeekLinksProps {
  word: string;
  weeks: WeekLinkInfo[];
  currentWeekId?: string;
}

export default function WeekLinks({ word, weeks, currentWeekId }: WeekLinksProps) {
  const otherWeeks = weeks.filter((w) => w.id !== currentWeekId);

  if (otherWeeks.length === 0) return null;

  return (
    <div className="bg-card border border-card-border rounded-card p-4 card-shadow">
      <p className="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#D97757">
          <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" />
        </svg>
        &apos;{word}&apos;이(가) 등장한 다른 주차
      </p>
      <div className="flex flex-wrap gap-2">
        {otherWeeks.map((week) => (
          <Link
            key={week.id}
            href={`/week/${week.id}`}
            className="px-3 py-1.5 text-sm rounded-full border border-accent/30 text-accent hover:bg-accent/5 transition-colors font-medium"
          >
            {week.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
