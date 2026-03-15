# DropdownMenu

An accessible dropdown menu with keyboard navigation, icons, shortcuts, and selection states.

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@raydenui/ui";
import type {
  DropdownMenuProps,
  DropdownMenuItemProps,
  DropdownMenuContentProps,
} from "@raydenui/ui";
```

## Usage

### Basic Dropdown

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="grey" appearance="outlined">
      Options
      <Icon name="chevron-down" size="sm" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => console.log("Edit")}>
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => console.log("Duplicate")}>
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => console.log("Delete")}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Icons

```tsx
<DropdownMenuContent>
  <DropdownMenuItem icon="edit" onSelect={() => {}}>
    Edit
  </DropdownMenuItem>
  <DropdownMenuItem icon="copy" onSelect={() => {}}>
    Duplicate
  </DropdownMenuItem>
  <DropdownMenuItem icon="download" onSelect={() => {}}>
    Download
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem icon="trash" onSelect={() => {}}>
    Delete
  </DropdownMenuItem>
</DropdownMenuContent>
```

### With Keyboard Shortcuts

```tsx
<DropdownMenuContent>
  <DropdownMenuItem icon="copy" shortcut="⌘C" onSelect={() => {}}>
    Copy
  </DropdownMenuItem>
  <DropdownMenuItem icon="clipboard" shortcut="⌘V" onSelect={() => {}}>
    Paste
  </DropdownMenuItem>
  <DropdownMenuItem icon="scissors" shortcut="⌘X" onSelect={() => {}}>
    Cut
  </DropdownMenuItem>
</DropdownMenuContent>
```

### With Selection State

```tsx
const [selected, setSelected] = useState("option1");

<DropdownMenuContent>
  <DropdownMenuItem
    selected={selected === "option1"}
    onSelect={() => setSelected("option1")}
  >
    Option 1
  </DropdownMenuItem>
  <DropdownMenuItem
    selected={selected === "option2"}
    onSelect={() => setSelected("option2")}
  >
    Option 2
  </DropdownMenuItem>
  <DropdownMenuItem
    selected={selected === "option3"}
    onSelect={() => setSelected("option3")}
  >
    Option 3
  </DropdownMenuItem>
</DropdownMenuContent>
```

### With Groups and Labels

```tsx
<DropdownMenuContent>
  <DropdownMenuLabel description="john@example.com">
    John Doe
  </DropdownMenuLabel>
  <DropdownMenuSeparator />

  <DropdownMenuGroup>
    <DropdownMenuItem icon="user">Profile</DropdownMenuItem>
    <DropdownMenuItem icon="settings">Settings</DropdownMenuItem>
  </DropdownMenuGroup>

  <DropdownMenuSeparator />

  <DropdownMenuGroup>
    <DropdownMenuItem icon="log-out">Sign out</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

### Disabled Items

```tsx
<DropdownMenuContent>
  <DropdownMenuItem icon="edit" onSelect={() => {}}>
    Edit
  </DropdownMenuItem>
  <DropdownMenuItem icon="archive" disabled>
    Archive (disabled)
  </DropdownMenuItem>
  <DropdownMenuItem icon="trash" onSelect={() => {}}>
    Delete
  </DropdownMenuItem>
</DropdownMenuContent>
```

### Controlled State

```tsx
const [open, setOpen] = useState(false);

<DropdownMenu open={open} onOpenChange={setOpen}>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    {/* ... */}
  </DropdownMenuContent>
</DropdownMenu>
```

## API Reference

### DropdownMenuProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open changes |

### DropdownMenuContentProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "end"` | `"end"` | Alignment relative to trigger |
| `sideOffset` | `number` | `4` | Gap from trigger in pixels |

### DropdownMenuItemProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode \| IconName` | — | Leading icon |
| `shortcut` | `string` | — | Keyboard shortcut label |
| `selected` | `boolean` | `false` | Show selection checkmark |
| `disabled` | `boolean` | `false` | Disable the item |
| `onSelect` | `() => void` | — | Called when item is selected |

### DropdownMenuLabelProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `string` | — | Secondary text below title |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Select focused item |
| `ArrowDown` | Move focus to next item |
| `ArrowUp` | Move focus to previous item |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Escape` | Close the menu |

## Examples

### User Profile Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <button className="flex items-center gap-2">
      <Avatar type="image" src="..." size="sm" />
      <Icon name="chevron-down" size="sm" />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel description="john@example.com">
      John Doe
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon="user" onSelect={() => navigate("/profile")}>
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem icon="settings" onSelect={() => navigate("/settings")}>
      Settings
    </DropdownMenuItem>
    <DropdownMenuItem icon="help" onSelect={() => navigate("/help")}>
      Help & Support
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon="log-out" onSelect={handleLogout}>
      Sign out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Table Row Actions

```tsx
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button className="p-2 rounded-lg hover:bg-grey-100">
        <Icon name="more-vertical" size="sm" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem icon="eye" onSelect={() => viewRow(row.id)}>
        View details
      </DropdownMenuItem>
      <DropdownMenuItem icon="edit" onSelect={() => editRow(row.id)}>
        Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem icon="trash" onSelect={() => deleteRow(row.id)}>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
```
