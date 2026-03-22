# RAYDEN_RULES.md

AI agent instructions for generating Rayden UI code. Follow these rules precisely to avoid hallucinating components, props, or patterns that don't exist.

---

## Quick Start

```tsx
import {
  // Primitives
  Button, Badge, Icon, Divider, Tooltip,
  // Inputs
  Input, Select, SelectOption, Checkbox, Radio, Toggle, Chip,
  Counter, NumberCounter, Slider, RangeSlider, DatePicker,
  // Feedback
  Alert, Banner, ProgressBar, ProgressCircle, Spinner,
  // Navigation
  Tabs, Tab, Breadcrumb, BreadcrumbItem, Pagination,
  SidebarMenu, SidebarMenuSection, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
  Stepper, LinearStepper, SegmentedStepper,
  // Data Display
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Avatar, AvatarGroup, MetricsCard, EmptyStateIllustration,
  ActivityFeed, ActivityItem, ActivityContent, RaydenChart,
  // Layout
  Accordion, AccordionItem, AccordionTrigger, AccordionContent, Modal,
  // Composite
  ButtonGroup, ButtonGroupItem,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup,
  FileUpload, FileUploadDropZone, FileUploadItem
} from '@raydenui/ui';
import '@raydenui/ui/styles.css';
```

---

## Core Rules

1. **ONLY use documented components** — Never invent components that aren't listed below
2. **ONLY use documented props** — Never invent props; check the prop list for each component
3. **Use token classes** — Use `bg-primary-500` not `#EB5017`
4. **Follow composition rules** — Compound components must nest correctly (Table → TableHeader → TableRow → TableHead)
5. **Provide accessible names** — Icon-only buttons require `aria-label`
6. **No loading states** — Rayden UI does not have built-in loading props; implement loading UX separately

---

## Design Philosophy — Premium, Minimal, Clean UI

**Every screen you generate must feel intentional, polished, and premium.** Rayden UI is built on professional design principles — the code you produce should reflect that. Follow these design directives precisely.

### The 5 Pillars of Rayden UI Design

#### 1. Breathing Room — Generous Whitespace
Premium UI is defined by what you *leave out*, not what you put in. Space is a design element.

```tsx
// BAD — cramped, amateur layout
<div className="p-2 space-y-1">
  <h3 className="text-h6">Settings</h3>
  <Input label="Name" />
  <Input label="Email" />
  <Button variant="primary">Save</Button>
</div>

// GOOD — spacious, premium layout
<div className="p-8 space-y-6 max-w-lg">
  <div>
    <h3 className="text-h4 font-semibold text-grey-900">Settings</h3>
    <p className="text-body-sm text-grey-500 mt-1">Manage your account preferences</p>
  </div>
  <div className="space-y-4">
    <Input label="Name" placeholder="Your full name" />
    <Input label="Email" placeholder="you@company.com" />
  </div>
  <Button variant="primary" className="w-full">Save Changes</Button>
</div>
```

**Spacing rules:**
- Page-level padding: `p-6` minimum, `p-8` to `p-12` preferred
- Section gaps: `space-y-6` or `space-y-8` between major sections
- Form field gaps: `space-y-4` between inputs
- Inline element gaps: `gap-2` to `gap-3`
- Always constrain content width: `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-2xl`

#### 2. Visual Hierarchy — Guide the Eye
Every screen needs a clear reading order. Use size, weight, and color contrast deliberately.

```tsx
// Heading hierarchy pattern
<div>
  <span className="text-caption-sm uppercase tracking-wider text-grey-400 font-medium">Dashboard</span>
  <h1 className="text-h3 font-semibold text-grey-900 mt-1">Good morning, Alex</h1>
  <p className="text-body-md text-grey-500 mt-2">Here's what's happening with your projects today.</p>
</div>
```

**Hierarchy rules:**
- Page titles: `text-h3` or `text-h4` in `text-grey-900 font-semibold`
- Section headers: `text-h5` or `text-h6` in `text-grey-800 font-semibold`
- Overlines/labels: `text-caption-sm uppercase tracking-wider text-grey-400 font-medium`
- Body text: `text-body-md text-grey-700` (primary), `text-body-sm text-grey-500` (secondary)
- Helper/meta text: `text-body-xs text-grey-400`
- Never use `text-grey-900` for body text — reserve it for headings
- Never use more than 3 font sizes on one screen section

#### 3. Restraint — Minimal Color, Maximum Impact
Color should be purposeful, not decorative. A premium interface is mostly neutral with strategic color accents.

```tsx
// BAD — color overload
<div className="bg-primary-50 border-2 border-primary-500 p-4 rounded-xl">
  <Badge color="orange">New</Badge>
  <h3 className="text-primary-600">Dashboard</h3>
  <Button variant="primary">View</Button>
  <Button variant="success">Approve</Button>
  <Button variant="warning">Flag</Button>
</div>

// GOOD — neutral base, single accent
<div className="bg-white border border-grey-200 p-6 rounded-xl">
  <div className="flex items-center justify-between">
    <h3 className="text-h6 font-semibold text-grey-800">Dashboard</h3>
    <Badge color="orange" type="accent" size="sm">New</Badge>
  </div>
  <p className="text-body-sm text-grey-500 mt-1">3 items need your attention</p>
  <div className="flex gap-3 mt-4">
    <Button variant="primary" size="sm">Review</Button>
    <Button variant="grey" appearance="outlined" size="sm">Dismiss</Button>
  </div>
</div>
```

**Color rules:**
- Backgrounds: `bg-white` or `bg-grey-50` — never colored backgrounds for containers
- One primary action per section (one `variant="primary"` button)
- Secondary actions: `variant="grey"` with `appearance="outlined"`
- Use `primary-500` sparingly: active tabs, primary buttons, key links
- Status colors (`success`, `error`, `warning`) only for actual status indicators
- Never use more than 2 accent colors in one view

#### 4. Polish — Shadows, Borders, and Radius
The difference between good and great UI is in the subtle details.

```tsx
// Card pattern — clean, elevated
<div className="bg-white rounded-xl border border-grey-200 shadow-soft-xs p-6">
  {/* content */}
</div>

// Card pattern — minimal, flat
<div className="bg-white rounded-lg border border-grey-200 p-6">
  {/* content */}
</div>

// Card pattern — elevated, premium
<div className="bg-white rounded-2xl shadow-soft-sm p-8">
  {/* content */}
</div>
```

**Polish rules:**
- Cards: `rounded-xl` or `rounded-2xl` with `border border-grey-200` or `shadow-soft-xs`
- Never use both heavy borders AND heavy shadows — pick one elevation strategy
- Use `shadow-soft-xs` for cards, `shadow-soft-sm` for elevated panels, `shadow-soft-md` for overlays
- Dividers between sections: use `<Divider />` or `border-b border-grey-100`
- Input radius matches surrounding card radius (both use `rounded-lg` by default)
- Consistent radius: don't mix `rounded-md` and `rounded-2xl` in the same section

#### 5. Composition — Intentional Layout Structure
Premium layouts follow predictable, grid-aligned patterns.

```tsx
// Page shell pattern
<div className="min-h-screen bg-grey-50">
  {/* Top bar */}
  <header className="bg-white border-b border-grey-200 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <h1 className="text-h6 font-semibold text-grey-900">App Name</h1>
      <Avatar src="/user.jpg" alt="User" />
    </div>
  </header>

  {/* Content */}
  <main className="max-w-7xl mx-auto px-6 py-8">
    {/* page content */}
  </main>
</div>
```

**Layout rules:**
- Page backgrounds: `bg-grey-50` or `bg-white`
- Content containers: `max-w-7xl mx-auto` for full pages
- Grid systems: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Sidebar layouts: `flex` with sidebar as fixed-width, content as `flex-1`
- Always use responsive breakpoints: `sm:`, `md:`, `lg:`
- Sticky headers: `sticky top-0 z-10 bg-white border-b border-grey-200`

---

## Design Patterns by Context

