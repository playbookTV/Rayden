import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./ButtonGroup";
import { ButtonGroupItem } from "./ButtonGroupItem";

const ArrowLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M15 10H5M5 10l4-4M5 10l4 4" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 10h10M15 10l-4-4M15 10l-4 4" />
  </svg>
);

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem>First</ButtonGroupItem>
      <ButtonGroupItem>Middle</ButtonGroupItem>
      <ButtonGroupItem>Last</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem leadingIcon={<ArrowLeft />} trailingIcon={<ArrowRight />}>
        First
      </ButtonGroupItem>
      <ButtonGroupItem leadingIcon={<ArrowLeft />} trailingIcon={<ArrowRight />}>
        Middle
      </ButtonGroupItem>
      <ButtonGroupItem leadingIcon={<ArrowLeft />} trailingIcon={<ArrowRight />}>
        Last
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const WithActiveItem: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem>First</ButtonGroupItem>
      <ButtonGroupItem active>Middle</ButtonGroupItem>
      <ButtonGroupItem>Last</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem disabled>First</ButtonGroupItem>
      <ButtonGroupItem disabled>Middle</ButtonGroupItem>
      <ButtonGroupItem disabled>Last</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const FourItems: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem>First</ButtonGroupItem>
      <ButtonGroupItem>Second</ButtonGroupItem>
      <ButtonGroupItem active>Third</ButtonGroupItem>
      <ButtonGroupItem>Last</ButtonGroupItem>
    </ButtonGroup>
  ),
};
