"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import NoteEditor from "@/components/NoteEditor";
import WeekLinks from "@/components/WeekLinks";
import { useNotes } from "@/lib/useUserData";
import { buildSearchUrl } from "@/lib/buildDictUrl";

interface Word {
  text: string;
  description?: string;
  videoUrl?: string;
}

interface Week {
  id: string;
  title: string;
  words: Word[];
}

interface Curriculum {
  weeks: Week[];
}

interface SignResult {
  title: string;
  url: string;
  referenceIdentifier: string;
  description: string;
  subDescription: string;
  signDescription: string;
  signImages: string;
}

export default function WordPage() {
  const params = useParams();
  const wordText = decodeURIComponent(params.text as string);
  const [wordData, setWordData] = useState<Word | null>(null);
  const [relatedWeeks, setRelatedWeeks] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [signData, setSignData] = useState<SignResult | null>(null);
  const [signLoading, setSignLoading] = useState(true);
  const [signImages, setSignImages] = useState<string[]>([]);
  const { getNote, setNote } = useNotes();

  // Load curriculum data
  useEffect(() => {
    fetch("/api/curriculum")
      .then((res) => res.json())
      .then((data: Curriculum) => {
        for (const week of data.weeks) {
          const found = week.words.find((w) => w.text === wordText);
          if (found && !wordData) {
            setWordData(found);
          }
        }
        const weeks = data.weeks
          .filter((w) => w.words.some((word) => word.text === wordText))
          .map((w) => ({ id: w.id, title: w.title }));
        setRelatedWeeks(weeks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wordText, wordData]);

  // Load sign language data from KCISA API
  useEffect(() => {
    setSignLoading(true);
    fetch(`/api/sign?keyword=${encodeURIComponent(wordText)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const match = data.results.find(
            (r: SignResult) => r.title === wordText || r.title?.includes(wordText)
          ) || data.results[0];
          setSignData(match);
          if (match.signImages) {
            setSignImages(match.signImages.split(",").map((s: string) => s.trim()).filter(Boolean));
          }
        }
        setSignLoading(false);
      })
      .catch(() => setSignLoading(false));
  }, [wordText]);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="max-w-app mx-auto px-4 pt-6">
          <div className="flex justify-center py-16">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <div className="pt-4">
          <BackButton />
        </div>

        {/* Word header */}
        <div className="mt-3 mb-5">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">{wordText}</h1>
          {wordData?.description && (
            <p className="text-sm text-text-sub mt-2.5 leading-relaxed">
              {wordData.description}
            </p>
          )}
        </div>

        {/* Sign language data from KCISA API */}
        {signLoading ? (
          <div className="bg-card border border-card-border rounded-card p-5 card-shadow mb-4">
            <div className="flex items-center gap-2 text-text-sub text-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full loading-dot" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full loading-dot" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full loading-dot" />
              </div>
              수어 정보를 불러오는 중...
            </div>
          </div>
        ) : signData ? (
          <div className="bg-card border border-card-border rounded-card overflow-hidden card-shadow mb-4">
            {/* Thumbnail / Video link */}
            {signData.referenceIdentifier && (
              <div className="relative">
                <img
                  src={signData.referenceIdentifier}
                  alt={`${wordText} 수어`}
                  className="w-full h-48 object-cover bg-bg-warm"
                />
                {signData.url && (
                  <a
                    href={signData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#D97757">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </a>
                )}
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Sign description */}
              {signData.signDescription && (
                <div>
                  <h3 className="text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">수형 설명</h3>
                  <p className="text-sm text-text-main leading-relaxed">{signData.signDescription}</p>
                </div>
              )}

              {/* Content description */}
              {signData.subDescription && (
                <div>
                  <h3 className="text-xs font-semibold text-text-light uppercase tracking-wide mb-1.5">상세 설명</h3>
                  <p className="text-sm text-text-sub leading-relaxed">{signData.subDescription}</p>
                </div>
              )}

              {/* Sign images */}
              {signImages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">수형 이미지</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {signImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${wordText} 수형 ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-xl border border-card-border flex-shrink-0 bg-bg-warm"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Video button */}
              {signData.url && (
                <a
                  href={signData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full btn-soft bg-accent text-white font-semibold py-3.5 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all text-center"
                >
                  수어 영상 보기
                </a>
              )}
            </div>
          </div>
        ) : (
          /* Fallback: no API data */
          <div className="mb-4">
            <a
              href={buildSearchUrl(wordText)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full btn-soft bg-accent text-white font-semibold py-4 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all text-lg text-center flex items-center justify-center gap-2"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              수어사전에서 검색하기
            </a>
          </div>
        )}

        {/* External dictionary link */}
        <a
          href={buildSearchUrl(wordText)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 rounded-xl border border-card-border text-text-sub hover:text-accent hover:border-accent/40 transition-colors text-sm mb-5"
        >
          국립국어원 수어사전에서 직접 검색
        </a>

        {/* Note editor */}
        <div className="mb-4">
          <NoteEditor
            word={wordText}
            note={getNote(wordText)}
            onSave={setNote}
          />
        </div>

        {/* Cross-week links */}
        {relatedWeeks.length > 1 && (
          <div className="mb-4">
            <WeekLinks word={wordText} weeks={relatedWeeks} />
          </div>
        )}
      </div>
    </main>
  );
}