### Premium Dashboard
```tsx
<div className="min-h-screen bg-grey-50">
  <header className="bg-white border-b border-grey-200 px-8 py-5">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-h5 font-semibold text-grey-900">Dashboard</h1>
        <p className="text-body-xs text-grey-400 mt-0.5">Last updated 5 min ago</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="grey" appearance="outlined" icon="download" iconPosition="leading" size="sm">Export</Button>
        <Button variant="primary" icon="plus" iconPosition="leading" size="sm">New Report</Button>
      </div>
    </div>
  </header>

  <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
    {/* KPI strip */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricsCard title="Total Revenue" value="$45,231" trend={{ label: "+20.1%", type: "up" }} />
      <MetricsCard title="Subscriptions" value="2,350" trend={{ label: "+180", type: "up" }} />
      <MetricsCard title="Active Now" value="573" statusBadge={{ label: "Live", color: "success" }} />
      <MetricsCard title="Churn Rate" value="2.4%" trend={{ label: "-0.3%", type: "down" }} />
    </div>

    {/* Content sections */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h6 font-semibold text-grey-800">Recent Orders</h2>
          <Button variant="text" size="sm">View All</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar alt="Olivia Martin" />
                  <div>
                    <p className="text-body-sm font-medium text-grey-800">Olivia Martin</p>
                    <p className="text-body-xs text-grey-400">olivia@email.com</p>
                  </div>
                </div>
              </TableCell>
              <TableCell><Badge color="success" size="sm">Paid</Badge></TableCell>
              <TableCell className="text-body-sm font-medium text-grey-800">$1,999.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <h2 className="text-h6 font-semibold text-grey-800 mb-6">Activity</h2>
        <div className="space-y-4">
          {/* Activity items */}
        </div>
      </div>
    </div>
  </main>
</div>
```

### Minimal Settings Page
```tsx
<div className="max-w-2xl mx-auto py-12 px-6">
  <div className="mb-8">
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>Settings</BreadcrumbItem>
    </Breadcrumb>
    <h1 className="text-h3 font-semibold text-grey-900 mt-4">Settings</h1>
    <p className="text-body-md text-grey-500 mt-2">Manage your account and preferences.</p>
  </div>

  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <Tab value="profile">Profile</Tab>
    <Tab value="notifications">Notifications</Tab>
    <Tab value="security">Security</Tab>
  </Tabs>

  <div className="mt-8 space-y-8">
    {/* Section */}
    <div>
      <h2 className="text-h6 font-semibold text-grey-800">Personal Information</h2>
      <p className="text-body-sm text-grey-500 mt-1">Update your photo and personal details.</p>
      <Divider className="my-5" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First name" placeholder="Alex" />
          <Input label="Last name" placeholder="Johnson" />
        </div>
        <Input label="Email" type="email" placeholder="alex@company.com" leadingIcon="mail" />
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3 pt-4 border-t border-grey-100">
      <Button variant="grey" appearance="outlined">Cancel</Button>
      <Button variant="primary">Save Changes</Button>
    </div>
  </div>
</div>
```

### Clean Data Table Page
```tsx
<div className="bg-white rounded-xl border border-grey-200">
  {/* Table header bar */}
  <div className="px-6 py-5 flex items-center justify-between border-b border-grey-100">
    <div>
      <h2 className="text-h6 font-semibold text-grey-800">Team Members</h2>
      <p className="text-body-xs text-grey-400 mt-0.5">Manage your team and their account permissions.</p>
    </div>
    <div className="flex items-center gap-3">
      <Input leadingIcon="search" placeholder="Search members..." size="sm" />
      <Button variant="primary" icon="plus" iconPosition="leading" size="sm">Invite</Button>
    </div>
  </div>

  {/* Filter bar */}
  <div className="px-6 py-3 border-b border-grey-100 flex items-center gap-2">
    <Chip variant="filter">Role</Chip>
    <Chip variant="filter">Status</Chip>
    <Chip variant="filter">Department</Chip>
  </div>

  {/* Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead sortable sortDirection="asc" onSort={() => handleSort('name')}>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
        <TableHead sortable onSort={() => handleSort('joined')}>Joined</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {members.map(member => (
        <TableRow key={member.id}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar src={member.avatar} alt={member.name} />
              <div>
                <p className="text-body-sm font-medium text-grey-800">{member.name}</p>
                <p className="text-body-xs text-grey-400">{member.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-body-sm text-grey-600">{member.role}</TableCell>
          <TableCell>
            <Badge color={member.active ? "success" : "neutral"} size="sm">
              {member.active ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
          <TableCell className="text-body-sm text-grey-500">{member.joined}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button icon="dots-horizontal" iconPosition="icon-only" variant="text" size="sm" aria-label="Actions" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {/* Pagination footer */}
  <div className="px-6 py-4 border-t border-grey-100 flex items-center justify-between">
    <p className="text-body-xs text-grey-400">Showing 1-10 of 48 members</p>
    <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
  </div>
</div>
```

### Premium Empty State
```tsx
<div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
  <EmptyStateIllustration name="no-data" size="lg" />
  <h3 className="text-h5 font-semibold text-grey-900 mt-8">No projects yet</h3>
  <p className="text-body-md text-grey-500 mt-3 leading-relaxed">
    Create your first project to start tracking progress and collaborating with your team.
  </p>
  <div className="flex gap-3 mt-8">
    <Button variant="grey" appearance="outlined">Learn More</Button>
    <Button variant="primary" icon="plus" iconPosition="leading">Create Project</Button>
  </div>
</div>
```

### Clean Login / Auth Page
```tsx
<div className="min-h-screen bg-grey-50 flex items-center justify-center px-4">
  <div className="w-full max-w-sm">
    {/* Logo area */}
    <div className="text-center mb-8">
      <h1 className="text-h4 font-semibold text-grey-900">Welcome back</h1>
      <p className="text-body-md text-grey-500 mt-2">Sign in to your account to continue</p>
    </div>

    {/* Form card */}
    <div className="bg-white rounded-2xl shadow-soft-sm p-8">
      <form className="space-y-4">
        <Input label="Email" type="email" placeholder="you@company.com" leadingIcon="mail" />
        <Input label="Password" type="password" placeholder="Enter your password" />
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" />
          <button type="button" className="text-body-sm text-primary-600 font-medium">Forgot password?</button>
        </div>
        <Button variant="primary" className="w-full" size="lg">Sign In</Button>
      </form>
      <Divider label="OR" className="my-6" />
      <Button variant="grey" appearance="outlined" className="w-full">Continue with Google</Button>
    </div>

    <p className="text-center text-body-sm text-grey-400 mt-6">
      Don't have an account? <button type="button" className="text-primary-600 font-medium">Sign up</button>
    </p>
  </div>
</div>
```

### Minimal Profile / Detail Page
```tsx
<div className="max-w-3xl mx-auto py-12 px-6">
  {/* Profile header */}
  <div className="flex items-start gap-6">
    <Avatar src="/user.jpg" alt="Alex Johnson" size="lg" />
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <h1 className="text-h4 font-semibold text-grey-900">Alex Johnson</h1>
        <Badge color="success" size="sm">Active</Badge>
      </div>
      <p className="text-body-md text-grey-500 mt-1">Product Designer at Acme Inc.</p>
      <div className="flex gap-3 mt-4">
        <Button variant="primary" size="sm">Edit Profile</Button>
        <Button variant="grey" appearance="outlined" size="sm" icon="mail" iconPosition="leading">Message</Button>
      </div>
    </div>
  </div>

  <Divider className="my-8" />

  {/* Stats row */}
  <div className="grid grid-cols-3 gap-6">
    <MetricsCard title="Projects" value="24" />
    <MetricsCard title="Completed" value="18" trend={{ label: "75%", type: "up" }} />
    <MetricsCard title="Hours Logged" value="1,240" />
  </div>

  <Divider className="my-8" />

  {/* Detail sections */}
  <div className="space-y-6">
    <div>
      <h2 className="text-h6 font-semibold text-grey-800">About</h2>
      <p className="text-body-md text-grey-600 mt-3 leading-relaxed">
        Product designer with 8+ years of experience building digital products.
        Passionate about design systems and accessible interfaces.
      </p>
    </div>
  </div>
</div>
```

---

## UI Quality Anti-Patterns — NEVER Do These

