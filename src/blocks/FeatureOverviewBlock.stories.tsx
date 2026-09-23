import type { Meta, StoryObj } from "@storybook/react";
import { FeatureOverviewBlock, type FeatureOverviewItem } from "./FeatureOverviewBlock";

const meta: Meta<typeof FeatureOverviewBlock> = {
  title: "Blocks/FeatureOverview",
  component: FeatureOverviewBlock,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeatureOverviewBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────── */

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
      "Project the current billing period from live usage and see the forecast move when a rollout changes consumption.",
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
      "Stream the attributed usage table into Snowflake, BigQuery, or Redshift on the schedule your finance team already uses.",
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
      "Give finance the totals and engineering the traces, without maintaining two separate reporting stacks.",
    badge: "Enterprise",
    cta: { label: "Roles and permissions", href: "#access" },
  },
];

/* ─── Default ─────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <FeatureOverviewBlock
      eyebrow="What you get"
      title="Built for the questions finance and engineering ask each other"
      description="Each capability answers one recurring question. Follow the ones that matter to you and skip the rest."
      features={features}
      footerCta={{ label: "Compare every capability", href: "#compare" }}
    />
  ),
};

/* ─── Two columns, plain surface ──────────────────────────────────────── */
export const TwoColumnsPlain: Story = {
  render: () => (
    <FeatureOverviewBlock
      variant="plain"
      columns={2}
      headingLevel="h3"
      title="Two capabilities, borderless"
      description="The plain variant drops the card surface for use inside a page that already provides one. Item headings follow the section heading level, so h3 here makes each item an h4."
      features={features.slice(0, 4)}
    />
  ),
};

/* ─── Four columns ────────────────────────────────────────────────────── */
export const FourColumns: Story = {
  render: () => (
    <FeatureOverviewBlock
      title="Four across on wide screens"
      description="Narrow viewports always reduce to a single column."
      columns={4}
      features={features.slice(0, 4)}
    />
  ),
};

/* ─── Edge case: long translated labels, no follow-on links ───────────── */
export const LongTranslatedLabels: Story = {
  render: () => (
    <FeatureOverviewBlock
      eyebrow="Funktionsübersicht"
      title="Nutzungsereigniszuordnung und Rechnungsprognose für Plattformteams"
      description="Jede Funktion beantwortet eine wiederkehrende Frage zwischen Finanzabteilung und Entwicklung."
      features={[
        {
          id: "zuordnung",
          icon: "coin-swap",
          title: "Ereignisgenaue Kostenzuordnung",
          description:
            "Jedes abrechenbare Ereignis trägt Team, Kundin und Umgebung, sodass jede Kostenspitze eine verantwortliche Stelle hat.",
          cta: { label: "Funktionsweise der Kostenzuordnung ansehen", href: "#zuordnung" },
        },
        {
          id: "prognose",
          icon: "chart-up",
          title: "Rechnungsbetragsvorhersage",
          description:
            "Hochrechnung des laufenden Abrechnungszeitraums aus Echtzeitdaten, einschließlich Veränderungen durch neue Rollouts.",
          badge: "Vorschau",
        },
        {
          id: "budgetueberwachung",
          icon: "shield-tick",
          title: "Budgetüberwachungsschwellenwerte",
          description:
            "Legen Sie Obergrenzen je Team oder Kundin fest; Benachrichtigungen erfolgen vor dem Überschreiten.",
        },
      ]}
    />
  ),
};

/* ─── Loading ─────────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <FeatureOverviewBlock
      state="loading"
      title="Built for the questions finance and engineering ask each other"
      description="Placeholders are hidden from assistive technology; a status message carries the announcement."
      features={[]}
      loadingItemCount={3}
    />
  ),
};

/* ─── Empty source ────────────────────────────────────────────────────────
   No features configured. Distinct from a search that returned no matches —
   the caller supplies the wording for each case.
   ----------------------------------------------------------------------- */
export const EmptySource: Story = {
  render: () => (
    <FeatureOverviewBlock
      title="Capabilities"
      features={[]}
      emptyState={{
        title: "No capabilities published yet",
        description:
          "This section is driven by the marketing content service. Publish a capability to see it here.",
        cta: { label: "Open the content service", href: "#cms" },
      }}
    />
  ),
};

/* ─── No matches ──────────────────────────────────────────────────────────
   Same visual treatment, different truthful wording.
   ----------------------------------------------------------------------- */
export const NoMatches: Story = {
  render: () => (
    <FeatureOverviewBlock
      title="Capabilities"
      description="Filtered by “compliance”."
      state="empty"
      features={[]}
      emptyState={{
        title: "Nothing matched “compliance”",
        description: "Try a broader term, or clear the filter to see all six capabilities.",
        cta: { label: "Clear the filter", onClick: () => window.alert("Filter cleared") },
      }}
    />
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────────── */
export const ErrorWithRetry: Story = {
  render: () => (
    <FeatureOverviewBlock
      state="error"
      title="Built for the questions finance and engineering ask each other"
      features={[]}
      errorTitle="We could not load these capabilities"
      errorDescription="The content service returned an error. Nothing about your account changed."
      onRetry={() => window.alert("Retry requested")}
    />
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
      <FeatureOverviewBlock
        title="Three columns collapse to one"
        description="The grid reads the container width, so this stays single column on a wide screen."
        columns={3}
        features={features.slice(0, 3)}
      />
    </div>
  ),
};
