import type { Meta, StoryObj } from "@storybook/react";
import { EmptyStateIllustration } from "./EmptyStateIllustration";
import { illustrationNames } from "./illustrations";

const meta: Meta<typeof EmptyStateIllustration> = {
  title: "Elements/EmptyStateIllustration",
  component: EmptyStateIllustration,
};

export default meta;
type Story = StoryObj<typeof EmptyStateIllustration>;

/* ─── All colored illustrations ───────────────────────────────────── */
export const AllColored: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-6">
      {illustrationNames.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <EmptyStateIllustration name={name} colored />
          <span className="text-body-xs text-grey-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

/* ─── All grey illustrations ──────────────────────────────────────── */
export const AllGrey: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-6">
      {illustrationNames.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <EmptyStateIllustration name={name} colored={false} />
          <span className="text-body-xs text-grey-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

/* ─── Side-by-side comparison ─────────────────────────────────────── */
export const ColoredVsGrey: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-6">
      {illustrationNames.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <EmptyStateIllustration name={name} colored />
            <EmptyStateIllustration name={name} colored={false} />
          </div>
          <span className="text-body-xs text-grey-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

/* ─── Custom palette (blue theme) ─────────────────────────────────── */
const bluePalette = [
  "#E5F0FF", // lightest
  "#C2D8FC",
  "#9ABCFC",
  "#74A0FA",
  "#4A85F7",
  "#3066F5",
  "#1750EB",
  "#0C40CC",
  "#0733AD",
  "#02288F",
  "#001E71", // darkest
];

export const CustomPalette: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="inbox" colored />
        <span className="text-body-xs text-grey-500">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="inbox" colored palette={bluePalette} />
        <span className="text-body-xs text-grey-500">Blue palette</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="inbox" colored={false} />
        <span className="text-body-xs text-grey-500">Grey</span>
      </div>
    </div>
  ),
};

/* ─── Custom size ─────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={80} />
        <span className="text-body-xs text-grey-500">80px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={120} />
        <span className="text-body-xs text-grey-500">120px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={150} />
        <span className="text-body-xs text-grey-500">150px (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={200} />
        <span className="text-body-xs text-grey-500">200px</span>
      </div>
    </div>
  ),
};