| Anti-Pattern | Why It's Bad | What To Do Instead |
|---|---|---|
| Colored backgrounds on containers | Looks dated and cluttered | `bg-white` or `bg-grey-50` with `border border-grey-200` |
| Multiple primary buttons in one view | Confuses the user's focus | One `variant="primary"`, rest are `variant="grey"` |
| Tiny padding (`p-1`, `p-2`) on sections | Feels cramped and cheap | `p-6` minimum for card/section padding |
| Missing subtitle text under headings | Headers feel disconnected | Add `text-body-sm text-grey-500 mt-1` descriptor |
| All text same size/color | No visual hierarchy | Use the hierarchy rules above — size + weight + color |
| Raw data without formatting | Looks unfinished | Format numbers (`$1,234`), use relative dates, add units |
| Full-width layouts without `max-w-*` | Content stretches, hard to read | Constrain with `max-w-2xl` to `max-w-7xl` |
| Borders AND heavy shadows together | Double elevation looks wrong | Pick one: `border border-grey-200` OR `shadow-soft-xs` |
| Putting everything in a grid | Monotonous, no focus | Mix grid sections with full-width sections |
| No empty/loading/error states | Feels unfinished | Handle all three states with EmptyStateIllustration + Alert |
| Using `text-black` or `text-white` | Off-brand, harsh contrast | Use `text-grey-900` (darkest) or `text-white` only on dark bg |
| Inconsistent spacing between sections | Looks unpolished | Use `space-y-6` or `space-y-8` consistently |

---

## Available Components (33 Total)

### Primitives
| Component | Description |
|-----------|-------------|
| `Button` | Primary action trigger with variants, appearances, sizes, icons |
| `Badge` | Status indicator or label |
| `Icon` | SVG icon from predefined set |
| `Divider` | Visual separator |
| `Tooltip` | Hover/focus information popup |

### Inputs
| Component | Description |
|-----------|-------------|
| `Input` | Text input with label, validation, icons |
| `Select` + `SelectOption` | Dropdown select input |
| `Checkbox` | Boolean checkbox with label |
| `Radio` | Radio option (use within groups) |
| `Toggle` | Switch toggle |
| `Chip` | Removable tag or filter token |
| `Counter` + `NumberCounter` | Numeric input with increment/decrement |
| `Slider` + `RangeSlider` | Draggable value/range input |
| `DatePicker` | Calendar date picker (single, range, year modes) |

### Feedback
| Component | Description |
|-----------|-------------|
| `Alert` | Toast or banner notification |
| `Banner` | Full-width notification banner |
| `ProgressBar` | Linear progress indicator |
| `ProgressCircle` | Circular progress indicator |
| `Spinner` | Loading indicator with 7 animation types |

### Navigation
| Component | Description |
|-----------|-------------|
| `Tabs` + `Tab` | Tabbed navigation |
| `Breadcrumb` + `BreadcrumbItem` | Navigation breadcrumbs |
| `Pagination` | Page navigation |
| `SidebarMenu` | Vertical navigation sidebar |
| `Stepper` + `LinearStepper` + `SegmentedStepper` | Multi-step progress indicator |

### Data Display
| Component | Description |
|-----------|-------------|
| `Table` | Data table (compound component) |
| `Avatar` + `AvatarGroup` | User profile images |
| `MetricsCard` | KPI/statistics display |
| `EmptyStateIllustration` | Empty state artwork |
| `ActivityFeed` + `ActivityItem` + `ActivityContent` | Timeline and notification feeds |
| `RaydenChart` | Chart.js wrapper for data visualizations |

### Layout
| Component | Description |
|-----------|-------------|
| `Accordion` | Collapsible content panels (compound component) |
| `Modal` | Dialog overlay with backdrop and focus management |

### Composite
| Component | Description |
|-----------|-------------|
| `ButtonGroup` + `ButtonGroupItem` | Connected button group |
| `DropdownMenu` | Dropdown menu (compound) |
| `FileUpload` | File upload with dropzone |

---

## Components That DO NOT Exist

**DO NOT use these — they will not work:**

- `Dialog`, `Popup`, `Overlay`, `Lightbox` (use `Modal`)
- `Card`, `Panel`, `Box`, `Container`, `Paper`, `Surface` (use `<div>` with Tailwind)
- `Collapse`, `Collapsible`, `Expandable` (use `Accordion`)
- `Carousel`
- `TimePicker`, `DateTimePicker`, `Calendar` (use `DatePicker`)
- `ColorPicker`
- `Tree`, `TreeView`, `TreeSelect`
- `Drawer`, `Sheet`, `BottomSheet`, `SideSheet`
- `HoverCard`, `Popover` (use `Tooltip` or `DropdownMenu`)
- `Command`, `CommandPalette`, `CommandMenu`
- `Autocomplete`, `AutoComplete`, `TypeAhead`
- `Skeleton`, `Shimmer`
- `AspectRatio`, `ScrollArea`, `ScrollView`
- `Steps`, `Wizard` (use `Stepper` or `LinearStepper` or `SegmentedStepper`)
- `Timeline` (use `ActivityFeed`)
- `Rating`, `Stars`, `StarRating`
- `Stack`, `Flex`, `Grid`, `Center`, `Wrap`, `VStack`, `HStack`, `Spacer`
- `Portal`, `VisuallyHidden`
- `ResizablePanel`, `Splitter`
- `Loading`, `Loader` (use `Spinner`)

**How to build what's missing with native HTML + Tailwind:**

| Need | Solution |
|------|----------|
| Card / Panel | `<div className="bg-white rounded-xl border border-grey-200 p-6">` |
| Sidebar layout | `<div className="flex"><aside className="w-64 shrink-0">` + `<main className="flex-1">` |
| Grid layout | `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">` |
| Skeleton loading | `<div className="animate-pulse bg-grey-100 rounded-lg h-4 w-3/4">` |
| Sticky header | `<header className="sticky top-0 z-10 bg-white border-b border-grey-200">` |
| Scrollable area | `<div className="overflow-y-auto max-h-96">` |
| Aspect ratio | `<div className="aspect-video">` (native Tailwind) |
| Visually hidden | `<span className="sr-only">` |

---

## Button

```tsx
// Variants: primary | secondary | grey | destructive | text | success | warning | info
// Appearances: solid | outlined
// Sizes: sm | lg (NO "md" — only sm and lg exist)

// Basic
<Button variant="primary">Click me</Button>
<Button variant="secondary" appearance="outlined">Cancel</Button>

// With icon
<Button icon="plus" iconPosition="leading">Add Item</Button>
<Button icon="download" iconPosition="trailing">Export</Button>

// Icon only (requires aria-label)
<Button icon="settings" iconPosition="icon-only" aria-label="Settings" />

// Sizes
<Button size="sm">Small (36px)</Button>
<Button size="lg">Large (56px)</Button>

// Full width
<Button variant="primary" className="w-full">Submit</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Button — Common Mistakes

| Wrong | Correct |
|----------|-----------|
| `color="red"` | `variant="destructive"` |
| `color="primary"` | `variant="primary"` |
| `outline` or `outline={true}` | `appearance="outlined"` |
| `size="medium"` or `size="md"` | `size="sm"` (only sm and lg exist) |
| `leftIcon={<Icon />}` | `icon="name" iconPosition="leading"` |
| `rightIcon={<Icon />}` | `icon="name" iconPosition="trailing"` |
| `loading` or `isLoading` | Not supported — disable button and show separate spinner |
| `fullWidth` or `block` | `className="w-full"` |
| `href="/path"` | Use `<a>` or router Link component wrapping Button |

### Button — Design Best Practices

```tsx
// Action bar pattern — one primary, rest secondary
<div className="flex justify-end gap-3">
  <Button variant="grey" appearance="outlined">Cancel</Button>
  <Button variant="primary">Save Changes</Button>
</div>

// Destructive action — confirm pattern
<div className="flex justify-end gap-3">
  <Button variant="grey" appearance="outlined">Keep</Button>
  <Button variant="destructive">Delete Account</Button>
</div>

// Toolbar pattern — icon buttons with tooltips
<div className="flex items-center gap-1">
  <Tooltip content="Bold"><Button icon="bold" iconPosition="icon-only" variant="text" size="sm" aria-label="Bold" /></Tooltip>
  <Tooltip content="Italic"><Button icon="italic" iconPosition="icon-only" variant="text" size="sm" aria-label="Italic" /></Tooltip>
  <Divider />
  <Tooltip content="Link"><Button icon="link" iconPosition="icon-only" variant="text" size="sm" aria-label="Link" /></Tooltip>
</div>
```

---

## Input

```tsx
// Basic
<Input label="Email" placeholder="Enter email" />

// With helper text
<Input label="Username" helperText="Must be 3-20 characters" />

