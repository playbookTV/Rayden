import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProductHeroBlock } from "./ProductHeroBlock";
import { FeatureOverviewBlock, type FeatureOverviewItem } from "./FeatureOverviewBlock";
import {
  PricingPlansBlock,
  type PricingBillingPeriod,
  type PricingPlan,
} from "./PricingPlansBlock";
import { SiteFooterBlock, type SiteFooterLinkGroup } from "./SiteFooterBlock";

/**
 * Batch A composition. Assembling the four blocks into one page is what exposes
 * inconsistent section spacing, competing heading levels, mismatched surfaces
 * between themes, and nested scrolling — none of which is visible when each
 * block is reviewed alone.
 *
 * Heading hierarchy across the page: the hero owns the only h1, the feature and
 * pricing sections are h2 with h3 items, and the footer group headings are h2.
 */
const meta: Meta = {
  title: "Blocks/Compositions/Marketing Landing",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ─── Shared page content ─────────────────────────────────────────────── */

const productShot =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">',
      '<rect width="640" height="400" fill="#fff7f3"/>',
      '<rect x="0" y="0" width="640" height="48" fill="#ffffff"/>',
      '<circle cx="28" cy="24" r="6" fill="#f56630"/>',
      '<rect x="48" y="18" width="96" height="12" rx="6" fill="#e4e7ec"/>',
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
      "</svg>",
    ].join("")
  );

const features: FeatureOverviewItem[] = [
  {
    id: "attribution",
    icon: "coin-swap",
    title: "Event-level attribution",
    description:
      "Every billable event carries the team, customer, and environment that produced it, so a spike always has an owner.",
    cta: { label: "How attribution works", href: "#attribution" },
  },
  {
    id: "forecast",
    icon: "chart-up",
    title: "Invoice forecasting",
    description:
      "Project the current billing period from live usage and watch the forecast move when a rollout changes consumption.",
    cta: { label: "See a worked example", href: "#forecast" },
  },
  {
    id: "budgets",
    icon: "shield-tick",
    title: "Budgets and guardrails",
    description:
      "Set a ceiling per team or customer. Citrionus notifies the owner before the threshold is crossed, not after.",
    badge: "Beta",
    cta: { label: "Configure a budget", href: "#budgets" },
  },
  {
    id: "exports",
    icon: "file-download",
    title: "Warehouse exports",
    description:
      "Stream the attributed usage table into Snowflake, BigQuery, or Redshift on the schedule finance already uses.",
    cta: { label: "Read the export schema", href: "#exports" },
  },
  {
    id: "alerts",
    icon: "bell",
    title: "Anomaly alerts",
    description:
      "Learns each customer's normal shape and flags only the departures worth a human's attention.",
    cta: { label: "Alert rules reference", href: "#alerts" },
  },
  {
    id: "access",
    icon: "user-group",
    title: "Scoped access",
    description:
      "Give finance the totals and engineering the traces, without maintaining two reporting stacks.",
    badge: "Enterprise",
    cta: { label: "Roles and permissions", href: "#access" },
  },
];

const periods: PricingBillingPeriod[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", badge: "Save 20%" },
];

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For a single team putting its first usage data in one place.",
    prices: {
      monthly: { amount: 49, currency: "USD", unit: "per month", note: "Billed monthly" },
      yearly: {
        amount: 39,
        currency: "USD",
        unit: "per month",
        originalAmount: 49,
        note: "Billed annually at $468",
      },
    },
    limits: [
      { id: "events", label: "Included events", value: "5M / month" },
      { id: "seats", label: "Editors", value: "5" },
    ],
    features: [
      { id: "attribution", label: "Event-level attribution" },
      { id: "forecast", label: "Invoice forecasting" },
      { id: "alerts", label: "Anomaly alerts", included: false },
      { id: "sso", label: "SAML single sign-on", included: false },
    ],
    cta: { label: "Start a free trial", href: "#starter" },
  },
  {
    id: "growth",
    name: "Growth",
    description: "For platform teams billing external customers for usage.",
    badge: "Most popular",
    highlighted: true,
    prices: {
      monthly: { amount: 249, currency: "USD", unit: "per month", note: "Billed monthly" },
      yearly: {
        amount: 199,
        currency: "USD",
        unit: "per month",
        originalAmount: 249,
        note: "Billed annually at $2,388",
      },
    },
    limits: [
      { id: "events", label: "Included events", value: "250M / month" },
      { id: "seats", label: "Editors", value: "25" },
      { id: "overage", label: "Overage", value: "$0.04 / 100k events" },
    ],
    features: [
      { id: "everything", label: "Everything in Starter" },
      { id: "alerts", label: "Anomaly alerts" },
      { id: "budgets", label: "Budgets and guardrails" },
      { id: "exports", label: "Warehouse exports", note: "hourly" },
      { id: "sso", label: "SAML single sign-on" },
      { id: "scim", label: "SCIM user provisioning" },
      { id: "chargeback", label: "Chargeback statements" },
      { id: "residency", label: "Regional data residency", included: false },
    ],
    cta: { label: "Start a free trial", href: "#growth" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For regulated teams with procurement, residency, and audit requirements.",
    prices: {
      monthly: { custom: "Custom pricing", note: "Annual agreement" },
      yearly: { custom: "Custom pricing", note: "Annual agreement" },
    },
    limits: [
      { id: "events", label: "Included events", value: "Negotiated" },
      { id: "seats", label: "Editors", value: "Unlimited" },
    ],
    features: [
      { id: "growth", label: "Everything in Growth" },
      { id: "residency", label: "Regional data residency" },
      { id: "audit", label: "Audit log export" },
      { id: "sla", label: "99.99% ingest SLA" },
    ],
    cta: { label: "Talk to sales", href: "#enterprise", icon: "message" },
  },
];

