import type { Meta, StoryObj } from "@storybook/react";
import { ProductHeroBlock } from "./ProductHeroBlock";

const meta: Meta<typeof ProductHeroBlock> = {
  title: "Blocks/ProductHero",
  component: ProductHeroBlock,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductHeroBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────────
   The example image is an inline data URI so the story renders identically
   offline and in a headless browser.
   ----------------------------------------------------------------------- */

const productShot =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">',
      '<rect width="640" height="400" fill="#fff7f3"/>',
      '<rect x="0" y="0" width="640" height="48" fill="#ffffff"/>',
      '<circle cx="28" cy="24" r="6" fill="#f56630"/>',
      '<rect x="48" y="18" width="96" height="12" rx="6" fill="#e4e7ec"/>',
      '<rect x="160" y="18" width="64" height="12" rx="6" fill="#f0f2f5"/>',
      '<rect x="24" y="72" width="240" height="20" rx="6" fill="#344054"/>',
      '<rect x="24" y="108" width="180" height="12" rx="6" fill="#98a2b3"/>',
      '<rect x="24" y="148" width="288" height="120" rx="12" fill="#ffffff" stroke="#e4e7ec"/>',
      '<rect x="44" y="172" width="120" height="12" rx="6" fill="#d0d5dd"/>',
      '<rect x="44" y="200" width="200" height="40" rx="8" fill="#ffece5"/>',
      '<rect x="336" y="148" width="280" height="120" rx="12" fill="#ffffff" stroke="#e4e7ec"/>',
      '<polyline points="356,248 396,220 436,232 476,188 516,204 556,172 596,180" ',
      'fill="none" stroke="#f56630" stroke-width="4" stroke-linecap="round"/>',
      '<rect x="24" y="292" width="592" height="84" rx="12" fill="#ffffff" stroke="#e4e7ec"/>',
      '<rect x="44" y="316" width="140" height="10" rx="5" fill="#e4e7ec"/>',
      '<rect x="44" y="340" width="220" height="10" rx="5" fill="#f0f2f5"/>',
      "</svg>",
    ].join("")
  );

/* ─── Default ─────────────────────────────────────────────────────────────
   Typical marketing content: one destination, one in-page action, an example
   of the product, and scannable proof points.
   ----------------------------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <ProductHeroBlock
      eyebrowBadge="New"
      eyebrow="Usage analytics now included on every plan"
      headline="Understand what your product costs to run, before the invoice arrives"
      description="Citrionus reads your usage events as they happen, attributes them to the teams and customers that created them, and tells you what changed. No agents to install and no sampling."
      primaryCta={{ label: "Start a free trial", href: "#start" }}
      secondaryCta={{ label: "Book a walkthrough", href: "#demo", icon: "calendar" }}
      note="14-day trial. No card required."
      highlights={[
        { id: "setup", value: "9 min", label: "Median time to first insight", icon: "stopwatch" },
        { id: "events", value: "4.1B", label: "Events attributed each month", icon: "chart-up" },
        {
          id: "uptime",
          value: "99.98%",
          label: "Ingest uptime, last 12 months",
          icon: "shield-tick",
        },
      ]}
      media={{
        src: productShot,
        alt: "The Citrionus usage dashboard showing cost per team and a spend trend for the last seven days.",
        width: 640,
        height: 400,
        caption: "Cost attribution updates within a minute of each event.",
      }}
    />
  ),
};

/* ─── Centred, no media ─────────────────────────────────────────────────── */
export const CentredWithoutMedia: Story = {
  render: () => (
    <ProductHeroBlock
      align="center"
      eyebrow="Citrionus for platform teams"
      headline="Every usage question, answered in one place"
      description="Attribute spend, forecast the next invoice, and share the numbers with the people who own the budget."
      primaryCta={{ label: "Create an account", href: "#signup" }}
      secondaryCta={{ label: "Read the docs", href: "https://example.com/docs", external: true }}
      note="Works with your existing event pipeline."
    />
  ),
};

/* ─── Action rather than destination ──────────────────────────────────────
   The primary next step is an in-page action, so it renders as a button. The
   block never renders a control without a configured destination or handler.
   ----------------------------------------------------------------------- */
export const ActionPrimaryStep: Story = {
  render: () => (
    <ProductHeroBlock
      headingLevel="h2"
      eyebrow="Embedded in an existing page"
      headline="Open the cost explorer"
      description="This hero sits under a page that already owns the h1, so the headline is rendered as an h2."
      primaryCta={{
        label: "Open cost explorer",
        icon: "chart",
        onClick: () => window.alert("Cost explorer requested"),
      }}
      secondaryCta={{ label: "What is this?", onClick: () => window.alert("Explainer requested") }}
    />
  ),
};

