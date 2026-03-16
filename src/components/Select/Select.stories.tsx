import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { SelectOption } from "./SelectOption";
import { Avatar } from "../Avatar";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="home">Home</SelectOption>
        <SelectOption value="search">Search</SelectOption>
        <SelectOption value="notifications">Notifications</SelectOption>
        <SelectOption value="settings">Settings</SelectOption>
        <SelectOption value="profile">Profile</SelectOption>
      </Select>
    </div>
  ),
};

/* ─── With Descriptions ───────────────────────────────────────────── */
export const WithDescriptions: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="account" description="@account">
          Account settings
        </SelectOption>
        <SelectOption value="profile" description="@profile">
          Profile settings
        </SelectOption>
        <SelectOption value="billing" description="@billing">
          Billing settings
        </SelectOption>
        <SelectOption value="security" description="@security">
          Security settings
        </SelectOption>
      </Select>
    </div>
  ),
};

/* ─── With Icons ──────────────────────────────────────────────────── */
export const WithIcons: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="heart" icon="heart" description="@favorites">
          Favorites
        </SelectOption>
        <SelectOption value="star" icon="star" description="@starred">
          Starred
        </SelectOption>
        <SelectOption value="bookmark" icon="bookmark" description="@bookmarks">
          Bookmarks
        </SelectOption>
        <SelectOption value="archive" icon="archive" description="@archive">
          Archive
        </SelectOption>
      </Select>
    </div>
  ),
};

/* ─── With Avatars ────────────────────────────────────────────────── */
export const WithAvatars: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption
          value="john"
          avatar={<Avatar type="initials" initials="JD" size="xs" />}
          description="@john"
        >
          John Doe
        </SelectOption>
        <SelectOption
          value="jane"
          avatar={<Avatar type="initials" initials="JS" size="xs" />}
          description="@jane"
        >
          Jane Smith
        </SelectOption>
        <SelectOption
          value="bob"
          avatar={<Avatar type="initials" initials="BW" size="xs" />}
          description="@bob"
        >
          Bob Wilson
        </SelectOption>
        <SelectOption
          value="alice"
          avatar={<Avatar type="initials" initials="AB" size="xs" />}
          description="@alice"
        >
          Alice Brown
        </SelectOption>
      </Select>
    </div>
  ),
};

/* ─── With Status ─────────────────────────────────────────────────── */
export const WithStatus: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="online" statusColor="#04802E" description="@online">
          Online
        </SelectOption>
        <SelectOption value="away" statusColor="#F5B546" description="@away">
          Away
        </SelectOption>
        <SelectOption value="busy" statusColor="#CB1A14" description="@busy">
          Do not disturb
        </SelectOption>
        <SelectOption value="offline" statusColor="#D0D5DD" description="@offline">
          Offline
        </SelectOption>
      </Select>
    </div>
  ),
};

/* ─── With Helper Text ────────────────────────────────────────────── */
export const WithHelperText: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder" helperText="Helper text">
        <SelectOption value="opt1">Option 1</SelectOption>
        <SelectOption value="opt2">Option 2</SelectOption>
        <SelectOption value="opt3">Option 3</SelectOption>
      </Select>
    </div>
  ),
};

/* ─── Pre-filled ──────────────────────────────────────────────────── */
export const Filled: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" defaultValue="settings" placeholder="Placeholder">
        <SelectOption value="home">Home</SelectOption>
        <SelectOption value="search">Search</SelectOption>
        <SelectOption value="settings">Settings</SelectOption>
        <SelectOption value="profile">Profile</SelectOption>
      </Select>
    </div>
  ),
};

/* ─── Disabled ────────────────────────────────────────────────────── */
export const Disabled: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder" disabled>
        <SelectOption value="opt1">Option 1</SelectOption>
        <SelectOption value="opt2">Option 2</SelectOption>
      </Select>
    </div>
  ),
};

/* ─── With Disabled Options ───────────────────────────────────────── */
export const WithDisabledOptions: Story = {
  render: () => (
    <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="opt1">Option 1</SelectOption>
        <SelectOption value="opt2" disabled>
          Option 2 (disabled)
        </SelectOption>
        <SelectOption value="opt3">Option 3</SelectOption>
        <SelectOption value="opt4" disabled>
          Option 4 (disabled)
        </SelectOption>
      </Select>
    </div>
  ),
};

/* ─── Controlled ──────────────────────────────────────────────────── */
export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [value, setValue] = useState("search");

      return (
        <div className="w-[375px] space-y-4 p-6">
          <Select label="Label" placeholder="Placeholder" value={value} onValueChange={setValue}>
            <SelectOption value="home" icon="home">
              Home
            </SelectOption>
            <SelectOption value="search" icon="search">
              Search
            </SelectOption>
            <SelectOption value="settings" icon="settings">
              Settings
            </SelectOption>
            <SelectOption value="profile" icon="user">
              Profile
            </SelectOption>
          </Select>
          <p className="text-body-sm text-grey-500">
            Selected value: <span className="font-medium text-grey-900">{value || "none"}</span>
          </p>
        </div>
      );
    };
    return <ControlledDemo />;
  },
};
