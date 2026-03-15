# EmptyStateIllustration

Decorative illustrations for empty states, with 19 themed illustrations supporting colored and greyscale variants.

## Import

```tsx
import { EmptyStateIllustration } from "@raydenui/ui";
import type { EmptyStateIllustrationProps, IllustrationName } from "@raydenui/ui";
```

## Usage

### Basic Usage

```tsx
<EmptyStateIllustration name="inbox" />
```

### Colored vs Grey

```tsx
{/* Colored (default) */}
<EmptyStateIllustration name="search" colored />

{/* Greyscale */}
<EmptyStateIllustration name="search" colored={false} />
```

### Custom Size

```tsx
<EmptyStateIllustration name="inbox" size={80} />   {/* 80px */}
<EmptyStateIllustration name="inbox" size={120} />  {/* 120px */}
<EmptyStateIllustration name="inbox" size={150} />  {/* 150px - default */}
<EmptyStateIllustration name="inbox" size={200} />  {/* 200px */}
```

### Custom Color Palette

Replace the default orange palette with your brand colors:

```tsx
const bluePalette = [
  "#E5F0FF", // lightest
  "#C2D8FC",
  "#9ABCFC",
  "#74A0FA",
  "#4A85F7",
  "#3066F5",
  "#1750EB",
  "#0C40CC",
  "#0733AD",
  "#02288F",
  "#001E71", // darkest
];

<EmptyStateIllustration
  name="inbox"
  colored
  palette={bluePalette}
/>
```

## API Reference

### EmptyStateIllustrationProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IllustrationName` | — | Illustration name (required) |
| `colored` | `boolean` | `true` | Show colored or greyscale variant |
| `palette` | `string[]` | — | Custom 11-color palette (lightest → darkest) |
| `size` | `number` | `150` | Width and height in pixels |

### IllustrationName

```ts
type IllustrationName =
  | "calendar"
  | "chat"
  | "contacts"
  | "dashboard"
  | "favorites"
  | "file-manager"
  | "forms"
  | "gallery"
  | "inbox"
  | "invoice"
  | "notifications"
  | "product-catalog"
  | "project-list"
  | "search"
  | "shopping-cart"
  | "subscriptions"
  | "survey"
  | "task-templates"
  | "team";
```

## Available Illustrations

| Name | Use Case |
|------|----------|
| `calendar` | Empty calendar, no events |
| `chat` | No messages, empty conversation |
| `contacts` | Empty address book |
| `dashboard` | No dashboard data |
| `favorites` | No favorites saved |
| `file-manager` | Empty folder, no files |
| `forms` | No form submissions |
| `gallery` | Empty image gallery |
| `inbox` | Empty inbox, no emails |
| `invoice` | No invoices |
| `notifications` | No notifications |
| `product-catalog` | No products |
| `project-list` | No projects |
| `search` | No search results |
| `shopping-cart` | Empty cart |
| `subscriptions` | No subscriptions |
| `survey` | No survey responses |
| `task-templates` | No task templates |
| `team` | No team members |

## Examples

### Empty Search Results

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <EmptyStateIllustration name="search" size={150} />
  <h3 className="mt-6 text-lg font-semibold text-grey-900">
    No results found
  </h3>
  <p className="mt-2 text-sm text-grey-500">
    Try adjusting your search or filter to find what you're looking for.
  </p>
  <Button variant="primary" className="mt-6">
    Clear filters
  </Button>
</div>
```

### Empty Inbox

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <EmptyStateIllustration name="inbox" />
  <h3 className="mt-6 text-lg font-semibold text-grey-900">
    Your inbox is empty
  </h3>
  <p className="mt-2 max-w-sm text-sm text-grey-500">
    Messages from your team and notifications will appear here.
  </p>
</div>
```

### With Brand Colors

```tsx
const greenPalette = [
  "#E7F6EC",
  "#C1EBD2",
  "#91DDB0",
  "#5DCF8D",
  "#30C06E",
  "#0F973D",
  "#0B7A31",
  "#085D25",
  "#054119",
  "#03280F",
  "#011606",
];

<EmptyStateIllustration
  name="shopping-cart"
  colored
  palette={greenPalette}
/>
```

## Default Palette

The default palette uses the primary orange color scale:

```ts
const DEFAULT_PALETTE = [
  "#FFECE5", // primary-50
  "#FCD2C2", // primary-75
  "#FCB59A", // primary-100
  "#FA9874", // primary-150
  "#F77A4A", // primary-200
  "#F56630", // primary-400
  "#EB5017", // primary-500
  "#CC400C", // primary-600
  "#AD3307", // primary-700
  "#8F2802", // primary-800
  "#711E00", // primary-900
];
```