const footerGroups: SiteFooterLinkGroup[] = [
  {
    id: "product",
    title: "Product",
    links: [
      { id: "attribution", label: "Cost attribution", href: "#attribution" },
      { id: "forecasting", label: "Invoice forecasting", href: "#forecast" },
      { id: "budgets", label: "Budgets", href: "#budgets", badge: "New" },
      { id: "pricing", label: "Pricing", href: "#pricing" },
    ],
  },
  {
    id: "developers",
    title: "Developers",
    links: [
      { id: "docs", label: "Documentation", href: "#docs" },
      { id: "api", label: "API reference", href: "#api" },
      { id: "status", label: "System status", href: "https://example.com/status", external: true },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { id: "about", label: "About", href: "#about" },
      { id: "careers", label: "Careers", href: "#careers", badge: "6 open" },
      { id: "blog", label: "Blog", href: "#blog" },
    ],
  },
  {
    id: "support",
    title: "Support",
    links: [
      { id: "help", label: "Help centre", href: "#help" },
      { id: "contact", label: "Contact us", href: "#contact" },
    ],
  },
];

function LandingPage() {
  const [language, setLanguage] = useState("en-GB");
  const [period, setPeriod] = useState("yearly");

  return (
    <main className="w-full bg-surface">
      <ProductHeroBlock
        headingLevel="h1"
        eyebrowBadge="New"
        eyebrow="Usage analytics now included on every plan"
        headline="Understand what your product costs to run, before the invoice arrives"
        description="Citrionus reads your usage events as they happen, attributes them to the teams and customers that created them, and tells you what changed."
        primaryCta={{ label: "Start a free trial", href: "#starter" }}
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
        }}
      />

      <FeatureOverviewBlock
        className="bg-surface-muted"
        headingLevel="h2"
        eyebrow="What you get"
        title="Built for the questions finance and engineering ask each other"
        description="Each capability answers one recurring question. Follow the ones that matter to you and skip the rest."
        features={features}
        footerCta={{ label: "Compare every capability", href: "#compare" }}
      />

      <PricingPlansBlock
        id="pricing"
        headingLevel="h2"
        eyebrow="Pricing"
        title="Pay for the usage you attribute, not the seats you guess"
        description="Every plan includes event-level attribution and invoice forecasting. Move up when your event volume or your compliance requirements do."
        periods={periods}
        period={period}
        onPeriodChange={setPeriod}
        plans={plans}
        featuresVisibleLimit={5}
        footnote="Prices exclude VAT and sales tax. Overage is billed monthly in arrears."
      />

      <SiteFooterBlock
        label="Citrionus site footer"
        groupHeadingLevel="h2"
        brand={{
          name: "Citrionus",
          href: "#top",
          description:
            "Usage attribution and invoice forecasting for teams that bill their customers by consumption.",
        }}
        groups={footerGroups}
        social={[
          { id: "linkedin", label: "Citrionus on LinkedIn", href: "#linkedin", icon: "users" },
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
              { value: "ja-JP", label: "日本語" },
            ],
          },
        ]}
        copyright="© 2026 Citrionus Technologies Ltd. Registered in England and Wales, no. 11882043."
        legalLinks={[
          { id: "privacy", label: "Privacy notice", href: "#privacy" },
          { id: "terms", label: "Terms of service", href: "#terms" },
          { id: "cookies", label: "Cookie preferences", href: "#cookies" },
        ]}
      />
    </main>
  );
}

/* ─── Full page ───────────────────────────────────────────────────────────
   Hero, features, pricing, and footer in the order a visitor meets them.
   Interactive: switch the billing period and expand the Growth feature list.
   ----------------------------------------------------------------------- */
export const FullPage: Story = {
  render: () => <LandingPage />,
};

/* ─── Narrow desktop container ────────────────────────────────────────────
   Release gate 2 requires a narrow parent container on desktop as well as the
   four viewport widths. The blocks must reflow to the container, not the
   viewport, and must not introduce a second horizontal scroll region.
   ----------------------------------------------------------------------- */
export const NarrowContainer: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[420px] border-x border-grey-200">
      <LandingPage />
    </div>
  ),
};

/* ─── Scoped light island inside a dark page ──────────────────────────────
   The flavor contract keeps mode separate from customisation. A .rayden-light
   island must stay readable inside a globally dark document.
   ----------------------------------------------------------------------- */
export const ScopedLightIsland: Story = {
  render: () => (
    <div className="dark bg-grey-50 p-4">
      <div className="rayden-light overflow-hidden rounded-xl border border-grey-200">
        <LandingPage />
      </div>
    </div>
  ),
};
