import type { Meta, StoryObj } from "@storybook/react";
import { MetricsCard } from "./MetricsCard";

const meta: Meta<typeof MetricsCard> = {
  title: "Elements/MetricsCard",
  component: MetricsCard,
  tags: ["autodocs"],
  argTypes: {
    variation: {
      control: "select",
      options: ["1", "2", "3", "4", "5", "6"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricsCard>;

/* ─── Variation 1: Horizontal — label+value+CTA left, date+status right ── */

export const Variation1DataCta: Story = {
  args: {
    variation: "1",
    label: "Total Solar Sales",
    value: "$45,823",
    secondaryText: "Jun 12th, 2023",
    statusBadge: { label: "Paid", variant: "success" },
    cta: { label: "View Transactions", onClick: () => {} },
  },
};

export const Variation1DataOnly: Story = {
  args: {
    variation: "1",
    label: "Total Solar Sales",
    value: "45,823",
    secondaryText: "Jun 12th, 2023",
    statusBadge: { label: "Paid", variant: "success" },
  },
};

/* ─── Variation 2: Vertical — icon+label → value → badge+desc → footer CTA ── */

export const Variation2DataCta: Story = {
  args: {
    variation: "2",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
    cta: { label: "View Snap Report", onClick: () => {}, icon: "chevron-right" },
  },
};

export const Variation2DataOnly: Story = {
  args: {
    variation: "2",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
  },
};

/* ─── Variation 3: Vertical reversed — icon+label → badge+desc → value → footer CTA ── */

export const Variation3DataCta: Story = {
  args: {
    variation: "3",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
    cta: { label: "View Snap Report", onClick: () => {}, icon: "chevron-right" },
  },
};

export const Variation3DataOnly: Story = {
  args: {
    variation: "3",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
  },
};

/* ─── Variation 4: Horizontal body with large icon → footer CTA ── */

export const Variation4DataCta: Story = {
  args: {
    variation: "4",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
    cta: { label: "View Snap Report", onClick: () => {}, icon: "chevron-right" },
  },
};

export const Variation4DataOnly: Story = {
  args: {
    variation: "4",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
  },
};

/* ─── Variation 5: Compact horizontal — label+value+desc left, badge+CTA right ── */

export const Variation5DataCta: Story = {
  args: {
    variation: "5",
    label: "Total Solar Sales",
    value: "45,823",
    trendBadge: { label: "10%", trend: "up" },
    description: "$1,873 last year",
    cta: { label: "View Transactions", onClick: () => {} },
  },
};

export const Variation5DataOnly: Story = {
  args: {
    variation: "5",
    label: "Total Solar Sales",
    value: "45,823",
    trendBadge: { label: "10%", trend: "up" },
    description: "$1,873 last year",
  },
};

/* ─── Variation 6: Centered vertical — icon → label → value(28px) → badge+desc → footer CTA ── */

export const Variation6DataCta: Story = {
  args: {
    variation: "6",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
    description: "Compared to last month",
    cta: { label: "View Snap Report", onClick: () => {} },
  },
};

export const Variation6DataOnly: Story = {
  args: {
    variation: "6",
    label: "Total Solar Sales",
    value: "45,823",
    icon: "sun",
    trendBadge: { label: "10%", trend: "up" },
  },
};

/* ─── All Variations Grid ─── */

export const AllVariations: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 max-w-3xl">
      {/* Row 1: Variation 1 */}
      <MetricsCard
        variation="1"
        label="Total Solar Sales"
        value="$45,823"
        secondaryText="Jun 12th, 2023"
        statusBadge={{ label: "Paid", variant: "success" }}
        cta={{ label: "View Transactions", onClick: () => {} }}
      />
      <MetricsCard
        variation="1"
        label="Total Solar Sales"
        value="45,823"
        secondaryText="Jun 12th, 2023"
        statusBadge={{ label: "Paid", variant: "success" }}
      />

      {/* Row 2: Variation 2 */}
      <MetricsCard
        variation="2"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
        cta={{ label: "View Snap Report", onClick: () => {}, icon: "chevron-right" }}
      />
      <MetricsCard
        variation="2"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
      />

      {/* Row 3: Variation 3 */}
      <MetricsCard
        variation="3"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
        cta={{ label: "View Snap Report", onClick: () => {}, icon: "chevron-right" }}
      />
      <MetricsCard
        variation="3"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
      />

      {/* Row 4: Variation 4 */}
      <MetricsCard
        variation="4"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
        cta={{ label: "View Snap Report", onClick: () => {}, icon: "chevron-right" }}
      />
      <MetricsCard
        variation="4"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
      />

      {/* Row 5: Variation 5 */}
      <MetricsCard
        variation="5"
        label="Total Solar Sales"
        value="45,823"
        trendBadge={{ label: "10%", trend: "up" }}
        description="$1,873 last year"
        cta={{ label: "View Transactions", onClick: () => {} }}
      />
      <MetricsCard
        variation="5"
        label="Total Solar Sales"
        value="45,823"
        trendBadge={{ label: "10%", trend: "up" }}
        description="$1,873 last year"
      />

      {/* Row 6: Variation 6 */}
      <MetricsCard
        variation="6"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
        description="Compared to last month"
        cta={{ label: "View Snap Report", onClick: () => {} }}
      />
      <MetricsCard
        variation="6"
        label="Total Solar Sales"
        value="45,823"
        icon="sun"
        trendBadge={{ label: "10%", trend: "up" }}
      />
    </div>
  ),
};
