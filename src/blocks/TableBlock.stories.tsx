import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { TableBlock } from "./TableBlock";
import type { TableBlockRow } from "./TableBlock";

const meta: Meta<typeof TableBlock> = {
  title: "Blocks/Table",
  component: TableBlock,
  tags: ["autodocs"],
  // Bounded, shrinkable preview. The global `centered` layout sizes a story to its
  // intrinsic width, which lets a wide table push the page out and hides whether the
  // block itself is responsive.
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TableBlock>;

const sampleRows: TableBlockRow[] = [
  {
    id: "1",
    name: "Emery Torff",
    email: "thekdfisher@email.co...",
    initials: "E",
    amount: "$200,000.00",
    paymentType: "Label",
    date: "Apr 12, 2023",
    time: "09:32AM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "2",
    name: "Maren Dokidis",
    email: "thekdfisher@email.co...",
    initials: "M",
    amount: "$120,000.00",
    paymentType: "Label",
    date: "Apr 12, 2023",
    time: "09:24AM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "3",
    name: "Cooper Siphron",
    email: "thekdfisher@email.co...",
    initials: "C",
    amount: "$150,000.00",
    paymentType: "Label",
    date: "Apr 11, 2023",
    time: "05:46PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "4",
    name: "Marcus Dias",
    email: "thekdfisher@email.co...",
    initials: "M",
    amount: "$900,000.00",
    paymentType: "Label",
    date: "Apr 11, 2023",
    time: "02:32PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "5",
    name: "Ahmad Stanton",
    email: "thekdfisher@email.co...",
    initials: "A",
    amount: "$1,000,000.00",
    paymentType: "Label",
    date: "Apr 10, 2023",
    time: "11:28AM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "6",
    name: "Giana Carder",
    email: "thekdfisher@email.co...",
    initials: "G",
    amount: "$38,000.00",
    paymentType: "Label",
    date: "Apr 09, 2023",
    time: "10:32PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "7",
    name: "Tiana Curtis",
    email: "thekdfisher@email.co...",
    initials: "T",
    amount: "$600,000.00",
    paymentType: "Label",
    date: "Apr 09, 2023",
    time: "02:38AM",
    status: "Label",
    statusColor: "error",
  },
  {
    id: "8",
    name: "Omar Siphron",
    email: "thekdfisher@email.co...",
    initials: "O",
    amount: "$100,000.00",
    paymentType: "Label",
    date: "Apr 08, 2023",
    time: "04:55PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "9",
    name: "Angel Rhiel Madsen",
    email: "thekdfisher@email.co...",
    initials: "A",
    amount: "$9,000.00",
    paymentType: "Label",
    date: "Apr 07, 2023",
    time: "11:44PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "10",
    name: "Lindsey Calzoni",
    email: "thekdfisher@email.co...",
    initials: "L",
    amount: "$400.00",
    paymentType: "Label",
    date: "Apr 06, 2023",
    time: "09:44AM",
    status: "Label",
    statusColor: "orange",
  },
];

/* ─── Default ─────────────────────────────────────────────────────── */
function PaginatedTable({ rows }: { readonly rows: TableBlockRow[] }) {
  const [page, setPage] = useState(3);
  return (
    <TableBlock
      rows={rows}
      page={page}
      totalPages={6}
      onPageChange={setPage}
      onRowAction={() => {}}
    />
  );
}

export const Default: Story = {
  render: () => (
    <div className="w-full min-w-0">
      <PaginatedTable rows={sampleRows} />
    </div>
  ),
};

/* ─── Controls without handlers ───────────────────────────────────── */
/**
 * Availability is explicit: with no `onRowAction` there is no actions column, and with no
 * `page`/`totalPages`/`onPageChange` there is no pagination. The block never renders a
 * control that would do nothing when activated.
 */
export const WithoutConfiguredActions: Story = {
  render: () => (
    <div className="w-full min-w-0">
      <TableBlock rows={sampleRows.slice(0, 4)} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("navigation", { name: "Pagination" })).not.toBeInTheDocument();
    for (const row of sampleRows.slice(0, 4)) {
      await expect(
        canvas.queryByRole("button", { name: `Actions for ${row.name}` })
      ).not.toBeInTheDocument();
    }
    // The selection controls stay: they change visible state, so they are not dead.
    await expect(canvas.getByRole("checkbox", { name: "Select all rows" })).toBeInTheDocument();
  },
};

