# Blocks

Pre-built, production-ready UI blocks that combine multiple Rayden UI components into common patterns. Blocks are designed to be dropped into your application with minimal configuration.

## Import

```tsx
import {
  NotificationsBlock,
  LoginBlock,
  TableBlock,
  QuickSendBlock,
  RecentTransactionsBlock,
  EmptyStateBlock,
  SearchableTableBlock,
} from "@raydenui/ui/blocks";
```

Or import individually:

```tsx
import { LoginBlock } from "@raydenui/ui/blocks";
```

## Available Blocks

| Block | Description |
|-------|-------------|
| [NotificationsBlock](#notificationsblock) | Notification list with read/unread states |
| [LoginBlock](#loginblock) | Authentication form with social providers |
| [TableBlock](#tableblock) | Data table with header and pagination |
| [QuickSendBlock](#quicksendblock) | Quick money transfer interface |
| [RecentTransactionsBlock](#recenttransactionsblock) | Transaction history list |
| [EmptyStateBlock](#emptystateblock) | Empty state with illustration and CTA |
| [SearchableTableBlock](#searchabletableblock) | Table with search and filters |

---

## NotificationsBlock

A notification panel with support for read/unread states, avatars, and timestamps.

```tsx
<NotificationsBlock
  title="Notifications"
  notifications={[
    {
      id: "1",
      avatar: <Avatar type="image" src="..." />,
      title: "John Doe",
      description: "Mentioned you in a comment",
      time: "5 mins ago",
      unread: true,
    },
    {
      id: "2",
      avatar: <Avatar type="initials" initials="AS" />,
      title: "Alice Smith",
      description: "Shared a document with you",
      time: "1 hour ago",
      unread: false,
    },
  ]}
  onItemClick={(id) => handleNotificationClick(id)}
  onMarkAllRead={() => markAllAsRead()}
/>
```

### NotificationsBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Notifications"` | Header title |
| `notifications` | `NotificationItem[]` | — | Array of notifications (required) |
| `onItemClick` | `(id: string) => void` | — | Click handler |
| `onMarkAllRead` | `() => void` | — | Mark all as read handler |

---

## LoginBlock

A complete authentication form with email/password fields and social login options.

```tsx
<LoginBlock
  variant="signin"
  title="Welcome back"
  subtitle="Sign in to your account"
  onSubmit={async (data) => {
    await signIn(data.email, data.password);
  }}
  socialProviders={["google", "github", "apple"]}
  onSocialLogin={(provider) => handleSocialAuth(provider)}
  forgotPasswordHref="/forgot-password"
  signUpHref="/sign-up"
/>
```

### Variants

```tsx
// Sign In
<LoginBlock variant="signin" />

// Sign Up
<LoginBlock
  variant="signup"
  title="Create an account"
  subtitle="Get started with your free account"
  signInHref="/sign-in"
/>

// Forgot Password
<LoginBlock
  variant="forgot"
  title="Reset your password"
  subtitle="Enter your email to receive a reset link"
/>
```

### LoginBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"signin" \| "signup" \| "forgot"` | `"signin"` | Form variant |
| `title` | `string` | — | Header title |
| `subtitle` | `string` | — | Header subtitle |
| `onSubmit` | `(data: { email, password }) => void` | — | Form submit handler |
| `socialProviders` | `("google" \| "github" \| "apple")[]` | — | Social login buttons |
| `onSocialLogin` | `(provider: string) => void` | — | Social login handler |
| `forgotPasswordHref` | `string` | — | Forgot password link |
| `signUpHref` | `string` | — | Sign up link (signin variant) |
| `signInHref` | `string` | — | Sign in link (signup variant) |

---

## TableBlock

A data table block with header, columns, and built-in pagination.

```tsx
<TableBlock
  title="Team Members"
  description="Manage your team members and their roles"
  columns={["Name", "Email", "Role", "Status"]}
  rows={users.map((user) => ({
    id: user.id,
    cells: [
      <div className="flex items-center gap-3">
        <Avatar type="image" src={user.avatar} size="sm" />
        {user.name}
      </div>,
      user.email,
      user.role,
      <Badge color={user.active ? "success" : "neutral"}>
        {user.active ? "Active" : "Inactive"}
      </Badge>,
    ],
  }))}
  onRowClick={(id) => viewUser(id)}
  pagination={{
    currentPage: page,
    totalPages: 10,
    onPageChange: setPage,
  }}
/>
```

### TableBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Header title |
| `description` | `string` | — | Header description |
| `columns` | `string[]` | — | Column headers (required) |
| `rows` | `TableBlockRow[]` | — | Table rows (required) |
| `onRowClick` | `(id: string) => void` | — | Row click handler |
| `pagination` | `PaginationProps` | — | Pagination config |

---

## QuickSendBlock

A quick money transfer interface with beneficiary selection.

```tsx
<QuickSendBlock
  title="Quick Send"
  beneficiaries={[
    { id: "1", name: "John Doe", avatar: "..." },
    { id: "2", name: "Jane Smith", avatar: "..." },
    { id: "3", name: "Add New", isAddNew: true },
  ]}
  onSend={(beneficiaryId, amount) => sendMoney(beneficiaryId, amount)}
/>
```

### QuickSendBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Quick Send"` | Header title |
| `beneficiaries` | `QuickSendBeneficiary[]` | — | List of recipients (required) |
| `onSend` | `(id, amount) => void` | — | Send handler (required) |

---

## RecentTransactionsBlock

A transaction history list with direction indicators and amounts.

```tsx
<RecentTransactionsBlock
  title="Recent Transactions"
  transactions={[
    {
      id: "1",
      title: "Netflix Subscription",
      date: "Mar 15, 2024",
      amount: 15.99,
      direction: "outgoing",
      icon: "tv",
    },
    {
      id: "2",
      title: "Salary Deposit",
      date: "Mar 1, 2024",
      amount: 5000,
      direction: "incoming",
      icon: "briefcase",
    },
  ]}
  onViewAll={() => navigate("/transactions")}
/>
```

### RecentTransactionsBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Recent Transactions"` | Header title |
| `transactions` | `Transaction[]` | — | Transaction list (required) |
| `onViewAll` | `() => void` | — | View all handler |

---

## EmptyStateBlock

An empty state display with illustration, title, description, and action buttons.

```tsx
<EmptyStateBlock
  variant="no-data"
  title="No projects yet"
  description="Get started by creating your first project"
  primaryAction={{
    label: "Create Project",
    onClick: () => createProject(),
    icon: "plus",
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => openDocs(),
  }}
/>
```

### Variants

| Variant | Use Case |
|---------|----------|
| `no-data` | Empty lists or tables |
| `no-results` | Search with no matches |
| `no-connection` | Network error |
| `error` | General error state |
| `success` | Action completed |
| `empty-inbox` | Empty inbox |
| `empty-folder` | Empty folder |
| `no-notifications` | No notifications |

### EmptyStateBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `EmptyStateBlockVariant` | `"no-data"` | Illustration type |
| `title` | `string` | — | Title text (required) |
| `description` | `string` | — | Description text |
| `primaryAction` | `EmptyStateBlockAction` | — | Primary CTA button |
| `secondaryAction` | `EmptyStateBlockAction` | — | Secondary button |

---

## SearchableTableBlock

A full-featured table with search input, filters, and sortable columns.

```tsx
<SearchableTableBlock
  title="Products"
  searchPlaceholder="Search products..."
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock" },
  ]}
  data={products}
  onSearch={(query) => searchProducts(query)}
  onSort={(key, direction) => sortProducts(key, direction)}
  filters={[
    {
      key: "category",
      label: "Category",
      options: ["Electronics", "Clothing", "Books"],
    },
  ]}
  onFilterChange={(filters) => applyFilters(filters)}
/>
```

### SearchableTableBlockProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Header title |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `columns` | `SearchableTableColumn[]` | — | Column config (required) |
| `data` | `any[]` | — | Table data (required) |
| `onSearch` | `(query: string) => void` | — | Search handler |
| `onSort` | `(key, direction) => void` | — | Sort handler |
| `filters` | `FilterConfig[]` | — | Filter options |
| `onFilterChange` | `(filters) => void` | — | Filter change handler |

---

## Using Blocks in Your App

Blocks are designed to be customizable while providing sensible defaults:

```tsx
import { LoginBlock, EmptyStateBlock } from "@raydenui/ui/blocks";

function AuthPage() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <div className="w-full max-w-md">
          <LoginBlock
            variant="signin"
            onSubmit={async (data) => {
              const user = await signIn(data);
              setUser(user);
            }}
            socialProviders={["google", "github"]}
          />
        </div>
      </div>
    );
  }

  return <Dashboard user={user} />;
}
```

## Customization

Blocks accept a `className` prop for custom styling:

```tsx
<TableBlock
  className="rounded-xl shadow-soft-lg"
  title="Users"
  columns={...}
  rows={...}
/>
```

For deeper customization, consider using the individual components directly from `@raydenui/ui`.