// Error state
<Input label="Email" error="Invalid email address" />

// Success state
<Input label="Username" success="Username available!" />

// With icons
<Input leadingIcon="search" placeholder="Search..." />
<Input trailingIcon="eye" type="password" label="Password" />
<Input leadingIcon="mail" trailingIcon="check" label="Email" />

// With text addon
<Input addonRight=".com" placeholder="website" />

// Sizes
<Input size="sm" label="Small" />  {/* 40px height */}
<Input size="lg" label="Large" />  {/* 48px height */}

// States
<Input disabled label="Disabled" />
<Input readOnly value="Read only value" label="Read Only" />
```

### Input — Common Mistakes

| Wrong | Correct |
|----------|-----------|
| `leftIcon` | `leadingIcon` |
| `rightIcon` | `trailingIcon` |
| `startIcon` / `endIcon` | `leadingIcon` / `trailingIcon` |
| `errorMessage="..."` | `error="..."` |
| `isError` | `error={true}` or `error="message"` |
| `variant="outlined"` | No variant — Input is always outlined |

---

## Table (Compound Component)

Tables require specific nesting: `Table` → `TableHeader`/`TableBody` → `TableRow` → `TableHead`/`TableCell`

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge color="blue">{user.role}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Sortable Table Header

```tsx
<TableHead
  sortable
  sortDirection="asc"
  onSort={() => handleSort('name')}
>
  Name
</TableHead>
```

### Selected Row

```tsx
<TableRow selected>{/* cells */}</TableRow>
```

### Table — Common Mistakes

| Wrong | Correct |
|----------|-----------|
| `<Table data={[...]} columns={[...]} />` | Map data to `<TableRow>` components manually |
| `<th>` | `<TableHead>` |
| `<td>` | `<TableCell>` |
| `<thead>` | `<TableHeader>` |
| `<tbody>` | `<TableBody>` |
| `pagination` prop | Use separate `<Pagination>` component below table |

### Table — Premium Cell Patterns

```tsx
// User cell with avatar
<TableCell>
  <div className="flex items-center gap-3">
    <Avatar src={user.avatar} alt={user.name} />
    <div>
      <p className="text-body-sm font-medium text-grey-800">{user.name}</p>
      <p className="text-body-xs text-grey-400">{user.email}</p>
    </div>
  </div>
</TableCell>

// Status cell
<TableCell>
  <Badge color={status === 'active' ? 'success' : 'neutral'} size="sm">{status}</Badge>
</TableCell>

// Numeric/money cell — right-aligned, monospace feel
<TableCell className="text-right text-body-sm font-medium text-grey-800 tabular-nums">
  $1,234.56
</TableCell>

// Actions cell
<TableCell>
  <div className="flex justify-end">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button icon="dots-horizontal" iconPosition="icon-only" variant="text" size="sm" aria-label="Actions" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</TableCell>
```

---

## Select (Compound Component)

```tsx
<Select
  value={value}
  onValueChange={setValue}
  placeholder="Select option..."
  label="Country"
>
  <SelectOption value="us">United States</SelectOption>
  <SelectOption value="uk">United Kingdom</SelectOption>
  <SelectOption value="ca">Canada</SelectOption>
</Select>
```

### Select — Common Mistakes

| Wrong | Correct |
|----------|-----------|
| `options={[...]}` | Use `<SelectOption>` children |
| `onChange` | `onValueChange` |

---

## DropdownMenu (Compound Component)

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="grey">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onClick={() => edit()}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={() => duplicate()}>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => del()}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Grouped Menu Items

```tsx
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem>Logout</DropdownMenuItem>
</DropdownMenuContent>
```

### DropdownMenu — Common Mistakes

| Wrong | Correct |
|----------|-----------|
| `items={[...]}` | Use `<DropdownMenuItem>` children |
| `trigger={<Button />}` | Wrap in `<DropdownMenuTrigger><Button /></DropdownMenuTrigger>` |

---

## Tabs (Compound Component)

```tsx
// Line variant (default)
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <Tab value="overview">Overview</Tab>
  <Tab value="analytics">Analytics</Tab>
  <Tab value="settings">Settings</Tab>
</Tabs>

// Pill variant
<Tabs variant="pill" value={activeTab} onValueChange={setActiveTab}>
  <Tab value="all">All</Tab>
  <Tab value="active">Active</Tab>
  <Tab value="completed">Completed</Tab>
</Tabs>

// With badge
<Tab value="inbox" badge={5}>Inbox</Tab>
```

---

## ButtonGroup (Compound Component)

```tsx
<ButtonGroup>
  <ButtonGroupItem active={view === 'list'} onClick={() => setView('list')}>
    List
  </ButtonGroupItem>
  <ButtonGroupItem active={view === 'grid'} onClick={() => setView('grid')}>
    Grid
  </ButtonGroupItem>
  <ButtonGroupItem active={view === 'table'} onClick={() => setView('table')}>
    Table
  </ButtonGroupItem>
</ButtonGroup>
```

### ButtonGroup — Common Mistakes

| Wrong | Correct |
|----------|-----------|
| `items={[...]}` | Use `<ButtonGroupItem>` children |
| `<Button>` inside ButtonGroup | Use `<ButtonGroupItem>` not `<Button>` |
| `value` / `onChange` | Use `active` prop on individual items + `onClick` |

---

## Badge

```tsx
// Colors: orange | blue | success | warning | error | neutral | disabled
// Types: filled | accent | outline
// Sizes: sm | md | lg

<Badge color="success">Active</Badge>
<Badge color="error" type="outline">Failed</Badge>
<Badge color="blue" type="accent" size="lg">New</Badge>
```

---

## Alert

```tsx
// Variants: toast | banner
// States: information | success | warning | error

// Toast (dismissible notification)
<Alert
  variant="toast"
  state="success"
  title="Success!"
  description="Your changes have been saved."
  onClose={() => setOpen(false)}
/>

// Banner (inline message)
<Alert
  variant="banner"
  state="warning"
  title="Warning"
  description="Your subscription expires in 3 days."
  primaryAction={{ label: "Renew", onClick: renew }}
  secondaryAction={{ label: "Dismiss", onClick: dismiss }}
/>
```

---

## ProgressBar

```tsx
// Sizes: sm | lg

<ProgressBar value={65} />
<ProgressBar value={65} label="Uploading..." />
<ProgressBar value={65} label="Storage" metadata="6.5GB of 10GB" showPercentage />
<ProgressBar value={100} size="lg" />
```

---

## ProgressCircle

```tsx
// Sizes: xs | sm | md | lg | xl

<ProgressCircle value={75} />
<ProgressCircle value={75} size="lg" />
<ProgressCircle value={75} size="xl" showValue />
<ProgressCircle value={75} centerText="75%" />
```

---

## Avatar

```tsx
// Single avatar
<Avatar src="/user.jpg" alt="John Doe" />
<Avatar src="/user.jpg" alt="John Doe" size="lg" />

// Fallback (no image)
<Avatar alt="John Doe" />  {/* Shows initials "JD" */}

// Avatar group
<AvatarGroup max={4}>
  <Avatar src="/user1.jpg" alt="User 1" />
  <Avatar src="/user2.jpg" alt="User 2" />
  <Avatar src="/user3.jpg" alt="User 3" />
  <Avatar src="/user4.jpg" alt="User 4" />
  <Avatar src="/user5.jpg" alt="User 5" />
</AvatarGroup>
```

---

## MetricsCard

```tsx
// Basic
<MetricsCard title="Total Revenue" value="$45,231" />

// With trend
<MetricsCard
  title="Active Users"
  value="2,543"
  trend={{ label: "+12%", type: "up" }}
/>

// With variation
<MetricsCard
  title="Monthly Sales"
  value="$12,500"
  variation={{ value: "+$2,100", type: "increase" }}
/>

// With status badge
<MetricsCard
  title="Server Status"
  value="Operational"
  statusBadge={{ label: "Healthy", color: "success" }}
/>

// With CTA
<MetricsCard
  title="Pending Orders"
  value="24"
  cta={{ label: "View All", onClick: () => navigate('/orders') }}
/>

// Stats grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <MetricsCard title="Users" value="12,543" trend={{ label: "+5%", type: "up" }} />
  <MetricsCard title="Revenue" value="$89,000" trend={{ label: "+12%", type: "up" }} />
  <MetricsCard title="Orders" value="456" trend={{ label: "-2%", type: "down" }} />
