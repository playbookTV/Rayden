import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SidebarMenu, type SidebarMenuTheme } from "./SidebarMenu";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuSub, SidebarMenuSubItem } from "./SidebarMenuItem";
import { SidebarMenuSection } from "./SidebarMenuSection";
import { Icon } from "../Icon";
import { Avatar } from "../Avatar";
import { Input } from "../Input";

const meta: Meta<typeof SidebarMenu> = {
  title: "Elements/SidebarMenu",
  component: SidebarMenu,
};

export default meta;
type Story = StoryObj<typeof SidebarMenu>;

/* ─── Default expanded sidebar ──────────────────────────────────── */
export const Default: Story = {
  render: () => {
    const SidebarDemo = () => {
      const [active, setActive] = useState("dashboard");

      return (
        <div className="h-[800px] bg-grey-50 p-6">
          <SidebarMenu
            value={active}
            onValueChange={setActive}
            className="h-full shadow-soft-xs"
          >
            {/* Search */}
            <div className="mb-3 px-2">
              <Input size="sm" placeholder="Search" icon="search" />
            </div>

            {/* Main Menu */}
            <SidebarMenuSection title="Main Menu">
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="transactions" icon="wallet" badge={12}>
                Transactions
              </SidebarMenuItem>
              <SidebarMenuItem value="analytics" icon="chart">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem value="messages" icon="message" badge={3}>
                Messages
              </SidebarMenuItem>
            </SidebarMenuSection>

            {/* Settings Section */}
            <SidebarMenuSection title="Settings" showDivider={false}>
              <SidebarMenuItem value="profile" icon="user">
                Profile
              </SidebarMenuItem>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
              <SidebarMenuItem value="help" icon="help-circle">
                Help Center
              </SidebarMenuItem>
            </SidebarMenuSection>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer user card */}
            <div className="flex items-center gap-3 border-t border-grey-100 px-4 pt-4">
              <Avatar
                type="initials"
                initials="JD"
                size="md"
                status="online"
              />
              <div className="flex flex-1 flex-col">
                <span className="text-body-sm font-semibold text-grey-900">
                  John Doe
                </span>
                <span className="text-body-xs text-grey-600">
                  john@example.com
                </span>
              </div>
              <button
                type="button"
                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-grey-400 hover:bg-grey-100"
              >
                <Icon name="sign-out" size="md" />
              </button>
            </div>
          </SidebarMenu>
        </div>
      );
    };
    return <SidebarDemo />;
  },
};

/* ─── With expandable sub-items ─────────────────────────────────── */
export const WithSubItems: Story = {
  render: () => {
    const SidebarSubDemo = () => {
      const [active, setActive] = useState("all-projects");

      return (
        <div className="h-[700px] bg-grey-50 p-6">
          <SidebarMenu
            value={active}
            onValueChange={setActive}
            className="h-full shadow-soft-xs"
          >
            <SidebarMenuSection title="Main Menu">
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="projects" icon="folder">
                Projects
                <SidebarMenuSub>
                  <SidebarMenuSubItem value="all-projects">
                    All Projects
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem value="active-projects">
                    Active
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem value="archived-projects">
                    Archived
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem value="team" icon="users">
                Team
                <SidebarMenuSub>
                  <SidebarMenuSubItem value="members">
                    Members
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem value="roles">
                    Roles
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem value="reports" icon="chart" badge={5}>
                Reports
              </SidebarMenuItem>
            </SidebarMenuSection>

            <SidebarMenuSection title="Other" showDivider={false}>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>
        </div>
      );
    };
    return <SidebarSubDemo />;
  },
};

/* ─── Collapsed icon-only mode ──────────────────────────────────── */
export const Collapsed: Story = {
  render: () => {
    const SidebarCollapsedDemo = () => {
      const [active, setActive] = useState("dashboard");

      return (
        <div className="h-[600px] bg-grey-50 p-6">
          <SidebarMenu
            collapsed
            value={active}
            onValueChange={setActive}
            className="h-full shadow-soft-xs"
          >
            <SidebarMenuSection showDivider={false}>
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="transactions" icon="wallet">
                Transactions
              </SidebarMenuItem>
              <SidebarMenuItem value="analytics" icon="chart">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem value="messages" icon="message">
                Messages
              </SidebarMenuItem>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>
        </div>
      );
    };
    return <SidebarCollapsedDemo />;
  },
};

