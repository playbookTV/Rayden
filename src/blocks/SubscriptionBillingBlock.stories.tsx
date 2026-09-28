import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  SubscriptionBillingBlock,
  type SubscriptionCancellationState,
  type SubscriptionPlanOption,
  type SubscriptionUsageMetric,
} from "./SubscriptionBillingBlock";

const meta: Meta<typeof SubscriptionBillingBlock> = {
  title: "Blocks/Subscription Billing",
  component: SubscriptionBillingBlock,
  tags: ["autodocs"],
  /**
   * Fullscreen plus an explicit-width decorator. Storybook's padded layout is a
   * flex column with `align-items: center`, which sizes a story shrink-to-fit; a
   * root carrying `container-type: inline-size` then resolves to 0px.
   */
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full min-w-0 bg-surface-muted p-4 text-on-surface">
        {Story()}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubscriptionBillingBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────── */

const usage: SubscriptionUsageMetric[] = [
  { id: "seats", label: "Seats in use", used: 18, limit: 25, unit: "seats" },
  {
    id: "builds",
    label: "Build minutes",
    used: 8_420,
    limit: 10_000,
    unit: "minutes",
    note: "Extra minutes are billed at £0.004 each.",
  },
  { id: "storage", label: "Artifact storage", used: 41, limit: 100, unit: "GB" },
];

const options: SubscriptionPlanOption[] = [
  {
    id: "scale",
    name: "Scale",
    amount: 49_900,
    interval: "per month",
    description: "For teams that need more build capacity and priority support.",
    highlights: ["50 seats", "40,000 build minutes", "Priority support"],
    recommended: true,
    onSelect: fn(),
  },
  {
    id: "enterprise",
    name: "Enterprise",
    amount: null,
    interval: "annual agreement",
    description: "Custom limits, procurement review, and a named contact.",
    highlights: ["Unlimited seats", "Custom limits", "Security review"],
    selectLabel: "Talk to sales",
    onSelect: fn(),
  },
];

const cancelReasons = [
  { id: "cost", label: "Too expensive" },
  { id: "unused", label: "We are not using it" },
  { id: "missing", label: "Missing a feature we need" },
  { id: "switching", label: "Moving to another product" },
];

/* ─── Default ─────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{ label: "Active", tone: "success" }}
      plan={{
        name: "Team",
        badge: "Annual",
        amount: 24_900,
        interval: "per month, billed annually",
        seats: "25 seats included",
        description: "Everything a product team needs to ship a design system.",
      }}
      renewsOn={new Date("2027-03-01T00:00:00Z")}
      timeZone="Europe/London"
      renewalNote="We will email the invoice seven days before the renewal date."
      nextChargeAmount={298_800}
      paymentMethodSummary="Visa ending 4242"
      onManagePaymentMethod={fn()}
      usage={usage}
      usagePeriod="1–30 September 2026"
      upgradeOptions={options}
      upgradeDescription="Changing plan takes effect at the start of the next billing period."
      actions={[
        { id: "invoices", label: "Billing history", icon: "receipt", href: "#invoices" },
        { id: "tax", label: "Tax details", icon: "file", onClick: fn() },
      ]}
      onCancelConfirm={fn()}
      cancelExplanation="Your subscription stays active until 1 March 2027. After that, projects become read-only."
      cancelReasons={cancelReasons}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "Subscription" })).toBeVisible();
    await expect(canvas.getByText("£249.00")).toBeVisible();
    await expect(canvas.getByText("£2,988.00")).toBeVisible();

    // Usage bars are named and carry real values.
    const bars = canvas.getAllByRole("progressbar");
    await expect(bars).toHaveLength(3);
    await expect(bars[0]).toHaveAttribute("aria-valuenow", "72");
    await expect(bars[0]).toHaveAccessibleName("Seats in use: 18 seats of 25 seats");

    // The cancellation panel is mounted and hidden, so `aria-controls` resolves.
    const toggle = canvas.getByRole("button", { name: /Cancel subscription/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    const panelId = toggle.getAttribute("aria-controls");
    await expect(canvasElement.querySelector(`#${CSS.escape(panelId as string)}`)).toBeTruthy();
  },
};

/* ─── Cancellation is two steps, and changes nothing by itself ─────────
   Opening the panel is not cancelling. Confirming calls the callback exactly
   once and the block still reports the subscription as Active, because only the
   caller knows whether the provider acted.
   ------------------------------------------------------------------- */
function CancelHarness({ resultAfterConfirm = false }: { resultAfterConfirm?: boolean }) {
  const [calls, setCalls] = useState<string[]>([]);
  const [cancellationState, setCancellationState] = useState<SubscriptionCancellationState>("idle");
  return (
    <div className="flex flex-col gap-3">
      <p data-testid="cancel-calls" className="text-body-sm text-on-surface-body">
        Cancellations requested: {calls.length}
        {calls.length > 0 && ` (reason: ${calls[0] ?? "none"})`}
      </p>
      <SubscriptionBillingBlock
        status={{ label: "Active", tone: "success" }}
        plan={{ name: "Team", amount: 24_900, interval: "per month", seats: "25 seats included" }}
        renewsOn={new Date("2027-03-01T00:00:00Z")}
        timeZone="Europe/London"
        usage={usage.slice(0, 1)}
        cancellationState={cancellationState}
        cancelReasons={cancelReasons}
        requireCancelReason
        cancelExplanation="Your subscription stays active until 1 March 2027."
        onCancelRequest={() => setCancellationState("idle")}
        onCancelConfirm={(reason) => {
          setCalls((previous) => [...previous, reason ?? "none"]);
          if (resultAfterConfirm) setCancellationState("pending");
        }}
      />
    </div>
  );
}

export const CancellationIsTwoSteps: Story = {
  render: () => <CancelHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Step one: the confirm control is not reachable until the panel is open,
    // but the panel is mounted, so `aria-controls` resolves to a real element
    // even while it is closed (audit B01).
    const toggle = canvas.getByRole("button", { name: /^Cancel subscription/ });
    const panelId = toggle.getAttribute("aria-controls") as string;
    const panel = canvasElement.querySelector(`#${CSS.escape(panelId)}`);
    await expect(panel).toBeTruthy();
    await expect(canvas.queryByRole("button", { name: /Yes, cancel subscription/ })).toBeNull();

    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const confirm = canvas.getByRole("button", { name: /Yes, cancel subscription/ });
    // A reason is required, so confirmation is not yet possible.
    await expect(confirm).toBeDisabled();

    await userEvent.selectOptions(canvas.getByLabelText(/Reason for cancelling/), "cost");
    await expect(confirm).toBeEnabled();

    await userEvent.click(confirm);
    await userEvent.click(confirm);

    // Exactly one request, and the reason was passed through.
    await expect(canvas.getByTestId("cancel-calls")).toHaveTextContent(
      "Cancellations requested: 1 (reason: cost)"
    );

    // The subscription is still reported as Active. The block did not decide
    // that the cancellation took effect.
    await expect(canvas.getByText("Active")).toBeVisible();
    await expect(canvas.queryByText(/cancelled|canceled/i)).toBeNull();
  },
};

