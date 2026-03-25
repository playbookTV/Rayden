export const authors = {
  sarah: {
    name: "Sarah Chen",
    initials: "SC",
    role: "Senior Developer",
    bio: "Full-stack developer with 10+ years of experience building web applications.",
  },
  marcus: {
    name: "Marcus Johnson",
    initials: "MJ",
    role: "Tech Lead",
    bio: "Passionate about clean code and developer experience.",
  },
};

export const posts = [
  {
    id: "1",
    slug: "getting-started-with-rayden-ui",
    title: "Getting Started with Rayden UI",
    excerpt: "Learn how to quickly set up and start building beautiful interfaces with Rayden UI components.",
    content: `
# Getting Started with Rayden UI

Rayden UI is a modern React component library that helps you build beautiful user interfaces quickly and efficiently.

## Installation

To get started, install the package using your preferred package manager:

npm install @raydenui/ui

## Basic Usage

Import the components you need and start building.

## Styling

Rayden UI uses Tailwind CSS for styling. Make sure to import the styles in your main CSS file.

That's it! You're ready to start building with Rayden UI.
    `,
    category: "Tutorial",
    author: authors.sarah,
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: "2",
    slug: "building-accessible-forms",
    title: "Building Accessible Forms with Rayden UI",
    excerpt: "Best practices for creating accessible and user-friendly forms using our form components.",
    content: `
# Building Accessible Forms

Accessibility is at the core of Rayden UI. Our form components are designed to be accessible out of the box.

## Form Components

Rayden UI provides a comprehensive set of form components including Input, Select, Checkbox, Radio, and Toggle.

## Best Practices

1. Always use labels for form inputs
2. Provide helpful error messages
3. Use appropriate input types
4. Ensure keyboard navigation works
    `,
    category: "Guide",
    author: authors.marcus,
    publishedAt: "2024-01-10",
    readTime: "8 min read",
  },
  {
    id: "3",
    slug: "design-tokens-explained",
    title: "Understanding Design Tokens in Rayden UI",
    excerpt: "Deep dive into how design tokens work and how to customize them for your brand.",
    content: `
# Understanding Design Tokens

Design tokens are the foundation of Rayden UI's design system.

## What are Design Tokens?

Design tokens are named entities that store visual design attributes.

## Token Categories

- Colors: Primary, secondary, semantic colors
- Typography: Font families, sizes, weights
- Spacing: Consistent spacing values
- Shadows: Elevation levels
    `,
    category: "Deep Dive",
    author: authors.sarah,
    publishedAt: "2024-01-05",
    readTime: "12 min read",
  },
  {
    id: "4",
    slug: "responsive-layouts",
    title: "Creating Responsive Layouts",
    excerpt: "Learn how to build responsive layouts that work across all device sizes.",
    content: `
# Creating Responsive Layouts

Building responsive layouts is essential for modern web applications.

## Breakpoints

We use standard Tailwind breakpoints: sm, md, lg, xl.

## Tips

1. Use flexible grid layouts
2. Test on multiple devices
3. Consider touch targets on mobile
    `,
    category: "Tutorial",
    author: authors.marcus,
    publishedAt: "2024-01-01",
    readTime: "6 min read",
  },
];

export const categories = ["All", "Tutorial", "Guide", "Deep Dive"];

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category) {
  if (category === "All") return posts;
  return posts.filter((post) => post.category === category);
}

export function getFeaturedPost() {
  return posts.find((post) => post.featured);
}
