import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Codex Field Guide — 99 Use Cases สำหรับคนทำงาน",
  description:
    "คู่มือ Codex ฉบับคนทำงาน: 99 use cases จากเอกสารทางการ พร้อม workflow ภาษาไทยที่นำไปใช้ได้จริง",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#17221b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
