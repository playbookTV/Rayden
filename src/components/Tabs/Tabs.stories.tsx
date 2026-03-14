import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";

const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 10l7-7 7 7M5 8v7a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" />
  </svg>
);

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  argTypes: {
    variant: { control: "select", options: ["line", "pill"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const LineTabs: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1" icon={<HomeIcon />} badge={3}>Overview</Tab>
      <Tab value="tab2" icon={<HomeIcon />} badge={5}>Details</Tab>
      <Tab value="tab3" icon={<HomeIcon />} badge={0}>Settings</Tab>
    </Tabs>
  ),
};

export const PillTabs: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="tab1">
      <Tab value="tab1" icon={<HomeIcon />} badge={3}>Overview</Tab>
      <Tab value="tab2" icon={<HomeIcon />} badge={5}>Details</Tab>
      <Tab value="tab3" icon={<HomeIcon />} badge={0}>Settings</Tab>
    </Tabs>
  ),
};

export const LineWithDisabled: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1" icon={<HomeIcon />} badge={3}>Active</Tab>
      <Tab value="tab2" icon={<HomeIcon />} badge={5}>Normal</Tab>
      <Tab value="tab3" icon={<HomeIcon />} badge={0} disabled>Disabled</Tab>
    </Tabs>
  ),
};

export const PillWithDisabled: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="tab1">
      <Tab value="tab1" icon={<HomeIcon />} badge={3}>Active</Tab>
      <Tab value="tab2" icon={<HomeIcon />} badge={5}>Normal</Tab>
      <Tab value="tab3" icon={<HomeIcon />} badge={0} disabled>Disabled</Tab>
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
