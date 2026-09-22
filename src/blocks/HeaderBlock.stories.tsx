import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { HeaderBlock } from "./HeaderBlock";

const meta: Meta<typeof HeaderBlock> = {
  title: "Blocks/Header",
  component: HeaderBlock,
  tags: ["autodocs"],
  // A header spans the full width of whatever it is placed in. The default centred,
  // padded preview host shrinks the available width and hides the real responsive
  // contract, so these examples are previewed edge-to-edge instead.
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HeaderBlock>;

/* ─── Shared Logo ─────────────────────────────────────────────────── */
const Logo = ({ light = false }: { light?: boolean }) => (
  <span
    className={`inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight whitespace-nowrap ${light ? "text-white" : "text-on-surface"}`}
  >
    <span
      aria-hidden="true"
      className="flex size-8 items-center justify-center rounded-lg bg-action-primary text-base font-bold text-white"
    >
      R
    </span>
    Rayden
  </span>
);

/* ─── V1: Announcement banner + logo + centered links + CTA ──────── */
export const WithAnnouncement: Story = {
  render: () => (
    <HeaderBlock
      variant={1}
      logo={<Logo />}
      announcement={{
        text: "Rayden is now featured on Product Hunt.",
        linkLabel: "Support Us",
      }}
      links={[
        { label: "Solutions", hasDropdown: true },
        { label: "How it works" },
        { label: "About", hasDropdown: true },
        { label: "Resources" },
      ]}
      actions={[{ label: "Get Started", variant: "primary" }]}
    />
  ),
};

/* ─── V2: Logo + many links + Login text + Get Started ───────────── */
export const Standard: Story = {
  render: () => (
    <HeaderBlock
      variant={2}
      logo={<Logo />}
      links={[
        { label: "Use cases", href: "#use-cases", active: true },
        { label: "Pricing" },
        { label: "Partners" },
        { label: "Affiliates" },
        { label: "Customers" },
        { label: "Blog" },
        { label: "Resources", href: "#resources" },
      ]}
      actions={[
        { label: "Log in", variant: "text", href: "#login" },
        { label: "Get started", variant: "primary", href: "#get-started" },
      ]}
    />
  ),
};

/* ─── V3: Pill nav (light) ───────────────────────────────────────── */
export const PillNav: Story = {
  render: () => (
    <HeaderBlock
      variant={3}
      logo={<Logo />}
      links={[
        { label: "Use Cases", hasDropdown: true },
        { label: "Resources", hasDropdown: true },
        { label: "Pricing" },
        { label: "What's New?", dot: true },
      ]}
      actions={[{ label: "Book a Demo", variant: "primary" }]}
    />
  ),
};

/* ─── V4: Pill nav (dark) ────────────────────────────────────────── */
export const DarkPillNav: Story = {
  render: () => (
    <HeaderBlock
      variant={4}
      logo={<Logo light />}
      links={[
        { label: "Use Cases", hasDropdown: true },
        { label: "Resources", hasDropdown: true },
        { label: "Pricing" },
        { label: "What's New?", dot: true },
      ]}
      actions={[{ label: "Book a Demo", variant: "primary" }]}
    />
  ),
};

/* ─── V5: Rounded pill buttons ───────────────────────────────────── */
export const RoundedButtons: Story = {
  render: () => (
    <HeaderBlock
      variant={5}
      logo={<Logo />}
      links={[
        { label: "Product", hasDropdown: true },
        { label: "Partnerships", hasDropdown: true },
        { label: "Pricing" },
        { label: "Company", hasDropdown: true },
      ]}
      actions={[
        { label: "Sign In", variant: "secondary" },
        { label: "Get Started", variant: "primary" },
      ]}
    />
  ),
};

/* ─── V6: Logo + dropdowns + EN language + Register + Login ──────── */
export const WithLanguage: Story = {
  render: () => (
    <HeaderBlock
      variant={6}
      logo={<Logo />}
      links={[
        { label: "Product", hasDropdown: true },
        { label: "Platform", hasDropdown: true },
        { label: "Fees", hasDropdown: true },
        { label: "EN", hasDropdown: true },
      ]}
      actions={[
        { label: "Register", variant: "text" },
        { label: "Login", variant: "primary" },
      ]}
    />
  ),
};

/* ─── V7: Left links | Centered logo | Right links + actions ────── */
export const CenteredLogo: Story = {
  render: () => (
    <HeaderBlock
      variant={7}
      logo={<Logo />}
      links={[{ label: "Solutions" }, { label: "Investments" }]}
      rightLinks={[{ label: "Meet Rayna" }, { label: "Resources" }]}
      actions={[
        { label: "Log in", variant: "text" },
        { label: "Get Started", variant: "primary" },
      ]}
    />
  ),
};

/* ─── V8: Dark bg | Left links | Centered logo | Right links + actions */
export const DarkBackground: Story = {
  render: () => (
    <HeaderBlock
      variant={8}
      logo={<Logo light />}
      links={[
        { label: "Find talent" },
        { label: "For designers" },
        { label: "Inspiration" },
        { label: "Learn Design" },
        { label: "Go Pro" },
      ]}
      rightLinks={[{ label: "Meet Rayna" }, { label: "Resources" }]}
      actions={[
        { label: "Sign up", variant: "secondary" },
        { label: "Post a job", variant: "primary" },
      ]}
    />
  ),
};

/* ─── V9: Logo + Search | Right links + actions ──────────────────── */
export const WithSearch: Story = {
  render: () => (
    <HeaderBlock
      variant={9}
      logo={<Logo />}
      searchPlaceholder="Search for components..."
      onSearch={(q) => console.log("Search:", q)}
      rightLinks={[{ label: "About" }, { label: "Partners" }]}
      actions={[
        { label: "Sign in", variant: "text" },
        { label: "Post a job", variant: "primary" },
      ]}
    />
  ),
};

/* ─── V10: Logo + Switcher | Links | Actions ─────────────────────── */
export const WithSwitcher: Story = {
  render: () => (
    <HeaderBlock
      variant={10}
      logo={<Logo />}
      switcher={{
        tabs: ["Personal", "Business"],
        defaultActiveIndex: 0,
      }}
      links={[
        { label: "Product", hasDropdown: true },
        { label: "Platform", hasDropdown: true },
        { label: "Fees", hasDropdown: true },
        { label: "EN", hasDropdown: true },
      ]}
      actions={[
        { label: "Register", variant: "text" },
        { label: "Login", variant: "primary" },
      ]}
    />
  ),
};

/* ─── V11: Double row header ─────────────────────────────────────── */
export const DoubleRow: Story = {
  render: () => (
    <HeaderBlock
      variant={11}
      logo={<Logo />}
      switcher={{
        tabs: ["Personal", "Business"],
        defaultActiveIndex: 0,
      }}
      secondaryLinks={[{ label: "Privacy Policy" }, { label: "Terms of Use" }]}
      links={[{ label: "Money" }, { label: "Wealth" }, { label: "Plans" }, { label: "More" }]}
      actions={[
        { label: "Login", variant: "secondary" },
        { label: "Sign up", variant: "primary" },
      ]}
    />
  ),
};

/* ─── Destinations supplied as href, with no onClick ──────────────── */
/**
 * Regression fixture for the 2026-09-21 audit finding B01. Every destination here is
 * an `href` and nothing has an `onClick`, so anything rendered as a button would be a
 * dead control. Check the collapsed menu as well as the expanded row.
 */
export const LinkDestinations: Story = {
  render: () => (
    <HeaderBlock
      variant={2}
      logo={<Logo />}
      links={[
        { label: "Products", href: "#products", hasDropdown: true },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
        { label: "Docs", href: "#docs" },
      ]}
      rightLinks={[{ label: "Support", href: "#support" }]}
      actions={[
        { label: "Login", variant: "text" },
        { label: "Get Started", variant: "primary" },
      ]}
    />
  ),
};

/* ─── Placed in a narrow column, on a wide viewport ───────────────── */
/**
 * The header collapses on the width it actually has. This example stays collapsed at
 * every viewport because its container is 420px wide, which a viewport breakpoint
 * could not detect.
 */
export const InNarrowColumn: Story = {
  render: () => (
    <div className="mx-auto w-[420px] max-w-full border border-grey-200">
      <HeaderBlock
        variant={9}
        logo={<Logo />}
        searchPlaceholder="Search for components..."
        rightLinks={[
          { label: "About", href: "#about", active: true },
          { label: "Partners", href: "#partners" },
        ]}
        actions={[
          { label: "Sign in", variant: "text", href: "#sign-in" },
          { label: "Post a job", variant: "primary" },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    const signIn = canvas.getByRole("link", { name: "Sign in" });
    await expect(signIn).toHaveAttribute("href", "#sign-in");
    await userEvent.tab();
    await userEvent.keyboard("{Escape}");
    await expect(toggle).toHaveFocus();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByRole("button", { name: "Post a job" }));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  },
};

function ControlledSwitcherExample() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <HeaderBlock
        variant={10}
        switcher={{ tabs: ["Personal", "Team"], activeIndex, onChange: () => {} }}
      />
      <button type="button" onClick={() => setActiveIndex(1)}>
        Select team externally
      </button>
    </div>
  );
}
export const ControlledSwitcher: Story = {
  render: () => <ControlledSwitcherExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Open the collapsed menu if the preview is narrow.
    const menu = canvas.queryByRole("button", { name: /open.*menu/i });
    if (menu) await userEvent.click(menu);
    const team = canvas.getByRole("button", { name: "Team" });
    await userEvent.click(team);
    await expect(team).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(canvas.getByRole("button", { name: "Select team externally" }));
    await expect(team).toHaveAttribute("aria-pressed", "true");
  },
};

