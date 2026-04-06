"use client";

import { useState } from "react";
import { buildSearchUrl } from "@/lib/buildDictUrl";

interface DictViewerProps {
  word: string;
  videoUrl?: string;
  onClose: () => void;
}

export default function DictViewer({ word, videoUrl, onClose }: DictViewerProps) {
  const [iframeError, setIframeError] = useState(false);
  const searchUrl = buildSearchUrl(word);

  const handleOpenExternal = () => {
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-app bg-card border-t-2 border-card-border rounded-t-2xl overflow-hidden animate-slide-up max-h-[80vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-card-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-card-border">
          <h3 className="text-lg font-bold text-text-main">{word}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card-border transition-colors text-text-sub"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Video player (if videoUrl available from Culture API) */}
          {videoUrl && (
            <div className="mb-4">
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full rounded-xl bg-bg"
                style={{ maxHeight: "300px" }}
              >
                <source src={videoUrl} />
              </video>
            </div>
          )}

          {/* iframe attempt for dictionary */}
          {!videoUrl && !iframeError && (
            <div className="mb-4">
              <iframe
                src={searchUrl}
                className="w-full rounded-xl border-2 border-card-border"
                style={{ height: "400px" }}
                onError={() => setIframeError(true)}
                sandbox="allow-scripts allow-same-origin"
                title={`${word} 수어사전`}
              />
            </div>
          )}

          {/* Fallback button */}
          {(iframeError || !videoUrl) && (
            <button
              onClick={handleOpenExternal}
              className="w-full btn-3d bg-green text-white font-bold py-4 rounded-xl shadow-[0_4px_0_#46A302] hover:brightness-110 transition-all text-base"
            >
              수어사전에서 &apos;{word}&apos; 검색하기
            </button>
          )}

          <p className="text-xs text-text-sub text-center mt-3">
            국립국어원 한국수어사전에서 수어 영상을 확인합니다
          </p>
        </div>
      </div>
    </div>
  );
}
