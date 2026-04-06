import signWordsData from "@/data/sign-words.json";

export interface SignWord {
  title: string;
  url: string;
  signDescription: string;
  signImages: string;
  referenceIdentifier: string;
  subDescription: string;
  categoryType: string;
  description: string;
}

const signWords: SignWord[] = signWordsData as SignWord[];

// Build index by title for fast lookup
const wordMap = new Map<string, SignWord>();
for (const word of signWords) {
  if (word.title) {
    wordMap.set(word.title, word);
  }
}

export function getWord(title: string): SignWord | undefined {
  return wordMap.get(title);
}

export function searchWords(query: string, limit = 20): SignWord[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results: SignWord[] = [];

  for (const word of signWords) {
    if (word.title.toLowerCase().includes(q)) {
      results.push(word);
      if (results.length >= limit) break;
    }
  }

  return results.sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const word of signWords) {
    const cat = word.categoryType || "기타";
    counts.set(cat, (counts.get(cat) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getWordsByCategory(category: string): SignWord[] {
  return signWords
    .filter((w) => (w.categoryType || "기타") === category)
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

export function getAllWords(): SignWord[] {
  return signWords;
}

export function getTotalCount(): number {
  return signWords.length;
}
