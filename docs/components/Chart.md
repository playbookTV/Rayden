# Chart

Data visualization with Chart.js.

## Import

```tsx
import { RaydenChart, chartColors, hexToRgba } from "@raydenui/ui";
```

## Usage

```tsx
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [{
    label: "Revenue",
    data: [30, 45, 60, 50, 70, 85],
    borderColor: chartColors.primary[400],
    backgroundColor: hexToRgba(chartColors.primary[400], 0.1),
    fill: true,
  }],
};

<RaydenChart type="line" data={data} height={300} />
```

## Chart Types

- `line` - Line/area charts
- `bar` - Bar charts
- `pie` - Pie charts
- `doughnut` - Donut charts
- `radar` - Radar charts
- `scatter` - Scatter plots
- `bubble` - Bubble charts
- `polar-area` - Polar area charts

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ChartType` | — | Chart type (required) |
| `data` | `ChartData<any>` | — | Chart.js data (required) |
| `options` | `ChartOptions<any>` | — | Chart.js options |
| `height` | `number` | `300` | Chart height |
| `width` | `number` | — | Chart width |

## Theme Utilities

- `chartColors.primary[50-900]` - Primary palette
- `chartColors.semantic.success/error/warning/info` - Semantic colors
- `chartColors.grey[50-900]` - Grey scale
- `hexToRgba(hex, alpha)` - Convert hex to rgba
- `createGradientFill(ctx, color, startAlpha, endAlpha)` - Create gradients