/* ─── Edge case: long names, long translated labels, missing image ────────
   A long German compound headline, long translated call-to-action labels, and
   an image source that cannot load. Nothing may clip or overflow at 320px.
   ----------------------------------------------------------------------- */
export const LongLabelsAndMissingImage: Story = {
  render: () => (
    <ProductHeroBlock
      eyebrowBadge="Neu"
      eyebrow="Nutzungsanalyse jetzt in allen Tarifen enthalten"
      headline="Kostenzuordnungsplattform für Zahlungsabwicklungsinfrastruktur"
      description="Citrionus ordnet Nutzungsereignisse den Teams und Kundinnen zu, die sie verursacht haben, und erklärt jede Veränderung der Abrechnungsgrundlage nachvollziehbar."
      primaryCta={{ label: "Kostenlosen Testzeitraum starten", href: "#start" }}
      secondaryCta={{ label: "Produktvorführung vereinbaren", href: "#demo" }}
      note="14 Tage kostenlos. Keine Zahlungsinformationen erforderlich."
      highlights={[
        {
          id: "setup",
          value: "9 Minuten",
          label: "Durchschnittliche Zeit bis zur ersten Auswertung",
          icon: "stopwatch",
        },
        {
          id: "events",
          value: "4,1 Mrd.",
          label: "Zugeordnete Ereignisse pro Monat",
          icon: "chart-up",
        },
      ]}
      media={{
        src: "https://example.invalid/screenshot-that-cannot-load.png",
        alt: "Produktansicht konnte nicht geladen werden",
      }}
    />
  ),
};

/* ─── Loading ─────────────────────────────────────────────────────────────
   Placeholder shapes are hidden from assistive technology; a status message
   carries the announcement instead.
   ----------------------------------------------------------------------- */
export const Loading: Story = {
  render: () => (
    <ProductHeroBlock
      state="loading"
      headline="Understand what your product costs to run"
      media={{ src: productShot, alt: "Usage dashboard" }}
      loadingLabel="Loading product introduction"
    />
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────────────
   The retry control appears only because a handler was supplied.
   ----------------------------------------------------------------------- */
export const ErrorWithRetry: Story = {
  render: () => (
    <ProductHeroBlock
      state="error"
      headline="Understand what your product costs to run"
      errorTitle="We could not load this introduction"
      errorDescription="The content service did not respond. Your account and data are unaffected."
      onRetry={() => window.alert("Retry requested")}
    />
  ),
};

/* ─── Error without a recovery handler ────────────────────────────────────
   No handler, no control. Nothing inert is rendered.
   ----------------------------------------------------------------------- */
export const ErrorWithoutRetry: Story = {
  render: () => (
    <ProductHeroBlock
      state="error"
      headline="Understand what your product costs to run"
      errorTitle="This introduction is temporarily unavailable"
      errorDescription="Please try again from the main navigation."
    />
  ),
};

/* ─── Custom surface theme ────────────────────────────────────────────────
   Overriding the semantic surface role must reach the block without a
   block-specific override.

   Flavor, mode, and customisation are separate concerns, so a brand surface is
   declared per mode. A single inline light value would look correct in light
   mode and leave light foreground tokens on a light ground in dark mode — the
   defect the September audit recorded against the work-email fixture.
   ----------------------------------------------------------------------- */
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

export const ThemedSurface: Story = {
  render: () => (
    <div className="batch-a-brand">
      <style>{brandTheme}</style>
      <ProductHeroBlock
        className="bg-surface"
        eyebrow="Scoped brand surface"
        headline="The hero picks up a consumer surface override"
        description="Cards, media frames, and the error panel read --color-surface with its paired border and muted-ground roles, not a hard-coded white."
        primaryCta={{ label: "Start a free trial", href: "#start" }}
        media={{ src: productShot, alt: "Usage dashboard example" }}
      />
    </div>
  ),
};

/* ─── Narrow container on a wide viewport ─────────────────────────────────
   The block reads its own container, not the viewport, so a 360px column on a
   1440px screen collapses to a single column. A viewport media query could not
   detect this placement at all.
   ----------------------------------------------------------------------- */
export const NarrowContainer: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[360px] border-x border-surface-border">
      <ProductHeroBlock
        eyebrow="Embedded in a 360px column"
        headline="The hero follows its container, not the window"
        description="Media stacks under the text and the actions become full width, even on a 1440px screen."
        primaryCta={{ label: "Start a free trial", href: "#start" }}
        secondaryCta={{ label: "Book a walkthrough", href: "#demo" }}
        highlights={[
          { id: "setup", value: "9 min", label: "Median time to first insight", icon: "stopwatch" },
        ]}
        media={{ src: productShot, alt: "Usage dashboard example" }}
      />
    </div>
  ),
};
