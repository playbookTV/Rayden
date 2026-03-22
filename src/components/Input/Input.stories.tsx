import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="9" r="5" />
    <path d="M13 13l4 4" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="4" width="16" height="12" rx="2" />
    <path d="M2 4l8 6 8-6" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="#5FC381" strokeWidth={2}>
    <circle cx="10" cy="10" r="7" />
    <path d="M7 10l2 2 4-4" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="#E26E6A" strokeWidth={2}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 7v4M10 13h0" />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />,
  },
};

export const ExtraSmall: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    size: "xs",
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />,
  },
};

export const Medium: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    size: "md",
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />,
  },
};

export const Large: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    size: "lg",
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />,
  },
};

export const WithSuccess: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    defaultValue: "Input",
    success: "Success text",
    leadingIcon: <SearchIcon />,
    trailingIcon: <CheckIcon />,
  },
};

export const WithError: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    defaultValue: "Input",
    error: "Error text",
    leadingIcon: <SearchIcon />,
    trailingIcon: <ErrorIcon />,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text",
    readOnly: true,
    leadingIcon: <SearchIcon />,
    trailingIcon: <MailIcon />,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <Input
        label="Extra Small (xs)"
        placeholder="Placeholder"
        helperText="Helper text"
        size="xs"
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Small (sm)"
        placeholder="Placeholder"
        helperText="Helper text"
        size="sm"
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Medium (md)"
        placeholder="Placeholder"
        helperText="Helper text"
        size="md"
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Large (lg)"
        placeholder="Placeholder"
        helperText="Helper text"
        size="lg"
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <Input
        label="Default"
        placeholder="Placeholder"
        helperText="Helper text"
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Filled"
        placeholder="Placeholder"
        defaultValue="Input"
        helperText="Helper text"
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Success"
        placeholder="Placeholder"
        defaultValue="Input"
        success="Success text"
        leadingIcon={<SearchIcon />}
        trailingIcon={<CheckIcon />}
      />
      <Input
        label="Error"
        placeholder="Placeholder"
        defaultValue="Input"
        error="Error text"
        leadingIcon={<SearchIcon />}
        trailingIcon={<ErrorIcon />}
      />
      <Input
        label="Read Only"
        placeholder="Placeholder"
        helperText="Helper text"
        readOnly
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Disabled"
        placeholder="Placeholder"
        helperText="Helper text"
        disabled
        leadingIcon={<SearchIcon />}
        trailingIcon={<MailIcon />}
      />
    </div>
  ),
};

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusCircle = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
    <circle cx="10" cy="10" r="8" />
    <path d="M10 6v8M6 10h8" strokeLinecap="round" />
  </svg>
);

const DropdownAddon = ({ label = "Label" }: { label?: string }) => (
  <>
    <PlusCircle />
    <span className="px-1">{label}</span>
    <ChevronDown />
  </>
);

const ButtonAddon = () => (
  <button className="text-sm font-semibold text-primary-400 whitespace-nowrap cursor-pointer">
    Button
  </button>
);

export const WithLeadingAddon: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <Input
        label="Leading dropdown (separated)"
        placeholder="Placeholder"
        helperText="Helper text"
        size="md"
        leadingAddon={<DropdownAddon />}
        trailingIcon={<MailIcon />}
      />
      <Input
        label="Leading dropdown (sm)"
        placeholder="Placeholder"
        helperText="Helper text"
        size="sm"
        leadingAddon={<DropdownAddon label="USD" />}
      />
    </div>
  ),
};

export const WithTrailingAddon: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <Input
        label="Trailing button"
        placeholder="Placeholder"
        helperText="Helper text"
        size="md"
        leadingIcon={<SearchIcon />}
        trailingAddon={<ButtonAddon />}
      />
      <Input
        label="Trailing dropdown"
        placeholder="Placeholder"
        helperText="Helper text"
        size="md"
        trailingAddon={<DropdownAddon label=".com" />}
      />
    </div>
  ),
};

export const WithBothAddons: Story = {
  render: () => (
    <Input
      label="Both addons"
      placeholder="Placeholder"
      helperText="Helper text"
      size="md"
      leadingAddon={<DropdownAddon label="https://" />}
      trailingAddon={<DropdownAddon label=".com" />}
      className="w-[500px]"
    />
  ),
};
