# Avatar

Display user avatars with images, initials, or icons. Supports status indicators and grouping.

## Import

```tsx
import { Avatar, AvatarGroup } from "@raydenui/ui";
import type { AvatarProps, AvatarGroupProps, AvatarType, AvatarSize, AvatarStatus } from "@raydenui/ui";
```

## Usage

### Image Avatar

```tsx
<Avatar
  type="image"
  src="https://example.com/avatar.jpg"
  alt="John Doe"
/>
```

### Initials Avatar

```tsx
<Avatar type="initials" initials="JD" />
<Avatar type="initials" initials="AB" size="lg" />
```

### Icon Avatar

```tsx
<Avatar type="icon" />  {/* Default user icon */}
<Avatar type="icon" icon="settings" />
<Avatar type="icon" icon={<CustomIcon />} />
```

### Sizes

```tsx
<Avatar type="initials" initials="XS" size="xs" />  {/* 24px */}
<Avatar type="initials" initials="SM" size="sm" />  {/* 32px */}
<Avatar type="initials" initials="MD" size="md" />  {/* 40px - default */}
<Avatar type="initials" initials="LG" size="lg" />  {/* 48px */}
<Avatar type="initials" initials="XL" size="xl" />  {/* 56px */}
<Avatar type="initials" initials="2X" size="2xl" /> {/* 64px */}
```

### Status Indicators

Show online/offline status or verified badge:

```tsx
<Avatar type="image" src="..." status="online" />
<Avatar type="image" src="..." status="offline" />
<Avatar type="image" src="..." status="verified" />
<Avatar type="image" src="..." status="none" />  {/* default */}
```

### Avatar Group

Display a stack of avatars with overflow indicator:

```tsx
<AvatarGroup max={3}>
  <Avatar type="image" src="..." />
  <Avatar type="image" src="..." />
  <Avatar type="image" src="..." />
  <Avatar type="image" src="..." />
  <Avatar type="image" src="..." />
</AvatarGroup>
{/* Shows 3 avatars + "+2" overflow */}
```

### Avatar Group Sizes

```tsx
<AvatarGroup size="sm">...</AvatarGroup>  {/* xs avatars */}
<AvatarGroup size="md">...</AvatarGroup>  {/* sm avatars - default */}
<AvatarGroup size="lg">...</AvatarGroup>  {/* md avatars */}
```

## API Reference

### AvatarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"image" \| "icon" \| "initials"` | `"image"` | Visual type of the avatar |
| `size` | `AvatarSize` | `"md"` | Size preset |
| `status` | `AvatarStatus` | `"none"` | Status indicator at bottom-right |
| `src` | `string` | — | Image URL (for `type="image"`) |
| `alt` | `string` | `""` | Alt text (for `type="image"`) |
| `initials` | `string` | — | Initials text (for `type="initials"`) |
| `icon` | `ReactNode \| IconName` | `"user"` | Custom icon (for `type="icon"`) |

### AvatarSize

```ts
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
```

| Size | Pixels |
|------|--------|
| `xs` | 24px |
| `sm` | 32px |
| `md` | 40px |
| `lg` | 48px |
| `xl` | 56px |
| `2xl` | 64px |

### AvatarStatus

```ts
type AvatarStatus = "none" | "online" | "offline" | "verified";
```

- `none` — No status indicator (default)
- `online` — Green dot
- `offline` — Grey dot
- `verified` — Blue checkmark badge

### AvatarGroupProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of avatars in the group |
| `max` | `number` | — | Maximum visible avatars before "+N" overflow |

## Examples

### In a Table Row

```tsx
<TableCell>
  <div className="flex items-center gap-3">
    <Avatar
      type="initials"
      initials="JD"
      size="md"
      status="online"
    />
    <div>
      <p className="font-medium">John Doe</p>
      <p className="text-grey-500">john@example.com</p>
    </div>
  </div>
</TableCell>
```

### Team Members

```tsx
<div className="flex items-center gap-2">
  <AvatarGroup max={4} size="md">
    {teamMembers.map((member) => (
      <Avatar
        key={member.id}
        type="image"
        src={member.avatar}
        alt={member.name}
      />
    ))}
  </AvatarGroup>
  <span className="text-sm text-grey-500">
    {teamMembers.length} team members
  </span>
</div>
```
