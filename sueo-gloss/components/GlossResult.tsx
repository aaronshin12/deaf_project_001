"use client";

import { useState } from "react";
import TokenChip from "./TokenChip";
import TokenDetail from "./TokenDetail";
import { isGrammarToken } from "@/lib/dictionaryMap";

export interface GlossData {
  input: string;
  corrected: string | null;
  gloss: string[];
  notes?: string;
}

interface GlossResultProps {
  data: GlossData;
}

export default function GlossResult({ data }: GlossResultProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const handleTokenClick = (token: string) => {
    setSelectedToken(selectedToken === token ? null : token);
  };

  return (
    <div className="bg-card border-2 border-card-border rounded-card p-4 space-y-4">
      {/* Original / Corrected sentence */}
      <div>
        <p className="text-xs text-text-sub mb-1">입력 문장</p>
        <p className="text-sm text-text-main">{data.input}</p>
        {data.corrected && (
          <p className="text-xs text-yellow mt-1">
            → 교정: {data.corrected}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-card-border" />

      {/* Gloss tokens */}
      <div>
        <p className="text-xs text-text-sub mb-3">수어 글로스</p>
        <div className="flex flex-wrap items-center gap-2">
          {data.gloss.map((token, index) => (
            <div key={`${token}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-text-sub text-lg select-none">›</span>
              )}
              <TokenChip
                token={token}
                isGrammar={isGrammarToken(token)}
                isSelected={selectedToken === token}
                onClick={() => handleTokenClick(token)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Token detail panel */}
      {selectedToken && (
        <TokenDetail
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}

      {/* Notes */}
      {data.notes && (
        <p className="text-xs text-text-sub italic">
          💡 {data.notes}
        </p>
      )}
    </div>
  );
}
