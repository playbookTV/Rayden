# SidebarMenu

A collapsible sidebar navigation component with sections, submenus, and keyboard accessibility.

## Import

```tsx
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSection,
} from "@raydenui/ui";
import type {
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuSubProps,
  SidebarMenuSubItemProps,
  SidebarMenuSectionProps,
} from "@raydenui/ui";
```

## Usage

### Basic Sidebar

```tsx
const [active, setActive] = useState("dashboard");

<SidebarMenu activeItem={active} onItemSelect={setActive}>
  <SidebarMenuItem id="dashboard" icon="home">
    Dashboard
  </SidebarMenuItem>
  <SidebarMenuItem id="analytics" icon="chart-bar">
    Analytics
  </SidebarMenuItem>
  <SidebarMenuItem id="settings" icon="settings">
    Settings
  </SidebarMenuItem>
</SidebarMenu>
```

### With Sections

```tsx
<SidebarMenu activeItem={active} onItemSelect={setActive}>
  <SidebarMenuSection title="Main">
    <SidebarMenuItem id="dashboard" icon="home">
      Dashboard
    </SidebarMenuItem>
    <SidebarMenuItem id="inbox" icon="inbox" badge={5}>
      Inbox
    </SidebarMenuItem>
  </SidebarMenuSection>

  <SidebarMenuSection title="Teams">
    <SidebarMenuItem id="engineering" icon="code">
      Engineering
    </SidebarMenuItem>
    <SidebarMenuItem id="design" icon="palette">
      Design
    </SidebarMenuItem>
  </SidebarMenuSection>
</SidebarMenu>
```

### With Submenus

```tsx
<SidebarMenu activeItem={active} onItemSelect={setActive}>
  <SidebarMenuItem id="dashboard" icon="home">
    Dashboard
  </SidebarMenuItem>

  <SidebarMenuSub icon="folder" label="Projects" defaultOpen>
    <SidebarMenuSubItem id="project-alpha">
      Alpha
    </SidebarMenuSubItem>
    <SidebarMenuSubItem id="project-beta">
      Beta
    </SidebarMenuSubItem>
    <SidebarMenuSubItem id="project-gamma">
      Gamma
    </SidebarMenuSubItem>
  </SidebarMenuSub>

  <SidebarMenuItem id="settings" icon="settings">
    Settings
  </SidebarMenuItem>
</SidebarMenu>
```

### Collapsed State

```tsx
const [collapsed, setCollapsed] = useState(false);

<SidebarMenu
  collapsed={collapsed}
  activeItem={active}
  onItemSelect={setActive}
>
  <SidebarMenuItem id="dashboard" icon="home">
    Dashboard
  </SidebarMenuItem>
  {/* In collapsed mode, only icons are shown */}
</SidebarMenu>

<button onClick={() => setCollapsed(!collapsed)}>
  Toggle Sidebar
</button>
```

### Theme Variants

```tsx
<SidebarMenu theme="light" activeItem={active} onItemSelect={setActive}>
  {/* Light theme (default) */}
</SidebarMenu>

<SidebarMenu theme="dark" activeItem={active} onItemSelect={setActive}>
  {/* Dark theme with inverted colors */}
</SidebarMenu>
```

## API Reference

### SidebarMenuProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collapsed` | `boolean` | `false` | Collapse to icon-only mode |
| `theme` | `"light" \| "dark"` | `"light"` | Color theme |
| `activeItem` | `string` | — | Currently active item ID |
| `onItemSelect` | `(id: string) => void` | — | Called when an item is selected |

### SidebarMenuItemProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | — | Unique identifier (required) |
| `icon` | `ReactNode \| IconName` | — | Leading icon |
| `badge` | `number \| string` | — | Badge count or label |
| `disabled` | `boolean` | `false` | Disable the item |

### SidebarMenuSubProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode \| IconName` | — | Leading icon |
| `label` | `string` | — | Submenu label (required) |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `badge` | `number \| string` | — | Badge on the trigger |

### SidebarMenuSubItemProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | — | Unique identifier (required) |
| `disabled` | `boolean` | `false` | Disable the item |

### SidebarMenuSectionProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Section header title |

## Full Example

```tsx
import { useState } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSection,
  Avatar,
  Input,
} from "@raydenui/ui";

function AppSidebar() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "flex flex-col h-screen border-r border-grey-200 bg-white",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-grey-200">
        <Logo collapsed={collapsed} />
      </div>

      {/* Search (hidden when collapsed) */}
      {!collapsed && (
        <div className="p-4">
          <Input leadingIcon="search" placeholder="Search..." size="sm" />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarMenu
          collapsed={collapsed}
          activeItem={active}
          onItemSelect={setActive}
        >
          <SidebarMenuSection title="Main">
            <SidebarMenuItem id="dashboard" icon="home">
              Dashboard
            </SidebarMenuItem>
            <SidebarMenuItem id="inbox" icon="inbox" badge={12}>
              Inbox
            </SidebarMenuItem>
            <SidebarMenuItem id="calendar" icon="calendar">
              Calendar
            </SidebarMenuItem>
          </SidebarMenuSection>

          <SidebarMenuSection title="Projects">
            <SidebarMenuSub icon="folder" label="All Projects" defaultOpen>
              <SidebarMenuSubItem id="project-1">
                Website Redesign
              </SidebarMenuSubItem>
              <SidebarMenuSubItem id="project-2">
                Mobile App
              </SidebarMenuSubItem>
              <SidebarMenuSubItem id="project-3">
                API Integration
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuSection>

          <SidebarMenuSection title="Settings">
            <SidebarMenuItem id="settings" icon="settings">
              Settings
            </SidebarMenuItem>
            <SidebarMenuItem id="help" icon="help">
              Help & Support
            </SidebarMenuItem>
          </SidebarMenuSection>
        </SidebarMenu>
      </div>

      {/* User profile */}
      {!collapsed && (
        <div className="p-4 border-t border-grey-200">
          <div className="flex items-center gap-3">
            <Avatar type="image" src="..." size="sm" />
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-grey-500">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
```

## Accessibility

- Full keyboard navigation with arrow keys
- `Enter` or `Space` to select items
- Submenus can be expanded/collapsed with keyboard
- ARIA attributes for screen readers
