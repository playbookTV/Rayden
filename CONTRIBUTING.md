# Contributing to Rayden UI

Thank you for your interest in contributing to Rayden UI! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Component Guidelines](#component-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Please be respectful and considerate in all interactions. We're building a welcoming community for contributors of all backgrounds and experience levels.

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** 8 or higher
- **Git**

### Setup

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/rayden.git
   cd rayden
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Start Storybook**

   ```bash
   pnpm storybook
   ```

   Visit `http://localhost:6006` to see the component library.

## Development Workflow

### Branch Naming

Create feature branches from `main`:

```bash
git checkout -b feature/button-loading-state
git checkout -b fix/input-focus-ring
git checkout -b docs/update-readme
```

### Commands

```bash
pnpm dev              # Watch mode (rebuilds on changes)
pnpm build            # Production build
pnpm typecheck        # TypeScript type checking
pnpm storybook        # Start Storybook dev server
pnpm exec vitest      # Run tests
```

### Testing

We use Storybook's Vitest addon with Playwright for browser testing:

```bash
# Run all tests
pnpm exec vitest

# Run specific component tests
pnpm exec vitest Button

# Watch mode
pnpm exec vitest --watch
```

## Component Guidelines

### File Structure

Each component lives in `src/components/<Name>/`:

```
src/components/MyComponent/
├── MyComponent.tsx        # Component implementation
├── MyComponent.stories.tsx # Storybook stories (also tests)
└── index.ts               # Re-exports
```

### Component Implementation

Follow these patterns:

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

// 1. Export types
export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "lg";
  children: ReactNode;
}

// 2. Use forwardRef for DOM access
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  (
    {
      variant = "primary",
      size = "sm",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === "primary" && "primary-styles",
          size === "lg" && "large-styles",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

// 3. Set displayName for debugging
MyComponent.displayName = "MyComponent";
```

### Styling

- Use Tailwind CSS v4 with custom theme tokens
- Use the `cn()` utility for conditional classes
- Prefer design token colors (`primary-400`, `grey-500`) over arbitrary values
- Support `className` prop for customization

### Accessibility

- Use semantic HTML elements
- Include ARIA attributes where appropriate
- Support keyboard navigation
- Test with screen readers
- Ensure sufficient color contrast

### Stories

Create comprehensive stories for all states:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    children: "Default content",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <MyComponent variant="primary">Primary</MyComponent>
      <MyComponent variant="secondary">Secondary</MyComponent>
    </div>
  ),
};
```

### Exports

Add your component to `src/index.ts`:

```tsx
export { MyComponent } from "./components/MyComponent";
export type { MyComponentProps } from "./components/MyComponent";
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(button): add loading state with spinner

fix(input): correct focus ring color on error state

docs(readme): add installation instructions

refactor(tabs): simplify context implementation
```

## Pull Request Process

1. **Create your branch**

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**

   - Write clean, readable code
   - Add/update stories
   - Add/update tests if needed
   - Update documentation

3. **Verify your changes**

   ```bash
   pnpm typecheck
   pnpm exec vitest
   pnpm build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(component): description"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/my-feature
   ```

6. **Open a Pull Request**

   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for visual changes
   - Request review from maintainers

### PR Checklist

- [ ] Code follows the project style guidelines
- [ ] TypeScript types are properly defined and exported
- [ ] Component uses `forwardRef` for ref forwarding
- [ ] Stories cover all variants and states
- [ ] Accessibility has been considered
- [ ] Documentation is updated if needed
- [ ] All tests pass
- [ ] Build succeeds

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: What happened vs. what you expected
2. **Steps to reproduce**: Clear, numbered steps
3. **Environment**: Browser, OS, Node version
4. **Screenshots**: If applicable
5. **Code example**: Minimal reproduction

### Feature Requests

For new features:

1. **Use case**: Why is this needed?
2. **Proposed solution**: How might it work?
3. **Alternatives**: Other approaches considered
4. **Design reference**: Link to Figma if applicable

---

## Questions?

Feel free to open a GitHub issue for any questions about contributing. We're happy to help!

Thank you for contributing to Rayden UI!
