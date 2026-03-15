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
  // Feedback
  Alert, ProgressBar, ProgressCircle,
  // Navigation
  Tabs, Tab, Breadcrumb, BreadcrumbItem, Pagination,
  SidebarMenu, SidebarMenuSection, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
  // Data Display
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Avatar, AvatarGroup, MetricsCard, EmptyStateIllustration,
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

## Available Components (23 Total)

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

### Feedback
| Component | Description |
|-----------|-------------|
| `Alert` | Toast or banner notification |
| `ProgressBar` | Linear progress indicator |
| `ProgressCircle` | Circular progress/spinner |

### Navigation
| Component | Description |
|-----------|-------------|
| `Tabs` + `Tab` | Tabbed navigation |
| `Breadcrumb` + `BreadcrumbItem` | Navigation breadcrumbs |
| `Pagination` | Page navigation |
| `SidebarMenu` | Vertical navigation sidebar |

### Data Display
| Component | Description |
|-----------|-------------|
| `Table` | Data table (compound component) |
| `Avatar` + `AvatarGroup` | User profile images |
| `MetricsCard` | KPI/statistics display |
| `EmptyStateIllustration` | Empty state artwork |

### Composite
| Component | Description |
|-----------|-------------|
| `ButtonGroup` + `ButtonGroupItem` | Connected button group |
| `DropdownMenu` | Dropdown menu (compound) |
| `FileUpload` | File upload with dropzone |

---

## Components That DO NOT Exist

**DO NOT use these — they will not work:**

- `Modal`, `Dialog`, `Popup`, `Overlay`, `Lightbox`
- `Card`, `Panel`, `Box`, `Container`, `Paper`, `Surface`
- `Accordion`, `Collapse`, `Collapsible`, `Expandable`
- `Carousel`, `Slider`, `RangeSlider`, `Range`
- `DatePicker`, `TimePicker`, `DateTimePicker`, `Calendar`
- `ColorPicker`
- `Tree`, `TreeView`, `TreeSelect`
- `Drawer`, `Sheet`, `BottomSheet`, `SideSheet`
- `HoverCard`, `Popover` (use `Tooltip` or `DropdownMenu`)
- `Command`, `CommandPalette`, `CommandMenu`
- `Autocomplete`, `AutoComplete`, `TypeAhead`
- `Skeleton`, `Shimmer`
- `AspectRatio`, `ScrollArea`, `ScrollView`
- `Stepper`, `Steps`, `Wizard`
- `Timeline`
- `Rating`, `Stars`, `StarRating`
- `Stack`, `Flex`, `Grid`, `Center`, `Wrap`, `VStack`, `HStack`, `Spacer`
- `Portal`, `VisuallyHidden`
- `ResizablePanel`, `Splitter`

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

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `color="red"` | `variant="destructive"` |
| `color="primary"` | `variant="primary"` |
| `outline` or `outline={true}` | `appearance="outlined"` |
| `size="medium"` or `size="md"` | `size="sm"` (only sm and lg exist) |
| `leftIcon={<Icon />}` | `icon={<Icon />} iconPosition="leading"` |
| `rightIcon={<Icon />}` | `icon={<Icon />} iconPosition="trailing"` |
| `loading` or `isLoading` | Not supported — disable button and show separate spinner |
| `fullWidth` or `block` | `className="w-full"` |
| `href="/path"` | Use `<a>` or router Link component wrapping Button |

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

| ❌ Wrong | ✅ Correct |
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

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `<Table data={[...]} columns={[...]} />` | Map data to `<TableRow>` components manually |
| `<th>` | `<TableHead>` |
| `<td>` | `<TableCell>` |
| `<thead>` | `<TableHeader>` |
| `<tbody>` | `<TableBody>` |
| `pagination` prop | Use separate `<Pagination>` component below table |

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

| ❌ Wrong | ✅ Correct |
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

| ❌ Wrong | ✅ Correct |
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

| ❌ Wrong | ✅ Correct |
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
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

<div className="text-center py-12">
  <EmptyStateIllustration name="no-data" />
  <h3 className="text-h5 font-semibold mt-4">No data yet</h3>
  <p className="text-body-sm text-grey-500 mt-2">Start by adding some items</p>
  <Button variant="primary" className="mt-4">Add Item</Button>
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

## Color Tokens

Use Tailwind classes with these tokens — never use raw hex values.

### Primary (Orange)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | #FFECE5 | Light backgrounds |
| `primary-100` | #FCB59A | Borders |
| `primary-400` | #F56630 | Hover states |
| `primary-500` | #EB5017 | **Primary button default** |
| `primary-600` | #CC400C | Links, active states |
| `primary-700` | #AD3307 | Focus rings |

