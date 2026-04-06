"use client";

import Link from "next/link";

interface WeekCardProps {
  id: string;
  title: string;
  description?: string;
  wordCount: number;
  reviewCount: number;
  noteCount: number;
}

export default function WeekCard({
  id,
  title,
  description,
  wordCount,
  reviewCount,
  noteCount,
}: WeekCardProps) {
  const progress = wordCount > 0 ? Math.round((noteCount / wordCount) * 100) : 0;

  return (
    <Link href={`/week/${id}`}>
      <div className="bg-card border border-card-border rounded-card p-4 card-shadow hover:border-accent/40 transition-all active:scale-[0.98]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-main truncate">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-text-sub mt-1 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-sm font-bold text-accent">{wordCount}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-text-sub mb-1.5">
            <span>학습 진행률</span>
            <span className="text-accent font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-bg-warm rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-3">
          {reviewCount > 0 && (
            <span className="text-xs text-clay flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {reviewCount}
            </span>
          )}
          {noteCount > 0 && (
            <span className="text-xs text-sage flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              {noteCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