/* ─── Backing out restores focus ──────────────────────────────────────── */
export const CancellationDismissRestoresFocus: Story = {
  render: () => <CancelHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /^Cancel subscription/ });
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByRole("button", { name: /Keep subscription/ }));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveFocus();
  },
};

/* ─── Cancellation in flight ──────────────────────────────────────────── */
export const CancellationPending: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{ label: "Active", tone: "success" }}
      plan={{ name: "Team", amount: 24_900, interval: "per month" }}
      renewsOn={new Date("2027-03-01T00:00:00Z")}
      timeZone="Europe/London"
      usage={usage.slice(0, 2)}
      cancellationState="pending"
      cancellationPendingMessage="Cancelling your subscription. This can take a few seconds."
      cancelExplanation="Your subscription stays active until 1 March 2027."
      onCancelConfirm={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Pending is not cancelled. The plan and the status are unchanged.
    await expect(canvas.getByText("Active")).toBeVisible();
    await expect(canvas.queryByText(/has been cancelled/i)).toBeNull();
    await expect(canvas.getByRole("status")).toHaveTextContent("Cancelling your subscription");
    const toggle = canvas.getByRole("button", { name: /^Cancel subscription/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    await expect(canvas.getByRole("status")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Keep subscription/ })).toBeDisabled();
  },
};

