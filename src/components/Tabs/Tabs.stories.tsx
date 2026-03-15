import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["line", "pill"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const LineTabs: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>Overview</Tab>
      <Tab value="tab2" icon="home" badge={5}>Details</Tab>
      <Tab value="tab3" icon="home" badge={0}>Settings</Tab>
    </Tabs>
  ),
};

export const PillTabs: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>Overview</Tab>
      <Tab value="tab2" icon="home" badge={5}>Details</Tab>
      <Tab value="tab3" icon="home" badge={0}>Settings</Tab>
    </Tabs>
  ),
};

export const LineWithDisabled: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>Active</Tab>
      <Tab value="tab2" icon="home" badge={5}>Normal</Tab>
      <Tab value="tab3" icon="home" badge={0} disabled>Disabled</Tab>
    </Tabs>
  ),
};

export const PillWithDisabled: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>Active</Tab>
      <Tab value="tab2" icon="home" badge={5}>Normal</Tab>
      <Tab value="tab3" icon="home" badge={0} disabled>Disabled</Tab>
    </Tabs>
  ),
};

export const TextOnly: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1">Overview</Tab>
      <Tab value="tab2">Details</Tab>
      <Tab value="tab3">Settings</Tab>
    </Tabs>
  ),
};
