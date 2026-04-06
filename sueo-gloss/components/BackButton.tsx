"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = "뒤로" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-text-sub hover:text-text-main transition-colors py-2"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
      <span className="text-sm">{label}</span>
    </button>
  );
}
