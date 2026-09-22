import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  PricingPlansBlock,
  type PricingBillingPeriod,
  type PricingPlan,
} from "./PricingPlansBlock";

const meta: Meta<typeof PricingPlansBlock> = {
  title: "Blocks/PricingPlans",
  component: PricingPlansBlock,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PricingPlansBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────── */

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
      { id: "retention", label: "History", value: "13 months" },
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
      { id: "retention", label: "History", value: "3 years" },
      { id: "overage", label: "Overage", value: "$0.04 / 100k events" },
    ],
    features: [
      { id: "attribution", label: "Everything in Starter" },
      { id: "alerts", label: "Anomaly alerts" },
      { id: "budgets", label: "Budgets and guardrails" },
      { id: "exports", label: "Warehouse exports", note: "hourly" },
      { id: "sso", label: "SAML single sign-on" },
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
      { id: "retention", label: "History", value: "7 years" },
    ],
    features: [
      { id: "growth", label: "Everything in Growth" },
      { id: "residency", label: "Regional data residency" },
      { id: "audit", label: "Audit log export" },
      { id: "sla", label: "99.99% ingest SLA" },
      { id: "csm", label: "Named success manager" },
    ],
    cta: { label: "Talk to sales", href: "#enterprise", icon: "message" },
  },
];

/* ─── Default ─────────────────────────────────────────────────────────────
   Uncontrolled period switching. Selecting a plan is a destination, so it
   renders as a link; the block performs no purchase.
   ----------------------------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <PricingPlansBlock
      eyebrow="Pricing"
      title="Pay for the usage you attribute, not the seats you guess"
      description="Every plan includes event-level attribution and invoice forecasting. Move up when your event volume or your compliance requirements do."
      periods={periods}
      plans={plans}
      footnote="Prices exclude VAT and sales tax. Overage is billed monthly in arrears."
    />
  ),
};

/* ─── Controlled period ───────────────────────────────────────────────────
   The consuming application owns the selected period and can persist it.
   ----------------------------------------------------------------------- */
export const ControlledPeriod: Story = {
  render: function ControlledPeriodStory() {
    const [period, setPeriod] = useState("yearly");
    return (
      <PricingPlansBlock
        eyebrow="Pricing"
        title="Controlled billing period"
        description={"The parent owns the selection. Current value: " + period + "."}
        periods={periods}
        period={period}
        onPeriodChange={setPeriod}
        plans={plans}
      />
    );
  },
};

/* ─── Locale and large amounts ────────────────────────────────────────────
   Currency, locale, and separators are configurable inputs, not constants.
   ----------------------------------------------------------------------- */
export const LocaleAndLargeAmounts: Story = {
  render: () => (
    <PricingPlansBlock
      locale="de-DE"
      eyebrow="Preise"
      title="Nutzungsbasierte Tarife für Plattformteams"
      description="Große Beträge, deutsche Trennzeichen und lange übersetzte Bezeichnungen."
      periodLegend="Abrechnungszeitraum"
      limitsLabel="Enthaltenes Volumen"
      periods={[
        { id: "monthly", label: "Monatlich" },
        { id: "yearly", label: "Jährlich", badge: "20 % sparen" },
      ]}
      plans={[
        {
          id: "wachstum",
          name: "Wachstum",
          description: "Für Plattformteams mit nutzungsbasierter Weiterberechnung.",
          badge: "Beliebteste Wahl",
          highlighted: true,
          prices: {
            monthly: {
              amount: 1249.5,
              currency: "EUR",
              unit: "pro Monat",
              note: "Monatlich abgerechnet",
            },
            yearly: {
              amount: 999.99,
              currency: "EUR",
              unit: "pro Monat",
              originalAmount: 1249.5,
              note: "Jährlich abgerechnet mit 11.999,88 €",
            },
          },
          limits: [
            { id: "events", label: "Enthaltene Ereignisse", value: "250.000.000 / Monat" },
            { id: "overage", label: "Zusatzvolumen", value: "0,04 € / 100.000 Ereignisse" },
          ],
          features: [
            { id: "zuordnung", label: "Ereignisgenaue Kostenzuordnung" },
            { id: "budget", label: "Budgetüberwachungsschwellenwerte" },
          ],
          cta: { label: "Kostenlosen Testzeitraum starten", href: "#wachstum" },
        },
        {
          id: "konzern",
          name: "Konzern",
          description: "Für regulierte Organisationen mit Datenresidenzanforderungen.",
          prices: {
            monthly: {
              amount: 18750000,
              currency: "JPY",
              unit: "pro Jahr",
              note: "Jährliche Vereinbarung",
            },
            yearly: {
              amount: 18750000,
              currency: "JPY",
              unit: "pro Jahr",
              note: "Jährliche Vereinbarung",
            },
          },
          limits: [{ id: "events", label: "Enthaltene Ereignisse", value: "Nach Vereinbarung" }],
          features: [
            { id: "residenz", label: "Regionale Datenresidenz" },
            { id: "audit", label: "Revisionsprotokollexport" },
          ],
          cta: { label: "Vertrieb kontaktieren", href: "#konzern" },
        },
      ]}
      footnote="Alle Preise zuzüglich Umsatzsteuer."
    />
  ),
};

/* ─── A plan with many features ───────────────────────────────────────────
   Long feature lists collapse behind a disclosure rather than producing a
   card several screens tall.
   ----------------------------------------------------------------------- */
