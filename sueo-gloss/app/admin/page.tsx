"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";

interface Word {
  text: string;
  description?: string;
}

interface Week {
  id: string;
  title: string;
  description?: string;
  words: Word[];
}

interface Curriculum {
  weeks: Week[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [curriculum, setCurriculum] = useState<Curriculum>({ weeks: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [newWeekTitle, setNewWeekTitle] = useState("");
  const [newWeekDesc, setNewWeekDesc] = useState("");
  const [newWords, setNewWords] = useState("");

  const handleLogin = () => {
    setAuthenticated(true);
    loadCurriculum();
  };

  const loadCurriculum = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/curriculum");
      const data = await res.json();
      setCurriculum(data);
    } catch {
      setMessage({ type: "error", text: "커리큘럼을 불러올 수 없습니다." });
    }
    setLoading(false);
  };

  const saveCurriculum = async (data: Curriculum) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/curriculum", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      setCurriculum(data);
      setMessage({ type: "success", text: "저장되었습니다!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "저장에 실패했습니다.";
      setMessage({ type: "error", text: msg });
    }
    setSaving(false);
  };

  const addWeek = () => {
    if (!newWeekTitle.trim()) return;
    const id = `week-${curriculum.weeks.length + 1}`;
    const words: Word[] = newWords.split(",").map((w) => w.trim()).filter(Boolean).map((text) => ({ text }));
    const newWeek: Week = { id, title: newWeekTitle.trim(), description: newWeekDesc.trim() || undefined, words };
    const updated = { weeks: [...curriculum.weeks, newWeek] };
    saveCurriculum(updated);
    setNewWeekTitle("");
    setNewWeekDesc("");
    setNewWords("");
  };

  const deleteWeek = (weekId: string) => {
    if (!confirm("이 주차를 삭제하시겠습니까?")) return;
    saveCurriculum({ weeks: curriculum.weeks.filter((w) => w.id !== weekId) });
  };

  const addWordsToWeek = (weekId: string, wordsText: string) => {
    const newWordsList = wordsText.split(",").map((w) => w.trim()).filter(Boolean).map((text) => ({ text }));
    if (newWordsList.length === 0) return;
    saveCurriculum({
      weeks: curriculum.weeks.map((w) =>
        w.id === weekId ? { ...w, words: [...w.words, ...newWordsList] } : w
      ),
    });
  };

  const removeWord = (weekId: string, wordText: string) => {
    saveCurriculum({
      weeks: curriculum.weeks.map((w) =>
        w.id === weekId ? { ...w, words: w.words.filter((word) => word.text !== wordText) } : w
      ),
    });
  };

  const updateWordDescription = (weekId: string, wordText: string, description: string) => {
    saveCurriculum({
      weeks: curriculum.weeks.map((w) =>
        w.id === weekId
          ? { ...w, words: w.words.map((word) => word.text === wordText ? { ...word, description: description || undefined } : word) }
          : w
      ),
    });
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="max-w-app mx-auto px-4 w-full">
          <div className="bg-card border border-card-border rounded-card p-6 card-shadow">
            <h1 className="text-xl font-bold text-text-main text-center mb-2">
              관리자 로그인
            </h1>
            <p className="text-sm text-text-sub text-center mb-6">
              커리큘럼을 편집하려면 비밀번호를 입력하세요
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="비밀번호"
              className="w-full bg-bg border border-card-border rounded-xl p-3 text-text-main placeholder-text-light outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full btn-soft bg-accent text-white font-semibold py-3 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all"
            >
              로그인
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="max-w-app mx-auto px-4">
        <div className="pt-4">
          <TopNav />
        </div>

        <h1 className="text-xl font-bold text-text-main mt-2 mb-1 tracking-tight">
          커리큘럼 관리
        </h1>
        <p className="text-sm text-text-sub mb-6">
          주차별 학습 단어를 추가하고 관리합니다
        </p>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-sage-light text-sage-dark border border-sage/20"
              : "bg-red/5 text-red border border-red/20"
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
              <span className="w-2 h-2 bg-accent rounded-full loading-dot" />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {curriculum.weeks.map((week) => (
                <WeekEditor
                  key={week.id}
                  week={week}
                  isOpen={editingWeek === week.id}
                  onToggle={() => setEditingWeek(editingWeek === week.id ? null : week.id)}
                  onDelete={() => deleteWeek(week.id)}
                  onAddWords={(words) => addWordsToWeek(week.id, words)}
                  onRemoveWord={(word) => removeWord(week.id, word)}
                  onUpdateDescription={(word, desc) => updateWordDescription(week.id, word, desc)}
                  saving={saving}
                />
              ))}
            </div>

            <div className="bg-card border border-dashed border-card-border rounded-card p-5 card-shadow">
              <h3 className="text-base font-semibold text-text-main mb-4">
                새 주차 추가
              </h3>
              <input
                value={newWeekTitle}
                onChange={(e) => setNewWeekTitle(e.target.value)}
                placeholder="주차 제목 (예: 11주차: 교통)"
                className="w-full bg-bg border border-card-border rounded-xl p-3 text-sm text-text-main placeholder-text-light outline-none focus:border-accent/50 transition-colors mb-2"
              />
              <input
                value={newWeekDesc}
                onChange={(e) => setNewWeekDesc(e.target.value)}
                placeholder="설명 (선택)"
                className="w-full bg-bg border border-card-border rounded-xl p-3 text-sm text-text-main placeholder-text-light outline-none focus:border-accent/50 transition-colors mb-2"
              />
              <textarea
                value={newWords}
                onChange={(e) => setNewWords(e.target.value)}
                placeholder="단어 목록 (쉼표로 구분: 버스, 지하철, 택시)"
                rows={2}
                className="w-full bg-bg border border-card-border rounded-xl p-3 text-sm text-text-main placeholder-text-light resize-none outline-none focus:border-accent/50 transition-colors mb-3"
              />
              <button
                onClick={addWeek}
                disabled={!newWeekTitle.trim() || saving}
                className="w-full btn-soft bg-accent text-white font-semibold py-3 rounded-xl shadow-[0_3px_0_#C4623F] hover:brightness-105 transition-all disabled:opacity-40"
              >
                주차 추가
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function WeekEditor({
  week, isOpen, onToggle, onDelete, onAddWords, onRemoveWord, onUpdateDescription, saving,
}: {
  week: Week; isOpen: boolean; onToggle: () => void; onDelete: () => void;
  onAddWords: (words: string) => void; onRemoveWord: (word: string) => void;
  onUpdateDescription: (word: string, desc: string) => void; saving: boolean;
}) {
  const [addInput, setAddInput] = useState("");
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [descInput, setDescInput] = useState("");

  return (
    <div className="bg-card border border-card-border rounded-card overflow-hidden card-shadow">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left">
        <div>
          <h3 className="text-base font-semibold text-text-main">{week.title}</h3>
          <p className="text-xs text-text-sub mt-0.5">{week.words.length}개 단어</p>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#A69E94" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-card-border pt-3">
          <div className="space-y-2 mb-3">
            {week.words.map((word) => (
              <div key={word.text} className="flex items-center gap-2 bg-bg rounded-xl px-3 py-2">
                <span className="flex-1 text-sm text-text-main">{word.text}</span>
                <button onClick={() => onRemoveWord(word.text)} className="text-red text-xs font-medium hover:underline">삭제</button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={addInput} onChange={(e) => setAddInput(e.target.value)} placeholder="단어 추가 (쉼표 구분)"
              className="flex-1 bg-bg border border-card-border rounded-xl p-2 text-sm text-text-main placeholder-text-light outline-none focus:border-accent/50"
              onKeyDown={(e) => { if (e.key === "Enter" && addInput.trim()) { onAddWords(addInput); setAddInput(""); } }} />
            <button onClick={() => { if (addInput.trim()) { onAddWords(addInput); setAddInput(""); } }}
              disabled={!addInput.trim() || saving}
              className="px-4 py-2 bg-sage text-white text-sm font-semibold rounded-xl disabled:opacity-40">추가</button>
          </div>

          <button onClick={onDelete} className="mt-3 text-xs text-red font-medium hover:underline">이 주차 삭제</button>
        </div>
      )}
    </div>
  );
}
