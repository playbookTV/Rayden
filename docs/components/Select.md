# Select

A dropdown select component with support for icons, avatars, status indicators, and descriptions.

## Import

```tsx
import { Select, SelectOption } from "@raydenui/ui";
import type { SelectProps, SelectOptionProps } from "@raydenui/ui";
```

## Usage

### Basic Select

```tsx
const [value, setValue] = useState("");

<Select
  label="Country"
  placeholder="Select a country"
  value={value}
  onValueChange={setValue}
>
  <SelectOption value="us">United States</SelectOption>
  <SelectOption value="uk">United Kingdom</SelectOption>
  <SelectOption value="ca">Canada</SelectOption>
  <SelectOption value="au">Australia</SelectOption>
</Select>
```

### Uncontrolled

```tsx
<Select
  label="Role"
  defaultValue="viewer"
  onValueChange={(value) => console.log(value)}
>
  <SelectOption value="admin">Admin</SelectOption>
  <SelectOption value="editor">Editor</SelectOption>
  <SelectOption value="viewer">Viewer</SelectOption>
</Select>
```

### With Icons

```tsx
<Select label="Category" placeholder="Select category">
  <SelectOption value="design" icon="palette">
    Design
  </SelectOption>
  <SelectOption value="development" icon="code">
    Development
  </SelectOption>
  <SelectOption value="marketing" icon="megaphone">
    Marketing
  </SelectOption>
</Select>
```

### With Avatars

```tsx
<Select label="Assignee" placeholder="Select team member">
  <SelectOption
    value="john"
    avatar={<Avatar type="image" src="..." size="sm" />}
  >
    John Doe
  </SelectOption>
  <SelectOption
    value="jane"
    avatar={<Avatar type="image" src="..." size="sm" />}
  >
    Jane Smith
  </SelectOption>
  <SelectOption
    value="bob"
    avatar={<Avatar type="initials" initials="BW" size="sm" />}
  >
    Bob Wilson
  </SelectOption>
</Select>
```

### With Status Colors

```tsx
<Select label="Status" placeholder="Select status">
  <SelectOption value="online" statusColor="#0F973D">
    Online
  </SelectOption>
  <SelectOption value="away" statusColor="#F3A218">
    Away
  </SelectOption>
  <SelectOption value="busy" statusColor="#D42620">
    Busy
  </SelectOption>
  <SelectOption value="offline" statusColor="#98A2B3">
    Offline
  </SelectOption>
</Select>
```

### With Descriptions

```tsx
<Select label="Plan" placeholder="Select plan">
  <SelectOption value="free" description="Basic features for individuals">
    Free
  </SelectOption>
  <SelectOption value="pro" description="Advanced features for professionals">
    Pro - $9/mo
  </SelectOption>
  <SelectOption value="team" description="Collaboration tools for teams">
    Team - $29/mo
  </SelectOption>
</Select>
```

### With Helper Text

```tsx
<Select
  label="Language"
  helperText="This will be used for all communications"
  placeholder="Select language"
>
  <SelectOption value="en">English</SelectOption>
  <SelectOption value="es">Spanish</SelectOption>
  <SelectOption value="fr">French</SelectOption>
</Select>
```

### Disabled

```tsx
<Select
  label="Region"
  placeholder="Select region"
  disabled
>
  <SelectOption value="us">United States</SelectOption>
  <SelectOption value="eu">Europe</SelectOption>
</Select>
```

## API Reference

### SelectProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | `""` | Uncontrolled default value |
| `onValueChange` | `(value: string) => void` | — | Called when value changes |
| `placeholder` | `string` | `"Select an option"` | Placeholder text |
| `label` | `string` | — | Label text above the select |
| `helperText` | `string` | — | Helper text below the select |
| `disabled` | `boolean` | `false` | Disable the select |
| `wrapperClassName` | `string` | — | Class for the wrapper div |
| `className` | `string` | — | Class for the trigger button |

### SelectOptionProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Option value (required) |
| `icon` | `ReactNode \| IconName` | — | Leading icon |
| `avatar` | `ReactNode` | — | Leading avatar element |
| `statusColor` | `string` | — | Status dot color (hex) |
| `description` | `string` | — | Secondary description text |
| `disabled` | `boolean` | `false` | Disable this option |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open/close dropdown, select option |
| `ArrowDown` | Move focus to next option |
| `ArrowUp` | Move focus to previous option |
| `Home` | Move focus to first option |
| `End` | Move focus to last option |
| `Escape` | Close the dropdown |

## Examples

### Form with Select

```tsx
function UserForm() {
  const [role, setRole] = useState("viewer");
  const [department, setDepartment] = useState("");

  return (
    <form className="space-y-6">
      <Input label="Name" placeholder="Enter name" />
      <Input label="Email" type="email" placeholder="Enter email" />

      <Select
        label="Role"
        value={role}
        onValueChange={setRole}
      >
        <SelectOption value="admin" icon="shield">
          Admin
        </SelectOption>
        <SelectOption value="editor" icon="edit">
          Editor
        </SelectOption>
        <SelectOption value="viewer" icon="eye">
          Viewer
        </SelectOption>
      </Select>

      <Select
        label="Department"
        placeholder="Select department"
        value={department}
        onValueChange={setDepartment}
      >
        <SelectOption value="engineering">Engineering</SelectOption>
        <SelectOption value="design">Design</SelectOption>
        <SelectOption value="marketing">Marketing</SelectOption>
        <SelectOption value="sales">Sales</SelectOption>
      </Select>

      <Button type="submit" variant="primary">
        Save User
      </Button>
    </form>
  );
}
```

### Team Member Selector

```tsx
<Select
  label="Project Lead"
  placeholder="Assign a lead"
  value={lead}
  onValueChange={setLead}
>
  {teamMembers.map((member) => (
    <SelectOption
      key={member.id}
      value={member.id}
      avatar={
        <Avatar
          type="image"
          src={member.avatar}
          size="sm"
          status={member.online ? "online" : "offline"}
        />
      }
      description={member.role}
    >
      {member.name}
    </SelectOption>
  ))}
</Select>
```
