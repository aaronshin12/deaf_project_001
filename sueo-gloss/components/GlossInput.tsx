"use client";

import { useState, useRef, useEffect } from "react";

interface GlossInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function GlossInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: GlossInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "ko-KR";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        onChange(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [value]);

  return (
    <div className="bg-card border-2 border-card-border rounded-card p-3">
      <div className="flex items-end gap-2">
        {/* Microphone button */}
        {speechSupported && (
          <button
            onClick={toggleListening}
            disabled={isLoading}
            className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-red text-white mic-pulse"
                : "bg-card-border text-text-sub hover:text-text-main"
            }`}
            aria-label={isListening ? "음성 인식 중지" : "음성 입력"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        )}

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="한국어 문장을 입력하세요..."
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent text-text-main placeholder-text-sub text-base resize-none outline-none min-h-[40px] py-2"
        />

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-green text-white flex items-center justify-center shadow-[0_3px_0_#46A302] btn-3d disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all"
          aria-label="변환하기"
        >
          {isLoading ? (
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full loading-dot" />
              <span className="w-1.5 h-1.5 bg-white rounded-full loading-dot" />
              <span className="w-1.5 h-1.5 bg-white rounded-full loading-dot" />
            </div>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      {isListening && (
        <p className="text-xs text-red mt-2 animate-pulse">
          음성을 듣고 있어요...
        </p>
      )}
    </div>
  );
}