/* ─── A caller-supplied cancellation outcome ──────────────────────────
   The only way the block ever reports a cancellation. Note the tone: this is a
   scheduled end, not an immediate one, and the caller says so.
   ------------------------------------------------------------------- */
export const ConsumerSuppliedCancellationResult: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{
        label: "Cancels 1 March 2027",
        tone: "warning",
        description: "Set by the billing provider when the cancellation was accepted.",
      }}
      plan={{ name: "Team", amount: 24_900, interval: "per month", seats: "25 seats included" }}
      renewsOn={null}
      renewalNote="There is no further renewal. Access ends on 1 March 2027."
      usage={usage.slice(0, 2)}
      cancellationResult={{
        title: "This subscription will end on 1 March 2027",
        description: "You keep full access until then. Nothing else will be charged.",
        reference: "Reference SUB-CANCEL-88412",
      }}
      onCancelConfirm={fn()}
      actions={[{ id: "invoices", label: "Billing history", icon: "receipt", href: "#invoices" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "This subscription will end on 1 March 2027"
    );
    // Once an outcome exists, the cancellation affordance is withdrawn.
    await expect(canvas.queryByRole("button", { name: /^Cancel subscription/ })).toBeNull();
    // And the unknown renewal date is words, not a fabricated date.
    await expect(canvas.getByText("Not available")).toBeVisible();
  },
};

/* ─── Cancellation failed ─────────────────────────────────────────────── */
export const CancellationError: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{ label: "Active", tone: "success" }}
      plan={{ name: "Team", amount: 24_900, interval: "per month" }}
      usage={usage.slice(0, 1)}
      cancellationState="error"
      cancellationErrorDescription="The billing provider rejected the request. Nothing has changed."
      cancelExplanation="Your subscription stays active until 1 March 2027."
      onCancelConfirm={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "The billing provider rejected the request."
    );
    // Confirming again is allowed, because the caller reported a failure.
    await expect(canvas.getByRole("button", { name: /Yes, cancel subscription/ })).toBeEnabled();
    await userEvent.click(canvas.getByRole("button", { name: /Keep subscription/ }));
    await expect(canvas.getByRole("button", { name: /^Cancel subscription/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  },
};

export const ZeroUsageAllowance: Story = {
  render: () => (
    <SubscriptionBillingBlock
      plan={{ name: "Free", amount: 0 }}
      usage={[{ id: "builds", label: "Build minutes", used: 0, limit: 0, unit: "minutes" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("0 minutes of 0 minutes")).toBeVisible();
    await expect(canvas.getByText("This plan has no allowance for this usage.")).toBeVisible();
    await expect(canvas.queryByText(/A figure is missing/)).toBeNull();
    await expect(canvas.queryByRole("progressbar")).toBeNull();
  },
};

/* ─── Usage with unknown and unmetered figures ─────────────────────────
   No bar is drawn when a figure is missing, because an empty bar reads as zero
   use. An unmetered entitlement says so instead of implying a limit.
   ------------------------------------------------------------------- */
export const UsageWithUnknownFigures: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{ label: "Active", tone: "success" }}
      plan={{ name: "Team", amount: 24_900, interval: "per month" }}
      renewsOn={new Date("2027-03-01T00:00:00Z")}
      timeZone="Europe/London"
      unknownLabel="Not reported"
      usage={[
        { id: "seats", label: "Seats in use", used: 18, limit: 25, unit: "seats" },
        { id: "builds", label: "Build minutes", used: null, limit: 10_000, unit: "minutes" },
        { id: "bandwidth", label: "Bandwidth", used: 412, limit: null, unit: "GB" },
        { id: "projects", label: "Projects", used: 7, unit: "projects" },
      ]}
      usagePeriod="1–30 September 2026"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Only the one fully known metric gets a bar.
    await expect(canvas.getAllByRole("progressbar")).toHaveLength(1);
    await expect(canvas.getAllByText(/Not reported/).length).toBeGreaterThanOrEqual(2);
    await expect(canvas.getByText(/Unlimited/)).toBeVisible();
    await expect(
      canvas.getAllByText("A figure is missing, so no proportion is shown.")
    ).toHaveLength(2);
  },
};