</div>
```

---

## EmptyStateIllustration

```tsx
// Names: no-data | no-results | no-connection | error | success | empty-inbox | empty-folder | no-notifications
// Sizes: sm | md | lg

<div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
  <EmptyStateIllustration name="no-data" size="lg" />
  <h3 className="text-h5 font-semibold text-grey-900 mt-8">No data yet</h3>
  <p className="text-body-md text-grey-500 mt-3">Start by adding some items to get started.</p>
  <Button variant="primary" icon="plus" iconPosition="leading" className="mt-6">Add Item</Button>
</div>
```

---

## SidebarMenu (Compound Component)

```tsx
<SidebarMenu>
  <SidebarMenuSection label="Main">
    <SidebarMenuItem icon="home" active>Dashboard</SidebarMenuItem>
    <SidebarMenuItem icon="users">Users</SidebarMenuItem>
    <SidebarMenuItem icon="folder">Projects</SidebarMenuItem>
  </SidebarMenuSection>

  <SidebarMenuSection label="Settings">
    <SidebarMenuItem icon="settings">
      Preferences
      <SidebarMenuSub>
        <SidebarMenuSubItem>Account</SidebarMenuSubItem>
        <SidebarMenuSubItem>Security</SidebarMenuSubItem>
      </SidebarMenuSub>
    </SidebarMenuItem>
  </SidebarMenuSection>
</SidebarMenu>
```

---

## Pagination

```tsx
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>

// With siblings
<Pagination
  currentPage={page}
  totalPages={100}
  onPageChange={setPage}
  siblingCount={2}
/>
```

---

## Breadcrumb (Compound Component)

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem current>Widget Pro</BreadcrumbItem>
</Breadcrumb>
```

---

## Checkbox

```tsx
<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
<Checkbox label="Disabled option" disabled />
<Checkbox label="Indeterminate" indeterminate />
```

---

## Radio

```tsx
<div role="radiogroup">
  <Radio name="plan" value="free" label="Free" checked={plan === 'free'} onChange={() => setPlan('free')} />
  <Radio name="plan" value="pro" label="Pro" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
  <Radio name="plan" value="enterprise" label="Enterprise" checked={plan === 'enterprise'} onChange={() => setPlan('enterprise')} />
</div>
```

---

## Toggle

```tsx
<Toggle
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
  label="Enable notifications"
/>
```

---

## Chip

```tsx
// Input variant (with close button)
<Chip variant="input" onClose={() => removeTag(tag)}>
  {tag}
</Chip>

// Filter variant (with chevron)
<Chip variant="filter" onClick={() => openFilter()}>
  Status
</Chip>

// With icon
<Chip icon="tag" variant="input" onClose={onRemove}>
  Category
</Chip>

// States
<Chip focused>Focused</Chip>
<Chip disabled>Disabled</Chip>
```

---

## Divider

```tsx
// Basic
<Divider />

// With label
<Divider label="OR" />

// With icon
<Divider icon="star" />

// With title
<Divider title="Section Title" />

// With button
<Divider button={{ label: "View More", onClick: showMore }} />
```

---

## Tooltip

```tsx
<Tooltip content="Click to save your changes">
  <Button>Save</Button>
</Tooltip>

// Positions: top | right | bottom | left
<Tooltip content="Settings" position="right">
  <Button icon="settings" iconPosition="icon-only" aria-label="Settings" />
</Tooltip>
```

---

## FileUpload (Compound Component)

```tsx
<FileUpload onUpload={handleUpload}>
  <FileUploadDropZone>
    <p>Drag and drop files here, or click to browse</p>
  </FileUploadDropZone>

  {files.map((file) => (
    <FileUploadItem
      key={file.name}
      name={file.name}
      size={file.size}
      progress={file.progress}
      onRemove={() => removeFile(file)}
    />
  ))}
</FileUpload>
```

---

## Modal

```tsx
// Basic confirmation modal
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to continue?"
  primaryLabel="Confirm"
  onPrimaryClick={handleConfirm}
  secondaryLabel="Cancel"
/>

// Modal with custom content
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  primaryLabel="Save Changes"
  onPrimaryClick={handleSave}
  secondaryLabel="Cancel"
>
  <div className="space-y-4">
    <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
    <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
  </div>
</Modal>

// Large modal with vertical buttons
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  size="lg"
  title="Choose a Plan"
  description="Select the plan that works best for you."
  footerOrientation="vertical"
  primaryLabel="Upgrade to Pro"
  onPrimaryClick={handleUpgrade}
  secondaryLabel="Stay on Free"
/>

// Prevent accidental close
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Important"
  closeOnOverlay={false}
  closeOnEscape={false}
  showClose={false}
  primaryLabel="I Understand"
  onPrimaryClick={() => setIsOpen(false)}
/>
```

### Modal — Common Mistakes

| Wrong | Correct |
|-------|---------|
| `isOpen` | `open` |
| `onDismiss` | `onClose` |
| `header={<>...</>}` | Use `title` and `description` props |
| `footer={<Button />}` | Use `primaryLabel` / `secondaryLabel` props |
| Modal without `open`/`onClose` | Both are required props |

---

## Accordion (Compound Component)

```tsx
// Basic accordion
<Accordion type="default" defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Rayden UI?</AccordionTrigger>
    <AccordionContent>
      Rayden UI is a professional React component library built on the Rayna UI design system.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes! All components follow WAI-ARIA guidelines and support keyboard navigation.
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple items open at once
<Accordion multiple>
  <AccordionItem value="faq-1">
    <AccordionTrigger>FAQ Item 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="faq-2">
    <AccordionTrigger>FAQ Item 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>

// With leading icons and badges
<Accordion>
  <AccordionItem value="settings">
    <AccordionTrigger leadingIcon="settings" badge={{ label: "New", color: "orange" }}>
      Settings
    </AccordionTrigger>
    <AccordionContent>Settings content here...</AccordionContent>
  </AccordionItem>
</Accordion>

// Nested accordion
<Accordion type="nested">
  <AccordionItem value="parent">
    <AccordionTrigger>Parent Section</AccordionTrigger>
    <AccordionContent>
      <Accordion type="nested">
        <AccordionItem value="child">
          <AccordionTrigger>Child Section</AccordionTrigger>
          <AccordionContent>Nested content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Accordion — Common Mistakes

| Wrong | Correct |
|-------|---------|
| `<Accordion items={[...]} />` | Use `<AccordionItem>` children |
| `expanded` / `isOpen` | Use `value` on AccordionItem and `defaultValue` on Accordion |
| `onToggle` | Use `onValueChange` on Accordion |
| Missing `value` on AccordionItem | Each AccordionItem requires a unique `value` prop |

---

## Slider

```tsx
// Basic slider
<Slider value={volume} onChange={setVolume} />

// With label and metadata
<Slider
  value={progress}
  onChange={setProgress}
  label="Progress"
  metadata="Step 2 of 5"
/>

// Custom range
<Slider
  value={price}
  onChange={setPrice}
  min={10}
  max={500}
  step={10}
  label="Price"
/>

// Without percentage display
<Slider
  value={brightness}
  onChange={setBrightness}
  size="sm"
  showPercentage={false}
/>

// Disabled
<Slider value={50} disabled label="Locked" />
```

## RangeSlider

```tsx
// Basic range slider
<RangeSlider
  value={priceRange}
  onChange={setPriceRange}
  label="Price Range"
/>

// With custom range
<RangeSlider
  value={ageRange}
  onChange={setAgeRange}
  min={18}
  max={65}
  label="Age Range"
  showLabels
/>
```

### Slider — Common Mistakes

| Wrong | Correct |
|-------|---------|
| `marks={[0, 25, 50, 75, 100]}` | Marks/ticks not supported |
| `orientation="vertical"` | Only horizontal orientation |
| `tooltip` | Use `showPercentage` for value display |
| `defaultValue` | Component is controlled-only; use `value` |

---

## DatePicker

```tsx
// Single date picker
<DatePicker
  mode="single"
  value={selectedDate}
  onChange={setSelectedDate}
/>

// Date range picker
<DatePicker
  mode="range"
  rangeValue={dateRange}
  onRangeChange={setDateRange}
/>

