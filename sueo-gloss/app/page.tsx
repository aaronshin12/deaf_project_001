"use client";

import { useState, useCallback } from "react";
import OwlMascot from "@/components/OwlMascot";
import GlossInput from "@/components/GlossInput";
import GlossResult, { GlossData } from "@/components/GlossResult";
import SuggestionChips from "@/components/SuggestionChips";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<GlossData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = useCallback(async () => {
    const sentence = input.trim();
    if (!sentence || isLoading) return;

    setIsLoading(true);
    setError(null);
    setMascotState("loading");

    try {
      const res = await fetch("/api/gloss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "변환에 실패했습니다.");
      }

      setResults((prev) => [data, ...prev]);
      setInput("");
      setMascotState("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setMascotState("error");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleSuggestion = (sentence: string) => {
    setInput(sentence);
  };

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-2 text-center">
          <h1 className="text-2xl font-bold text-text-main">
            수어글로스
          </h1>
          <p className="text-xs text-text-sub mt-1">
            한국어 → 한국수어(KSL) 글로스 변환기
          </p>
        </header>

        {/* Owl Mascot */}
        <OwlMascot state={mascotState} />

        {/* Input */}
        <div className="mt-2">
          <GlossInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 bg-red/10 border border-red/30 rounded-xl px-4 py-3">
            <p className="text-sm text-red">{error}</p>
          </div>
        )}

        {/* Suggestion chips (show when no results) */}
        {results.length === 0 && !isLoading && (
          <div className="mt-6">
            <p className="text-xs text-text-sub text-center mb-3">
              예문을 선택해 보세요
            </p>
            <SuggestionChips onSelect={handleSuggestion} />
          </div>
        )}

        {/* Results */}
        <div className="mt-4 space-y-4">
          {results.map((data, index) => (
            <GlossResult key={`${data.input}-${index}`} data={data} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-text-sub">
            수어 데이터 출처:{" "}
            <a
              href="https://sldict.korean.go.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline"
            >
              국립국어원 한국수어사전
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
