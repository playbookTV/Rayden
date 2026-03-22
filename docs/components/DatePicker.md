# DatePicker

Calendar picker for date and range selection.

## Import

```tsx
import { DatePicker } from "@raydenui/ui";
```

## Usage

```tsx
// Single date
const [date, setDate] = useState<Date | null>(null);
<DatePicker value={date} onChange={setDate} />

// Date range
const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
<DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />

// Year picker
<DatePicker mode="year" value={date} onChange={setDate} />
```

## Modes

- `single` - Select a single date
- `range` - Select a date range (dual calendar)
- `year` - Select a year from 20-year grid

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"single" \| "range" \| "year"` | `"single"` | Picker mode |
| `value` | `Date \| null` | — | Selected date |
| `rangeValue` | `[Date \| null, Date \| null]` | — | Selected range |
| `onChange` | `(date: Date \| null) => void` | — | Date callback |
| `onRangeChange` | `(range: [Date \| null, Date \| null]) => void` | — | Range callback |
| `showFooter` | `boolean` | `false` | Show Clear/Done buttons |
| `onDone` | `() => void` | — | Done callback |
| `onClear` | `() => void` | — | Clear callback |
| `minDate` | `Date` | — | Minimum date |
| `maxDate` | `Date` | — | Maximum date |
