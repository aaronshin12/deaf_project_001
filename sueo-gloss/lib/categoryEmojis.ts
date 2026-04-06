export const categoryEmojis: Record<string, string> = {
  "인간": "😊",
  "개념": "💡",
  "사회생활": "🤹‍♀️",
  "삶": "🎉",
  "장소": "🌏",
  "식생활": "🍚",
  "경제생활": "💰",
  "종교": "🙏",
  "교육": "📚",
  "동식물": "🐾",
  "주생활": "🏠",
  "정치와 행정": "👑",
  "자연": "🍀",
  "의생활": "👕",
  "문화": "🎭",
  "기타": "📋",
};

export function getEmoji(category: string): string {
  return categoryEmojis[category] || "📋";
}
