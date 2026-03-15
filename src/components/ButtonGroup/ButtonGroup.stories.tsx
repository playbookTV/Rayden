import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./ButtonGroup";
import { ButtonGroupItem } from "./ButtonGroupItem";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
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
      <ButtonGroupItem leadingIcon="arrow-left" trailingIcon="arrow-right">
        First
      </ButtonGroupItem>
      <ButtonGroupItem leadingIcon="arrow-left" trailingIcon="arrow-right">
        Middle
      </ButtonGroupItem>
      <ButtonGroupItem leadingIcon="arrow-left" trailingIcon="arrow-right">
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
