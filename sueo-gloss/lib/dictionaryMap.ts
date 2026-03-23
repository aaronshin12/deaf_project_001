import dictionaryData from "@/data/ksl-dictionary.json";

export interface DictionaryEntry {
  origin_no: number;
  category: string;
}

type DictionaryMap = Record<string, DictionaryEntry | DictionaryEntry[]>;

const dictionary: DictionaryMap = dictionaryData as DictionaryMap;

export function lookupToken(token: string): DictionaryEntry | DictionaryEntry[] | null {
  // Remove "다" suffix for verb lookup (e.g., "먹다" → try "먹다" first, then "먹")
  const entry = dictionary[token];
  if (entry) return entry;

  if (token.endsWith("다")) {
    const stem = token.slice(0, -1);
    const stemEntry = dictionary[stem];
    if (stemEntry) return stemEntry;
  }

  return null;
}

export function isGrammarToken(token: string): boolean {
  return token.startsWith("[") && token.endsWith("]");
}
