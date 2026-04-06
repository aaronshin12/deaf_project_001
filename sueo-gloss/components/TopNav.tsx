"use client";

import Link from "next/link";

export default function TopNav() {
  return (
    <div className="flex items-center gap-2 pt-4 pb-2">
      <Link
        href="/"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-sub hover:text-accent hover:bg-accent/5 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        첫화면
      </Link>
      <Link
        href="/review"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-sub hover:text-clay hover:bg-clay/5 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        복습하기
      </Link>
    </div>
  );
}
