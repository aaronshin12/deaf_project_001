"use client";

import Link from "next/link";

interface WordItemProps {
  text: string;
  description?: string;
  isReviewed: boolean;
  hasNote: boolean;
  onToggleReview: () => void;
}

export default function WordItem({
  text,
  description,
  isReviewed,
  hasNote,
  onToggleReview,
}: WordItemProps) {
  return (
    <div className="flex items-center gap-3 bg-card border border-card-border rounded-card p-3.5 card-shadow hover:border-accent/30 transition-colors">
      {/* Review checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleReview();
        }}
        className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
          isReviewed
            ? "bg-clay border-clay"
            : "border-card-border hover:border-clay/50"
        }`}
        aria-label={isReviewed ? "복습 체크 해제" : "복습 체크"}
      >
        {isReviewed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </button>

      {/* Word content - link to detail */}
      <Link
        href={`/word/${encodeURIComponent(text)}`}
        className="flex-1 min-w-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-text-main">
            {text}
          </span>
          {hasNote && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#5B8C6F"
              className="flex-shrink-0"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          )}
        </div>
        {description && (
          <p className="text-xs text-text-sub mt-0.5 line-clamp-1 leading-relaxed">
            {description}
          </p>
        )}
      </Link>

      {/* Arrow */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="#A69E94"
        className="flex-shrink-0"
      >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </div>
  );
}
