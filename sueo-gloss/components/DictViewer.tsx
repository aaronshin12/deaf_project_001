"use client";

import { useState } from "react";

interface SignData {
  url?: string;
  signDescription?: string;
  signImages?: string;
  referenceIdentifier?: string;
  subDescription?: string;
}

interface DictViewerProps {
  word: string;
  signData?: SignData | null;
  onClose: () => void;
}

export default function DictViewer({ word, signData, onClose }: DictViewerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const contentUrl = signData?.url || null;
  const isVideo = contentUrl && (contentUrl.endsWith(".mp4") || contentUrl.endsWith(".webm"));
  const signImages = signData?.signImages
    ? signData.signImages.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleOpenExternal = () => {
    if (contentUrl) window.open(contentUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-app bg-card rounded-t-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col card-shadow">
        {/* Close button - prominent */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white border border-card-border rounded-full flex items-center justify-center shadow-md hover:bg-bg-warm transition-colors"
          aria-label="닫기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#2D2B2A">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-card-border" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3">
          <h3 className="text-xl font-bold text-text-main">{word}</h3>
          <p className="text-xs text-text-sub mt-0.5">수어 영상</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video / iframe area */}
          {contentUrl && (
            <div className="relative bg-bg-warm">
              {isVideo ? (
                <video
                  src={contentUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full"
                  style={{ maxHeight: "360px" }}
                />
              ) : !iframeError ? (
                <>
                  {!iframeLoaded && (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
                        <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
                        <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
                      </div>
                    </div>
                  )}
                  <iframe
                    src={contentUrl}
                    className="w-full border-0"
                    style={{ height: iframeLoaded ? "400px" : "0px" }}
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setIframeError(true)}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    title={`${word} 수어 영상`}
                  />
                </>
              ) : (
                /* iframe blocked fallback */
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <p className="text-sm text-text-sub">영상을 불러올 수 없습니다</p>
                  <button
                    onClick={handleOpenExternal}
                    className="px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:brightness-105 transition-all"
                  >
                    새 탭에서 열기
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sign info section */}
          <div className="p-5 space-y-4">
            {/* Sign description */}
            {signData?.signDescription && (
              <div>
                <h4 className="text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">수형 설명</h4>
                <p className="text-sm text-text-main leading-relaxed">{signData.signDescription}</p>
              </div>
            )}

            {/* Sub description */}
            {signData?.subDescription && (
              <div>
                <h4 className="text-xs font-semibold text-text-light uppercase tracking-wide mb-1.5">상세 설명</h4>
                <p className="text-sm text-text-sub leading-relaxed">{signData.subDescription}</p>
              </div>
            )}

            {/* Sign images */}
            {signImages.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">수형 이미지</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {signImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${word} 수형 ${i + 1}`}
                      className="w-28 h-28 object-cover rounded-xl border border-card-border flex-shrink-0 bg-bg-warm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No data fallback */}
            {!contentUrl && !signData?.signDescription && signImages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-text-sub mb-3">이 단어의 수어 정보를 찾을 수 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