/* ─── B03 regression ──────────────────────────────────────────────── */
/**
 * Regression for the horizontal-overflow defect: at 320px the block's own scroll region
 * was correctly bounded, but the `sr-only` "Actions" heading is absolutely positioned and
 * the scroller established no containing block, so the heading resolved against the
 * initial containing block and widened the whole document to ~848px.
 *
 * This needs the full sample columns *and* row actions present — a one-column table has
 * no `sr-only` heading to escape and passes either way.
 */
export const NarrowViewport: Story = {
  name: "Narrow viewport (320px)",
  render: () => (
    <div data-testid="viewport-320" style={{ width: 320, maxWidth: "100%" }}>
      <PaginatedTable rows={sampleRows} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Data table" });

    // The defect, stated directly: an absolutely positioned descendant must resolve
    // against the scroll region. `offsetParent` is the nearest positioned ancestor, so
    // this is false while the scroller is `position: static`.
    const actionsHeading = canvasElement.querySelector<HTMLElement>("th .sr-only");
    await expect(actionsHeading).toHaveTextContent("Actions");
    await expect(actionsHeading?.offsetParent).toBe(region);
    await expect(getComputedStyle(region).position).not.toBe("static");

    // Nothing escapes sideways: the page itself must not scroll horizontally.
    const doc = document.documentElement;
    await expect(doc.scrollWidth).toBeLessThanOrEqual(doc.clientWidth);

    // The intended inner scroll area survives, keyboard reachable and still scrollable.
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    region.focus();
    await expect(region).toHaveFocus();
    region.scrollLeft = 120;
    await expect(region.scrollLeft).toBeGreaterThan(0);
    region.scrollLeft = 0;
  },
};

/* ─── B04 regression ──────────────────────────────────────────────── */
const pairA: TableBlockRow[] = sampleRows.slice(0, 2);
const pairB: TableBlockRow[] = sampleRows.slice(2, 4).map((row) => ({
  ...row,
  id: `replaced-${row.id}`,
}));

function SelectionHarness() {
  const [rows, setRows] = useState<TableBlockRow[]>(pairA);
  const [reported, setReported] = useState<string[]>([]);
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setRows(pairB)} className="text-sm underline">
          Replace rows
        </button>
        <button
          type="button"
          onClick={() => setRows((prev) => prev.slice(1))}
          className="text-sm underline"
        >
          Delete first row
        </button>
      </div>
      <TableBlock rows={rows} onSelectionChange={setReported} onRowAction={() => {}} />
      <output data-testid="reported">{reported.join(",")}</output>
    </div>
  );
}

/**
 * Regression for the false selection state. Full and partial selection are derived from
 * membership of the current row ids, never from comparing set sizes — which is what let
 * one-of-two read as fully checked, and let a stale "checked" survive a row swap.
 */
