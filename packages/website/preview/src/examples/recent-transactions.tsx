"use client";
import { useState } from "react";
import { RecentTransactionsBlock, type Transaction } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
const transactions: Transaction[] = [
  {
    id: "invoice",
    direction: "incoming",
    name: "Northline Studio",
    category: "Demo invoice",
    amount: "£1,200.00",
  },
  {
    id: "supplies",
    direction: "outgoing",
    name: "Paper & Practice",
    category: "Demo supplies",
    amount: "£84.00",
  },
  {
    id: "software",
    direction: "outgoing",
    name: "Studio tools",
    category: "Demo subscription",
    amount: "£29.00",
  },
  {
    id: "workshop",
    direction: "incoming",
    name: "Community workshop",
    category: "Demo booking",
    amount: "£320.00",
  },
];
export default function Example() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Transaction>();
  return (
    <div style={{ width: "min(100%, 640px)" }}>
      <RecentTransactionsBlock
        title="The studio ledger"
        transactions={expanded ? transactions : transactions.slice(0, 3)}
        seeAllLabel={expanded ? "Show recent" : "See all activity"}
        onSeeAll={() => setExpanded(!expanded)}
        onTransactionClick={(id) =>
          setSelected(transactions.find((transaction) => transaction.id === id))
        }
      />
      <p role="status" style={{ marginTop: 24 }}>
        {selected
          ? `${selected.name}: ${selected.amount} · ${selected.category}.`
          : "Select a row for its demo details."}
      </p>
      <p style={{ marginTop: 12 }}>Fictional records. This preview cannot move money.</p>
    </div>
  );
}
