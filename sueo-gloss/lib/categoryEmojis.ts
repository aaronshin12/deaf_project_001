export const categoryEmojis: Record<string, string> = {
  "개념": "💡",
  "경제생활": "💰",
  "교육": "📚",
  "동식물": "🐾",
  "문화": "🎭",
  "일상생활": "🏠",
  "식생활": "🍚",
  "의생활": "👕",
  "인간": "😊",
  "사회생활": "🤹‍♀️",
  "삶": "🎉",
  "나라명 및 지명": "🌏",
  "종교": "🙏",
  "주생활": "🏠",
  "정치와 행정": "👑",
  "자연": "🍀",
  "인사": "🤝",
  "감정": "😊",
  "직업": "💼",
  "장소": "📍",
  "교통": "🚌",
  "날씨": "🌤",
  "건강": "❤️",
  "가족": "👨‍👩‍👧",
  "시간": "⏰",
  "숫자": "🔢",
  "기타": "📋",
};

export function getEmoji(category: string): string {
  for (const [key, emoji] of Object.entries(categoryEmojis)) {
    if (category.includes(key)) return emoji;
  }
  return "📋";
}
