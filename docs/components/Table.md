# Table

A composable data table with sorting, row selection, and customizable cells.

## Import

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@raydenui/ui";
import type {
  TableProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  SortDirection,
} from "@raydenui/ui";
```

## Usage

### Basic Table

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
        <TableCell>{user.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### With Sorting

```tsx
const [sortCol, setSortCol] = useState<string | null>(null);
const [sortDir, setSortDir] = useState<SortDirection>(null);

const handleSort = (col: string) => {
  if (sortCol === col) {
    setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
    if (sortDir === "desc") setSortCol(null);
  } else {
    setSortCol(col);
    setSortDir("asc");
  }
};

<Table>
  <TableHeader>
    <TableRow>
      <TableHead
        sortable
        sortDirection={sortCol === "name" ? sortDir : null}
        onSort={() => handleSort("name")}
      >
        Name
      </TableHead>
      <TableHead
        sortable
        sortDirection={sortCol === "email" ? sortDir : null}
        onSort={() => handleSort("email")}
      >
        Email
      </TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sortedUsers.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### With Row Selection

```tsx
const [selected, setSelected] = useState<Set<string>>(new Set());

const allSelected = selected.size === users.length;
const someSelected = selected.size > 0 && !allSelected;

const toggleAll = () => {
  setSelected(allSelected ? new Set() : new Set(users.map((u) => u.id)));
};

const toggleRow = (id: string) => {
  setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

<Table>
  <TableHeader>
    <TableRow selected={allSelected || someSelected}>
      <TableHead className="w-12">
        <Checkbox
          checked={allSelected}
          onChange={toggleAll}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
        />
      </TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id} selected={selected.has(user.id)}>
        <TableCell className="w-12">
          <Checkbox
            checked={selected.has(user.id)}
            onChange={() => toggleRow(user.id)}
          />
        </TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### With Avatars and Badges

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Member</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar
              type="initials"
              initials={user.initials}
              size="md"
              status="online"
            />
            <div>
              <p className="font-medium text-grey-900">{user.name}</p>
              <p className="text-sm text-grey-500">{user.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
          <Badge
            color={user.status === "Active" ? "success" : "neutral"}
            type="accent"
            size="sm"
          >
            {user.status}
          </Badge>
        </TableCell>
        <TableCell>
          <button className="text-primary-400">Edit</button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## API Reference

### TableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |

### TableRowProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | `boolean` | `false` | Whether this row is selected |
| `className` | `string` | — | Additional CSS classes |

### TableHeadProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortable` | `boolean` | `false` | Enable sort indicator |
| `sortDirection` | `SortDirection` | — | Current sort direction |
| `onSort` | `() => void` | — | Called when sort is clicked |
| `className` | `string` | — | Additional CSS classes |

### TableCellProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |

### SortDirection

```ts
type SortDirection = "asc" | "desc" | null;
```

## Styling

### Cell Heights

Table cells have a default height of `72px`. Customize with Tailwind:

```tsx
<TableCell className="h-14">Shorter cell</TableCell>
<TableCell className="h-20">Taller cell</TableCell>
```

### Column Widths

Control column widths on `TableHead` or `TableCell`:

```tsx
<TableHead className="w-12">Select</TableHead>
<TableHead className="w-64">Name</TableHead>
<TableHead className="w-20">Actions</TableHead>
```

### Selected Row Styling

Selected rows automatically get a `bg-primary-50` background. The `selected` prop also sets `aria-selected` for accessibility.

## Full Example

```tsx
function UsersTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const sorted = [...users].sort((a, b) => {
    if (!sortCol || !sortDir) return 0;
    const aVal = a[sortCol as keyof typeof a];
    const bVal = b[sortCol as keyof typeof b];
    return sortDir === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  return (
    <div className="rounded-xl border border-grey-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow selected={selected.size > 0}>
            <TableHead className="w-12">
              <Checkbox ... />
            </TableHead>
            <TableHead sortable sortDirection={...} onSort={...}>
              Member
            </TableHead>
            <TableHead sortable sortDirection={...} onSort={...}>
              Role
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((user) => (
            <TableRow key={user.id} selected={selected.has(user.id)}>
              {/* ... cells ... */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```
