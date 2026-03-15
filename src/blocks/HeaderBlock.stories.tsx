import type { Meta, StoryObj } from "@storybook/react";
import { HeaderBlock } from "./HeaderBlock";

const meta: Meta<typeof HeaderBlock> = {
  title: "Blocks/Header",
  component: HeaderBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeaderBlock>;

/* ─── Shared Logo ─────────────────────────────────────────────────── */
const Logo = ({ light = false }: { light?: boolean }) => (
  <span
    className={`text-xl font-bold whitespace-nowrap ${
      light ? "text-white" : "text-grey-900"
    }`}
  >
    <span className="text-primary-400">R</span> rayna UI
  </span>
);

/* ─── V1: Announcement banner + logo + centered links + CTA ──────── */
export const WithAnnouncement: Story = {
  render: () => (
    <HeaderBlock
      variant={1}
      logo={<Logo />}
      announcement={{
        text: "Rayna UI is now features on Product Hunt!",
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
        { label: "Use Cases" },
        { label: "Pricing" },
        { label: "Partners" },
        { label: "Affiliates" },
        { label: "Customers" },
        { label: "Blog" },
        { label: "Resources", hasDropdown: true },
      ]}
      actions={[
        { label: "Login", variant: "text" },
        { label: "Get Started", variant: "primary" },
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
      links={[
        { label: "Solutions" },
        { label: "Investments" },
      ]}
      rightLinks={[
        { label: "Meet Rayna" },
        { label: "Resources" },
      ]}
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
      rightLinks={[
        { label: "Meet Rayna" },
        { label: "Resources" },
      ]}
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
      rightLinks={[
        { label: "About" },
        { label: "Partners" },
      ]}
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
        activeIndex: 0,
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
        activeIndex: 0,
      }}
      secondaryLinks={[
        { label: "Privacy Policy" },
        { label: "Terms of Use" },
      ]}
      links={[
        { label: "Money" },
        { label: "Wealth" },
        { label: "Plans" },
        { label: "More" },
      ]}
      actions={[
        { label: "Login", variant: "secondary" },
        { label: "Sign up", variant: "primary" },
      ]}
    />
  ),
};
