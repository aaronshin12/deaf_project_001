import fs from "fs";
import path from "path";

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

export function readCurriculum(): Curriculum {
  const raw = fs.readFileSync(CURRICULUM_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeCurriculum(data: Curriculum): void {
  fs.writeFileSync(CURRICULUM_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function findWeekById(curriculum: Curriculum, id: string): Week | undefined {
  return curriculum.weeks.find((w) => w.id === id);
}

export function findWeeksContainingWord(curriculum: Curriculum, word: string): Week[] {
  return curriculum.weeks.filter((w) =>
    w.words.some((item) => item.text === word)
  );
}

export function findWordInCurriculum(curriculum: Curriculum, word: string): Word | undefined {
  for (const week of curriculum.weeks) {
    const found = week.words.find((w) => w.text === word);
    if (found) return found;
  }
  return undefined;
}
