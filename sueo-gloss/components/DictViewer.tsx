"use client";

import { useState } from "react";
import { buildSearchUrl } from "@/lib/buildDictUrl";

interface DictViewerProps {
  word: string;
  onClose: () => void;
}

export default function DictViewer({ word, onClose }: DictViewerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const searchUrl = buildSearchUrl(word);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-app bg-card rounded-t-2xl overflow-hidden animate-slide-up flex flex-col card-shadow" style={{ height: "85vh" }}>
        {/* Close button - prominent */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white border border-card-border rounded-full flex items-center justify-center shadow-lg hover:bg-bg-warm transition-colors"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#2D2B2A">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-card-border" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-main">{word}</h3>
            <p className="text-xs text-text-sub">국립국어원 한국수어사전</p>
          </div>
        </div>

        {/* iframe content */}
        <div className="flex-1 relative">
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
            src={searchUrl}
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title={`${word} 수어사전`}
          />
        </div>
      </div>
    </div>
  );
}
