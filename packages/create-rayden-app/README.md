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
- **6 Templates**: From blank canvas to full e-commerce
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
- Template (Blank, Minimal, Landing, Dashboard, E-commerce, Blog)
- TypeScript (Yes/No)
- Package manager (pnpm, npm, or yarn)
- Git initialization
- Dependency installation

### Non-Interactive Mode

Pass flags for CI/automation:

```bash
npx create-rayden-app my-app -f vite -t landing --ts --pm pnpm
```

#### Available Flags

| Flag | Description |
|------|-------------|
| `-f, --framework <name>` | `vite` or `nextjs` |
| `-t, --template <name>` | `blank`, `minimal`, `landing`, `dashboard`, `ecommerce`, or `blog` |
| `--ts, --typescript` | Use TypeScript (default) |
| `--js, --javascript` | Use JavaScript |
| `--pm <manager>` | `npm`, `pnpm`, or `yarn` |
| `--git / --no-git` | Initialize git (default: true) |
| `--install / --no-install` | Install dependencies |

## Templates

### Blank

An empty project with Rayden UI configured. Perfect for starting from scratch.

- Clean slate with basic structure
- Rayden UI and Tailwind CSS ready to use
- Ideal for custom projects

### Minimal

A clean starting point showcasing core components.

- Single page with Button, Input, and Badge demo
- Great for learning the component API
- Minimal dependencies

### Landing Page

A marketing landing page template with modern sections.

- Hero section with CTA buttons
- Features grid with icons
- Testimonials with avatars
- Pricing tiers
- Newsletter signup
- Fully responsive design

**Components used:** Button, Badge, Avatar, Icon, Divider, Input

### Dashboard

A full dashboard layout with navigation and data visualization.

- Sidebar navigation with SidebarMenu
- MetricsCard grid
- Data tables with sorting
- Multiple pages (Dashboard, Transactions, Settings)
- React Router (Vite) or App Router (Next.js)

**Components used:** SidebarMenu, MetricsCard, Table, Avatar, Badge, Button, Input

### E-commerce

A complete storefront template with shopping functionality.

- Product listing with filters and sorting
- Product detail pages
- Shopping cart with quantity controls
- Checkout form with validation
- Category navigation

**Components used:** Button, Badge, Input, Select, Counter, Breadcrumb, Divider

### Blog

A content-focused template for articles and posts.

- Home page with featured post
- Individual post pages with Markdown-style content
- Sidebar with search, categories, and recent posts
- About page with author profiles
- Category filtering

**Components used:** Avatar, Badge, Input, Divider, Breadcrumb, Button

## What's Included

Every scaffolded project comes with:

- **Rayden UI** - Pre-installed component library
- **Tailwind CSS v4** - Configured with Rayden design tokens
- **ESLint** - Code linting setup
- **TypeScript** - Full type support (if selected)

## Examples

```bash
# Create a landing page with TypeScript
npx create-rayden-app my-landing -f vite -t landing --ts

# Create an e-commerce site with Next.js
npx create-rayden-app my-store -f nextjs -t ecommerce --ts

# Create a blog with JavaScript
npx create-rayden-app my-blog -f vite -t blog --js

# Create a dashboard with pnpm
npx create-rayden-app my-dashboard -f nextjs -t dashboard --ts --pm pnpm
```

## Learn More

- [Rayden UI Documentation](https://raydenui.com/docs)
- [GitHub Repository](https://github.com/raydenui/rayden)

## License

MIT
