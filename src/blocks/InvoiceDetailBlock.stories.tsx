import { useMemo, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { InvoiceDetailBlock, type InvoiceAdjustment, type InvoiceLine } from "./InvoiceDetailBlock";

const meta: Meta<typeof InvoiceDetailBlock> = {
  title: "Blocks/Invoice Detail",
  component: InvoiceDetailBlock,
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
type Story = StoryObj<typeof InvoiceDetailBlock>;

export const EnlargedTextInNarrowColumn: Story = {
  render: () => (
    <div className="w-[288px] max-w-full">
      <InvoiceDetailBlock
        lines={[
          {
            id: "audit",
            description: "Design system audit",
            quantity: 34,
            quantityUnit: "hours",
            unitPrice: 9_500,
            amount: 323_000,
          },
        ]}
        amountDue={323_000}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement;
    const previous = root.style.fontSize;
    try {
      root.style.fontSize = "32px";
      const region = within(canvasElement).getByRole("group", { name: "Invoice lines" });
      const section = canvasElement.querySelector("section")!;
      await expect(region).toHaveAttribute("tabindex", "0");
      await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth + 1);
      region.focus();
      await expect(region).toHaveFocus();
      // All of the amount remains reachable in the contained scroll area.
      region.scrollLeft = region.scrollWidth;
      await expect(region.scrollLeft + region.clientWidth).toBeGreaterThanOrEqual(
        region.scrollWidth - 1
      );
    } finally {
      root.style.fontSize = previous;
    }
  },
};

/* ─── Fixtures ────────────────────────────────────────────────────────── */

const lines: InvoiceLine[] = [
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
    detail: "Phase one",
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
    detail: "Agreed 4 August 2026",
    quantity: 1,
    unitPrice: -75_000,
    amount: -75_000,
  },
];

const taxes: InvoiceAdjustment[] = [
  { id: "vat", label: "VAT", detail: "20% on services", amount: 196_400 },
];

const adjustments: InvoiceAdjustment[] = [
  {
    id: "early",
    label: "Early settlement discount",
    detail: "2% if paid by 30 September",
    amount: -19_640,
  },
];

const billedFrom = {
  label: "From",
  lines: ["Meridian Studio Ltd", "12 Fenchurch Avenue", "London EC3M 5BN", "VAT GB 421 8890 11"],
};

const billedTo = {
  label: "Billed to",
  lines: [
    "Northwind Logistics B.V.",
    "Waalhaven Oostzijde 81",
    "3087 BM Rotterdam",
    "VAT NL 8102 4419 B01",
  ],
};

