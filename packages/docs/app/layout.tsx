import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rayden UI",
    template: "%s - Rayden UI",
  },
  description: "A modern React component library with 24+ components built on Tailwind CSS v4",
  icons: {
    icon: "/favicon.ico",
  },
};

const navbar = (
  <Navbar
    logo={
      <span className="flex items-center gap-2 font-bold text-lg">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#F56630" />
          <path d="M7 8h4l2 4-2 4H7l2-4-2-4z" fill="white" />
          <path d="M13 8h4l-2 4 2 4h-4l-2-4 2-4z" fill="white" fillOpacity="0.7" />
        </svg>
        Rayden UI
      </span>
    }
    projectLink="https://github.com/raydenui/rayden"
  />
);

const footer = (
  <Footer>
    <div className="flex w-full flex-col items-center sm:items-start">
      <p className="text-sm text-gray-500">
        MIT {new Date().getFullYear()} © Rayden UI. Built with Rayna UI Design System.
      </p>
    </div>
  </Footer>
);

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="🔶" />
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/raydenui/rayden/tree/main/packages/docs/content"
          footer={footer}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            autoCollapse: true,
          }}
          toc={{
            backToTop: true,
          }}
          editLink="Edit this page on GitHub"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
