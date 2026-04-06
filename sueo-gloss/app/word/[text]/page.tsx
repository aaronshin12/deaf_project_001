"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import { useWordBook } from "@/lib/useUserData";
import { getWord } from "@/lib/signData";
import { buildSearchUrl } from "@/lib/buildDictUrl";

export default function WordPage() {
  const params = useParams();
  const wordText = decodeURIComponent(params.text as string);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const { isInWordBook, toggleWord } = useWordBook();

  const signData = useMemo(() => getWord(wordText), [wordText]);
  const iframeSrc = signData?.url || buildSearchUrl(wordText);
  const inWordBook = isInWordBook(wordText);
  const signImages = signData?.signImages
    ? signData.signImages.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleRefreshIframe = () => {
    setIframeLoaded(false);
    setIframeKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <TopNav showBack />

        {/* Word header + wordbook button */}
        <div className="mt-3 mb-4 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">{wordText}</h1>
          <button
            onClick={() => toggleWord(wordText)}
            className={`flex-shrink-0 mt-1 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
              inWordBook
                ? "bg-accent/10 text-accent border border-accent/30"
                : "bg-accent text-white shadow-[0_2px_0_#C4623F] btn-soft"
            }`}
          >
            {inWordBook ? "추가됨 ✓" : "단어장 추가"}
          </button>
        </div>

        {/* Sign data - no labels */}
        {signData && (signData.signDescription || signImages.length > 0) && (
          <div className="bg-card border border-card-border rounded-card p-4 card-shadow mb-4 space-y-3">
            {signData.signDescription && (
              <p className="text-base text-text-main leading-relaxed">{signData.signDescription}</p>
            )}
            {signImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {signImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${wordText} 수형 ${i + 1}`}
                    className="w-28 h-28 object-cover rounded-xl border border-card-border flex-shrink-0 bg-bg-warm"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sign language dictionary iframe */}
        <div className="bg-card border border-card-border rounded-card overflow-hidden card-shadow mb-4">
          <div className="px-4 py-2.5 border-b border-card-border flex items-center justify-between">
            <span className="text-xs font-semibold text-text-sub">수어사전</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefreshIframe}
                className="text-xs text-text-sub hover:text-accent transition-colors flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                새로고침
              </button>
              <a href={iframeSrc} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                새 탭
              </a>
            </div>
          </div>
          <div className="relative" style={{ height: "480px" }}>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-warm">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-accent rounded-full loading-dot" />
                    <span className="w-2.5 h-2.5 bg-accent rounded-full loading-dot" />
                    <span className="w-2.5 h-2.5 bg-accent rounded-full loading-dot" />
                  </div>
                  <p className="text-sm text-text-sub">수어사전을 불러오는 중...</p>
                </div>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={iframeSrc}
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title={`${wordText} 수어사전`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
