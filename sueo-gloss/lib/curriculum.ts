import fs from "fs";
import path from "path";
import { kvGet, kvSet } from "./kvStore";

export interface Word {
  text: string;
  description?: string;
  videoUrl?: string;
  dictUrl?: string;
}

export interface Week {
  id: string;
  title: string;
  description?: string;
  words: Word[];
}

export interface Curriculum {
  weeks: Week[];
}

const CURRICULUM_PATH = path.join(process.cwd(), "data", "curriculum.json");
const KV_KEY = "curriculum";

function readCurriculumFromFile(): Curriculum {
  const raw = fs.readFileSync(CURRICULUM_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function readCurriculum(): Promise<Curriculum> {
  // Try KV first
  const kvData = await kvGet<Curriculum>(KV_KEY);
  if (kvData) return kvData;

  // Fallback to file
  return readCurriculumFromFile();
}

export async function writeCurriculum(data: Curriculum): Promise<void> {
  // Write to KV
  const success = await kvSet(KV_KEY, data);

  if (!success) {
    // Fallback: write to file (works in dev, not on Vercel)
    fs.writeFileSync(CURRICULUM_PATH, JSON.stringify(data, null, 2), "utf-8");
  }
}

export function findWeekById(curriculum: Curriculum, id: string): Week | undefined {
  return curriculum.weeks.find((w) => w.id === id);
}

export function findWeeksContainingWord(curriculum: Curriculum, word: string): Week[] {
  return curriculum.weeks.filter((w) =>
    w.words.some((item) => item.text === word)
  );
}
