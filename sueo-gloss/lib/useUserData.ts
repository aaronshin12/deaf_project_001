"use client";

import { useState, useCallback, useEffect } from "react";

const NOTES_KEY = "sueo-gloss-notes";
const RECENTLY_VIEWED_KEY = "sueo-gloss-recently-viewed";
const WORDBOOK_KEY = "sueo-gloss-wordbook";
const CUSTOM_WORDS_KEY = "sueo-gloss-custom-words";

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

export function useRecentlyViewed() {
  const [viewed, setViewed] = useState<string[]>([]);

  useEffect(() => {
    setViewed(loadFromStorage(RECENTLY_VIEWED_KEY, []));
  }, []);

  const addViewed = useCallback((word: string) => {
    setViewed((prev) => {
      const updated = [word, ...prev.filter((w) => w !== word)].slice(0, 20);
      saveToStorage(RECENTLY_VIEWED_KEY, updated);
      return updated;
    });
  }, []);

  const clearViewed = useCallback(() => {
    setViewed([]);
    saveToStorage(RECENTLY_VIEWED_KEY, []);
  }, []);

  return { viewed, addViewed, clearViewed };
}

export function useWordBook() {
  const [words, setWords] = useState<Record<string, boolean>>({});
  const [customWords, setCustomWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(loadFromStorage(WORDBOOK_KEY, {}));
    setCustomWords(loadFromStorage(CUSTOM_WORDS_KEY, []));
  }, []);

  const addWord = useCallback((word: string) => {
    setWords((prev) => {
      const next = { ...prev, [word]: true };
      saveToStorage(WORDBOOK_KEY, next);
      return next;
    });
  }, []);

  const removeWord = useCallback((word: string) => {
    setWords((prev) => {
      const next = { ...prev };
      delete next[word];
      saveToStorage(WORDBOOK_KEY, next);
      return next;
    });
  }, []);

  const isInWordBook = useCallback(
    (word: string) => Boolean(words[word]),
    [words]
  );

  const toggleWord = useCallback((word: string) => {
    setWords((prev) => {
      const next = { ...prev };
      if (next[word]) {
        delete next[word];
      } else {
        next[word] = true;
      }
      saveToStorage(WORDBOOK_KEY, next);
      return next;
    });
  }, []);

  const addCustomWord = useCallback((word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    setCustomWords((prev) => {
      if (prev.includes(trimmed)) return prev;
      const next = [...prev, trimmed];
      saveToStorage(CUSTOM_WORDS_KEY, next);
      return next;
    });
    // Also add to wordbook
    setWords((prev) => {
      const next = { ...prev, [trimmed]: true };
      saveToStorage(WORDBOOK_KEY, next);
      return next;
    });
  }, []);

  const removeCustomWord = useCallback((word: string) => {
    setCustomWords((prev) => {
      const next = prev.filter((w) => w !== word);
      saveToStorage(CUSTOM_WORDS_KEY, next);
      return next;
    });
    // Also remove from wordbook
    setWords((prev) => {
      const next = { ...prev };
      delete next[word];
      saveToStorage(WORDBOOK_KEY, next);
      return next;
    });
  }, []);

  const allWords = Object.keys(words).filter((w) => words[w]);

  return {
    words,
    allWords,
    customWords,
    addWord,
    removeWord,
    isInWordBook,
    toggleWord,
    addCustomWord,
    removeCustomWord,
  };
}