// Year picker
<DatePicker
  mode="year"
  value={selectedYear}
  onChange={setSelectedYear}
/>

// With footer buttons
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  showFooter
  onDone={() => setOpen(false)}
  onClear={() => setDate(null)}
/>

// With min/max constraints
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={new Date(2025, 11, 31)}
/>
```

### DatePicker — Common Mistakes

| Wrong | Correct |
|-------|---------|
| `onChange` for range mode | Use `onRangeChange` |
| `value` for range mode | Use `rangeValue={[start, end]}` |
| `disabledDates={[...]}` | Use `minDate`/`maxDate` |
| `format="MM/DD/YYYY"` | DatePicker shows calendar; format dates yourself |
| `<DatePicker trigger={<Input />} />` | DatePicker is the calendar itself |

---

## Stepper

```tsx
// Basic stepper with dot indicators
<Stepper
  steps={[
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Complete your profile' },
    { label: 'Review', description: 'Review and submit' }
  ]}
  activeStep={1}
/>

// With number indicators
<Stepper
  steps={[
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' }
  ]}
  activeStep={0}
  indicator="number"
/>

// With icon indicators
<Stepper
  steps={[
    { label: 'Account', icon: 'user' },
    { label: 'Payment', icon: 'credit-card' },
    { label: 'Confirm', icon: 'check' }
  ]}
  activeStep={1}
  indicator="icon"
/>

// Vertical orientation
<Stepper
  steps={steps}
  activeStep={currentStep}
  orientation="vertical"
/>
```

## LinearStepper

```tsx
// Simple linear progress
<LinearStepper currentStep={2} totalSteps={5} />

// With label
<LinearStepper currentStep={3} totalSteps={4} showLabel />
```

## SegmentedStepper

```tsx
// Segmented progress bar
<SegmentedStepper currentStep={2} totalSteps={5} />

// With label
<SegmentedStepper currentStep={1} totalSteps={3} showLabel />
```

### Stepper — Common Mistakes

| Wrong | Correct |
|-------|---------|
| `current` / `activeIndex` | `activeStep` |
| `items={[...]}` | `steps={[...]}` |
| `direction="vertical"` | `orientation="vertical"` |

---

## Spinner

```tsx
// Basic spinner
<Spinner />

// With label
<Spinner label="Loading..." />

// Different types
<Spinner type="thin" />
<Spinner type="bold" />
<Spinner type="duo-tone" />
<Spinner type="buffering-thin" />
<Spinner type="buffering-bold" />
<Spinner type="dot" />
<Spinner type="juggling" />

// Sizes: xs, sm, md, lg, xl, 2xl, 3xl
<Spinner size="lg" />
<Spinner size="xl" />

// White spinner on dark background
<div className="bg-grey-900 p-4 rounded-lg">
  <Spinner colorStyle="white" label="Loading..." />
</div>

// Label positions
<Spinner label="Please wait" labelPosition="below" />
<Spinner label="Loading" labelPosition="before" />

// Inside a button (loading state)
<Button variant="primary" disabled>
  <Spinner type="thin" size="sm" colorStyle="white" />
  <span className="ml-2">Saving...</span>
</Button>
```

### Spinner — Common Mistakes

| Wrong | Correct |
|-------|---------|
| `variant="circular"` | `type="thin"` or `type="bold"` |
| `color="primary"` | `colorStyle="brand"` |
| Spinner with `value`/`progress` | Use `ProgressCircle` for determinate progress |
| `size="large"` | `size="lg"` |

---

## Counter

```tsx
// Basic counter
<Counter value={count} onChange={setCount} />

// With min/max constraints
<Counter
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={10}
/>

// Different sizes
<Counter value={count} onChange={setCount} size="sm" />
<Counter value={count} onChange={setCount} size="md" />
<Counter value={count} onChange={setCount} size="lg" />

// Different shapes
<Counter value={count} onChange={setCount} shape="rounded" />
<Counter value={count} onChange={setCount} shape="block" />
<Counter value={count} onChange={setCount} shape="pill" />

// Disabled
<Counter value={5} disabled />
```

## NumberCounter

```tsx
// Display-only number counter (no interaction)
<NumberCounter value={42} />

// Different colors
<NumberCounter value={99} color="orange" />
<NumberCounter value={12} color="red" />
<NumberCounter value={5} color="grey" />
<NumberCounter value={0} color="white" />

// Different sizes
<NumberCounter value={7} size="sm" />
<NumberCounter value={7} size="md" />
<NumberCounter value={7} size="lg" />
```

---

## Banner

```tsx
// Information banner
<Banner
  status="information"
  title="System Update"
  description="A new version will be deployed tonight."
/>

// Success banner
<Banner
  status="success"
  title="Payment Received"
  description="Your payment has been processed successfully."
/>

// Warning banner
<Banner
  status="warning"
  title="Subscription Expiring"
  description="Your subscription expires in 3 days."
  buttonLabel="Renew Now"
  onButtonClick={handleRenew}
/>

// Error banner
<Banner
  status="error"
  title="Connection Lost"
  description="Please check your internet connection."
/>

// Feature/opportunity banners
<Banner status="feature" title="New Feature" description="Try our new dashboard!" />
<Banner status="opportunity" title="Special Offer" description="50% off this week!" />

// Subtle emphasis (lighter background)
<Banner
  status="information"
  emphasis="subtle"
  title="Note"
  description="This is a subtle informational banner."
/>

// Dismissible
<Banner
  status="success"
  title="Saved!"
  dismissible
  onDismiss={() => setShowBanner(false)}
/>

// Sizes
<Banner status="information" size="sm" title="Compact banner" />
<Banner status="information" size="lg" title="Large banner" description="With description" />
```

---

## ActivityFeed (Compound Component)

```tsx
<ActivityFeed>
  <ActivityItem
    avatar={<Avatar src="/user1.jpg" alt="John" />}
    text="John created a new project"
    date="Today"
    time="2:30 PM"
    connector="top"
  />
  <ActivityItem
    avatar={<Avatar src="/user2.jpg" alt="Sarah" />}
    text="Sarah commented on your post"
    date="Yesterday"
    time="4:15 PM"
    connector="middle"
    unread
  />
  <ActivityItem
    avatar={<Avatar alt="System" />}
    text="System backup completed"
    date="Mar 15"
    time="12:00 AM"
    connector="last"
  />
</ActivityFeed>
```

## ActivityContent

```tsx
// File attachment variant
<ActivityContent
  variant="file"
  contentStyle="card"
  fileName="report.pdf"
  fileSize="2.4 MB"
/>

// Comment variant
<ActivityContent
  variant="comment"
  contentStyle="container"
  commentText="This looks great! Let's proceed with the implementation."
  commentAuthor="Sarah"
/>

// CTA variant
<ActivityContent
  variant="cta"
  ctaTitle="Review Required"
  ctaDescription="Please review the changes before merging."
  ctaButtonLabel="Review Now"
  onCtaClick={handleReview}
/>
```

---

## RaydenChart

```tsx
import { RaydenChart, chartColors, hexToRgba, createGradientFill } from '@raydenui/ui';

// Line chart
<RaydenChart
  type="line"
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000],
      borderColor: chartColors.primary,
      backgroundColor: hexToRgba(chartColors.primary, 0.1)
    }]
  }}
  height={300}
/>

// Bar chart
<RaydenChart
  type="bar"
  data={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81],
      backgroundColor: chartColors.primary
    }]
  }}
/>

// Pie/Doughnut chart
<RaydenChart
  type="doughnut"
  data={{
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [55, 35, 10],
      backgroundColor: [chartColors.primary, chartColors.secondary, chartColors.success]
    }]
  }}
/>

// Available chart types: line, bar, pie, doughnut, radar, scatter, bubble, polar-area
```

---

## Color Tokens

Use Tailwind classes with these tokens — never use raw hex values.

### Primary (Orange)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | #FFECE5 | Light backgrounds, hover tints |
| `primary-100` | #FCB59A | Subtle borders |
| `primary-400` | #F56630 | Hover states |
| `primary-500` | #EB5017 | **Primary button default, key accents** |
| `primary-600` | #CC400C | Links, active states, text links |
| `primary-700` | #AD3307 | Focus rings |

### Secondary (Blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-50` | #E3EFFC | Light blue backgrounds |
| `secondary-500` | #0065C2 | Secondary accents |
| `secondary-900` | #001633 | Deep contrast |

