import type { Metadata } from "next";
import "@raydenui/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profile settings | Rayden UI",
  description: "A Next.js profile form built with Rayden UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
