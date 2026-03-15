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
export const WorkEmail: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-[700px] p-8 bg-[#FFF7F4]">
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