export const ManyFeaturesCollapsed: Story = {
  render: () => (
    <PricingPlansBlock
      title="Long feature lists stay scannable"
      description="Set featuresVisibleLimit to collapse the remainder behind a labelled disclosure."
      periods={periods}
      featuresVisibleLimit={5}
      plans={[
        plans[0],
        {
          ...plans[1],
          features: [
            { id: "f1", label: "Everything in Starter" },
            { id: "f2", label: "Anomaly alerts" },
            { id: "f3", label: "Budgets and guardrails" },
            { id: "f4", label: "Warehouse exports", note: "hourly" },
            { id: "f5", label: "SAML single sign-on" },
            { id: "f6", label: "SCIM user provisioning" },
            { id: "f7", label: "Per-customer cost reports" },
            { id: "f8", label: "Committed-use discount tracking" },
            { id: "f9", label: "Chargeback and showback statements" },
            { id: "f10", label: "Slack and Microsoft Teams notifications" },
            { id: "f11", label: "Custom event dimensions" },
            { id: "f12", label: "Sandbox environment" },
            { id: "f13", label: "Regional data residency", included: false },
            { id: "f14", label: "Named success manager", included: false },
          ],
        },
        plans[2],
      ]}
    />
  ),
};

/* ─── Availability: current and unavailable plans ─────────────────────────
   A plan that cannot be chosen renders an explicitly disabled control with a
   visible reason associated through aria-describedby. The current plan shows a
   non-interactive marker rather than a control that does nothing.
   ----------------------------------------------------------------------- */
export const CurrentAndUnavailablePlans: Story = {
  render: () => (
    <PricingPlansBlock
      title="Availability is explicit"
      description="Signed in as a Growth customer in a region where Enterprise residency is not yet offered."
      periods={periods}
      plans={[
        {
          ...plans[0],
          availability: "unavailable",
          unavailableReason:
            "Downgrades are handled by support while a committed-use term is open.",
          cta: { label: "Choose Starter", href: "#starter" },
        },
        {
          ...plans[1],
          availability: "current",
          badge: undefined,
          highlighted: false,
          cta: undefined,
        },
        {
          ...plans[2],
          availability: "unavailable",
          cta: { label: "Talk to sales", href: "#enterprise" },
        },
      ]}
      defaultUnavailableReason="Not available in your region yet."
    />
  ),
};

/* ─── Consumer-confirmed outcome ──────────────────────────────────────────
   The block never claims a purchase succeeded. A notice appears only when the
   consuming application passes one in.
   ----------------------------------------------------------------------- */
export const ConfirmedOutcomeNotice: Story = {
  render: () => (
    <PricingPlansBlock
      title="Choose a plan"
      description="The notice below was supplied by the application after its own confirmation."
      periods={periods}
      notice={{
        tone: "success",
        title: "Your plan change to Growth is confirmed",
        description: "The new rate applies from your next billing date, 1 October 2026.",
      }}
      plans={[plans[0], { ...plans[1], availability: "current", cta: undefined }, plans[2]]}
    />
  ),
};

/* ─── Selecting a plan is a callback ──────────────────────────────────────
   Action CTAs render as buttons. Nothing is purchased here.
   ----------------------------------------------------------------------- */
export const ActionCallbacks: Story = {
  render: function ActionCallbacksStory() {
    const [chosen, setChosen] = useState<string | null>(null);
    return (
      <PricingPlansBlock
        title="Plan selection raises a callback"
        description={
          chosen
            ? "Last callback received for: " +
              chosen +
              ". The application decides what happens next."
            : "Choose a plan to see the callback value. No purchase is made."
        }
        periods={periods}
        plans={plans.map((plan) => ({
          ...plan,
          cta: {
            label: "Choose " + String(plan.name),
            onClick: () => setChosen(String(plan.name)),
          },
        }))}
      />
    );
  },
};

/* ─── Loading ─────────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <PricingPlansBlock
      state="loading"
      title="Pay for the usage you attribute"
      periods={periods}
      plans={[]}
      loadingPlanCount={3}
    />
  ),
};

/* ─── Empty ───────────────────────────────────────────────────────────── */
export const Empty: Story = {
  render: () => (
    <PricingPlansBlock
      title="Pricing"
      plans={[]}
      emptyTitle="No plans are published for your region"
      emptyDescription="Pricing for this region is being finalised. Contact sales for an interim agreement."
    />
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────────── */
export const ErrorWithRetry: Story = {
  render: () => (
    <PricingPlansBlock
      state="error"
      title="Pricing"
      plans={[]}
      errorTitle="We could not load pricing"
      errorDescription="The billing service did not respond. Your subscription is unchanged."
      onRetry={() => window.alert("Retry requested")}
    />
  ),
};

/* ─── Single plan ─────────────────────────────────────────────────────────
   One plan and one period: the switcher is omitted rather than shown inert.
   ----------------------------------------------------------------------- */
export const SinglePlanNoSwitcher: Story = {
  render: () => (
    <PricingPlansBlock
      title="One plan, one price"
      periods={[{ id: "monthly", label: "Monthly" }]}
      plans={[{ ...plans[1], badge: undefined, highlighted: false }]}
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
      <PricingPlansBlock
        title="Plans stack in a narrow column"
        description="The period switcher wraps and the plan grid collapses to one column."
        periods={periods}
        plans={plans}
        featuresVisibleLimit={4}
      />
    </div>
  ),
};