/* ─── Unknown plan price, trialling ───────────────────────────────────── */
export const TrialWithUnknownPrice: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{
        label: "Trial, 9 days left",
        tone: "warning",
        description: "The price after the trial depends on the seats you keep.",
      }}
      plan={{
        name: "Team trial",
        amount: null,
        interval: "after the trial",
        seats: "5 seats in use",
      }}
      renewsOn={new Date("2026-10-02T00:00:00Z")}
      timeZone="Europe/London"
      nextChargeAmount={null}
      renewalNote="Add a payment method before 2 October to keep your projects."
      usage={usage.slice(0, 2)}
      upgradeOptions={options}
      actions={[{ id: "method", label: "Add a payment method", tone: "primary", onClick: fn() }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("Not available").length).toBeGreaterThanOrEqual(2);
    await expect(canvas.queryByText("£0.00")).toBeNull();
  },
};

/* ─── Read-only ───────────────────────────────────────────────────────
   Every management control is withdrawn and the reason is stated. No control is
   left present-but-broken.
   ------------------------------------------------------------------- */
export const ReadOnly: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{ label: "Active", tone: "success" }}
      plan={{ name: "Team", amount: 24_900, interval: "per month", seats: "25 seats included" }}
      renewsOn={new Date("2027-03-01T00:00:00Z")}
      timeZone="Europe/London"
      usage={usage}
      upgradeOptions={options}
      onManagePaymentMethod={fn()}
      onCancelConfirm={fn()}
      readOnly
      readOnlyReason="Only a workspace owner can change or cancel this subscription. Ask Amara Okonkwo."
      actions={[{ id: "invoices", label: "Billing history", icon: "receipt", href: "#invoices" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: /^Cancel subscription/ })).toBeNull();
    await expect(canvas.queryByRole("button", { name: /Update payment method/ })).toBeNull();
    await expect(canvas.queryByRole("button", { name: /Choose plan/ })).toBeNull();
    await expect(canvas.getByText(/Only a workspace owner/)).toBeVisible();
    // Reading the billing history is still allowed.
    await expect(canvas.getByRole("link", { name: /Billing history/ })).toBeVisible();
  },
};

/* ─── A plan option the reader cannot choose ──────────────────────────── */
export const PlanOptionUnavailable: Story = {
  render: () => (
    <SubscriptionBillingBlock
      status={{
        label: "Past due",
        tone: "danger",
        description: "A payment failed on 18 September.",
      }}
      plan={{ name: "Team", amount: 24_900, interval: "per month" }}
      renewsOn={new Date("2026-10-01T00:00:00Z")}
      timeZone="Europe/London"
      usage={usage.slice(0, 2)}
      upgradeOptions={[
        {
          id: "scale",
          name: "Scale",
          amount: 49_900,
          interval: "per month",
          highlights: ["50 seats", "40,000 build minutes"],
          unavailableReason: "Settle the outstanding invoice before changing plan.",
        },
      ]}
      actions={[{ id: "pay", label: "Pay outstanding invoice", tone: "primary", onClick: fn() }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Choose plan/ });
    await expect(button).toBeDisabled();
    const id = button.getAttribute("aria-describedby");
    await expect(canvasElement.querySelector(`#${CSS.escape(id as string)}`)).toHaveTextContent(
      /Settle the outstanding invoice/
    );
  },
};

