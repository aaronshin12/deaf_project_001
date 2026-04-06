"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import { useWordBook } from "@/lib/useUserData";
import { getWord } from "@/lib/signData";
import { buildSearchUrl } from "@/lib/buildDictUrl";

export default function WordPage() {
  const params = useParams();
  const wordText = decodeURIComponent(params.text as string);
  const { isInWordBook, toggleWord } = useWordBook();

  const signData = useMemo(() => getWord(wordText), [wordText]);
  const inWordBook = isInWordBook(wordText);
  const videoUrl = signData?.subDescription || "";
  const thumbnail = signData?.referenceIdentifier || "";
  const signImages = signData?.signImages
    ? signData.signImages.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const fallbackUrl = signData?.url || buildSearchUrl(wordText);

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

        {/* Video player - direct MP4 */}
        {videoUrl ? (
          <div className="bg-card border border-card-border rounded-card overflow-hidden card-shadow mb-4">
            <video
              src={videoUrl.replace("http://", "https://")}
              poster={thumbnail ? thumbnail.replace("http://", "https://") : undefined}
              controls
              playsInline
              preload="none"
              className="w-full"
            />
          </div>
        ) : (
          /* Fallback: iframe for custom words without video data */
          <div className="bg-card border border-card-border rounded-card overflow-hidden card-shadow mb-4">
            <div className="px-4 py-2.5 border-b border-card-border">
              <span className="text-xs font-semibold text-text-sub">수어사전</span>
            </div>
            <iframe
              src={fallbackUrl}
              className="w-full border-0"
              style={{ height: "480px" }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title={`${wordText} 수어사전`}
            />
          </div>
        )}

        {/* Sign description + images — no box separation */}
        {(signData?.signDescription || signImages.length > 0) && (
          <div className="px-1 mb-4 space-y-3">
            {signData?.signDescription && (
              <p className="text-base text-text-main leading-relaxed">{signData.signDescription}</p>
            )}
            {signImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {signImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.replace("http://", "https://")}
                    alt={`${wordText} 수형 ${i + 1}`}
                    className="w-28 h-28 object-cover rounded-xl border border-card-border flex-shrink-0 bg-bg-warm"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Data warning */}
        <div className="bg-red/5 border border-red/20 rounded-xl px-4 py-3 mt-4 mb-2">
          <p className="text-sm text-red text-center font-medium">
            ⚠️ 영상 재생 시 데이터 이용료가 발생할 수 있습니다. 와이파이 이용을 권장합니다.
          </p>
        </div>

        {/* Dictionary link */}
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3 text-xs text-text-light hover:text-accent transition-colors"
        >
          수어사전에서 보기 →
        </a>
      </div>
    </main>
  );
}
