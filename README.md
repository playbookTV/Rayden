<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/MacBook Air - 17.png">
  <source media="(prefers-color-scheme: light)" srcset="./public/MacBook Air - 17.png">
  <img alt="Rayden UI - Build UI faster. A React UI system designed for humans and AI." src="./public/MacBook Air - 17.png" width="100%">
</picture>

# Rayden UI

A modern, accessible React component library built with Tailwind CSS v4.
Pixel-perfect components from the [Rayna UI](https://www.raynaui.com/) design system.

[![npm version](https://img.shields.io/npm/v/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-rayden--docs.vercel.app-F56630)](https://rayden-docs.vercel.app)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://main--69b6d5d8527b4eddb882e0a7.chromatic.com)

## Installation

```bash
npm install @raydenui/ui
```

## Quick Start

```tsx
import "@raydenui/ui/styles.css";
import { Button, Input, Badge } from "@raydenui/ui";

function App() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Input label="Email" placeholder="you@example.com" />
      <Button variant="primary" size="lg">Subscribe</Button>
      <Badge color="success">Active</Badge>
    </div>
  );
}
```

## Components (33+)

**Forms & Inputs**: Button, ButtonGroup, Input, Select, FormControl, Chip, FileUpload, Counter, Slider, DatePicker

**Navigation**: Tabs, Breadcrumb, Pagination, SidebarMenu, DropdownMenu, Stepper

**Data Display**: Table, Avatar, ActivityFeed, MetricsCard, Icon, EmptyStateIllustration, Chart

**Feedback**: Alert, Badge, Banner, ProgressBar, ProgressCircle, Spinner, Tooltip

**Layout**: Accordion, Divider, Modal

## Resources

- [Documentation](https://rayden-docs.vercel.app) — Full component API and guides
- [Storybook](https://main--69b6d5d8527b4eddb882e0a7.chromatic.com) — Interactive component explorer
- [@raydenui/ai](https://www.npmjs.com/package/@raydenui/ai) — MCP server for AI-assisted development

## License

MIT