/* ─── Loading, error, empty ───────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <SubscriptionBillingBlock
      plan={{ name: "" }}
      state="loading"
      loadingMessage="Loading your subscription"
    />
  ),
};

export const ErrorWithRetry: Story = {
  render: () => (
    <SubscriptionBillingBlock
      plan={{ name: "" }}
      state="error"
      errorDescription="The billing service did not respond."
      onRetry={fn()}
    />
  ),
};

export const EmptyNoSubscription: Story = {
  render: () => (
    <SubscriptionBillingBlock
      plan={{ name: "" }}
      state="empty"
      emptyTitle="No active subscription"
      emptyDescription="This workspace is on the free tier. Choose a plan to unlock build minutes."
      emptyAction={{ id: "plans", label: "See plans", tone: "primary", href: "#plans" }}
    />
  ),
};

/* ─── Narrow containers ───────────────────────────────────────────────── */
export const NarrowContainers: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-[288px]">
        <SubscriptionBillingBlock
          title="Subscription, 288px column"
          headingLevel="h3"
          status={{ label: "Active", tone: "success" }}
          plan={{ name: "Team", amount: 24_900, interval: "per month", seats: "25 seats" }}
          renewsOn={new Date("2027-03-01T00:00:00Z")}
          timeZone="Europe/London"
          usage={usage}
          onCancelConfirm={fn()}
          cancelExplanation="Access continues until 1 March 2027."
        />
      </div>
      <div className="w-[420px]">
        <SubscriptionBillingBlock
          title="Subscription, 420px column"
          headingLevel="h3"
          status={{ label: "Active", tone: "success" }}
          plan={{ name: "Team", amount: 24_900, interval: "per month", seats: "25 seats" }}
          renewsOn={new Date("2027-03-01T00:00:00Z")}
          timeZone="Europe/London"
          usage={usage}
          upgradeOptions={options}
          onCancelConfirm={fn()}
          cancelExplanation="Access continues until 1 March 2027."
        />
      </div>
    </div>
  ),
};

/* ─── Another currency and locale ─────────────────────────────────────── */
export const YenLocale: Story = {
  render: () => (
    <SubscriptionBillingBlock
      title="サブスクリプション"
      currency="JPY"
      locale="ja-JP"
      timeZone="Asia/Tokyo"
      planLabel="現在のプラン"
      renewsOnLabel="更新日"
      nextChargeLabel="次回請求額"
      usageLabel="今期の使用量"
      unknownLabel="取得できません"
      status={{ label: "有効", tone: "success" }}
      plan={{ name: "チームプラン", amount: 39_800, interval: "月額", seats: "25 席" }}
      renewsOn={new Date("2027-03-01T00:00:00Z")}
      nextChargeAmount={477_600}
      usage={[{ id: "seats", label: "使用中の席数", used: 18, limit: 25, unit: "席" }]}
    />
  ),
};

/* ─── Dark island ─────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="rayden-dark w-full min-w-0 bg-surface-muted p-4">
      <SubscriptionBillingBlock
        status={{ label: "Active", tone: "success" }}
        plan={{
          name: "Team",
          badge: "Annual",
          amount: 24_900,
          interval: "per month, billed annually",
          seats: "25 seats included",
        }}
        renewsOn={new Date("2027-03-01T00:00:00Z")}
        timeZone="Europe/London"
        nextChargeAmount={298_800}
        paymentMethodSummary="Visa ending 4242"
        onManagePaymentMethod={fn()}
        usage={usage}
        upgradeOptions={options}
        onCancelConfirm={fn()}
        cancelExplanation="Your subscription stays active until 1 March 2027."
        cancelReasons={cancelReasons}
        actions={[{ id: "invoices", label: "Billing history", icon: "receipt", href: "#invoices" }]}
      />
    </div>
  ),
};

/* ─── Consumer surface override, scoped to a light island ───────────────── */
const sageTheme = {
  "--color-surface": "#f6f7f2",
  "--color-surface-muted": "#eceee3",
  "--color-surface-border": "#dfe3d2",
  "--color-surface-border-strong": "#7d8a62",
  "--color-grey-500": "#4c5741",
  "--color-grey-600": "#3d4635",
  "--color-grey-700": "#2f362a",
  "--color-grey-900": "#1b1f18",
} as CSSProperties;

export const CustomSurface: Story = {
  render: () => (
    <div style={sageTheme} className="rayden-light w-full min-w-0 bg-surface-muted p-4">
      <SubscriptionBillingBlock
        status={{ label: "Active", tone: "success" }}
        plan={{ name: "Team", amount: 24_900, interval: "per month", seats: "25 seats included" }}
        renewsOn={new Date("2027-03-01T00:00:00Z")}
        timeZone="Europe/London"
        usage={usage}
        onCancelConfirm={fn()}
        cancelExplanation="Your subscription stays active until 1 March 2027."
      />
    </div>
  ),
};
