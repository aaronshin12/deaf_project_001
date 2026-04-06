import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "수어학습 도우미",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  description: "주차별 한국수어(KSL) 복습 도구 — 단어를 탭하면 수어 영상을 바로 확인하세요",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF6F0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-bg">{children}</body>
    </html>
  );
}
