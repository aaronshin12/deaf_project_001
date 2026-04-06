"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import DictViewer from "@/components/DictViewer";
import NoteEditor from "@/components/NoteEditor";
import WeekLinks from "@/components/WeekLinks";
import { useNotes } from "@/lib/useUserData";

interface Word {
  text: string;
  description?: string;
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
  const [showDict, setShowDict] = useState(false);
  const [wordData, setWordData] = useState<Word | null>(null);
  const [relatedWeeks, setRelatedWeeks] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [signData, setSignData] = useState<SignResult | null>(null);
  const [signLoading, setSignLoading] = useState(true);
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
        <TopNav />

        {/* Word header */}
        <div className="mt-3 mb-5">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">{wordText}</h1>
          {wordData?.description && (
            <p className="text-sm text-text-sub mt-2.5 leading-relaxed">
              {wordData.description}
            </p>
          )}
        </div>

        {/* Sign language video button */}
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
        ) : (
          <>
            {/* Thumbnail preview */}
            {signData?.referenceIdentifier && (
              <div
                className="relative mb-4 rounded-card overflow-hidden card-shadow cursor-pointer"
                onClick={() => setShowDict(true)}
              >
                <img
                  src={signData.referenceIdentifier}
                  alt={`${wordText} 수어`}
                  className="w-full h-48 object-cover bg-bg-warm"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/15 hover:bg-black/25 transition-colors">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#D97757">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Video button */}
            <button
              onClick={() => setShowDict(true)}
              className="w-full btn-soft bg-accent text-white font-semibold py-4 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all text-lg mb-5 flex items-center justify-center gap-2"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              수어 영상 보기
            </button>

            {/* Sign description preview (outside popup) */}
            {signData?.signDescription && (
              <div className="bg-card border border-card-border rounded-card p-4 card-shadow mb-4">
                <h3 className="text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">수형 설명</h3>
                <p className="text-sm text-text-main leading-relaxed">{signData.signDescription}</p>
              </div>
            )}
          </>
        )}

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

        {/* Dictionary viewer popup */}
        {showDict && (
          <DictViewer
            word={wordText}
            signData={signData}
            onClose={() => setShowDict(false)}
          />
        )}
      </div>
    </main>
  );
}
