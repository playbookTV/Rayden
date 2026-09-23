import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "grey",
        "destructive",
        "text",
        "success",
        "warning",
        "info",
      ],
    },
    appearance: { control: "select", options: ["solid", "outlined"] },
    size: { control: "select", options: ["sm", "lg"] },
    iconPosition: { control: "select", options: ["none", "leading", "trailing", "icon-only"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Label", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Label", variant: "secondary" },
};

export const Grey: Story = {
  args: { children: "Label", variant: "grey" },
};

export const GreyOutlined: Story = {
  args: { children: "Label", variant: "grey", appearance: "outlined" },
};

export const Destructive: Story = {
  args: { children: "Label", variant: "destructive" },
};

export const DestructiveOutlined: Story = {
  args: { children: "Label", variant: "destructive", appearance: "outlined" },
};

export const Text: Story = {
  args: { children: "Label", variant: "text" },
};

export const Large: Story = {
  args: { children: "Label", variant: "primary", size: "lg" },
};

export const WithLeadingIcon: Story = {
  args: {
    children: "Label",
    variant: "primary",
    icon: "plus",
    iconPosition: "leading",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: "Label",
    variant: "primary",
    icon: "plus",
    iconPosition: "trailing",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    icon: "plus",
    iconPosition: "icon-only",
    "aria-label": "Add item",
  },
};

export const Disabled: Story = {
  args: { children: "Label", variant: "primary", disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="grey">Grey</Button>
        <Button variant="grey" appearance="outlined">
          Grey Outlined
        </Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive" appearance="outlined">
          Destructive Outlined
        </Button>
        <Button variant="text">Text</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" size="lg">
          Primary Large
        </Button>
        <Button variant="secondary" size="lg">
          Secondary Large
        </Button>
        <Button variant="grey" size="lg">
          Grey Large
        </Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" icon="plus" iconPosition="leading">
          Leading
        </Button>
        <Button variant="primary" icon="plus" iconPosition="trailing">
          Trailing
        </Button>
        <Button variant="primary" icon="plus" iconPosition="icon-only" aria-label="Add item" />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="grey" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};

/** Guard the actual compiled theme pairs, rather than just the token values. */
export const ReadableActionColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {["rayden-light", "dark"].map((theme) => (
        <div key={theme} className={`${theme} bg-grey-50 p-4 flex flex-wrap gap-2`}>
          {(["primary", "grey", "destructive", "success", "warning", "info"] as const).map(
            (variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            )
          )}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const luminance = (color: string) => {
      const values = color
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    };
    for (const button of within(canvasElement).getAllByRole("button")) {
      const style = getComputedStyle(button);
      const foreground = luminance(style.color);
      const background = luminance(style.backgroundColor);
      const contrast =
        (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      await expect(contrast, `${button.textContent} contrast`).toBeGreaterThanOrEqual(4.5);
    }
  },
};

/* ─── Polymorphism ──────────────────────────────────────────────── */

/**
 * A destination styled as a button. `as="a"` keeps Button's styling, focus
 * treatment and icon composition while rendering a real anchor, so middle-click,
 * "open in new tab" and the browser's own link affordances all work.
 */
export const AsAnchor: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button as="a" href="#pricing">
        See pricing
      </Button>
      <Button as="a" href="#docs" variant="secondary" icon="arrow-up" iconPosition="trailing">
        Read the docs
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "See pricing" });
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "#pricing");
    // Same recipe as a <button>: one shared class list, not a copy.
    await expect(link.className).toContain("inline-flex items-center justify-center");
  },
};

/**
 * HTML has no disabled anchor: `disabled` is a form-control attribute and an
 * anchor keeps navigating with it. Button drops `href` so nothing can navigate,
 * and keeps the control discoverable with `role="link"`, `aria-disabled="true"`
 * and `tabIndex={0}` — still perceivable and focusable, not actionable.
 */
export const DisabledAnchor: Story = {
  render: () => (
    <Button as="a" href="#pricing" disabled>
      Unavailable in your region
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Unavailable in your region" });
    await expect(link.tagName).toBe("A");
    await expect(link).not.toHaveAttribute("href");
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).toHaveAttribute("tabindex", "0");
    // Visually identical to a disabled <button>.
    await expect(getComputedStyle(link).opacity).toBe("0.5");
    await expect(getComputedStyle(link).cursor).toBe("not-allowed");
  },
};

/**
 * `asChild` merges Button's recipe onto an element the caller already owns — a
 * router `Link`, for instance. The child's own children stay the label, so
 * `icon` and `iconPosition` still compose around them.
 */
export const AsChild: Story = {
  render: () => (
    <Button asChild variant="secondary" icon="arrow-up" iconPosition="leading">
      <a href="#anywhere" data-testid="slotted">
        Slotted destination
      </a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("slotted");
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "#anywhere");
    await expect(link.className).toContain("inline-flex");
    await expect(link.textContent).toContain("Slotted destination");
    // The icon composes around the slotted child's own children.
    await expect(link.querySelector("svg")).not.toBeNull();
  },
};