export const SelectionState: Story = {
  render: () => <SelectionHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectAll = canvas.getByRole("checkbox", {
      name: "Select all rows",
    }) as HTMLInputElement;

    // Nothing selected.
    await expect(selectAll.checked).toBe(false);
    await expect(selectAll.indeterminate).toBe(false);

    // Partial: one of two is mixed, not checked.
    await userEvent.click(canvas.getByRole("checkbox", { name: `Select ${pairA[0].name}` }));
    await expect(selectAll.indeterminate).toBe(true);
    await expect(selectAll).toHaveAttribute("aria-checked", "mixed");
    await expect(selectAll.checked).toBe(false);
    await expect(canvas.getByTestId("reported")).toHaveTextContent(pairA[0].id);

    // Full: both rows selected reads as checked, and no longer mixed.
    await userEvent.click(canvas.getByRole("checkbox", { name: `Select ${pairA[1].name}` }));
    await expect(selectAll.checked).toBe(true);
    await expect(selectAll.indeterminate).toBe(false);
    await expect(selectAll).not.toHaveAttribute("aria-checked", "mixed");

    // Row replacement: different ids arrive, so the header reports none selected rather
    // than staying checked over two unchecked rows.
    await userEvent.click(canvas.getByRole("button", { name: "Replace rows" }));
    const afterSwap = canvas.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    await expect(afterSwap.checked).toBe(false);
    await expect(afterSwap.indeterminate).toBe(false);
    for (const row of pairB) {
      const box = canvas.getByRole("checkbox", { name: `Select ${row.name}` }) as HTMLInputElement;
      await expect(box.checked).toBe(false);
    }

    // Select all, then delete a row: the deleted id is dropped and the remaining row is
    // still selected, so the header stays checked rather than going mixed.
    await userEvent.click(afterSwap);
    await expect(afterSwap.checked).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Delete first row" }));
    const afterDelete = canvas.getByRole("checkbox", {
      name: "Select all rows",
    }) as HTMLInputElement;
    await expect(afterDelete.checked).toBe(true);
    await expect(afterDelete.indeterminate).toBe(false);
    await expect(canvas.getByTestId("reported")).not.toHaveTextContent(pairB[0].id);
  },
};

/* ─── Selection across pages ──────────────────────────────────────── */
function PaginatedSelection({ controlled }: { readonly controlled: boolean }) {
  const pages = [sampleRows.slice(0, 2), sampleRows.slice(2, 4)];
  const [page, setPage] = useState(1);
  const [ids, setIds] = useState<string[]>([]);
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <TableBlock
        rows={pages[page - 1]}
        page={page}
        totalPages={pages.length}
        onPageChange={setPage}
        selectedIds={controlled ? ids : undefined}
        onSelectionChange={setIds}
        onRowAction={() => {}}
      />
      <output data-testid="reported">{ids.join(",")}</output>
    </div>
  );
}

/**
 * Uncontrolled selection covers only the rows the block currently holds. Paging replaces
 * `rows`, which the block cannot tell apart from deletion, so the selection is dropped —
 * and dropping it fires `onSelectionChange`, so a consumer mirroring the selection cannot
 * act on rows that are no longer there. Returning to page one does not revive it.
 */
export const SelectionAcrossPagesUncontrolled: Story = {
  render: () => <PaginatedSelection controlled={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = () =>
      canvas.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;

    await userEvent.click(header());
    await expect(header().checked).toBe(true);
    await expect(canvas.getByTestId("reported")).toHaveTextContent("1,2");

    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(header().checked).toBe(false);
    await expect(header().indeterminate).toBe(false);
    await expect(canvas.getByTestId("reported")).toBeEmptyDOMElement();

    await userEvent.click(canvas.getByRole("button", { name: "Previous page" }));
    await expect(header().checked).toBe(false);
    await expect(header().indeterminate).toBe(false);
  },
};

/**
 * Controlled selection is never reconciled, which is how a selection survives paging: the
 * supplied value is authoritative and the toggles leave ids from other pages alone.
 */
export const SelectionAcrossPagesControlled: Story = {
  render: () => <PaginatedSelection controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = () =>
      canvas.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;

    await userEvent.click(header());
    await expect(canvas.getByTestId("reported")).toHaveTextContent("1,2");

    // Page two holds different rows, so the header reports none of them selected while
    // page one's selection is kept.
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(header().checked).toBe(false);
    await expect(canvas.getByTestId("reported")).toHaveTextContent("1,2");

    // Selecting page two adds to the selection instead of replacing it.
    await userEvent.click(header());
    await expect(canvas.getByTestId("reported")).toHaveTextContent("1,2,3,4");

    await userEvent.click(canvas.getByRole("button", { name: "Previous page" }));
    await expect(header().checked).toBe(true);
    await expect(header().indeterminate).toBe(false);
  },
};
