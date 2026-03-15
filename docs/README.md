# Rayden UI Documentation

Welcome to the Rayden UI documentation. This guide covers everything you need to build with our React component library.

## Quick Links

- [Getting Started](../README.md#quick-start)
- [Design Tokens](./design-tokens.md)
- [Contributing](../CONTRIBUTING.md)

## Components

### Forms & Inputs

- [Button](./components/Button.md) - Action buttons with variants and icons
- [ButtonGroup](./components/ButtonGroup.md) - Grouped button controls
- [Input](./components/Input.md) - Text input with validation
- [Select](./components/Select.md) - Dropdown select with icons, avatars, status
- [Checkbox, Radio, Toggle](./components/FormControl.md) - Form selection controls
- [Chip](./components/Chip.md) - Input tags and filters
- [FileUpload](./components/FileUpload.md) - Drag-and-drop file upload with progress

### Navigation

- [Tabs](./components/Tabs.md) - Tabbed content navigation
- [Breadcrumb](./components/Breadcrumb.md) - Hierarchical navigation
- [Pagination](./components/Pagination.md) - Page navigation
- [SidebarMenu](./components/SidebarMenu.md) - Collapsible sidebar with sections
- [DropdownMenu](./components/DropdownMenu.md) - Accessible dropdown menu

### Data Display

- [Table](./components/Table.md) - Data table with sorting and selection
- [Avatar](./components/Avatar.md) - User avatar with image/initials/icon
- [ActivityFeed](./components/ActivityFeed.md) - Activity timelines and notification feeds
- [MetricsCard](./components/MetricsCard.md) - Dashboard metric cards (6 variations)
- [Icon](./components/Icon.md) - 200+ icons with variants
- [EmptyStateIllustration](./components/EmptyStateIllustration.md) - 19 empty state illustrations

### Feedback

- [Alert](./components/Alert.md) - Notifications and banners
- [Badge](./components/Badge.md) - Status indicators
- [ProgressBar](./components/ProgressBar.md) - Linear progress
- [ProgressCircle](./components/ProgressCircle.md) - Circular progress
- [Tooltip](./components/Tooltip.md) - Contextual information

### Layout

- [Divider](./components/Divider.md) - Content separators

## Blocks

Pre-built UI patterns combining multiple components:

- [Blocks Overview](./blocks.md) - All available blocks
- [LoginBlock](./blocks.md#loginblock) - Complete login form
- [NotificationsBlock](./blocks.md#notificationsblock) - Notification feed
- [TableBlock](./blocks.md#tableblock) - Full-featured data table
- [QuickSendBlock](./blocks.md#quicksendblock) - Quick send interface
- [RecentTransactionsBlock](./blocks.md#recenttransactionsblock) - Transaction history
- [EmptyStateBlock](./blocks.md#emptystateblock) - Empty state with CTA
- [SearchableTableBlock](./blocks.md#searchabletableblock) - Table with search

## AI Integration

- [Rayden AI Guide](./rayden-ai.md) - AI compatibility layer for reliable LLM code generation

## Design System

### Tokens

Our design tokens are extracted from the [Rayna UI](https://www.figma.com/community/file/1229854793310881425) Figma design system:

- **Colors** - Primary, secondary, grey, and semantic colors
- **Typography** - Display, heading, body, and caption styles
- **Shadows** - Soft and hard shadow variants
- **Spacing** - 4px grid-based spacing scale
- **Breakpoints** - Responsive design breakpoints

See the full [Design Tokens Reference](./design-tokens.md).

### Tailwind Integration

All tokens are available as Tailwind CSS v4 theme variables:

```tsx
<div className="bg-primary-400 text-grey-900 shadow-soft-lg">
  Using design tokens via Tailwind
</div>
```

### Programmatic Access

Import tokens directly in JavaScript/TypeScript:

```tsx
import { colors, shadows, typography } from "@raydenui/ui/preset";
```

## Architecture

### Component Structure

```
src/components/<Name>/
├── <Name>.tsx           # Component implementation
├── <Name>.stories.tsx   # Storybook stories + tests
└── index.ts             # Re-exports
```

### Key Patterns

1. **forwardRef** - All components support ref forwarding
2. **cn() utility** - Class merging with clsx + tailwind-merge
3. **TypeScript** - Full type definitions exported
4. **Tailwind CSS v4** - Modern styling with custom tokens

## Resources

- [Rayna UI Figma](https://www.figma.com/community/file/1229854793310881425) - Design source
- [Storybook](http://localhost:6006) - Interactive component docs
- [GitHub Repository](https://github.com/your-org/rayden) - Source code