/* ─── Default ─────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <InvoiceDetailBlock
      invoiceNumber="INV-2026-0918"
      status={{ label: "Awaiting payment", tone: "warning" }}
      issuedOn={new Date("2026-09-15T00:00:00Z")}
      dueOn={new Date("2026-09-30T00:00:00Z")}
      timeZone="Europe/London"
      meta={[{ id: "po", label: "Purchase order", value: "NW-4471", icon: "clipboard" }]}
      billedFrom={billedFrom}
      billedTo={billedTo}
      lines={lines}
      subtotal={982_000}
      taxes={taxes}
      adjustments={adjustments}
      amountPaid={0}
      amountDue={1_158_760}
      amountDueNote="Payable within 15 days. Bank details are on the PDF."
      primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
      actions={[
        { id: "pdf", label: "Download PDF", icon: "file-download", href: "#invoice.pdf" },
        { id: "remind", label: "Send reminder", icon: "mail", onClick: fn() },
      ]}
      note="Late payment interest is charged at 4% above base rate under the Late Payment of Commercial Debts (Interest) Act 1998."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 2, name: "Invoice" })).toBeVisible();

    // A real table with real header semantics.
    const table = canvas.getByRole("table", { name: "Invoice lines" });
    await expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
    await expect(within(table).getAllByRole("rowheader")).toHaveLength(4);

    // Amounts formatted from minor units, and a credit line rendered negative.
    await expect(canvas.getByText("£3,230.00")).toBeVisible();
    await expect(canvas.getAllByText("-£750.00").length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getByText("-£196.40")).toBeVisible();
    await expect(canvas.getByText("£11,587.60")).toBeVisible();

    // A supplied zero is a zero.
    await expect(canvas.getByText("£0.00")).toBeVisible();

    // The download destination is an anchor; paying is a button.
    await expect(canvas.getByRole("link", { name: /Download PDF/ })).toHaveAttribute(
      "href",
      "#invoice.pdf"
    );
    await expect(canvas.getByRole("button", { name: /Pay invoice/ })).toBeVisible();

    // No scroll region: four lines is under the threshold.
    await expect(canvas.queryByRole("region", { name: "Invoice lines" })).toBeNull();
  },
};

/* ─── A single line ───────────────────────────────────────────────────── */
export const SingleLine: Story = {
  render: () => (
    <InvoiceDetailBlock
      invoiceNumber="INV-2026-0921"
      status={{ label: "Paid", tone: "success" }}
      issuedOn={new Date("2026-09-21T00:00:00Z")}
      dueOn={new Date("2026-09-21T00:00:00Z")}
      timeZone="Europe/London"
      lines={[
        {
          id: "only",
          description: "Monthly retainer",
          quantity: 1,
          unitPrice: 250_000,
          amount: 250_000,
        },
      ]}
      subtotal={250_000}
      taxes={[{ id: "vat", label: "VAT", detail: "20%", amount: 50_000 }]}
      amountPaid={300_000}
      amountDue={0}
      amountDueNote="Settled by direct debit on 21 September 2026."
      actions={[{ id: "pdf", label: "Download receipt", icon: "file-download", href: "#receipt" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1 line")).toBeVisible();
    await expect(canvas.queryByRole("region", { name: "Invoice lines" })).toBeNull();
  },
};

/* ─── Forty lines in a bounded scroll region ───────────────────────────
   The measurement that matters: the table scrolls inside its own region and the
   document does not grow horizontally or without limit vertically.
   ------------------------------------------------------------------- */
function manyLines(count: number): InvoiceLine[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `line-${index + 1}`,
    description: `Sprint ${Math.floor(index / 4) + 1} — ${
      ["research", "design", "build", "review"][index % 4]
    }`,
    detail: index % 5 === 0 ? "Includes an out-of-scope amendment agreed in writing" : undefined,
    quantity: 4 + (index % 7),
    quantityUnit: "hours",
    unitPrice: 9_500,
    amount: (4 + (index % 7)) * 9_500,
  }));
}

export const FortyLinesScroll: Story = {
  render: () => {
    const rows = manyLines(40);
    const subtotal = rows.reduce((sum, row) => sum + (row.amount as number), 0);
    return (
      <InvoiceDetailBlock
        invoiceNumber="INV-2026-0940"
        status={{ label: "Awaiting payment", tone: "warning" }}
        issuedOn={new Date("2026-09-18T00:00:00Z")}
        dueOn={new Date("2026-10-18T00:00:00Z")}
        timeZone="Europe/London"
        billedTo={billedTo}
        lines={rows}
        subtotal={subtotal}
        taxes={[{ id: "vat", label: "VAT", detail: "20%", amount: Math.round(subtotal * 0.2) }]}
        amountDue={subtotal + Math.round(subtotal * 0.2)}
        primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("40 lines")).toBeVisible();

    // The lines are in a bounded, focusable, named region.
    const region = canvas.getByRole("region", { name: "Invoice lines" });
    await expect(region).toHaveAttribute("tabindex", "0");

    // It really does scroll vertically, and it is the element that scrolls.
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
    await expect(region.clientHeight).toBeLessThanOrEqual(480);

    // It does not scroll horizontally.
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);

    // And the document is not wider than the viewport because of it.
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth
    );

    // Scrolling the region does not move the page.
    const pageTop = window.scrollY;
    region.scrollTop = 200;
    await expect(region.scrollTop).toBe(200);
    await expect(window.scrollY).toBe(pageTop);

    // The totals stay outside the scroll region, so they are always readable.
    // `<dl>` carries no `list` role, so it is found by its accessible name.
    const totals = canvasElement.querySelector('dl[aria-label="Invoice totals"]');
    await expect(totals).toBeTruthy();
    await expect(region.contains(totals)).toBe(false);

    // The region takes focus from the keyboard, which is what makes a scroll
    // container operable without a pointer.
    region.focus();
    await expect(region).toHaveFocus();
  },
};

/* ─── Zero lines on a real invoice ────────────────────────────────────
   Distinct from `state="empty"`, which means there is no invoice at all. Both
   messages are the caller's, so a filtered view can say something different
   again.
   ------------------------------------------------------------------- */
