"use client";

import { buildSearchUrl } from "@/lib/buildDictUrl";

interface DictViewerProps {
  word: string;
  videoUrl?: string;
  onClose: () => void;
}

export default function DictViewer({ word, videoUrl, onClose }: DictViewerProps) {
  const searchUrl = buildSearchUrl(word);

  const handleOpenExternal = () => {
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-app bg-card border-t border-card-border rounded-t-2xl overflow-hidden animate-slide-up max-h-[80vh] flex flex-col card-shadow">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-card-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-card-border">
          <h3 className="text-lg font-semibold text-text-main">{word}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-warm transition-colors text-text-sub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Video player (if videoUrl available) */}
          {videoUrl && (
            <div className="mb-4">
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full rounded-xl bg-bg-warm"
                style={{ maxHeight: "300px" }}
              >
                <source src={videoUrl} />
              </video>
            </div>
          )}

          {/* Open dictionary button */}
          <button
            onClick={handleOpenExternal}
            className="w-full btn-soft bg-accent text-white font-semibold py-4 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all text-base"
          >
            수어사전에서 &apos;{word}&apos; 검색하기
          </button>

          <p className="text-xs text-text-light text-center mt-3 leading-relaxed">
            국립국어원 한국수어사전으로 이동합니다
          </p>
        </div>
      </div>
    </div>
  );
}
