# Breadcrumb

Hierarchical navigation component showing the user's location within the site structure.

## Import

```tsx
import { Breadcrumb } from "@raydenui/ui";
import type { BreadcrumbProps, BreadcrumbItem } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics", active: true },
  ]}
/>
```

### With Icons

```tsx
import { HomeIcon, FolderIcon } from "@heroicons/react/20/solid";

<Breadcrumb
  items={[
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Documents", href: "/docs", icon: <FolderIcon /> },
    { label: "Report.pdf", active: true },
  ]}
/>
```

### Custom Separator

```tsx
import { ChevronRightIcon } from "@heroicons/react/16/solid";

<Breadcrumb
  items={[
    { label: "Settings", href: "/settings" },
    { label: "Account", href: "/settings/account" },
    { label: "Security", active: true },
  ]}
  separator={<ChevronRightIcon className="size-4" />}
/>
```

### With Disabled Items

```tsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Archived", disabled: true },
    { label: "Old Post", active: true },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | — | **Required.** Navigation items |
| `separator` | `ReactNode` | `"/"` | Custom separator between items |
| `className` | `string` | — | Additional CSS classes |

### BreadcrumbItem Type

```tsx
interface BreadcrumbItem {
  label: string;      // Display text
  href?: string;      // Link URL
  icon?: ReactNode;   // Optional icon
  disabled?: boolean; // Disable interaction
  active?: boolean;   // Mark as current page
}
```

## Accessibility

- Uses `<nav>` element with `aria-label="Breadcrumb"`
- Active item has `aria-current="page"`
- Separators are hidden from screen readers with `aria-hidden`

## Design Guidelines

### Structure

- First item should be the root/home
- Last item should be the current page (active)
- Each intermediate item should be a navigable link

### Best practices

- Keep labels short and recognizable
- Show 3-5 levels maximum
- Consider truncation for deep hierarchies
- Use icons sparingly (home icon is common)
- Active page doesn't need to be a link