/**
 * Uncontrolled switcher: the header owns the selection, `defaultActiveIndex`
 * seeds it, and `onChange` reports every real change. Re-clicking the selected
 * tab is not a change and raises nothing.
 */
function UncontrolledSwitcherExample({ onChange }: { onChange: (index: number) => void }) {
  return (
    <HeaderBlock
      variant={10}
      switcher={{
        tabs: ["Personal", "Team"],
        defaultActiveIndex: 0,
        onChange,
        label: "Account scope",
      }}
    />
  );
}
export const UncontrolledSwitcher: Story = {
  render: () => {
    const calls: number[] = [];
    (globalThis as unknown as { __switcherCalls: number[] }).__switcherCalls = calls;
    return <UncontrolledSwitcherExample onChange={(index) => calls.push(index)} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.queryByRole("button", { name: /open.*menu/i });
    if (menu) await userEvent.click(menu);
    const calls = (globalThis as unknown as { __switcherCalls: number[] }).__switcherCalls;
    const group = canvas.getByRole("group", { name: "Account scope" });
    const team = within(group).getByRole("button", { name: "Team" });
    const personal = within(group).getByRole("button", { name: "Personal" });

    await expect(personal).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(team);
    // Uncontrolled: the header moves the selection itself, and reports it once.
    await expect(team).toHaveAttribute("aria-pressed", "true");
    await expect(personal).toHaveAttribute("aria-pressed", "false");
    await expect(calls).toEqual([1]);

    // Re-clicking the selected tab is not a change.
    await userEvent.click(team);
    await expect(calls).toEqual([1]);
  },
};

/** An out-of-range index selects the nearest tab instead of leaving nothing selected. */
export const SwitcherIndexOutOfRange: Story = {
  render: () => (
    <HeaderBlock
      variant={10}
      switcher={{ tabs: ["Personal", "Team"], activeIndex: 9, onChange: () => {}, label: "Scope" }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.queryByRole("button", { name: /open.*menu/i });
    if (menu) await userEvent.click(menu);
    const group = canvas.getByRole("group", { name: "Scope" });
    await expect(within(group).getByRole("button", { name: "Team" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  },
};
