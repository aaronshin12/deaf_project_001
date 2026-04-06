"use client";

import Link from "next/link";

interface WeekCardProps {
  id: string;
  title: string;
}

export default function WeekCard({ id, title }: WeekCardProps) {
  return (
    <Link href={`/week/${id}`}>
      <div className="bg-card border border-card-border rounded-card px-5 py-4 card-shadow hover:border-accent/40 transition-all active:scale-[0.98]">
        <h3 className="text-base font-semibold text-text-main">{title}</h3>
      </div>
    </Link>
  );
}
