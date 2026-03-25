import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BlogSidebar from "@/components/BlogSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Rayden Blog",
  description: "Created with create-rayden-app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-grey-50">
          <Header />
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <main className="lg:col-span-8">
                {children}
              </main>
              <aside className="hidden lg:block lg:col-span-4">
                <BlogSidebar />
              </aside>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
