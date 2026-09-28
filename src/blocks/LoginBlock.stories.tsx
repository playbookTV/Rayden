import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
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
    <div className="flex w-full items-center justify-center min-h-[700px] p-2 sm:p-8">
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
    <div className="flex w-full items-center justify-center min-h-[700px] p-2 sm:p-8">
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
    <div className="flex w-full items-center justify-center min-h-[700px] p-2 sm:p-8 bg-surface-muted">
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
    <div className="dark flex w-full items-center justify-center min-h-[700px] p-2 sm:p-8 bg-surface-muted">
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
    <div className="flex w-full items-center justify-center min-h-[700px] p-2 sm:p-8">
      <LoginBlock
        variant="card"
        pending
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Email address", { exact: true })).toBeDisabled();
    await expect(canvas.getByLabelText("Password", { exact: true })).toBeDisabled();
    await expect(canvas.getByRole("checkbox")).toBeDisabled();
    for (const name of [
      "Forgot password?",
      "Signing in…",
      "Continue with Google",
      "Continue with Twitter",
      "Create an account",
    ]) {
      await expect(canvas.getByRole("button", { name })).toBeDisabled();
    }
    await userEvent.click(canvas.getByRole("button", { name: "Show password" }));
    await expect(canvas.getByLabelText("Password", { exact: true })).toHaveAttribute(
      "type",
      "text"
    );
    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
  },
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* A consumer overriding the semantic surface role must reach the card
   without block-specific overrides. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="flex w-full items-center justify-center min-h-[700px] p-2 sm:p-8 bg-grey-100"
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

export const ErrorState: Story = {
  args: {
    variant: "card",
    error: "The email or password is incorrect. Check your details and try again.",
    onForgotPassword: fn(),
    onSignUp: fn(),
  },
};

export const EmailOnly: Story = {
  args: {
    variant: "card",
    socialProviders: [],
    onForgotPassword: fn(),
    onSignUp: fn(),
  },
};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-[288px]">
        <Story />
      </div>
    ),
  ],
  args: {
    variant: "card",
    onForgotPassword: fn(),
    onSignUp: fn(),
  },
};

export const FormInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  args: {
    variant: "card",
    onSubmit: fn(),
    onForgotPassword: fn(),
    onSignUp: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText("Email address", { exact: true }),
      "alex@example.com"
    );
    const password = canvas.getByLabelText("Password", { exact: true });
    await userEvent.type(password, "demo-password");
    await userEvent.click(canvas.getByRole("button", { name: "Show password" }));
    await expect(password).toHaveAttribute("type", "text");
    await expect(password).toHaveValue("demo-password");
    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(password).toHaveAttribute("type", "password");
    await userEvent.click(canvas.getByRole("checkbox", { name: "Remember me" }));
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: "alex@example.com",
      password: "demo-password",
      rememberMe: true,
    });
    await userEvent.click(canvas.getByRole("button", { name: "Forgot password?" }));
    await expect(args.onForgotPassword).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Create an account" }));
    await expect(args.onSignUp).toHaveBeenCalledOnce();
  },
};
