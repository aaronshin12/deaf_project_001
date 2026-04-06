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

const categoryRename: Record<string, string> = {
  "나라명 및 지명": "장소",
};

function normalizeCat(cat: string): string {
  return categoryRename[cat] || cat || "기타";
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const word of signWords) {
    const cat = normalizeCat(word.categoryType);
    counts.set(cat, (counts.get(cat) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getWordsByCategory(category: string): SignWord[] {
  return signWords
    .filter((w) => normalizeCat(w.categoryType) === category)
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

// Korean initial consonant extraction
const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export function getInitialConsonant(char: string): string {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return "기타";
  const index = Math.floor(code / 588);
  return INITIAL_CONSONANTS[index] || "기타";
}

// Grouped consonant filters
export const CONSONANT_GROUPS = [
  { label: "ㄱ-ㄴ", consonants: ["ㄱ", "ㄲ", "ㄴ"] },
  { label: "ㄷ-ㄹ", consonants: ["ㄷ", "ㄸ", "ㄹ"] },
  { label: "ㅁ-ㅂ", consonants: ["ㅁ", "ㅂ", "ㅃ"] },
  { label: "ㅅ-ㅇ", consonants: ["ㅅ", "ㅆ", "ㅇ"] },
  { label: "ㅈ-ㅊ", consonants: ["ㅈ", "ㅉ", "ㅊ"] },
  { label: "ㅋ-ㅎ", consonants: ["ㅋ", "ㅌ", "ㅍ", "ㅎ"] },
];

export function filterByConsonantGroup(words: SignWord[], consonants: string[]): SignWord[] {
  return words.filter((w) => {
    if (!w.title) return false;
    const initial = getInitialConsonant(w.title[0]);
    return consonants.includes(initial);
  });
}

export function getAllWords(): SignWord[] {
  return signWords;
}

export function getTotalCount(): number {
  return signWords.length;
}
