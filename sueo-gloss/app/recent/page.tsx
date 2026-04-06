"use client";

import Link from "next/link";
import TopNav from "@/components/TopNav";
import { useRecentlyViewed } from "@/lib/useUserData";

export default function RecentPage() {
  const { viewed, removeViewed, clearViewed } = useRecentlyViewed();

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <TopNav />

        <div className="mt-2 mb-5 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-main tracking-tight">최근 본 단어</h1>
            <p className="text-sm text-text-sub mt-1">
              {viewed.length > 0 ? `${viewed.length}개의 단어` : "아직 본 단어가 없습니다"}
            </p>
          </div>
          {viewed.length > 0 && (
            <button
              onClick={() => { if (confirm("최근 본 단어를 모두 지울까요?")) clearViewed(); }}
              className="text-xs text-red font-medium mt-1 hover:underline"
            >
              모두 지우기
            </button>
          )}
        </div>

        {viewed.length === 0 ? (
          <div className="bg-card border border-card-border rounded-card p-8 card-shadow text-center">
            <p className="text-sm text-text-sub mb-4">
              카테고리나 검색에서 단어를 탭해보세요
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:brightness-105 transition-all"
            >
              단어 검색하러 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {viewed.map((word) => (
              <div key={word} className="flex items-center gap-3 bg-card border border-card-border rounded-card p-3.5 card-shadow">
                <Link href={`/word/${encodeURIComponent(word)}`} className="flex-1 min-w-0">
                  <span className="text-base font-bold text-text-main">{word}</span>
                </Link>
                <button
                  onClick={() => removeViewed(word)}
                  className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:brightness-90 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
