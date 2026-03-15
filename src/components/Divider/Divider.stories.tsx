import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "with-icon",
        "with-label",
        "with-title",
        "with-button",
        "with-title-and-button",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
  args: {
    variant: "default",
  },
};

export const WithIcon: Story = {
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
  args: {
    variant: "with-icon",
    icon: <PlusIcon />,
  },
};

export const WithLabel: Story = {
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
  args: {
    variant: "with-label",
    label: "Continue",
  },
};

export const WithTitle: Story = {
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
  args: {
    variant: "with-title",
    label: "Continue",
  },
};

export const WithButton: Story = {
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
  args: {
    variant: "with-button",
    buttonLabel: "Label",
    buttonIcon: <PlusIcon />,
    onButtonClick: () => {},
  },
};

export const WithTitleAndButton: Story = {
  decorators: [(Story) => <div className="w-[640px]"><Story /></div>],
  args: {
    variant: "with-title-and-button",
    label: "Continue",
    buttonLabel: "Label",
    buttonIcon: <PlusIcon />,
    onButtonClick: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-12 w-[640px]">
      <Divider variant="default" />
      <Divider variant="with-icon" icon={<PlusIcon />} />
      <Divider variant="with-label" label="Continue" />
      <Divider variant="with-title" label="Continue" />
      <Divider variant="with-button" buttonLabel="Label" buttonIcon={<PlusIcon />} />
      <Divider
        variant="with-title-and-button"
        label="Continue"
        buttonLabel="Label"
        buttonIcon={<PlusIcon />}
      />
    </div>
  ),
};
