import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountBalanceBlock, type AccountBalanceEntry } from "./AccountBalanceBlock";
import type { FinanceAction } from "./finance";

const meta: Meta<typeof AccountBalanceBlock> = {
  title: "Blocks/Account Balance",
  component: AccountBalanceBlock,
  tags: ["autodocs"],
  /**
   * `layout: "fullscreen"` on purpose. Storybook's padded layout wraps a story in
   * a flex column with `align-items: center`, which makes the story a
   * shrink-to-fit flex item. A root carrying `container-type: inline-size`
   * contributes 0 to max-content, so the block collapsed to 0px wide and painted
   * outside its own box — the Batch C collapsed-switcher defect. The decorator
   * below supplies a real inline size and the page gutter.
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
type Story = StoryObj<typeof AccountBalanceBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────
   Amounts are integers in the currency's minor unit, the contract Batch B
   established for commerce. 428_612 GBP minor units is £4,286.12.
   ------------------------------------------------------------------- */

const actions: FinanceAction[] = [
  { id: "add", label: "Add money", icon: "wallet-add", tone: "primary", onClick: fn() },
  { id: "withdraw", label: "Withdraw", icon: "wallet-withdraw", onClick: fn() },
  { id: "statements", label: "Statements", icon: "file-download", href: "#statements" },
];

const holds: AccountBalanceEntry[] = [
  {
    id: "reserved",
    label: "Reserved for cards",
    amount: 42_000,
    hint: "Released when card holds settle",
    icon: "card",
  },
];

/* ─── Default ─────────────────────────────────────────────────────────
   Typical content: three known figures, an update time, and three actions.
   ------------------------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <AccountBalanceBlock
      eyebrow="Current account"
      account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
      status={{ label: "Active", tone: "success" }}
      available={428_612}
      pending={18_450}
      total={447_062}
      extraBalances={holds}
      asOf={new Date("2026-09-23T09:12:00Z")}
      timeZone="Europe/London"
      asOfNote="Balances refresh every 15 minutes, or when you ask for them."
      onRefresh={fn()}
      onToggleBalanceVisibility={fn()}
      actions={actions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 2, name: "Account balance" })).toBeVisible();

    // The headline figure is the available balance, formatted for en-GB/GBP.
    await expect(canvas.getByText("£4,286.12")).toBeVisible();
    // Secondary figures are present and formatted the same way.
    await expect(canvas.getByText("£184.50")).toBeVisible();
    await expect(canvas.getByText("£4,470.62")).toBeVisible();
    await expect(canvas.getByText("£420.00")).toBeVisible();

    // The update time is a real `<time>` with a machine-readable value.
    const time = canvasElement.querySelector("time");
    await expect(time).toHaveAttribute("datetime", "2026-09-23T09:12:00.000Z");

    // Destinations are anchors; actions are buttons.
    await expect(canvas.getByRole("link", { name: /Statements/ })).toHaveAttribute(
      "href",
      "#statements"
    );
    await expect(canvas.getByRole("button", { name: /Add money/ })).toBeVisible();
  },
};

export const LongControlLabels: Story = {
  render: () => (
    <div className="w-[288px] max-w-full">
      <AccountBalanceBlock
        available={428_612}
        status={{ label: "AwaitingInternationalAccountVerification" }}
        onRefresh={fn()}
        refreshLabel="EineSehrLangeBezeichnungFürDieseAktion"
        onToggleBalanceVisibility={fn()}
        hideBalancesLabel="EineSehrLangeBezeichnungFürDieseAktion"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("section")!;
    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth + 1);
    for (const button of section.querySelectorAll("button")) {
      await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};

/* ─── An unknown pending balance ──────────────────────────────────────
   `null` is not zero. The block says so in words and adds a note explaining
   that the figures marked this way are missing, not empty.
   ------------------------------------------------------------------- */
export const UnknownPendingBalance: Story = {
  render: () => (
    <AccountBalanceBlock
      account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
      status={{
        label: "Partial data",
        tone: "warning",
        description: "The pending balance is unavailable from the clearing provider.",
      }}
      available={428_612}
      pending={null}
      total={null}
      unknownLabel="Unavailable"
      asOf={new Date("2026-09-23T09:12:00Z")}
      timeZone="Europe/London"
      onRefresh={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Two unknown figures, stated as words.
    await expect(canvas.getAllByText("Unavailable")).toHaveLength(2);
    // And never rendered as a zero amount.
    await expect(canvas.queryByText("£0.00")).toBeNull();
  },
};

/* ─── A zero balance ──────────────────────────────────────────────────
   Zero is a real balance and prints as one. This story exists so the
   difference from the story above is visible side by side.
   ------------------------------------------------------------------- */
export const ZeroBalance: Story = {
  render: () => (
    <AccountBalanceBlock
      title="Savings balance"
      account={{ name: "Reserve account", reference: "•••• 9920", icon: "bank" }}
      available={0}
      pending={0}
      total={0}
      asOf={new Date("2026-09-23T06:00:00Z")}
      timeZone="Europe/London"
      actions={[{ id: "fund", label: "Fund this account", tone: "primary", onClick: fn() }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("£0.00").length).toBeGreaterThanOrEqual(3);
    await expect(canvas.queryByText("Not available")).toBeNull();
  },
};

/* ─── Hidden balances ─────────────────────────────────────────────────
   Controlled. The block masks what it is told to mask and stores nothing.
   ------------------------------------------------------------------- */
function HiddenHarness() {
  const [hidden, setHidden] = useState(true);
  return (
    <AccountBalanceBlock
      account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
      available={428_612}
      pending={18_450}
      total={447_062}
      balancesHidden={hidden}
      onToggleBalanceVisibility={() => setHidden((value) => !value)}
      asOf={new Date("2026-09-23T09:12:00Z")}
      timeZone="Europe/London"
    />
  );
}

export const HiddenBalances: Story = {
  render: () => <HiddenHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Show balances" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.queryByText("£4,286.12")).toBeNull();

    await userEvent.click(toggle);
    await expect(canvas.getByText("£4,286.12")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Hide balances" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  },
};

/* ─── A large amount in another currency and locale ───────────────────
   JPY has no minor unit, so the same integer contract prints whole yen.
   ------------------------------------------------------------------- */
export const LargeAmountJapaneseYen: Story = {
  render: () => (
    <AccountBalanceBlock
      title="口座残高"
      eyebrow="事業用口座"
      currency="JPY"
      locale="ja-JP"
      timeZone="Asia/Tokyo"
      availableLabel="利用可能額"
      pendingLabel="処理中"
      totalLabel="合計残高"
      asOfLabel="更新"
      unknownLabel="取得できません"
      account={{ name: "メリディアン商事株式会社", reference: "•••• 4417", icon: "bank" }}
      available={1_284_930_517}
      pending={9_420_000}
      total={1_294_350_517}
      asOf={new Date("2026-09-23T09:12:00Z")}
      actions={[{ id: "statements", label: "明細をダウンロード", href: "#statements" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Whole yen, grouped for ja-JP.
    await expect(canvas.getByText("￥1,284,930,517")).toBeVisible();
  },
};

/* ─── Euro, negative balance ──────────────────────────────────────────
   An overdrawn account is a real state, not an error.
   ------------------------------------------------------------------- */
export const OverdrawnEuro: Story = {
  render: () => (
    <AccountBalanceBlock
      currency="EUR"
      locale="nl-NL"
      timeZone="Europe/Amsterdam"
      account={{ name: "Meridian Handel B.V.", reference: "•••• 6631", icon: "bank" }}
      status={{ label: "Overdrawn", tone: "danger" }}
      available={-124_55}
      pending={0}
      total={-124_55}
      extraBalances={[
        { id: "limit", label: "Arranged overdraft", amount: 250_000, icon: "shield-tick" },
      ]}
      asOf={new Date("2026-09-23T07:45:00Z")}
      actions={[{ id: "transfer", label: "Transfer in", tone: "primary", onClick: fn() }]}
    />
  ),
};

/* ─── Permission ──────────────────────────────────────────────────────
   An action the reader cannot use is visible, disabled, and explained. It is
   not silently missing and not a control that fails when pressed.
   ------------------------------------------------------------------- */
export const RestrictedActions: Story = {
  render: () => (
    <AccountBalanceBlock
      account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
      available={428_612}
      total={447_062}
      asOf={new Date("2026-09-23T09:12:00Z")}
      actions={[
        { id: "add", label: "Add money", tone: "primary", onClick: fn() },
        {
          id: "withdraw",
          label: "Withdraw",
          unavailableReason: "Only an account owner can withdraw funds.",
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const withdraw = canvas.getByRole("button", { name: /Withdraw/ });
    await expect(withdraw).toBeDisabled();
    const reasonId = withdraw.getAttribute("aria-describedby");
    await expect(reasonId).toBeTruthy();
    await expect(
      canvasElement.querySelector(`#${CSS.escape(reasonId as string)}`)
    ).toHaveTextContent("Only an account owner can withdraw funds.");
  },
};

/* ─── Loading, error, empty ───────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <AccountBalanceBlock
      available={undefined}
      state="loading"
      loadingMessage="Fetching balances from your bank"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Fetching balances from your bank");
    await expect(canvasElement.querySelector("[aria-busy='true']")).toBeTruthy();
  },
};

export const ErrorWithRetry: Story = {
  render: () => (
    <AccountBalanceBlock
      state="error"
      errorDescription="Your bank did not respond. Your money is unaffected."
      onRetry={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("Balances could not be loaded");
    await expect(canvas.getByRole("button", { name: /Try again/ })).toBeVisible();
  },
};

export const EmptyNoAccount: Story = {
  render: () => (
    <AccountBalanceBlock
      state="empty"
      emptyTitle="No account connected"
      emptyDescription="Connect a bank account to see balances here."
      emptyAction={{ id: "connect", label: "Connect an account", tone: "primary", onClick: fn() }}
    />
  ),
};

/* ─── No figures supplied ─────────────────────────────────────────────
   The block does not invent a zero when nothing was supplied. It says there
   is nothing to show.
   ------------------------------------------------------------------- */
export const NoFiguresSupplied: Story = {
  render: () => (
    <AccountBalanceBlock
      account={{ name: "Meridian Trading Ltd", icon: "bank" }}
      emptyTitle="No balances for this account"
      emptyDescription="This account type does not report a balance."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No balances for this account")).toBeVisible();
    await expect(canvas.queryByText("£0.00")).toBeNull();
  },
};

/* ─── Narrow container on a wide viewport ─────────────────────────────
   288px and 420px columns at whatever viewport the story runs in. The block
   reads its own width, not the window's.
   ------------------------------------------------------------------- */
export const NarrowContainers: Story = {
  parameters: { viewport: { defaultViewport: "responsive" } },
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-[288px]">
        <AccountBalanceBlock
          title="Account balance, 288px column"
          headingLevel="h3"
          account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
          available={428_612}
          pending={18_450}
          total={447_062}
          asOf={new Date("2026-09-23T09:12:00Z")}
          onRefresh={fn()}
          actions={[{ id: "add", label: "Add money", tone: "primary", onClick: fn() }]}
        />
      </div>
      <div className="w-[420px]">
        <AccountBalanceBlock
          title="Account balance, 420px column"
          headingLevel="h3"
          account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
          available={428_612}
          pending={18_450}
          total={447_062}
          extraBalances={holds}
          asOf={new Date("2026-09-23T09:12:00Z")}
          onRefresh={fn()}
          actions={actions}
        />
      </div>
    </div>
  ),
};

/* ─── Dark island ─────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="rayden-dark bg-surface-muted p-4">
      <AccountBalanceBlock
        account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
        status={{ label: "Active", tone: "success" }}
        available={428_612}
        pending={null}
        total={447_062}
        extraBalances={holds}
        asOf={new Date("2026-09-23T09:12:00Z")}
        onRefresh={fn()}
        onToggleBalanceVisibility={fn()}
        actions={actions}
      />
    </div>
  ),
};

/* ─── Consumer surface override ───────────────────────────────────────
   Scoped to an explicit light island, because a consumer palette is written
   for one mode: the library's grey ramp inverts under `.dark` and these
   overrides do not.
   ------------------------------------------------------------------- */
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
    <div style={sageTheme} className="rayden-light bg-surface-muted p-4">
      <AccountBalanceBlock
        account={{ name: "Meridian Trading Ltd", reference: "•••• 4417", icon: "bank" }}
        status={{ label: "Active", tone: "success" }}
        available={428_612}
        pending={18_450}
        total={447_062}
        asOf={new Date("2026-09-23T09:12:00Z")}
        onRefresh={fn()}
        actions={actions}
      />
    </div>
  ),
};