export const InvoiceWithNoLines: Story = {
  render: () => (
    <InvoiceDetailBlock
      invoiceNumber="INV-2026-0999"
      status={{ label: "Draft", tone: "neutral" }}
      issuedOn={null}
      dueOn={null}
      lines={[]}
      linesEmptyTitle="No lines on this draft yet"
      linesEmptyDescription="Add a line to start building this invoice."
      linesEmptyAction={{ id: "add", label: "Add a line", tone: "primary", onClick: fn() }}
      amountDue={0}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No lines on this draft yet")).toBeVisible();
    await expect(canvas.queryByRole("table")).toBeNull();
    // Two unknown dates, because `null` was supplied for both.
    await expect(canvas.getAllByText("Not available")).toHaveLength(2);
  },
};

/* ─── A filtered view with no matches ─────────────────────────────────
   The same block, different words. This is the distinction the shared quality
   requirements ask for.
   ------------------------------------------------------------------- */
function FilterHarness() {
  const [query, setQuery] = useState("hosting");
  const filtered = useMemo(
    () =>
      lines.filter((line) =>
        String(line.description).toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );
  return (
    <div className="flex flex-col gap-3">
      <label className="flex max-w-[24rem] flex-col gap-1 text-body-sm text-on-surface-body">
        Filter lines
        <input
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          className="min-h-11 rounded-lg border border-control-border bg-surface px-3 py-2 text-body-sm text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
        />
      </label>
      <InvoiceDetailBlock
        invoiceNumber="INV-2026-0918"
        status={{ label: "Awaiting payment", tone: "warning" }}
        lines={filtered}
        linesEmptyTitle={`No lines match “${query}”`}
        linesEmptyDescription="Clear the filter to see every line on this invoice."
        amountDue={1_158_760}
      />
    </div>
  );
}

export const FilteredWithNoMatches: Story = {
  render: () => <FilterHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // No matches, and the wording says so rather than claiming the invoice is empty.
    await expect(canvas.getByText(/No lines match/)).toBeVisible();

    const field = canvas.getByLabelText("Filter lines");
    await userEvent.clear(field);
    await userEvent.type(field, "design");
    await expect(canvas.getByRole("table", { name: "Invoice lines" })).toBeVisible();
    await expect(canvas.getByText("1 line")).toBeVisible();
  },
};

/* ─── Unknown amounts ─────────────────────────────────────────────────── */
export const UnknownAmounts: Story = {
  render: () => (
    <InvoiceDetailBlock
      invoiceNumber="INV-2026-0918"
      status={{
        label: "Pending tax calculation",
        tone: "warning",
        description: "The tax authority has not returned a rate for this supply.",
      }}
      issuedOn={new Date("2026-09-15T00:00:00Z")}
      timeZone="Europe/London"
      unknownLabel="Not calculated"
      lines={[
        {
          id: "l1",
          description: "Consulting",
          quantity: 12,
          quantityUnit: "hours",
          unitPrice: 9_500,
          amount: 114_000,
        },
        {
          id: "l2",
          description: "Reimbursable travel",
          quantity: null,
          unitPrice: null,
          amount: null,
        },
      ]}
      subtotal={null}
      taxes={[{ id: "vat", label: "VAT", detail: "Rate pending", amount: null }]}
      amountDue={null}
      amountDueNote="This invoice cannot be paid until the tax rate is known."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("Not calculated").length).toBeGreaterThanOrEqual(4);
    await expect(canvas.queryByText("£0.00")).toBeNull();
  },
};

