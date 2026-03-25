import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rayden Store",
  description: "Created with create-rayden-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-grey-50">
          <Header />
          <main>{children}</main>
          <footer className="bg-white border-t border-grey-200 mt-16 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-grey-500">
                <p>© 2024 Rayden Store. Built with Rayden UI.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