/* ─── All Themes ────────────────────────────────────────────────── */
const ThemeSidebar = ({ theme }: { theme: SidebarMenuTheme }) => {
  const [active, setActive] = useState("dashboard");

  return (
    <SidebarMenu
      theme={theme}
      value={active}
      onValueChange={setActive}
      className="h-[600px] shadow-soft-xs"
    >
      <SidebarMenuSection title="Main Menu">
        <SidebarMenuItem value="dashboard" icon="grid">
          Dashboard
        </SidebarMenuItem>
        <SidebarMenuItem value="transactions" icon="wallet" badge={12}>
          Transactions
        </SidebarMenuItem>
        <SidebarMenuItem value="analytics" icon="chart">
          Analytics
        </SidebarMenuItem>
        <SidebarMenuItem value="messages" icon="message" badge={3}>
          Messages
        </SidebarMenuItem>
      </SidebarMenuSection>

      <SidebarMenuSection title="Settings" showDivider={false}>
        <SidebarMenuItem value="profile" icon="user">
          Profile
        </SidebarMenuItem>
        <SidebarMenuItem value="settings" icon="settings">
          Settings
        </SidebarMenuItem>
      </SidebarMenuSection>

      <div className="flex-1" />

      <div className="flex items-center gap-3 px-4 pt-4">
        <Avatar type="initials" initials="AE" size="md" status="online" />
        <div className="flex flex-1 flex-col">
          <span
            className={
              theme === "light"
                ? "text-body-sm font-semibold text-grey-900"
                : "text-body-sm font-semibold text-white"
            }
          >
            Alison Eyo
          </span>
          <span
            className={
              theme === "light"
                ? "text-body-xs text-grey-600"
                : "text-body-xs text-[#E3EFFC]"
            }
          >
            alison.e@rayna.ui
          </span>
        </div>
        <button
          type="button"
          className={
            theme === "light"
              ? "flex size-8 cursor-pointer items-center justify-center rounded-md text-grey-400 hover:bg-grey-100"
              : "flex size-8 cursor-pointer items-center justify-center rounded-md text-white/70 hover:text-white"
          }
        >
          <Icon name="sign-out" size="md" />
        </button>
      </div>
    </SidebarMenu>
  );
};

export const AllThemes: Story = {
  render: () => (
    <div className="flex gap-6 bg-grey-50 p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Light</span>
        <ThemeSidebar theme="light" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Blue</span>
        <ThemeSidebar theme="blue" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Dark Blue</span>
        <ThemeSidebar theme="dark-blue" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Dark Grey</span>
        <ThemeSidebar theme="dark-grey" />
      </div>
    </div>
  ),
};

/* ─── Collapsible toggle demo ───────────────────────────────────── */
export const CollapsibleToggle: Story = {
  render: () => {
    const ToggleDemo = () => {
      const [active, setActive] = useState("dashboard");
      const [collapsed, setCollapsed] = useState(false);

      return (
        <div className="flex h-[700px] gap-4 bg-grey-50 p-6">
          <SidebarMenu
            collapsed={collapsed}
            value={active}
            onValueChange={setActive}
            className="h-full shadow-soft-xs transition-all duration-200"
          >
            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="mb-2 flex cursor-pointer items-center justify-center self-end rounded-md p-2 text-grey-400 hover:bg-grey-100"
            >
              <Icon
                name={collapsed ? "chevron-right" : "chevron-left"}
                size="md"
              />
            </button>

            <SidebarMenuSection title="Main Menu">
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="transactions" icon="wallet" badge={12}>
                Transactions
              </SidebarMenuItem>
              <SidebarMenuItem value="analytics" icon="chart">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem value="messages" icon="message" badge={3}>
                Messages
              </SidebarMenuItem>
            </SidebarMenuSection>

            <SidebarMenuSection title="Settings" showDivider={false}>
              <SidebarMenuItem value="profile" icon="user">
                Profile
              </SidebarMenuItem>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>

          {/* Content area */}
          <div className="flex-1 rounded-xl bg-white p-8 shadow-soft-xs">
            <h2 className="text-h4 font-semibold text-grey-900">
              {active.charAt(0).toUpperCase() + active.slice(1)}
            </h2>
            <p className="mt-2 text-body-md text-grey-600">
              Selected menu item: <strong>{active}</strong>
            </p>
          </div>
        </div>
      );
    };
    return <ToggleDemo />;
  },
};
