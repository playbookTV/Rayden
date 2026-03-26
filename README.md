<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://i.postimg.cc/6QsxLKk8/Mac-Book-Air-17.png">
  <source media="(prefers-color-scheme: light)" srcset="https://i.postimg.cc/6QsxLKk8/Mac-Book-Air-17.png">
  <img alt="Rayden UI - Build UI faster. A React UI system designed for humans and AI." src="https://i.postimg.cc/6QsxLKk8/Mac-Book-Air-17.png" width="100%">
</picture>

# Rayden UI

A modern, accessible React component library built with Tailwind CSS v4.
Pixel-perfect components from the [Rayna UI](https://www.raynaui.com/) design system.

[![npm version](https://img.shields.io/npm/v/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-rayden--docs.vercel.app-F56630)](https://rayden-docs.vercel.app)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://69b6d5e6cb6bbc778afec0ee-tcxvxzrkrt.chromatic.com/)

## Quick Start

The fastest way to get started is with `create-rayden-app`:

```bash
npx create-rayden-app my-app
cd my-app
npm install
npm run dev
```

### Templates

| Template | Description |
|----------|-------------|
| `blank` | Empty project, Rayden UI configured |
| `minimal` | Demo of core components |
| `landing` | Hero, features, pricing, CTA |
| `dashboard` | Sidebar, tables, metrics |
| `ecommerce` | Products, cart, checkout |
| `blog` | Articles, categories, posts |

### CLI Options

```bash
npx create-rayden-app my-app -f vite -t landing --ts --pm pnpm
```

| Flag | Options |
|------|---------|
| `-f, --framework` | `vite` (recommended), `nextjs` |
| `-t, --template` | `blank`, `minimal`, `landing`, `dashboard`, `ecommerce`, `blog` |
| `--ts` / `--js` | TypeScript (default) or JavaScript |
| `--pm` | `npm`, `pnpm`, `yarn` |

### Manual Installation

```bash
npm install @raydenui/ui
```

## Usage

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
- [create-rayden-app](https://www.npmjs.com/package/create-rayden-app) — CLI scaffolding with 6 templates
- [@raydenui/ai](https://www.npmjs.com/package/@raydenui/ai) — MCP server for AI-assisted development

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/playbookTV"><img src="https://github.com/playbookTV.png" width="100px;" alt=""/><br /><sub><b>Leslie Isah</b></sub></a></td>
    <td align="center"><a href="https://github.com/ZyhvarZeGreat"><img src="https://github.com/ZyhvarZeGreat.png" width="100px;" alt=""/><br /><sub><b>Bolude Daniel</b></sub></a></td>
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT