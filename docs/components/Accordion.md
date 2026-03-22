# Accordion

Collapsible content sections for organizing information.

## Import

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@raydenui/ui";
```

## Usage

```tsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Rayden UI?</AccordionTrigger>
    <AccordionContent>
      Rayden UI is a React component library built with Tailwind CSS.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Types

- `default` - Bottom border style
- `nested` - Full border with rounded corners

## Props

### Accordion

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"default" \| "nested"` | `"default"` | Visual type |
| `multiple` | `boolean` | `false` | Allow multiple items open |
| `value` | `string[]` | — | Controlled open items |
| `defaultValue` | `string[]` | `[]` | Default open items |
| `onValueChange` | `(value: string[]) => void` | — | Change callback |

### AccordionItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Unique key (required) |
| `disabled` | `boolean` | `false` | Disabled state |

### AccordionTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leadingIcon` | `ReactNode \| IconName` | — | Leading icon |
| `leadingNumber` | `string` | — | Number badge |
| `leadingLogo` | `ReactNode` | — | Logo element |
| `badge` | `number \| string` | — | Counter badge |
| `hideChevron` | `boolean` | `false` | Hide chevron |
