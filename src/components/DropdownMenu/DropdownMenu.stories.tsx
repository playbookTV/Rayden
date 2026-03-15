import type { Meta, StoryObj } from "@storybook/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./DropdownMenu";
import { Icon } from "../Icon";
import { Avatar } from "../Avatar";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-grey-300 bg-white px-3 py-2 text-body-sm font-semibold text-grey-700 hover:border-[#B6D8FF] focus:border-[#3D89DF] focus:outline-none transition-colors">
          <Icon name="settings" size="md" />
          <span>Label</span>
          <Icon name="chevron-down" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem icon="home" shortcut="⌘H">
              Home
            </DropdownMenuItem>
            <DropdownMenuItem icon="search" shortcut="⌘K">
              Search
            </DropdownMenuItem>
            <DropdownMenuItem icon="bell" shortcut="⌘N">
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem icon="settings" shortcut="⌘S">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem icon="shield" shortcut="⌘A">
              Admin Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem icon="log-out">Sign out</DropdownMenuItem>
            <DropdownMenuItem icon="trash-2" className="text-error-500 hover:text-error-500">
              Delete account
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ─── With Section Headers ────────────────────────────────────────── */
export const WithSectionHeaders: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-grey-300 bg-white px-3 py-2 text-body-sm font-semibold text-grey-700 hover:border-[#B6D8FF] focus:border-[#3D89DF] focus:outline-none transition-colors">
          <Icon name="menu" size="md" />
          <span>Menu</span>
          <Icon name="chevron-down" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel description="This is a subheading for the title">
              Menu Title
            </DropdownMenuLabel>
            <DropdownMenuItem icon="home" shortcut="⌘H">
              Home
            </DropdownMenuItem>
            <DropdownMenuItem icon="search" shortcut="⌘K">
              Search
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel description="Manage your account">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem icon="settings" shortcut="⌘S">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem icon="shield">Admin Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
            <DropdownMenuItem icon="log-out">Sign out</DropdownMenuItem>
            <DropdownMenuItem icon="trash-2">Delete account</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ─── With Selection ──────────────────────────────────────────────── */
export const WithSelection: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-grey-300 bg-white px-3 py-2 text-body-sm font-semibold text-grey-700 hover:border-[#B6D8FF] focus:border-[#3D89DF] focus:outline-none transition-colors">
          <span>Status</span>
          <Icon name="chevron-down" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem selected>Active</DropdownMenuItem>
            <DropdownMenuItem>Away</DropdownMenuItem>
            <DropdownMenuItem>Do not disturb</DropdownMenuItem>
            <DropdownMenuItem disabled>Invisible</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ─── Avatar Trigger ──────────────────────────────────────────────── */
export const AvatarTrigger: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#3D89DF] focus:ring-offset-2">
          <Avatar type="initials" initials="JD" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel description="john@example.com">
              John Doe
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem icon="user">Profile</DropdownMenuItem>
            <DropdownMenuItem icon="settings">Settings</DropdownMenuItem>
            <DropdownMenuItem icon="credit-card">Billing</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem icon="log-out">Sign out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ─── Icon-Only Trigger ───────────────────────────────────────────── */
export const IconOnlyTrigger: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-grey-300 bg-white p-1 text-grey-500 hover:border-[#B6D8FF] focus:border-[#3D89DF] focus:outline-none transition-colors">
          <Icon name="more-horizontal" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem icon="pencil">Edit</DropdownMenuItem>
            <DropdownMenuItem icon="copy">Duplicate</DropdownMenuItem>
            <DropdownMenuItem icon="archive">Archive</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem icon="trash-2" className="text-error-500 hover:text-error-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ─── Disabled Trigger ────────────────────────────────────────────── */
export const Disabled: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled
          className="inline-flex items-center gap-2 rounded-md border border-grey-300 bg-grey-100 px-3 py-2 text-body-sm font-semibold text-grey-400 cursor-not-allowed"
        >
          <Icon name="settings" size="md" />
          <span>Label</span>
          <Icon name="chevron-down" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>This won&apos;t show</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/* ─── Align Start ─────────────────────────────────────────────────── */
export const AlignStart: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-grey-300 bg-white px-3 py-2 text-body-sm font-semibold text-grey-700 hover:border-[#B6D8FF] focus:border-[#3D89DF] focus:outline-none transition-colors">
          <Icon name="filter" size="md" />
          <span>Filter</span>
          <Icon name="chevron-down" size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem selected>All items</DropdownMenuItem>
            <DropdownMenuItem>Active</DropdownMenuItem>
            <DropdownMenuItem>Archived</DropdownMenuItem>
            <DropdownMenuItem>Deleted</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
