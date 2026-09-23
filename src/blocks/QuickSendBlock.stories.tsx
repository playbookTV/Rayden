import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QuickSendBlock } from "./QuickSendBlock";
import { Avatar } from "../components/Avatar";

const meta: Meta<typeof QuickSendBlock> = {
  title: "Blocks/QuickSend",
  component: QuickSendBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuickSendBlock>;

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-[695px] p-6">
      <QuickSendBlock
        onSeeAll={() => {}}
        onSelect={(id) => console.log("Selected:", id)}
        beneficiaries={[
          {
            id: "1",
            name: "Ariana Bush",
            handle: "ariana007",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=47" size="lg" />,
          },
          {
            id: "2",
            name: "Madelyn Ma...",
            handle: "made.ngo",
            initials: "MM",
          },
          {
            id: "3",
            name: "Zain Siphron",
            handle: "zainsiphron",
            initials: "ZS",
          },
          {
            id: "4",
            name: "Zain Curtis",
            handle: "zain_c",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=26" size="lg" />,
          },
          {
            id: "5",
            name: "Martin Stan...",
            handle: "themartin",
            initials: "MS",
          },
          {
            id: "6",
            name: "Aliya Cornrad",
            handle: "aliya_rd",
            initials: "AC",
          },
          {
            id: "7",
            name: "Jakob West...",
            handle: "jakobw",
            initials: "JW",
          },
        ]}
      />
    </div>
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* Overriding the semantic surface role must reach the card without a
   block-specific override. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="w-full max-w-[695px] p-6 bg-grey-100"
      style={{ "--color-surface": "#f2e9da", "--color-surface-border": "#e0d3bd" } as CSSProperties}
    >
      <QuickSendBlock
        onSeeAll={() => {}}
        onSelect={(id) => console.log("Selected:", id)}
        beneficiaries={[
          { id: "1", name: "Ariana Bush", handle: "ariana007", initials: "AB" },
          { id: "2", name: "Zain Siphron", handle: "zainsiphron", initials: "ZS" },
          { id: "3", name: "Aliya Cornrad", handle: "aliya_rd", initials: "AC" },
        ]}
      />
    </div>
  ),
};
