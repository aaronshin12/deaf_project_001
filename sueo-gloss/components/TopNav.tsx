"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopNavProps {
  showBack?: boolean;
}

export default function TopNav({ showBack = false }: TopNavProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-[#2D1B69] via-[#1E2A5E] to-[#162447] -mx-4 px-4 mb-4 rounded-b-2xl">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              이전 화면
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              첫화면
            </Link>
          )}
        </div>

        <button
          onClick={() => { router.refresh(); window.location.reload(); }}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors backdrop-blur-sm"
          aria-label="새로고침"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
