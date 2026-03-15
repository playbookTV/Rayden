# MetricsCard

Dashboard metric cards with 6 distinct layout variations for displaying KPIs and statistics.

## Import

```tsx
import { MetricsCard } from "@raydenui/ui";
import type { MetricsCardProps, MetricsCardVariation } from "@raydenui/ui";
```

## Usage

### Basic Usage

```tsx
<MetricsCard
  label="Total Revenue"
  value="$45,823"
/>
```

### With Icon and Trend

```tsx
<MetricsCard
  label="Monthly Sales"
  value="2,847"
  icon="shopping-cart"
  trendBadge={{ label: "12%", trend: "up" }}
  description="vs last month"
/>
```

### All Variations

The component offers 6 layout variations:

```tsx
{/* Variation 1: Horizontal with status badge */}
<MetricsCard
  variation="1"
  label="Invoice"
  value="$2,500.00"
  secondaryText="Jun 12th, 2023"
  statusBadge={{ label: "Paid", variant: "success" }}
  cta={{ label: "View Invoice", onClick: () => {} }}
/>

{/* Variation 2: Vertical with icon header (default) */}
<MetricsCard
  variation="2"
  label="Total Revenue"
  value="$45,823"
  icon="dollar"
  trendBadge={{ label: "10%", trend: "up" }}
  description="Compared to last month"
  cta={{ label: "View Report", onClick: () => {}, icon: "arrow-right" }}
/>

{/* Variation 3: Vertical with trend before value */}
<MetricsCard
  variation="3"
  label="Active Users"
  value="12,543"
  icon="users"
  trendBadge={{ label: "8%", trend: "up" }}
  description="This week"
/>

{/* Variation 4: Horizontal with large icon */}
<MetricsCard
  variation="4"
  label="Orders"
  value="1,234"
  icon="package"
  trendBadge={{ label: "5%", trend: "down" }}
/>

{/* Variation 5: Compact horizontal */}
<MetricsCard
  variation="5"
  label="Conversion Rate"
  value="3.24%"
  trendBadge={{ label: "0.5%", trend: "up" }}
  description="Last 30 days"
  cta={{ label: "Details", onClick: () => {} }}
/>

{/* Variation 6: Centered vertical */}
<MetricsCard
  variation="6"
  label="Total Solar Sales"
  value="45,823"
  icon="sun"
  trendBadge={{ label: "10%", trend: "up" }}
/>
```

## API Reference

### MetricsCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variation` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6"` | `"2"` | Layout variation |
| `label` | `string` | — | Metric label (required) |
| `value` | `string \| number` | — | Main metric value (required) |
| `icon` | `ReactNode \| IconName` | — | Icon (varies by variation) |
| `trendBadge` | `MetricsCardTrendBadge` | — | Trend indicator badge |
| `statusBadge` | `MetricsCardStatusBadge` | — | Status badge (variation 1) |
| `description` | `string` | — | Description text |
| `secondaryText` | `string` | — | Secondary text (variation 1) |
| `cta` | `MetricsCardCta` | — | Call-to-action link |

### MetricsCardTrendBadge

```ts
interface MetricsCardTrendBadge {
  label: string;         // e.g. "10%"
  trend?: "up" | "down"; // Arrow direction (default: "up")
}
```

- `up` — Orange background with up arrow
- `down` — Red background with down arrow

### MetricsCardStatusBadge

```ts
interface MetricsCardStatusBadge {
  label: string;
  variant?: "success" | "error" | "warning" | "info";
}
```

### MetricsCardCta

```ts
interface MetricsCardCta {
  label: string;
  onClick: () => void;
  icon?: ReactNode | IconName;
}
```

## Variation Guide

| Variation | Layout | Best For |
|-----------|--------|----------|
| 1 | Horizontal, label+value left, date+status right | Invoices, transactions |
| 2 | Vertical, icon+label → value → trend → CTA footer | General KPIs (default) |
| 3 | Vertical, icon+label → trend → value → CTA footer | Emphasizing trends |
| 4 | Horizontal, metrics left, large icon right | Highlight categories |
| 5 | Compact horizontal, no icon | Dense dashboards |
| 6 | Centered vertical, smaller text | Grid layouts |

## Examples

### Dashboard Grid

```tsx
<div className="grid grid-cols-3 gap-6">
  <MetricsCard
    variation="2"
    label="Total Revenue"
    value="$45,823"
    icon="dollar"
    trendBadge={{ label: "12%", trend: "up" }}
    description="vs last month"
  />
  <MetricsCard
    variation="2"
    label="Active Users"
    value="2,847"
    icon="users"
    trendBadge={{ label: "8%", trend: "up" }}
    description="vs last month"
  />
  <MetricsCard
    variation="2"
    label="Bounce Rate"
    value="24.5%"
    icon="trending-down"
    trendBadge={{ label: "3%", trend: "down" }}
    description="vs last month"
  />
</div>
```

### With CTA Actions

```tsx
<MetricsCard
  variation="2"
  label="Pending Orders"
  value="48"
  icon="package"
  trendBadge={{ label: "15%", trend: "up" }}
  cta={{
    label: "View all orders",
    onClick: () => navigate("/orders"),
    icon: "arrow-right",
  }}
/>
```
