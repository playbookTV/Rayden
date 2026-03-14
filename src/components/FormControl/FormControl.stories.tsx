import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";
import { Toggle } from "./Toggle";

const meta: Meta = {
  title: "Components/FormControl",
};

export default meta;

export const Checkboxes: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Default checkbox" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="With description" description="This is a helpful description" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Right position" position="right" />
    </div>
  ),
};

export const Radios: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio name="demo" label="Option A" defaultChecked />
      <Radio name="demo" label="Option B" />
      <Radio name="demo" label="Option C" description="With a description" />
      <Radio label="Disabled" disabled />
      <Radio name="pos" label="Right position" position="right" />
    </div>
  ),
};

export const Toggles: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle label="Default toggle" />
      <Toggle label="Checked" defaultChecked />
      <Toggle label="With description" description="Enable this feature" />
      <Toggle label="Disabled" disabled />
      <Toggle label="Right position" position="right" />
    </div>
  ),
};
