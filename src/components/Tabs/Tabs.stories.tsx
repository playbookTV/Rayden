import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["line", "pill", "segmented"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const LineTabs: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>
        Label
      </Tab>
      <Tab value="tab2" icon="home" badge={5}>
        Label
      </Tab>
      <Tab value="tab3" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab4" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab5" icon="home" badge={0}>
        Label
      </Tab>
    </Tabs>
  ),
};

export const PillTabs: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>
        Label
      </Tab>
      <Tab value="tab2" icon="home" badge={5}>
        Label
      </Tab>
      <Tab value="tab3" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab4" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab5" icon="home" badge={0}>
        Label
      </Tab>
    </Tabs>
  ),
};

export const SegmentedTabs: Story = {
  render: () => (
    <Tabs variant="segmented" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab2" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab3" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab4" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab5" icon="home" badge={0}>
        Label
      </Tab>
    </Tabs>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs text-grey-400 mb-2">Small</p>
        <Tabs variant="line" size="sm" defaultValue="tab1">
          <Tab value="tab1" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="tab2" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="tab3" icon="home" badge={0}>
            Label
          </Tab>
        </Tabs>
      </div>
      <div>
        <p className="text-xs text-grey-400 mb-2">Medium</p>
        <Tabs variant="line" size="md" defaultValue="tab1">
          <Tab value="tab1" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="tab2" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="tab3" icon="home" badge={0}>
            Label
          </Tab>
        </Tabs>
      </div>
      <div>
        <p className="text-xs text-grey-400 mb-2">Large</p>
        <Tabs variant="line" size="lg" defaultValue="tab1">
          <Tab value="tab1" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="tab2" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="tab3" icon="home" badge={0}>
            Label
          </Tab>
        </Tabs>
      </div>
    </div>
  ),
};

export const VerticalLine: Story = {
  render: () => (
    <Tabs variant="line" orientation="vertical" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>
        Label
      </Tab>
      <Tab value="tab2" icon="home" badge={5}>
        Label
      </Tab>
      <Tab value="tab3" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab4" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab5" icon="home" badge={0}>
        Label
      </Tab>
    </Tabs>
  ),
};

export const VerticalSegmented: Story = {
  render: () => (
    <Tabs variant="segmented" orientation="vertical" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab2" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab3" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab4" icon="home" badge={0}>
        Label
      </Tab>
      <Tab value="tab5" icon="home" badge={0}>
        Label
      </Tab>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="tab1">
      <Tab value="tab1" icon="home" badge={3}>
        Active
      </Tab>
      <Tab value="tab2" icon="home" badge={5}>
        Normal
      </Tab>
      <Tab value="tab3" icon="home" badge={0} disabled>
        Disabled
      </Tab>
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs text-grey-400 mb-2">Line</p>
        <Tabs variant="line" defaultValue="t1" size="md">
          <Tab value="t1" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="t2" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="t3" icon="home" badge={0}>
            Label
          </Tab>
        </Tabs>
      </div>
      <div>
        <p className="text-xs text-grey-400 mb-2">Pill</p>
        <Tabs variant="pill" defaultValue="t1" size="md">
          <Tab value="t1" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="t2" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="t3" icon="home" badge={0}>
            Label
          </Tab>
        </Tabs>
      </div>
      <div>
        <p className="text-xs text-grey-400 mb-2">Segmented</p>
        <Tabs variant="segmented" defaultValue="t1" size="md">
          <Tab value="t1" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="t2" icon="home" badge={0}>
            Label
          </Tab>
          <Tab value="t3" icon="home" badge={0}>
            Label
          </Tab>
        </Tabs>
      </div>
    </div>
  ),
};
