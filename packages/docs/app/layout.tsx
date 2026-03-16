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
};

const logo = (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/logo.svg" alt="Rayden UI" style={{ maxWidth: "20%", height: "auto" }} />
);

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="🔶" />
      <body>
        <Layout
          navbar={<Navbar logo={logo} projectLink="https://github.com/playbookTV/Rayden" />}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/playbookTV/Rayden/tree/main/packages/docs/content"
          footer={
            <Footer>
              <span>MIT {new Date().getFullYear()} © Rayden UI</span>
            </Footer>
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
