import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { icons, heartIcon } from "./icons";
import { iconCatalog, iconNames } from "./catalog";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "solid"] },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: "star",
    size: "lg",
    variant: "outline",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Icon name="star" size={s} />
          <span className="text-body-xs text-grey-500">{s}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1">
        <Icon name="star" size={48} />
        <span className="text-body-xs text-grey-500">48px</span>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["outline", "solid"] as const).map((v) => (
        <div key={v} className="flex flex-col items-center gap-1">
          <Icon name="heart" size="xl" variant={v} />
          <span className="text-body-xs text-grey-500">{v}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="bell" size="lg" color="var(--color-primary-400)" />
      <Icon name="bell" size="lg" color="var(--color-secondary-400)" />
      <Icon name="bell" size="lg" color="var(--color-success-400)" />
      <Icon name="bell" size="lg" color="var(--color-error-400)" />
      <Icon name="bell" size="lg" color="var(--color-warning-400)" />
      <Icon name="bell" size="lg" color="var(--color-grey-500)" />
    </div>
  ),
};

export const StaticData: Story = {
  render: () => (
    <Icon
      icon={heartIcon}
      variant="solid"
      size={24}
      aria-hidden={false}
      role="img"
      aria-label="Favorite"
    />
  ),
};

export const Gallery: Story = {
  parameters: { layout: "padded" },
  render: function IconGallery() {
    const [query, setQuery] = useState("");
    const matches = iconCatalog.filter(({ name, exportName }) =>
      `${name} ${exportName}`.toLowerCase().includes(query.trim().toLowerCase())
    );
    return (
      <section className="w-full space-y-4" aria-label="Icon catalog">
        <label className="flex flex-col gap-2 text-sm">
          Search icons by name or export
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-md border border-control-border bg-surface px-3 py-2 text-on-surface"
          />
        </label>
        <p role="status" className="text-sm text-on-surface-muted">
          {matches.length} of {iconCatalog.length} icons
        </p>
        <p className="text-sm">
          Names work with Icon name; data exports come from @raydenui/ui/icons. Each icon has
          outline and solid variants.
        </p>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {matches.map(({ name, exportName }) => (
            <li
              key={name}
              className="flex flex-col items-center gap-2 rounded-lg border border-grey-200 p-3"
            >
              <div className="flex gap-3">
                <Icon icon={icons[name]} size="lg" variant="outline" />
                <Icon icon={icons[name]} size="lg" variant="solid" />
              </div>
              <code className="text-sm">{name}</code>
              <code className="text-xs text-on-surface-muted break-all">{exportName}</code>
            </li>
          ))}
        </ul>
        {!matches.length && <p>No matching icons. Try a shorter name.</p>}
      </section>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox"), "heartBeatWaveIcon");
    await expect(canvas.getByRole("status")).toHaveTextContent(`1 of ${iconCatalog.length} icons`);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.getByText("heart-beat-wave")).toBeVisible();
  },
};
