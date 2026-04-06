"use client";

import { useState, useEffect, useRef } from "react";

interface NoteEditorProps {
  word: string;
  note: string;
  onSave: (word: string, note: string) => void;
}

export default function NoteEditor({ word, note, onSave }: NoteEditorProps) {
  const [value, setValue] = useState(note);
  const [isSaved, setIsSaved] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue(note);
  }, [note]);

  const handleChange = (newValue: string) => {
    setValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSave(word, newValue);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    }, 500);
  };

  return (
    <div className="bg-card border border-card-border rounded-card p-4 card-shadow">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-semibold text-text-main flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5B8C6F">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          나의 메모
        </label>
        {isSaved && (
          <span className="text-xs text-sage font-medium">저장됨</span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="이 단어에 대한 메모를 남겨보세요..."
        rows={3}
        className="w-full bg-bg border border-card-border rounded-xl p-3 text-sm text-text-main placeholder-text-light resize-none outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all leading-relaxed"
      />
    </div>
  );
}
