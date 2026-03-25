# create-rayden-app

The easiest way to get started with [Rayden UI](https://github.com/raydenui/rayden) - scaffold a new React project with Rayden UI pre-configured.

## Quick Start

```bash
npx create-rayden-app my-app
cd my-app
npm install
npm run dev
```

## Features

- **Framework options**: Vite (recommended) or Next.js
- **Template options**: Minimal starter or Dashboard with sidebar, tables, and metrics
- **TypeScript support**: Full TypeScript setup out of the box
- **Tailwind CSS v4**: Pre-configured with Rayden UI design tokens
- **Modern stack**: React 19, latest tooling

## Usage

### Interactive Mode

Run without arguments for an interactive experience:

```bash
npx create-rayden-app
```

You'll be prompted to choose:
- Project name
- Framework (Vite or Next.js)
- Template (Minimal or Dashboard)
- TypeScript (Yes/No)
- Package manager (pnpm, npm, or yarn)
- Git initialization
- Dependency installation

### Non-Interactive Mode

Pass flags for CI/automation:

```bash
npx create-rayden-app my-app -f vite -t dashboard --ts --pm pnpm
```

#### Available Flags

| Flag | Description |
|------|-------------|
| `-f, --framework <name>` | `vite` or `nextjs` |
| `-t, --template <name>` | `minimal` or `dashboard` |
| `--ts, --typescript` | Use TypeScript (default) |
| `--js, --javascript` | Use JavaScript |
| `--pm <manager>` | `npm`, `pnpm`, or `yarn` |
| `--git / --no-git` | Initialize git (default: true) |
| `--install / --no-install` | Install dependencies |

## Templates

### Minimal

A clean starting point with a single page showcasing Button, Input, and Badge components.

### Dashboard

A full dashboard layout featuring:
- Sidebar navigation with SidebarMenu
- MetricsCard grid
- Data table
- Multiple pages (Dashboard, Transactions, Settings)

## What's Included

Every scaffolded project comes with:

- **Rayden UI** - Pre-installed component library
- **Tailwind CSS v4** - Configured with Rayden design tokens
- **ESLint** - Code linting setup
- **TypeScript** - Full type support (if selected)

## Learn More

- [Rayden UI Documentation](https://raydenui.com/docs)
- [GitHub Repository](https://github.com/raydenui/rayden)

## License

MIT
