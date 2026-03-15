import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const InfoIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1 1 0 110 2 1 1 0 010-2zm1 8H7V7h2v5z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.7 5.3l-4 4a1 1 0 01-1.4 0l-2-2a1 1 0 011.4-1.4L7 8.2l3.3-3.3a1 1 0 011.4 1.4z" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.9 1.5a1 1 0 00-1.8 0L.6 13a1 1 0 00.9 1.5h12.9a1 1 0 00.9-1.5L8.9 1.5zM8 5a1 1 0 011 1v3a1 1 0 01-2 0V6a1 1 0 011-1zm0 6a1 1 0 110 2 1 1 0 010-2z" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3 9.6L9.6 12 8 10.4 6.4 12 5 10.6 6.6 9 5 7.4 6.4 6 8 7.6 9.6 6 11 7.4 9.4 9 11 10.6z" />
  </svg>
);

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["toast", "banner"] },
    state: {
      control: "select",
      options: ["information", "success", "warning", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const ToastInformation: Story = {
  args: {
    variant: "toast",
    state: "information",
    title: "Here's the alert info title",
    description: "The alert & notifications component",
    icon: <InfoIcon />,
    onClose: () => {},
  },
};

export const AllToasts: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[390px]">
      <Alert
        variant="toast"
        state="information"
        title="Here's the alert info title"
        description="The alert & notifications component"
        icon={<InfoIcon />}
        onClose={() => {}}
      />
      <Alert
        variant="toast"
        state="success"
        title="Here's the alert info title"
        description="The alert & notifications component"
        icon={<CheckIcon />}
        onClose={() => {}}
      />
      <Alert
        variant="toast"
        state="warning"
        title="Here's the alert info title"
        description="The alert & notifications component"
        icon={<WarningIcon />}
        onClose={() => {}}
      />
      <Alert
        variant="toast"
        state="error"
        title="Here's the alert info title"
        description="The alert & notifications component"
        icon={<ErrorIcon />}
        onClose={() => {}}
      />
    </div>
  ),
};

export const AllBanners: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[568px]">
      <Alert
        variant="banner"
        state="information"
        title="Here's the alert info title"
        description="The alert & notifications component is designed to work with the actions buttons."
        icon={<InfoIcon />}
        onClose={() => {}}
        primaryAction={{ label: "Primary CTA", onClick: () => {} }}
        secondaryAction={{ label: "Secondary CTA", onClick: () => {} }}
      />
      <Alert
        variant="banner"
        state="success"
        title="Here's the alert info title"
        description="The alert & notifications component is designed to work with the actions buttons."
        icon={<CheckIcon />}
        onClose={() => {}}
        primaryAction={{ label: "Primary CTA", onClick: () => {} }}
        secondaryAction={{ label: "Secondary CTA", onClick: () => {} }}
      />
      <Alert
        variant="banner"
        state="warning"
        title="Here's the alert info title"
        description="The alert & notifications component is designed to work with the actions buttons."
        icon={<WarningIcon />}
        onClose={() => {}}
        primaryAction={{ label: "Primary CTA", onClick: () => {} }}
        secondaryAction={{ label: "Secondary CTA", onClick: () => {} }}
      />
      <Alert
        variant="banner"
        state="error"
        title="Here's the alert info title"
        description="The alert & notifications component is designed to work with the actions buttons."
        icon={<ErrorIcon />}
        onClose={() => {}}
        primaryAction={{ label: "Primary CTA", onClick: () => {} }}
        secondaryAction={{ label: "Secondary CTA", onClick: () => {} }}
      />
    </div>
  ),
};
