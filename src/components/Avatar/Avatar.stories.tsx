import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    type: { control: "select", options: ["image", "icon", "initials"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
    status: { control: "select", options: ["none", "online", "offline", "verified"] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const sampleImage =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face";

export const Default: Story = {
  args: {
    type: "image",
    size: "md",
    status: "none",
    src: sampleImage,
    alt: "User avatar",
  },
};

export const ImageSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Avatar type="image" size={s} src={sampleImage} />
          <span className="text-caption-xs text-grey-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Avatar type="icon" size={s} />
          <span className="text-caption-xs text-grey-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const InitialsSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Avatar type="initials" size={s} initials={s === "xs" ? "O" : "OM"} />
          <span className="text-caption-xs text-grey-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["none", "online", "offline", "verified"] as const).map((status) => (
        <div key={status} className="flex items-center gap-3">
          <span className="text-body-sm text-grey-600 w-20">{status}</span>
          <Avatar type="image" size="md" status={status} src={sampleImage} />
          <Avatar type="icon" size="md" status={status} />
          <Avatar type="initials" size="md" status={status} initials="OM" />
        </div>
      ))}
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar type="icon" size="lg" icon="star" />
      <Avatar type="icon" size="lg" icon="heart" />
      <Avatar type="icon" size="lg" icon="bell" />
      <Avatar type="icon" size="lg" icon="globe" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((s) => (
        <div key={s} className="flex flex-col gap-1">
          <span className="text-body-sm text-grey-600">Size: {s}</span>
          <AvatarGroup size={s} max={5}>
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};