### Grey
| Token | Hex | Usage |
|-------|-----|-------|
| `grey-50` | #F9FAFB | Page backgrounds |
| `grey-75` | #F7F9FC | Alternate row backgrounds |
| `grey-100` | #F0F2F5 | Disabled backgrounds, skeleton loading |
| `grey-200` | #E4E7EC | Card borders, dividers |
| `grey-300` | #D0D5DD | Input borders |
| `grey-400` | #98A2B3 | Placeholder text, meta text |
| `grey-500` | #667185 | Secondary/descriptive text |
| `grey-600` | #475367 | Muted text, labels |
| `grey-700` | #344054 | **Body text (primary)** |
| `grey-800` | #1D2739 | Headings, emphasis |
| `grey-900` | #101928 | Highest contrast, page titles |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success-50` | #E7F6EC | Success backgrounds |
| `success-500` | #099137 | Success states, badges |
| `error-50` | #FBEAE9 | Error backgrounds |
| `error-500` | #CB1A14 | Error states, destructive |
| `warning-50` | #FEF6E7 | Warning backgrounds |
| `warning-500` | #DD900D | Warning states |
| `info-400` | #0BA5EC | Info accents |
| `info-500` | #0086C9 | Info states |

### Color Usage Examples
```tsx
// Page background
<div className="min-h-screen bg-grey-50">

// Card
<div className="bg-white rounded-xl border border-grey-200 p-6">

// Text hierarchy
<h2 className="text-grey-900">Page Title</h2>
<h3 className="text-grey-800">Section Heading</h3>
<p className="text-grey-700">Body text</p>
<p className="text-grey-500">Secondary text</p>
<span className="text-grey-400">Meta / timestamp</span>

// Semantic backgrounds for inline alerts
<div className="bg-success-50 border border-success-500 rounded-lg p-4">
<div className="bg-error-50 border border-error-500 rounded-lg p-4">
<div className="bg-warning-50 border border-warning-500 rounded-lg p-4">

// Hover state on interactive elements
<div className="hover:bg-grey-50 transition-colors rounded-lg p-3 cursor-pointer">

// Active / selected state
<div className="bg-primary-50 border border-primary-500 rounded-lg p-3">
```

---

## Typography

```tsx
// Headings
<h1 className="text-display-lg">Display Large (56px)</h1>
<h1 className="text-display-sm">Display Small (48px)</h1>
<h1 className="text-h1">Heading 1 (40px)</h1>
<h2 className="text-h2">Heading 2 (36px)</h2>
<h3 className="text-h3">Heading 3 (32px)</h3>
<h4 className="text-h4">Heading 4 (28px)</h4>
<h5 className="text-h5">Heading 5 (24px)</h5>
<h6 className="text-h6">Heading 6 (20px)</h6>

// Body text
<p className="text-body-lg">Large body (18px)</p>
<p className="text-body-md">Medium body (16px)</p>
<p className="text-body-sm">Small body (14px)</p>
<p className="text-body-xs">Extra small (12px)</p>

// Captions (always uppercase with tracking)
<span className="text-caption-lg uppercase tracking-wider font-medium">Caption Large (14px)</span>
<span className="text-caption-sm uppercase tracking-wider font-medium">Caption Small (12px)</span>
<span className="text-caption-xs uppercase tracking-wider font-medium">Caption XS (10px)</span>
```

### Typography Best Practices
```tsx
// Page header with overline
<div>
  <span className="text-caption-sm uppercase tracking-wider text-primary-500 font-medium">Overview</span>
  <h1 className="text-h3 font-semibold text-grey-900 mt-1">Dashboard</h1>
  <p className="text-body-md text-grey-500 mt-2">Track your key metrics and recent activity.</p>
</div>

// Section header with description
<div>
  <h2 className="text-h6 font-semibold text-grey-800">Billing</h2>
  <p className="text-body-sm text-grey-500 mt-1">Manage your subscription and payment methods.</p>
</div>

// Readable paragraph text
<p className="text-body-md text-grey-700 leading-relaxed max-w-prose">
  Long-form content should use relaxed line height and be constrained
  to a comfortable reading width.
</p>
```

---

## Shadows

```tsx
// Soft shadows (for cards, dropdowns, floating elements)
<div className="shadow-soft-xxs">Minimal lift</div>
<div className="shadow-soft-xs">Cards, subtle elevation</div>
<div className="shadow-soft-sm">Dropdowns, floating panels</div>
<div className="shadow-soft-md">Modals, dialogs</div>
<div className="shadow-soft-lg">Prominent floating elements</div>
<div className="shadow-soft-xl">Extra large</div>
<div className="shadow-soft-2xl">2X large</div>
<div className="shadow-soft-3xl">Maximum elevation</div>

// Hard shadows (for buttons, interactive elements)
<div className="shadow-hard-xxs">Button shadow</div>
<div className="shadow-hard-xs">Elevated button</div>
<div className="shadow-hard-sm">Small</div>
<div className="shadow-hard-md">Medium</div>
```

### Shadow Usage Guide
| Context | Recommended Shadow |
|---------|-------------------|
| Cards at rest | `shadow-soft-xs` or `border border-grey-200` (not both) |
| Cards on hover | `shadow-soft-sm` with `transition-shadow` |
| Dropdowns / popovers | `shadow-soft-sm` |
| Modals / dialogs | `shadow-soft-md` |
| Sticky headers | `shadow-soft-xxs` |
| Floating action buttons | `shadow-soft-sm` |

---

## Blur Tokens

```tsx
// Backdrop blur for overlays and frosted glass effects
<div className="backdrop-blur-xs">Subtle blur (2px)</div>
<div className="backdrop-blur-sm">Light blur (4px)</div>
<div className="backdrop-blur-md">Medium blur (12px)</div>
<div className="backdrop-blur-lg">Strong blur (16px)</div>
<div className="backdrop-blur-xl">Maximum blur (20px)</div>

// Frosted glass overlay pattern
<div className="bg-white/80 backdrop-blur-md border border-grey-200 rounded-xl p-6">
  {/* Content with frosted glass effect */}
</div>
```

---

## Spacing Scale

Use Tailwind spacing utilities. The scale is based on 4px increments.

| Class | Size | Pixels | Common Use |
|-------|------|--------|------------|
| `p-1`, `m-1`, `gap-1` | 0.25rem | 4px | Tight icon gaps |
| `p-2`, `m-2`, `gap-2` | 0.5rem | 8px | Inline element gaps |
| `p-3`, `m-3`, `gap-3` | 0.75rem | 12px | Small component padding |
| `p-4`, `m-4`, `gap-4` | 1rem | 16px | Form field gaps |
| `p-5`, `m-5`, `gap-5` | 1.25rem | 20px | Component padding |
| `p-6`, `m-6`, `gap-6` | 1.5rem | 24px | Card padding, grid gaps |
| `p-8`, `m-8`, `gap-8` | 2rem | 32px | Section spacing |
| `p-10`, `m-10`, `gap-10` | 2.5rem | 40px | Large section gaps |
| `p-12`, `m-12`, `gap-12` | 3rem | 48px | Page padding |
| `p-16`, `m-16`, `gap-16` | 4rem | 64px | Hero sections |
| `p-20`, `m-20`, `gap-20` | 5rem | 80px | Extra large spacing |
| `p-24`, `m-24`, `gap-24` | 6rem | 96px | Generous vertical space |

---

## Responsive Design

### Breakpoints
| Prefix | Min Width | Typical Use |
|--------|-----------|-------------|
| (none) | 0px | Mobile-first base styles |
| `sm:` | 320px | Small mobile adjustments |
| `md:` | 600px | Tablet layouts |
| `lg:` | 1136px | Desktop layouts |

### Responsive Patterns
```tsx
// Responsive grid — stacks on mobile, expands on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <MetricsCard title="Users" value="12,543" />
  <MetricsCard title="Revenue" value="$89,000" />
  <MetricsCard title="Orders" value="1,234" />
  <MetricsCard title="Conversion" value="3.2%" />
</div>

// Responsive sidebar layout
<div className="flex flex-col lg:flex-row">
  <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-grey-200">
    <SidebarMenu>{/* ... */}</SidebarMenu>
  </aside>
  <main className="flex-1 p-6 lg:p-8">{/* ... */}</main>
</div>

// Responsive text sizing
<h1 className="text-h4 md:text-h3 lg:text-h2 font-semibold text-grey-900">Welcome Back</h1>

// Responsive spacing
<div className="px-4 py-6 md:px-8 md:py-8 lg:px-12 lg:py-12">
```

