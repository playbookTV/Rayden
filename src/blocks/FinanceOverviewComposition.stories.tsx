import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountBalanceBlock } from "./AccountBalanceBlock";
import { InvoiceDetailBlock, type InvoiceLine } from "./InvoiceDetailBlock";
import { QuickSendBlock } from "./QuickSendBlock";
import { RecentTransactionsBlock } from "./RecentTransactionsBlock";
import { TransferReviewBlock } from "./TransferReviewBlock";
import { formatFinanceMoney } from "./finance";

/**
 * A finance overview assembled from two Batch D blocks and the two existing,
 * repaired finance blocks. Composing across the batch boundary is the point: it
 * is what exposes inconsistent spacing, heading levels, themes and nested
 * scrolling, and it did. See `docs/blocks-batch-d.md` for the inconsistencies
 * this composition found against `QuickSendBlock` and `RecentTransactionsBlock`.
 */
const meta: Meta = {
  title: "Blocks/Finance Overview",
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
};

export default meta;
type Story = StoryObj;

/* ─── Shared fixture data ─────────────────────────────────────────────
   One currency and one locale for the whole page, held here rather than in each
   block, which is how a real consumer would do it.
   ------------------------------------------------------------------- */
const CURRENCY = "GBP";
const LOCALE = "en-GB";
const TIME_ZONE = "Europe/London";

const gbp = (amount: number) =>
  formatFinanceMoney(amount, { currency: CURRENCY, locale: LOCALE }) as string;

const beneficiaries = [
  { id: "ama", name: "Ama Boateng", handle: "amaboateng", initials: "AB" },
  { id: "studio", name: "Studio Kleur", handle: "studiokleur", initials: "SK" },
  { id: "north", name: "Northwind Logistics", handle: "northwind", initials: "NL" },
  { id: "priya", name: "Priya Raghunathan", handle: "priyar", initials: "PR" },
  { id: "tomas", name: "Tomás Oyelaran-Whitfield", handle: "tomasow", initials: "TO" },
];

/** The existing block takes a pre-formatted string, so the page formats it. */
const transactions = [
  {
    id: "t1",
    direction: "outgoing" as const,
    name: "Studio Kleur",
    category: "Design services",
    amount: gbp(500_000),
  },
  {
    id: "t2",
    direction: "incoming" as const,
    name: "Northwind Logistics",
    category: "Invoice payment",
    amount: gbp(1_158_760),
  },
  {
    id: "t3",
    direction: "outgoing" as const,
    name: "HMRC",
    category: "VAT",
    amount: gbp(196_400),
  },
  {
    id: "t4",
    direction: "incoming" as const,
    name: "Priya Raghunathan",
    category: "Retainer",
    amount: gbp(250_000),
  },
];

const invoiceLines: InvoiceLine[] = [
  {
    id: "l1",
    description: "Design system audit",
    detail: "1–12 September 2026",
    quantity: 34,
    quantityUnit: "hours",
    unitPrice: 9_500,
    amount: 323_000,
  },
  {
    id: "l2",
    description: "Component library migration",
    quantity: 62,
    quantityUnit: "hours",
    unitPrice: 9_500,
    amount: 589_000,
  },
  {
    id: "l3",
    description: "Accessibility review and report",
    quantity: 1,
    unitPrice: 145_000,
    amount: 145_000,
  },
  {
    id: "l4",
    description: "Retainer credit carried forward",
    quantity: 1,
    unitPrice: -75_000,
    amount: -75_000,
  },
];

function longInvoice(count: number): InvoiceLine[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `line-${index + 1}`,
    description: `Sprint ${Math.floor(index / 4) + 1} — ${
      ["research", "design", "build", "review"][index % 4]
    }`,
    quantity: 4 + (index % 7),
    quantityUnit: "hours",
    unitPrice: 9_500,
    amount: (4 + (index % 7)) * 9_500,
  }));
}

/* ─── Layout ──────────────────────────────────────────────────────────
   A CSS grid with `minmax(0, …)` tracks, never a shrink-to-fit flex row. A
   block root carries `container-type: inline-size`, which contributes 0 to
   max-content, so a shrink-to-fit parent collapses it to nothing — the Batch C
   collapsed-switcher defect. A grid track gives it a real inline size.
   ------------------------------------------------------------------- */
