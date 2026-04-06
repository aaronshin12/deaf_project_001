"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import NoteEditor from "@/components/NoteEditor";
import WeekLinks from "@/components/WeekLinks";
import { useNotes } from "@/lib/useUserData";
import { buildSearchUrl } from "@/lib/buildDictUrl";

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

export default function WordPage() {
  const params = useParams();
  const wordText = decodeURIComponent(params.text as string);
  const [wordData, setWordData] = useState<Word | null>(null);
  const [relatedWeeks, setRelatedWeeks] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
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

  const searchUrl = buildSearchUrl(wordText);

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
        <div className="mt-3 mb-4">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">{wordText}</h1>
          {wordData?.description && (
            <p className="text-sm text-text-sub mt-2 leading-relaxed">
              {wordData.description}
            </p>
          )}
        </div>

        {/* Sign language dictionary - inline iframe */}
        <div className="bg-card border border-card-border rounded-card overflow-hidden card-shadow mb-4">
          <div className="px-4 py-2.5 border-b border-card-border flex items-center justify-between">
            <span className="text-xs font-semibold text-text-sub">수어사전</span>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              새 탭에서 열기
            </a>
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
              src={searchUrl}
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title={`${wordText} 수어사전`}
            />
          </div>
        </div>

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