/* ─── Another currency and locale ─────────────────────────────────────── */
export const EuroDutchLocale: Story = {
  render: () => (
    <InvoiceDetailBlock
      title="Factuur"
      invoiceNumber="F-2026-0918"
      currency="EUR"
      locale="nl-NL"
      timeZone="Europe/Amsterdam"
      issuedOnLabel="Datum"
      dueOnLabel="Vervaldatum"
      linesLabel="Factuurregels"
      columnLabels={{
        description: "Omschrijving",
        quantity: "Aantal",
        unitPrice: "Prijs per stuk",
        amount: "Bedrag",
      }}
      subtotalLabel="Subtotaal"
      amountDueLabel="Te betalen"
      totalsLabel="Factuurtotalen"
      status={{ label: "Openstaand", tone: "warning" }}
      issuedOn={new Date("2026-09-15T00:00:00Z")}
      dueOn={new Date("2026-09-30T00:00:00Z")}
      billedTo={{ label: "Aan", lines: billedTo.lines }}
      lines={[
        {
          id: "l1",
          description: "Ontwerpsysteem audit",
          quantity: 34,
          quantityUnit: "uur",
          unitPrice: 11_000,
          amount: 374_000,
        },
        {
          id: "l2",
          description: "Correctie vorige factuur",
          quantity: 1,
          unitPrice: -42_500,
          amount: -42_500,
        },
      ]}
      subtotal={331_500}
      taxes={[{ id: "btw", label: "BTW", detail: "21%", amount: 69_615 }]}
      amountDue={401_115}
      actions={[{ id: "pdf", label: "Download PDF", icon: "file-download", href: "#pdf" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Factuurregels" })).toBeVisible();
    await expect(canvas.getByText("€ 4.011,15")).toBeVisible();
  },
};

/* ─── Loading, error, empty ───────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <InvoiceDetailBlock
      lines={[]}
      amountDue={undefined}
      state="loading"
      loadingMessage="Loading invoice INV-2026-0918"
    />
  ),
};

export const ErrorWithRetry: Story = {
  render: () => (
    <InvoiceDetailBlock
      lines={[]}
      amountDue={undefined}
      state="error"
      errorDescription="The billing service did not respond."
      onRetry={fn()}
    />
  ),
};

export const EmptyNoInvoice: Story = {
  render: () => (
    <InvoiceDetailBlock
      lines={[]}
      amountDue={undefined}
      state="empty"
      emptyTitle="No invoice selected"
      emptyDescription="Choose an invoice from the list to see its detail."
    />
  ),
};

/* ─── Permission ──────────────────────────────────────────────────────── */
export const PaymentNotPermitted: Story = {
  render: () => (
    <InvoiceDetailBlock
      invoiceNumber="INV-2026-0918"
      status={{ label: "Awaiting approval", tone: "neutral" }}
      lines={lines}
      subtotal={982_000}
      taxes={taxes}
      amountDue={1_178_400}
      primaryAction={{
        id: "pay",
        label: "Pay invoice",
        unavailableReason: "A finance approver must release this invoice before it can be paid.",
      }}
      actions={[{ id: "pdf", label: "Download PDF", icon: "file-download", href: "#pdf" }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /Pay invoice/ })).toBeDisabled();
  },
};

/* ─── Narrow containers ───────────────────────────────────────────────
   At 288px the unit-price column is withdrawn and the unit price appears under
   the description instead, so nothing is lost and the table never scrolls
   sideways.
   ------------------------------------------------------------------- */
export const NarrowContainers: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-[288px]">
        <InvoiceDetailBlock
          title="Invoice, 288px column"
          headingLevel="h3"
          invoiceNumber="INV-2026-0918"
          status={{ label: "Awaiting payment", tone: "warning" }}
          lines={lines}
          subtotal={982_000}
          taxes={taxes}
          amountDue={1_178_400}
          primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
        />
      </div>
      <div className="w-[420px]">
        <InvoiceDetailBlock
          title="Invoice, 420px column"
          headingLevel="h3"
          invoiceNumber="INV-2026-0918"
          status={{ label: "Awaiting payment", tone: "warning" }}
          lines={lines}
          subtotal={982_000}
          taxes={taxes}
          adjustments={adjustments}
          amountDue={1_158_760}
          primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Three visible columns at 288px; four at 420px, because the 520px query
    // has not been met by either but the hidden cell is still in the table.
    const tables = canvas.getAllByRole("table");
    await expect(tables).toHaveLength(2);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth
    );
  },
};

/* ─── Dark island ─────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="rayden-dark w-full min-w-0 bg-surface-muted p-4">
      <InvoiceDetailBlock
        invoiceNumber="INV-2026-0918"
        status={{ label: "Awaiting payment", tone: "warning" }}
        issuedOn={new Date("2026-09-15T00:00:00Z")}
        dueOn={new Date("2026-09-30T00:00:00Z")}
        timeZone="Europe/London"
        billedFrom={billedFrom}
        billedTo={billedTo}
        lines={lines}
        subtotal={982_000}
        taxes={taxes}
        adjustments={adjustments}
        amountPaid={0}
        amountDue={1_158_760}
        primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
        actions={[{ id: "pdf", label: "Download PDF", icon: "file-download", href: "#pdf" }]}
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
      <InvoiceDetailBlock
        invoiceNumber="INV-2026-0918"
        status={{ label: "Awaiting payment", tone: "warning" }}
        lines={lines}
        subtotal={982_000}
        taxes={taxes}
        amountDue={1_178_400}
        primaryAction={{ id: "pay", label: "Pay invoice", tone: "primary", onClick: fn() }}
      />
    </div>
  ),
};
