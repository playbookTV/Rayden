import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RecentTransactionsBlock } from "./RecentTransactionsBlock";

const meta: Meta<typeof RecentTransactionsBlock> = {
  title: "Blocks/RecentTransactions",
  component: RecentTransactionsBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RecentTransactionsBlock>;

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="w-[370px] p-6">
      <RecentTransactionsBlock
        onSeeAll={() => {}}
        onTransactionClick={(id) => console.log("Transaction:", id)}
        transactions={[
          {
            id: "1",
            direction: "outgoing",
            name: "Market Square",
            category: "Transfer",
            amount: "$11,000.00",
          },
          {
            id: "2",
            direction: "incoming",
            name: "Aliya Cornrad",
            category: "Transfer",
            amount: "$499.00",
          },
          {
            id: "3",
            direction: "incoming",
            name: "Martin Stanford",
            category: "Transfer",
            amount: "$129.00",
          },
          {
            id: "4",
            direction: "incoming",
            name: "Aliya Cornrad",
            category: "Transfer",
            amount: "$499.00",
          },
          {
            id: "5",
            direction: "outgoing",
            name: "Gabriella Mark",
            category: "Transfer",
            amount: "$103.00",
          },
          {
            id: "6",
            direction: "incoming",
            name: "Aliya Cornrad",
            category: "Transfer",
            amount: "$499.00",
          },
        ]}
      />
    </div>
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* Overriding the semantic surface role must reach the list panel. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="w-[370px] p-6 bg-grey-100"
      style={{ "--color-surface": "#f2e9da", "--color-surface-border": "#e0d3bd" } as CSSProperties}
    >
      <RecentTransactionsBlock
        onSeeAll={() => {}}
        onTransactionClick={(id) => console.log("Transaction:", id)}
        transactions={[
          {
            id: "1",
            direction: "outgoing",
            name: "Market Square",
            category: "Transfer",
            amount: "$11,000.00",
          },
          {
            id: "2",
            direction: "incoming",
            name: "Aliya Cornrad",
            category: "Transfer",
            amount: "$499.00",
          },
        ]}
      />
    </div>
  ),
};
