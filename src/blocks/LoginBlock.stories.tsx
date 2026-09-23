import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LoginBlock } from "./LoginBlock";

const meta: Meta<typeof LoginBlock> = {
  title: "Blocks/Login",
  component: LoginBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginBlock>;

/* ─── Standard ────────────────────────────────────────────────────── */
export const Standard: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-[700px] p-8">
      <LoginBlock
        variant="standard"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  ),
};

/* ─── Card ────────────────────────────────────────────────────────── */
export const Card: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-[700px] p-8">
      <LoginBlock
        variant="card"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  ),
};

/* ─── Work Email ──────────────────────────────────────────────────── */
/* The tint uses the semantic surface-muted role rather than a literal peach,
   so the fixture follows the active mode instead of stranding light foreground
   tokens on a pale background in dark mode. Recovery is offered here even
   though the remember-me row is not rendered. */
export const WorkEmail: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-[700px] p-8 bg-surface-muted">
      <LoginBlock
        variant="work-email"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
        showRememberMe={false}
      />
    </div>
  ),
};

/* ─── Work Email on a dark island ─────────────────────────────────── */
/* Regression for the unreadable dark fixture: the same tint inside an
   explicit dark scope must stay legible without the global toolbar. */
export const WorkEmailDark: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () => (
    <div className="dark flex items-center justify-center min-h-[700px] p-8 bg-surface-muted">
      <LoginBlock
        variant="work-email"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
        showRememberMe={false}
      />
    </div>
  ),
};

/* ─── Pending ─────────────────────────────────────────────────────── */
/* While authentication is in flight every control that could change the
   credentials, change remembered-session intent, or start a competing
   route is disabled. Only the password visibility toggle stays active. */
export const Pending: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-[700px] p-8">
      <LoginBlock
        variant="card"
        pending
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* A consumer overriding the semantic surface role must reach the card
   without block-specific overrides. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="flex items-center justify-center min-h-[700px] p-8 bg-grey-100"
      style={
        {
          "--color-surface": "#f2e9da",
          "--color-surface-border-strong": "#c9b79b",
        } as CSSProperties
      }
    >
      <LoginBlock
        variant="card"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  ),
};
