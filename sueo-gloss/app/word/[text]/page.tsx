"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import DictViewer from "@/components/DictViewer";
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

export default function WordPage() {
  const params = useParams();
  const wordText = decodeURIComponent(params.text as string);
  const [showDict, setShowDict] = useState(false);
  const [wordData, setWordData] = useState<Word | null>(null);
  const [relatedWeeks, setRelatedWeeks] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { getNote, setNote } = useNotes();

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
        <div className="mt-3 mb-6">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">{wordText}</h1>
          {wordData?.description && (
            <p className="text-sm text-text-sub mt-2.5 leading-relaxed">
              {wordData.description}
            </p>
          )}
        </div>

        {/* Sign language video button */}
        <button
          onClick={() => setShowDict(true)}
          className="w-full btn-soft bg-accent text-white font-semibold py-4 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all text-lg mb-3 flex items-center justify-center gap-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          수어 영상 보기
        </button>

        {/* External link */}
        <a
          href={buildSearchUrl(wordText)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 rounded-xl border border-card-border text-text-sub hover:text-accent hover:border-accent/40 transition-colors text-sm mb-6"
        >
          수어사전에서 직접 검색하기
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

        {/* Dictionary viewer bottom sheet */}
        {showDict && (
          <DictViewer
            word={wordText}
            videoUrl={wordData?.videoUrl}
            onClose={() => setShowDict(false)}
          />
        )}
      </div>
    </main>
  );
}
