"use client";

import { buildSearchUrl } from "@/lib/buildDictUrl";
import { isGrammarToken } from "@/lib/dictionaryMap";

interface TokenDetailProps {
  token: string;
  onClose: () => void;
}

const grammarDescriptions: Record<string, string> = {
  "[완료]": "과거 시제를 나타냅니다. 수어에서는 동작 후 손을 아래로 내리는 동작으로 표현합니다.",
  "[미래]": "미래 시제를 나타냅니다. 수어에서는 손을 앞으로 향하는 동작으로 표현합니다.",
  "[진행]": "현재 진행을 나타냅니다. 수어에서는 반복적인 동작으로 표현합니다.",
  "[의문]": "의문문을 나타냅니다. 수어에서는 눈썹을 올리고 고개를 약간 앞으로 기울입니다.",
  "[원하다]": "희망/욕구를 나타냅니다. '~하고 싶다'의 의미입니다.",
  "[가능]": "가능을 나타냅니다. '~할 수 있다'의 의미입니다.",
  "[불가능]": "불가능을 나타냅니다. '~할 수 없다'의 의미입니다.",
};

export default function TokenDetail({ token, onClose }: TokenDetailProps) {
  const isGrammar = isGrammarToken(token);

  const handleDictSearch = async () => {
    const searchToken = token.endsWith("다") ? token.slice(0, -1) : token;
    const url = buildSearchUrl(searchToken);
    window.open(url, "_blank");

    // Copy to clipboard as fallback
    try {
      await navigator.clipboard.writeText(searchToken);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className="bg-card border-2 border-card-border rounded-card p-4 animate-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-text-main">{token}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card-border transition-colors text-text-sub"
        >
          ✕
        </button>
      </div>

      {isGrammar ? (
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-xs bg-purple/20 text-purple mb-2">
            문법 표지
          </span>
          <p className="text-sm text-text-sub leading-relaxed">
            {grammarDescriptions[token] || "한국수어의 문법 표지입니다."}
          </p>
        </div>
      ) : (
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-xs bg-blue/20 text-blue mb-3">
            어휘 토큰
          </span>
          <button
            onClick={handleDictSearch}
            className="w-full btn-3d bg-green text-white font-bold py-3 rounded-xl shadow-[0_4px_0_#46A302] hover:brightness-110 transition-all text-sm"
          >
            수어사전에서 &apos;{token.endsWith("다") ? token.slice(0, -1) : token}&apos; 검색
          </button>
          <p className="text-xs text-text-sub mt-2 text-center">
            국립국어원 한국수어사전으로 이동합니다
          </p>
        </div>
      )}
    </div>
  );
}
