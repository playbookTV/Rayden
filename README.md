<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://i.postimg.cc/6QsxLKk8/Mac-Book-Air-17.png">
  <source media="(prefers-color-scheme: light)" srcset="https://i.postimg.cc/6QsxLKk8/Mac-Book-Air-17.png">
  <img alt="Rayden UI - Build UI faster. A React UI system designed for humans and AI." src="https://i.postimg.cc/6QsxLKk8/Mac-Book-Air-17.png" width="100%">
</picture>

# Rayden UI

React components, page blocks, icons, and design tokens for building product interfaces. Rayden's default **Citrionus** flavor is built with Tailwind CSS v4 and includes TypeScript definitions, light and dark themes, and opt-in motion.

[![npm version](https://img.shields.io/npm/v/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Documentation](https://rayden-docs.vercel.app) · [Storybook](https://main--69b6d5d8527b4eddb882e0a7.chromatic.com) · [Source](https://github.com/playbookTV/Rayden)

## Quick start

In an existing React application:

```bash
npm install @raydenui/ui
```

React and React DOM 18 or later are required. Import the component stylesheet once in your app entry point or root layout. The optional font stylesheet serves bundled Hanken Grotesk and Manrope webfonts from your app.

```tsx
import "@raydenui/ui/styles.css";
import "@raydenui/ui/fonts.css";
import { Badge, Button, Input, ThemeProvider } from "@raydenui/ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <main style={{ display: "grid", gap: 16, maxWidth: 400, padding: 24 }}>
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Button variant="primary" size="lg">Subscribe</Button>
        <Badge color="success">Active</Badge>
      </main>
    </ThemeProvider>
  );
}
```

The package includes compiled component CSS. Configure Tailwind CSS v4 in your own app if you also want to generate utility classes for your layouts. In Next.js App Router, put interactive examples and providers in a client component with `"use client"`; import global styles from the root layout.

### Start a new project

```bash
npx create-rayden-app@latest my-app
```

Choose Vite or Next.js, TypeScript or JavaScript, and one of six starter templates: `blank`, `minimal`, `landing`, `dashboard`, `ecommerce`, or `blog`. Follow the CLI's printed next steps; it can install dependencies during setup.

For an explicit setup with npm:

```bash
npx create-rayden-app@latest my-app -f vite -t minimal --ts --pm npm --install
cd my-app
npm run dev
```

## Package imports

| Import | What it provides |
| --- | --- |
| `@raydenui/ui` | Components, theme providers and hooks, icon discovery, and utilities |
| `@raydenui/ui/blocks` | Ready-made application, account, marketing, and commerce blocks |
| `@raydenui/ui/icons` | Named static icon data such as `heartIcon` |
| `@raydenui/ui/chart` | `RaydenChart` and chart helpers |
| `@raydenui/ui/motion` | Motion primitives, presets, and recipes |
| `@raydenui/ui/preset` | Programmatic design tokens and the Tailwind preset |
| `@raydenui/ui/styles.css` | Compiled component styles and theme variables |
| `@raydenui/ui/fonts.css` | Optional bundled webfonts |

Charts require the optional `chart.js` and `react-chartjs-2` peers. The `useRaydenInput`, `useRaydenSelect`, and other form integration hooks require `react-hook-form`. Install these only when using the corresponding features:

```bash
npm install chart.js react-chartjs-2
# For React Hook Form integration:
npm install react-hook-form
```

## Components and blocks

- **Forms:** Button, ButtonGroup, Input, Select, Checkbox, Radio, Toggle, Chip, FileUpload, Counter, Slider, and DatePicker.
- **Navigation:** Tabs, Breadcrumb, Pagination, SidebarMenu, DropdownMenu, and Stepper.
- **Display and feedback:** Card, Table, Avatar, ActivityItem, ActivityContent, MetricsCard, Icon, EmptyStateIllustration, Alert, Badge, Banner, ProgressBar, ProgressCircle, Spinner, and Tooltip.
- **Layout:** Accordion, Divider, and Modal. Charts are available as `RaydenChart` from the chart subpath.

Import page blocks separately:

```tsx
import { PageHeaderBlock } from "@raydenui/ui/blocks";

export function OverviewHeader() {
  return (
    <PageHeaderBlock
      title="Overview"
      description="A snapshot of your workspace activity."
    />
  );
}
```

The block library includes application shells, page headers, workspace switching, command palettes, login and account creation, profile settings, KPI overviews, task lists, tables, notifications, marketing sections, product browsing, carts, and checkout review. Blocks provide UI; connect their props and callbacks to your own data and services.

## Icons

Use a static data import for immediate rendering, including server rendering:

```tsx
import { Button, Icon } from "@raydenui/ui";
import { heartIcon } from "@raydenui/ui/icons";

export function FavoriteButton() {
  return <Button icon={heartIcon} iconPosition="leading">Favorite</Button>;
}

export function FavoriteIcon() {
  return <Icon icon={heartIcon} variant="solid" size={24} />;
}
```

`<Icon name="heart" />` supports dynamic name lookup and loads the icon registry after mounting. Pass either `name` or `icon`. Both `outline` and `solid` variants are available. The `iconCatalog` export lists exact registry names and static export names without SVG artwork.

Icons are decorative by default. Label icon-only controls on the control itself; a meaningful standalone icon needs `aria-hidden={false}`, `role="img"`, and an `aria-label`.

## Theme and motion

`ThemeProvider` supports `light`, `dark`, and `system`. Use `useTheme()` to read or change the selected theme.

```tsx
import { MotionProvider, Pressable } from "@raydenui/ui/motion";

export function MotionExample() {
  return (
    <MotionProvider preset="snappy">
      <Pressable>Continue</Pressable>
    </MotionProvider>
  );
}
```

Motion presets are `calm`, `snappy`, `playful`, and `reduced`. `Reveal`, `Collapse`, and `SharedLayout` provide additional primitives. Tabs and Modal require an explicit `motion` prop to animate. System reduced-motion preferences take precedence.

## AI and MCP

[`@raydenui/ai`](https://www.npmjs.com/package/@raydenui/ai) supplies component contracts, token references, icon discovery, usage validation, and the Rayden MCP server. The MCP server ships in that package; it does not require a separate MCP package.

For an MCP client that launches stdio servers, use command `npx` with arguments `-y` and `@raydenui/ai@latest`. To inspect the server from a terminal:

```bash
npx -y @raydenui/ai@latest --help
```

See the [AI package README](https://github.com/playbookTV/Rayden/tree/main/packages/rayden-ai#readme) for configuration and programmatic usage. The AI catalog identifies its reference UI version and supported components; it does not inspect your installed project automatically.

## Development

From a checkout with Node.js and pnpm installed:

```bash
pnpm install
pnpm storybook
```

Use `pnpm typecheck`, `pnpm exec vitest run`, and `pnpm build` to check the UI. `pnpm check:pilots` validates the matching AI/MCP package and generated guidance after the UI build. Browser tests require a Playwright Chromium installation. See [CONTRIBUTING.md](https://github.com/playbookTV/Rayden/blob/main/CONTRIBUTING.md) for contributor setup.

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