---

## Transitions and Motion

Rayden UI uses subtle, purposeful transitions. Never add gratuitous animation.

```tsx
// Color transitions (buttons, links, interactive elements)
<div className="transition-colors hover:bg-grey-50">

// Shadow transitions (card hover effects)
<div className="bg-white rounded-xl border border-grey-200 shadow-soft-xs hover:shadow-soft-sm transition-shadow">

// Combined transitions
<div className="transition-all duration-200 hover:bg-grey-50 hover:shadow-soft-xs">

// Transform transitions (chevrons, toggles)
<Icon name="chevron-down" className="transition-transform duration-200 rotate-0 data-[open]:rotate-180" />
```

**Motion rules:**
- Use `transition-colors` for hover/focus color changes
- Use `transition-shadow` for elevation changes on hover
- Use `duration-200` for most transitions (fast, responsive)
- Use `duration-300` for progress bar animations
- Never use `animate-bounce`, `animate-spin` on UI elements (except loading spinners)
- Skeleton loading: `animate-pulse` with `bg-grey-100`

---

## Common Layout Patterns

### Form Layout
```tsx
<form className="space-y-4 max-w-md">
  <Input label="Email" type="email" placeholder="you@example.com" />
  <Input label="Password" type="password" placeholder="Enter password" />
  <Checkbox label="Remember me" />
  <Button variant="primary" className="w-full">Sign In</Button>
</form>
```

### Data Table with Pagination
```tsx
<div className="bg-white rounded-xl border border-grey-200">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Date</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(row => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
          <TableCell><Badge color={row.statusColor}>{row.status}</Badge></TableCell>
          <TableCell className="text-body-sm text-grey-500">{row.date}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <div className="px-6 py-4 border-t border-grey-100 flex items-center justify-between">
    <p className="text-body-xs text-grey-400">Showing 1-10 of {total}</p>
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  </div>
</div>
```

### Dashboard Stats
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <MetricsCard title="Total Users" value="12,543" trend={{ label: "+12%", type: "up" }} />
  <MetricsCard title="Revenue" value="$89,000" trend={{ label: "+8%", type: "up" }} />
  <MetricsCard title="Orders" value="1,234" trend={{ label: "-3%", type: "down" }} />
  <MetricsCard title="Conversion" value="3.2%" statusBadge={{ label: "Good", color: "success" }} />
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
  <EmptyStateIllustration name="no-data" size="lg" />
  <h3 className="text-h5 font-semibold text-grey-900 mt-8">No projects yet</h3>
  <p className="text-body-md text-grey-500 mt-3 leading-relaxed">
    Get started by creating your first project
  </p>
  <Button variant="primary" icon="plus" iconPosition="leading" className="mt-8">
    Create Project
  </Button>
</div>
```

### Sidebar App Shell
```tsx
<div className="flex min-h-screen bg-grey-50">
  {/* Sidebar */}
  <aside className="w-64 shrink-0 bg-white border-r border-grey-200">
    <div className="p-6">
      <h1 className="text-h6 font-semibold text-grey-900">App Name</h1>
    </div>
    <SidebarMenu>
      <SidebarMenuSection label="Main">
        <SidebarMenuItem icon="home" active>Dashboard</SidebarMenuItem>
        <SidebarMenuItem icon="users">Team</SidebarMenuItem>
        <SidebarMenuItem icon="folder">Projects</SidebarMenuItem>
      </SidebarMenuSection>
    </SidebarMenu>
  </aside>

  {/* Main content */}
  <div className="flex-1 flex flex-col">
    <header className="bg-white border-b border-grey-200 px-8 py-4 flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Dashboard</BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <Button icon="bell" iconPosition="icon-only" variant="text" aria-label="Notifications" />
        <Avatar src="/user.jpg" alt="User" />
      </div>
    </header>
    <main className="flex-1 p-8">
      {/* Page content */}
    </main>
  </div>
</div>
```

### Split Form Layout (Two Column)
```tsx
<div className="max-w-4xl mx-auto py-12 px-6 space-y-10">
  {/* Each section: description left, form right */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h2 className="text-h6 font-semibold text-grey-800">Profile</h2>
      <p className="text-body-sm text-grey-500 mt-2">
        This information will be displayed publicly so be careful what you share.
      </p>
    </div>
    <div className="md:col-span-2 bg-white rounded-xl border border-grey-200 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First name" />
        <Input label="Last name" />
      </div>
      <Input label="Email" type="email" leadingIcon="mail" />
      <Input label="Bio" placeholder="Tell us about yourself" />
    </div>
  </div>

  <Divider />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h2 className="text-h6 font-semibold text-grey-800">Notifications</h2>
      <p className="text-body-sm text-grey-500 mt-2">
        Choose how you want to be notified.
      </p>
    </div>
    <div className="md:col-span-2 bg-white rounded-xl border border-grey-200 p-6 space-y-4">
      <Toggle label="Email notifications" />
      <Toggle label="Push notifications" />
      <Toggle label="SMS notifications" />
    </div>
  </div>
</div>
```

---

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels (use `label` prop)
- [ ] Color is not the only indicator of state (use icons/text too)
- [ ] Focus states are visible (built-in with `focus-visible:` ring)
- [ ] Contrast ratios meet WCAG AA (grey-700 on white = 4.5:1+)
- [ ] Radio groups are wrapped in `role="radiogroup"`
- [ ] Tables use proper `TableHeader` / `TableHead` for screen readers
- [ ] Meaningful alt text on all `Avatar` components
- [ ] Error messages are associated with their inputs via `error` prop

---

## Alias Reference

If you see these names, use the correct Rayden UI component:

| Alias | Use Instead |
|-------|-------------|
| `Btn`, `CTA`, `Submit`, `ActionButton` | `Button` |
| `TextInput`, `TextField`, `TextBox` | `Input` |
| `Dropdown`, `Picker` | `Select` |
| `DataTable`, `DataGrid` | `Table` |
| `Nav`, `Navigation`, `Sidebar` | `SidebarMenu` |
| `Menu`, `ContextMenu` | `DropdownMenu` |
| `Toast`, `Notification`, `Snackbar` | `Alert` |
| `Tag`, `Label`, `Pill` | `Badge` |
| `Loading`, `Loader`, `LoadingSpinner` | `Spinner` |
| `Switch` | `Toggle` |
| `TabList`, `TabGroup` | `Tabs` |
| `Check` | `Checkbox` |
| `Separator`, `HR` | `Divider` |
| `Card`, `Panel`, `Surface` | `<div>` with Tailwind classes |
| `Dialog`, `Popup`, `Lightbox` | `Modal` |
| `Collapse`, `Collapsible`, `Expandable` | `Accordion` |
| `Range`, `RangeInput`, `SliderInput` | `Slider` or `RangeSlider` |
| `Calendar`, `DateInput`, `DateField` | `DatePicker` |
| `Steps`, `Wizard`, `ProgressSteps` | `Stepper` or `LinearStepper` |
| `Timeline` | `ActivityFeed` |
| `Chart`, `Graph`, `Visualization` | `RaydenChart` |
| `Skeleton` | `<div className="animate-pulse bg-grey-100">` |

---

## Final Checklist Before Generating Code

### Correctness
1. Is every component in this file? If not, don't use it
2. Is every prop documented for that component? If not, don't use it
3. Am I using token classes (`bg-primary-500`) not hex values?
4. For compound components, is the nesting correct?
5. Do icon-only buttons have `aria-label`?
6. Am I using `size="sm"` or `size="lg"` (not `size="md"` for Buttons)?

### Design Quality
7. Does the layout have generous whitespace? (`p-6`+ for containers, `space-y-6`+ between sections)
8. Is there a clear visual hierarchy? (title → subtitle → body → meta)
9. Is color used with restraint? (one primary action per section, neutral base)
10. Are cards/containers using consistent radius and elevation?
11. Is content width constrained? (`max-w-*` on content areas)
12. Are all three states handled? (data, empty, error)
13. Does it look good on mobile, tablet, and desktop?

---

*Generated by @raydenui/ai — The Rayden UI AI compatibility layer*