### Grey
| Token | Hex | Usage |
|-------|-----|-------|
| `grey-50` | #F9FAFB | Page backgrounds |
| `grey-100` | #F0F2F5 | Disabled backgrounds |
| `grey-200` | #E4E7EC | Card borders |
| `grey-300` | #D0D5DD | Input borders |
| `grey-400` | #98A2B3 | Placeholder text |
| `grey-500` | #667185 | Secondary text |
| `grey-600` | #475367 | Muted text |
| `grey-700` | #344054 | **Body text (primary)** |
| `grey-800` | #1D2739 | Headings |
| `grey-900` | #101928 | Highest contrast |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success-500` | #099137 | Success states |
| `error-500` | #CB1A14 | Error states |
| `warning-500` | #DD900D | Warning states |
| `info-500` | #0086C9 | Info states |

### Examples
```tsx
// Backgrounds
<div className="bg-primary-500">Primary bg</div>
<div className="bg-grey-50">Page bg</div>

// Text
<p className="text-grey-700">Body text</p>
<p className="text-grey-500">Secondary text</p>
<p className="text-error-500">Error message</p>

// Borders
<div className="border border-grey-200">Card</div>
<div className="border-2 border-primary-500">Focus</div>
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

// Captions
<span className="text-caption-lg uppercase tracking-wider">Caption Large</span>
<span className="text-caption-sm uppercase tracking-wider">Caption Small</span>
```

---

## Shadows

```tsx
// Soft shadows (for cards, dropdowns)
<div className="shadow-soft-xxs">Minimal shadow</div>
<div className="shadow-soft-xs">Extra small</div>
<div className="shadow-soft-sm">Small</div>
<div className="shadow-soft-md">Medium (modals)</div>
<div className="shadow-soft-lg">Large</div>
<div className="shadow-soft-xl">Extra large</div>
<div className="shadow-soft-2xl">2X large</div>
<div className="shadow-soft-3xl">3X large</div>

// Hard shadows (for buttons, interactive elements)
<div className="shadow-hard-xxs">Button shadow</div>
<div className="shadow-hard-xs">Elevated button</div>
<div className="shadow-hard-sm">Small</div>
<div className="shadow-hard-md">Medium</div>
```

---

## Spacing Scale

Use Tailwind spacing utilities. The scale is based on 4px increments.

| Class | Size | Pixels |
|-------|------|--------|
| `p-1`, `m-1`, `gap-1` | 0.25rem | 4px |
| `p-2`, `m-2`, `gap-2` | 0.5rem | 8px |
| `p-3`, `m-3`, `gap-3` | 0.75rem | 12px |
| `p-4`, `m-4`, `gap-4` | 1rem | 16px |
| `p-5`, `m-5`, `gap-5` | 1.25rem | 20px |
| `p-6`, `m-6`, `gap-6` | 1.5rem | 24px |
| `p-8`, `m-8`, `gap-8` | 2rem | 32px |
| `p-10`, `m-10`, `gap-10` | 2.5rem | 40px |
| `p-12`, `m-12`, `gap-12` | 3rem | 48px |
| `p-16`, `m-16`, `gap-16` | 4rem | 64px |

---

## Common Layout Patterns

### Form Layout
```tsx
<form className="space-y-4 max-w-md">
  <Input label="Email" type="email" placeholder="you@example.com" />
  <Input label="Password" type="password" placeholder="••••••••" />
  <Checkbox label="Remember me" />
  <Button variant="primary" className="w-full">Sign In</Button>
</form>
```

### Data Table with Pagination
```tsx
<div className="space-y-4">
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
          <TableCell>{row.date}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
</div>
```

### Dashboard Stats
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricsCard title="Total Users" value="12,543" trend={{ label: "+12%", type: "up" }} />
  <MetricsCard title="Revenue" value="$89,000" trend={{ label: "+8%", type: "up" }} />
  <MetricsCard title="Orders" value="1,234" trend={{ label: "-3%", type: "down" }} />
  <MetricsCard title="Conversion" value="3.2%" statusBadge={{ label: "Good", color: "success" }} />
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <EmptyStateIllustration name="no-data" size="lg" />
  <h3 className="text-h5 font-semibold mt-6">No projects yet</h3>
  <p className="text-body-md text-grey-500 mt-2 max-w-sm">
    Get started by creating your first project
  </p>
  <Button variant="primary" icon="plus" iconPosition="leading" className="mt-6">
    Create Project
  </Button>
</div>
```

---

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Color is not the only indicator of state (use icons/text too)
- [ ] Focus states are visible
- [ ] Contrast ratios meet WCAG AA (grey-700 on white = 4.5:1+)

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
| `Spinner`, `Loading`, `Loader` | `ProgressCircle` |
| `Switch` | `Toggle` |
| `TabList`, `TabGroup` | `Tabs` |
| `Check` | `Checkbox` |
| `Separator`, `HR` | `Divider` |

---

## Final Checklist Before Generating Code

1. ✅ Is every component in this file? If not, don't use it
2. ✅ Is every prop documented for that component? If not, don't use it
3. ✅ Am I using token classes (`bg-primary-500`) not hex values?
4. ✅ For compound components, is the nesting correct?
5. ✅ Do icon-only buttons have `aria-label`?
6. ✅ Am I using `size="sm"` or `size="lg"` (not `size="md"`)?

---

*Generated by @raydenui/ai — The Rayden UI AI compatibility layer*
