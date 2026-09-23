import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SiteFooterBlock, type SiteFooterLinkGroup } from "./SiteFooterBlock";

const meta: Meta<typeof SiteFooterBlock> = {
  title: "Blocks/SiteFooter",
  component: SiteFooterBlock,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteFooterBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────────
   Brand marks are supplied by the consumer as artwork, so authentic platform
   colours stay outside the themeable interface roles.
   ----------------------------------------------------------------------- */

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05A4.17 4.17 0 0 1 17.6 8.7c4.06 0 4.8 2.5 4.8 5.76V21h-4v-5.66c0-1.35-.03-3.09-1.96-3.09-1.96 0-2.26 1.47-2.26 2.99V21h-4V9Z"
      />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.8c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

const groups: SiteFooterLinkGroup[] = [
  {
    id: "product",
    title: "Product",
    links: [
      { id: "attribution", label: "Cost attribution", href: "#attribution" },
      { id: "forecasting", label: "Invoice forecasting", href: "#forecasting" },
      { id: "budgets", label: "Budgets", href: "#budgets", badge: "New" },
      { id: "exports", label: "Warehouse exports", href: "#exports" },
      { id: "pricing", label: "Pricing", href: "#pricing" },
    ],
  },
  {
    id: "developers",
    title: "Developers",
    links: [
      { id: "docs", label: "Documentation", href: "#docs" },
      { id: "api", label: "API reference", href: "#api" },
      { id: "sdks", label: "SDKs", href: "#sdks" },
      { id: "status", label: "System status", href: "https://example.com/status", external: true },
      { id: "changelog", label: "Changelog", href: "#changelog" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { id: "about", label: "About", href: "#about" },
      { id: "careers", label: "Careers", href: "#careers", badge: "6 open" },
      { id: "customers", label: "Customers", href: "#customers" },
      { id: "blog", label: "Blog", href: "#blog" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { id: "help", label: "Help centre", href: "#help" },
      { id: "contact", label: "Contact us", href: "#contact" },
      { id: "community", label: "Community", href: "#community" },
      { id: "security", label: "Report a vulnerability", href: "#security" },
    ],
  },
];

const legalLinks = [
  { id: "privacy", label: "Privacy notice", href: "#privacy" },
  { id: "terms", label: "Terms of service", href: "#terms" },
  { id: "dpa", label: "Data processing agreement", href: "#dpa" },
  { id: "cookies", label: "Cookie preferences", href: "#cookies" },
];

/* ─── Default ─────────────────────────────────────────────────────────────
   Locale controls require a handler, so a switcher can never be rendered
   without somewhere for the choice to go.
   ----------------------------------------------------------------------- */
export const Default: Story = {
  render: function DefaultFooterStory() {
    const [language, setLanguage] = useState("en-GB");
    const [region, setRegion] = useState("eu");
    return (
      <SiteFooterBlock
        label="Citrionus site footer"
        brand={{
          name: "Citrionus",
          href: "#home",
          description:
            "Usage attribution and invoice forecasting for teams that bill their customers by consumption.",
        }}
        groups={groups}
        social={[
          {
            id: "linkedin",
            label: "Citrionus on LinkedIn",
            href: "#linkedin",
            artwork: <LinkedInMark />,
          },
          { id: "github", label: "Citrionus on GitHub", href: "#github", artwork: <GithubMark /> },
          { id: "rss", label: "Citrionus changelog feed", href: "#rss", icon: "signal" },
        ]}
        localeControls={[
          {
            id: "language",
            label: "Language",
            value: language,
            onChange: setLanguage,
            options: [
              { value: "en-GB", label: "English (UK)" },
              { value: "en-US", label: "English (US)" },
              { value: "de-DE", label: "Deutsch" },
              { value: "fr-FR", label: "Français" },
              { value: "ja-JP", label: "日本語" },
            ],
          },
          {
            id: "region",
            label: "Data region",
            value: region,
            onChange: setRegion,
            hint: "Changes which region serves this site.",
            options: [
              { value: "eu", label: "European Union" },
              { value: "us", label: "United States" },
              { value: "ap", label: "Asia Pacific" },
            ],
          },
        ]}
        copyright="© 2026 Citrionus Technologies Ltd. Registered in England and Wales, no. 11882043."
        legalLinks={legalLinks}
      />
    );
  },
};

/* ─── Minimal ─────────────────────────────────────────────────────────────
   Every section is optional. Omitting one removes it instead of leaving an
   empty shell behind.
   ----------------------------------------------------------------------- */
export const Minimal: Story = {
  render: () => (
    <SiteFooterBlock
      label="Compact site footer"
      copyright="© 2026 Citrionus Technologies Ltd."
      legalLinks={legalLinks.slice(0, 2)}
    />
  ),
};

/* ─── Links only, no locale controls ──────────────────────────────────── */
export const LinksOnly: Story = {
  render: () => (
    <SiteFooterBlock
      brand={{ name: "Citrionus", href: "#home" }}
      groups={groups.slice(0, 3)}
      copyright="© 2026 Citrionus Technologies Ltd."
    />
  ),
};

/* ─── Edge case: long translated labels and five groups ───────────────────
   Long German compounds must wrap rather than widen the document at 320px.
   ----------------------------------------------------------------------- */
export const LongTranslatedLabels: Story = {
  render: function LongLabelsFooterStory() {
    const [language, setLanguage] = useState("de-DE");
    return (
      <SiteFooterBlock
        label="Fußzeile der Website"
        brand={{
          name: "Citrionus",
          href: "#home",
          description:
            "Nutzungszuordnung und Rechnungsbetragsvorhersage für Unternehmen mit verbrauchsabhängiger Abrechnung.",
        }}
        groupHeadingLevel="h3"
        groups={[
          {
            id: "produkt",
            title: "Produktfunktionen",
            links: [
              { id: "zuordnung", label: "Ereignisgenaue Kostenzuordnung", href: "#zuordnung" },
              { id: "prognose", label: "Rechnungsbetragsvorhersage", href: "#prognose" },
              {
                id: "budget",
                label: "Budgetüberwachungsschwellenwerte",
                href: "#budget",
                badge: "Neu",
              },
            ],
          },
          {
            id: "entwicklung",
            title: "Entwicklung",
            links: [
              { id: "doku", label: "Entwicklerdokumentation", href: "#doku" },
              { id: "api", label: "Programmierschnittstellenreferenz", href: "#api" },
              {
                id: "status",
                label: "Systemverfügbarkeitsanzeige",
                href: "https://example.com/status",
                external: true,
              },
            ],
          },
          {
            id: "unternehmen",
            title: "Unternehmen",
            links: [
              { id: "ueber", label: "Über uns", href: "#ueber" },
              { id: "karriere", label: "Stellenausschreibungen", href: "#karriere" },
            ],
          },
          {
            id: "support",
            title: "Unterstützung",
            links: [
              { id: "hilfe", label: "Hilfecenter", href: "#hilfe" },
              { id: "kontakt", label: "Kontaktaufnahme", href: "#kontakt" },
            ],
          },
          {
            id: "rechtliches",
            title: "Rechtliches",
            links: [
              { id: "impressum", label: "Impressum", href: "#impressum" },
              { id: "avv", label: "Auftragsverarbeitungsvertrag", href: "#avv" },
            ],
          },
        ]}
        localeControls={[
          {
            id: "sprache",
            label: "Sprache und Region",
            value: language,
            onChange: setLanguage,
            hint: "Bestimmt die Sprache der Benutzeroberfläche.",
            options: [
              { value: "de-DE", label: "Deutsch (Deutschland)" },
              { value: "de-AT", label: "Deutsch (Österreich)" },
              { value: "en-GB", label: "Englisch (Vereinigtes Königreich)" },
            ],
          },
        ]}
        copyright="© 2026 Citrionus Technologies Ltd. Eingetragen in England und Wales unter der Nummer 11882043."
        legalLabel="Rechtliche Hinweise"
        legalLinks={[
          { id: "datenschutz", label: "Datenschutzerklärung", href: "#datenschutz" },
          { id: "agb", label: "Allgemeine Geschäftsbedingungen", href: "#agb" },
          { id: "cookies", label: "Cookie-Einstellungen", href: "#cookies" },
        ]}
      />
    );
  },
};

const brandTheme = `
.batch-a-brand {
  --color-surface: #fbf6ee;
  --color-surface-muted: #f4ece0;
  --color-surface-border: #e6dcc9;
  --color-surface-border-strong: #c9bb9e;
}
.dark .batch-a-brand {
  --color-surface: #241d14;
  --color-surface-muted: #1a140e;
  --color-surface-border: #3d3324;
  --color-surface-border-strong: #5c4d37;
}
`;

/* ─── Custom surface theme ────────────────────────────────────────────────
   The locale control and footer ground read the paired surface roles rather than
   a hard-coded white.
   ----------------------------------------------------------------------- */
export const ThemedSurface: Story = {
  render: function ThemedFooterStory() {
    const [language, setLanguage] = useState("en-GB");
    return (
      <div className="batch-a-brand">
        <style>{brandTheme}</style>
        <SiteFooterBlock
          brand={{ name: "Citrionus", href: "#home" }}
          groups={groups.slice(0, 2)}
          localeControls={[
            {
              id: "language",
              label: "Language",
              value: language,
              onChange: setLanguage,
              options: [
                { value: "en-GB", label: "English (UK)" },
                { value: "de-DE", label: "Deutsch" },
              ],
            },
          ]}
          copyright="© 2026 Citrionus Technologies Ltd."
          legalLinks={legalLinks.slice(0, 2)}
        />
      </div>
    );
  },
};

/* ─── Narrow container on a wide viewport ─────────────────────────────────
   The block reads its own container, not the viewport, so a 360px column on a
   1440px screen collapses to a single column. A viewport media query could not
   detect this placement at all.
   ----------------------------------------------------------------------- */
export const NarrowContainer: Story = {
  render: function NarrowFooterStory() {
    const [language, setLanguage] = useState("en-GB");
    return (
      <div className="mx-auto w-full max-w-[360px] border-x border-surface-border">
        <SiteFooterBlock
          brand={{ name: "Citrionus", href: "#home" }}
          groups={groups}
          localeControls={[
            {
              id: "language",
              label: "Language",
              value: language,
              onChange: setLanguage,
              options: [
                { value: "en-GB", label: "English (UK)" },
                { value: "de-DE", label: "Deutsch" },
              ],
            },
          ]}
          copyright="© 2026 Citrionus Technologies Ltd."
          legalLinks={legalLinks.slice(0, 3)}
        />
      </div>
    );
  },
};