function FinanceOverview({
  invoiceLines: lines,
  showTransfer = false,
}: {
  invoiceLines: InvoiceLine[];
  showTransfer?: boolean;
}) {
  const [balancesHidden, setBalancesHidden] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + ((line.amount as number) ?? 0), 0),
    [lines]
  );
  const vat = Math.round(subtotal * 0.2);

  const beneficiary = beneficiaries.find((item) => item.id === selected);

  return (
    <div className="@container flex min-w-0 flex-col gap-6 bg-surface-muted p-4 @min-[900px]:p-8">
      <header className="flex min-w-0 flex-col gap-1">
        <p className="font-semibold break-words uppercase text-caption-sm text-action-primary-text">
          Meridian Studio Ltd
        </p>
        <h1 className="min-w-0 text-h5 font-semibold break-words text-on-surface">
          Money overview
        </h1>
        <p className="max-w-[62ch] text-body-sm break-words text-on-surface-muted">
          Balances, recent movement, and the invoice you are chasing. Nothing on this page moves
          money on its own.
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 @min-[1000px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <AccountBalanceBlock
            title="Account balance"
            headingLevel="h2"
            currency={CURRENCY}
            locale={LOCALE}
            timeZone={TIME_ZONE}
            account={{ name: "Meridian Studio Ltd", reference: "•••• 4417", icon: "bank" }}
            status={{ label: "Active", tone: "success" }}
            available={428_612}
            pending={18_450}
            total={447_062}
            extraBalances={[
              { id: "reserved", label: "Reserved for cards", amount: 42_000, icon: "card" },
            ]}
            asOf={new Date("2026-09-23T09:12:00Z")}
            asOfNote="Balances refresh every 15 minutes."
            balancesHidden={balancesHidden}
            onToggleBalanceVisibility={() => setBalancesHidden((value) => !value)}
            onRefresh={fn()}
            actions={[
              { id: "add", label: "Add money", icon: "wallet-add", tone: "primary", onClick: fn() },
              { id: "statements", label: "Statements", icon: "file-download", href: "#statements" },
            ]}
          />

          {showTransfer && beneficiary && (
            <TransferReviewBlock
              title={`Review transfer to ${beneficiary.name}`}
              headingLevel="h2"
              locale={LOCALE}
              timeZone={TIME_ZONE}
              source={{
                name: "Meridian Studio Ltd",
                reference: "•••• 4417",
                institution: "Current account",
                icon: "bank",
              }}
              recipient={{
                name: beneficiary.name,
                reference: `@${beneficiary.handle}`,
                initials: beneficiary.initials,
              }}
              sendAmount={125_000}
              sendCurrency={CURRENCY}
              fee={0}
              totalDebited={125_000}
              arrival="Within 2 hours"
              requireAcknowledgement
              onConfirm={fn()}
              onCancel={() => setSelected(null)}
            />
          )}

          <InvoiceDetailBlock
            headingLevel="h2"
            invoiceNumber="INV-2026-0918"
            currency={CURRENCY}
            locale={LOCALE}
            timeZone={TIME_ZONE}
            status={{ label: "Awaiting payment", tone: "warning" }}
            issuedOn={new Date("2026-09-15T00:00:00Z")}
            dueOn={new Date("2026-09-30T00:00:00Z")}
            billedTo={{
              label: "Billed to",
              lines: ["Northwind Logistics B.V.", "Waalhaven Oostzijde 81", "3087 BM Rotterdam"],
            }}
            lines={lines}
            subtotal={subtotal}
            taxes={[{ id: "vat", label: "VAT", detail: "20% on services", amount: vat }]}
            amountPaid={0}
            amountDue={subtotal + vat}
            amountDueNote="Payable within 15 days."
            primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
            actions={[
              { id: "pdf", label: "Download PDF", icon: "file-download", href: "#invoice.pdf" },
            ]}
          />
        </div>

        {/* The two existing, repaired finance blocks. They own their own headings
            at `h3`, which sits correctly one level below the `h2` blocks above. */}
        <div className="flex min-w-0 flex-col gap-6">
          <QuickSendBlock
            beneficiaries={beneficiaries}
            onSelect={(id) => setSelected(id)}
            onSeeAll={fn()}
          />
          <RecentTransactionsBlock
            transactions={transactions}
            onTransactionClick={fn()}
            onSeeAll={fn()}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Default composition ─────────────────────────────────────────────── */
export const FinanceOverviewPage: Story = {
  render: () => <FinanceOverview invoiceLines={invoiceLines} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Exactly one h1, and no level skipped.
    const headings = Array.from(
      canvasElement.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ) as HTMLElement[];
    const levels = headings.map((heading) => Number(heading.tagName.slice(1)));
    await expect(levels.filter((level) => level === 1)).toHaveLength(1);
    for (let index = 1; index < levels.length; index += 1) {
      await expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
    }

    // The two existing blocks kept their own h3 headings.
    await expect(canvas.getByRole("heading", { level: 3, name: "Quick Send" })).toBeVisible();
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Recent Transactions" })
    ).toBeVisible();

    // Money is formatted once, at page level, so both families agree. The
    // existing transactions block splits its sign and amount into separate text
    // nodes, so the amount is matched against the element's text content.
    await expect(canvas.getByText("£11,784.00")).toBeVisible();
    const transactionAmounts = Array.from(canvasElement.querySelectorAll("span")).filter(
      (node) => node.textContent?.replace(/\s+/g, " ").trim() === "+ £11,587.60"
    );
    await expect(transactionAmounts.length).toBeGreaterThanOrEqual(1);

    // No element on the page is a horizontal scroll region, and the document is
    // not wider than the viewport.
    const horizontal = Array.from(canvasElement.querySelectorAll("*")).filter((element) => {
      const node = element as HTMLElement;
      const style = getComputedStyle(node);
      const scrolls = style.overflowX === "auto" || style.overflowX === "scroll";
      return scrolls && node.scrollWidth > node.clientWidth + 1;
    });
    await expect(horizontal).toHaveLength(0);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth
    );
  },
};

