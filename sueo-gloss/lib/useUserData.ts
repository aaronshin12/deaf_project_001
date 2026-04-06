"use client";

import { useState, useCallback, useEffect } from "react";

const NOTES_KEY = "sueo-gloss-notes";
const REVIEWS_KEY = "sueo-gloss-reviews";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setNotes(loadFromStorage(NOTES_KEY, {}));
  }, []);

  const setNote = useCallback((word: string, note: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      if (note.trim()) {
        next[word] = note;
      } else {
        delete next[word];
      }
      saveToStorage(NOTES_KEY, next);
      return next;
    });
  }, []);

  const getNote = useCallback(
    (word: string) => notes[word] || "",
    [notes]
  );

  const hasNote = useCallback(
    (word: string) => Boolean(notes[word]?.trim()),
    [notes]
  );

  return { notes, setNote, getNote, hasNote };
}

export function useReviewMarks() {
  const [marks, setMarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMarks(loadFromStorage(REVIEWS_KEY, {}));
  }, []);

  const toggleMark = useCallback((word: string) => {
    setMarks((prev) => {
      const next = { ...prev };
      if (next[word]) {
        delete next[word];
      } else {
        next[word] = true;
      }
      saveToStorage(REVIEWS_KEY, next);
      return next;
    });
  }, []);

  const isMarked = useCallback(
    (word: string) => Boolean(marks[word]),
    [marks]
  );

  return { marks, toggleMark, isMarked };
}