/* ─── Selecting a beneficiary reveals a transfer review ────────────────
   The whole point of the category: Quick Send starts a transfer, Transfer Review
   presents it, and confirmation is a callback. No money moves and no success
   state is invented anywhere in the chain.
   ------------------------------------------------------------------- */
export const StartATransferFromQuickSend: Story = {
  render: () => {
    function Harness() {
      const [selected, setSelected] = useState<string | null>(null);
      const [confirmations, setConfirmations] = useState(0);
      const beneficiary = beneficiaries.find((item) => item.id === selected);
      return (
        <div className="@container flex min-w-0 flex-col gap-6 bg-surface-muted p-4">
          <h1 className="text-h5 font-semibold text-on-surface">Send money</h1>
          <p data-testid="confirmations" className="text-body-sm text-on-surface-body">
            Confirmations sent: {confirmations}
          </p>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 @min-[900px]:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-3">
              <h2 className="text-body-md font-semibold text-on-surface">Choose a beneficiary</h2>
              <QuickSendBlock beneficiaries={beneficiaries} onSelect={setSelected} />
            </div>
            <div className="min-w-0">
              {beneficiary ? (
                <TransferReviewBlock
                  title={`Review transfer to ${beneficiary.name}`}
                  headingLevel="h2"
                  locale={LOCALE}
                  source={{ name: "Meridian Studio Ltd", reference: "•••• 4417", icon: "bank" }}
                  recipient={{
                    name: beneficiary.name,
                    reference: `@${beneficiary.handle}`,
                    initials: beneficiary.initials,
                  }}
                  sendAmount={125_000}
                  sendCurrency={CURRENCY}
                  fee={0}
                  totalDebited={125_000}
                  arrival="Within 2 hours"
                  onConfirm={() => setConfirmations((value) => value + 1)}
                  onCancel={() => setSelected(null)}
                />
              ) : (
                <p className="text-body-sm text-on-surface-muted">
                  Choose a beneficiary to review a transfer.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }
    return <Harness />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /Ama Boateng/ }));

    const heading = canvas.getByRole("heading", {
      level: 2,
      name: "Review transfer to Ama Boateng",
    });
    await expect(heading).toBeVisible();

    const confirm = canvas.getByRole("button", { name: /Confirm transfer/ });
    await userEvent.click(confirm);
    await userEvent.click(confirm);

    // One confirmation, no matter how many presses.
    await expect(canvas.getByTestId("confirmations")).toHaveTextContent("Confirmations sent: 1");
    // And the composition has produced no success state of its own.
    await expect(canvas.queryByRole("status")).toBeNull();
  },
};

/* ─── Forty invoice lines inside the composition ───────────────────────
   The nested-scrolling check the plan asks a composition to make: the invoice
   scrolls inside its own bounded region and the page keeps one scroll axis.
   ------------------------------------------------------------------- */
export const LongInvoiceInComposition: Story = {
  render: () => <FinanceOverview invoiceLines={longInvoice(40)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const region = canvas.getByRole("region", { name: "Invoice lines" });
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);

    // Exactly one bounded vertical scroll region on the page.
    const vertical = Array.from(canvasElement.querySelectorAll("*")).filter((element) => {
      const node = element as HTMLElement;
      const style = getComputedStyle(node);
      const scrolls = style.overflowY === "auto" || style.overflowY === "scroll";
      return scrolls && node.scrollHeight > node.clientHeight + 1;
    });
    await expect(vertical).toHaveLength(1);
    await expect(vertical[0]).toBe(region);

    // The document still does not grow sideways.
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth
    );
  },
};

/* ─── Dark composition ────────────────────────────────────────────────
   The whole page in a dark island, which is where a theme inconsistency between
   the two block families shows up.
   ------------------------------------------------------------------- */
export const DarkComposition: Story = {
  render: () => (
    <div className="rayden-dark">
      <FinanceOverview invoiceLines={invoiceLines} />
    </div>
  ),
};

/* ─── Narrow composition ──────────────────────────────────────────────
   A 360px column at whatever viewport the story runs in. Every block reads its
   own width, so the page stacks without a single viewport media query.
   ------------------------------------------------------------------- */
export const NarrowComposition: Story = {
  render: () => (
    <div className="w-[360px]">
      <FinanceOverview invoiceLines={invoiceLines} />
    </div>
  ),
  play: async () => {
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth
    );
  },
};
