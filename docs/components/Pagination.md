# Pagination

Page navigation component with page numbers, ellipsis, and optional previous/next buttons.

## Import

```tsx
import { Pagination } from "@raydenui/ui";
import type { PaginationProps } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
const [page, setPage] = useState(1);

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

### Without Prev/Next Buttons

```tsx
<Pagination
  currentPage={3}
  totalPages={10}
  onPageChange={setPage}
  showPrevNext={false}
/>
```

### With Custom Sibling Count

Control how many page numbers appear around the current page:

```tsx
// Default (1 sibling on each side)
<Pagination currentPage={5} totalPages={20} onPageChange={setPage} />
// Shows: 1 ... 4 5 6 ... 20

// More siblings
<Pagination
  currentPage={5}
  totalPages={20}
  onPageChange={setPage}
  siblingCount={2}
/>
// Shows: 1 ... 3 4 5 6 7 ... 20
```

### Full Example

```tsx
function DataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 25;
  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Fetch data for new page
  };

  return (
    <div>
      <table>{/* Table content */}</table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | — | **Required.** Active page number |
| `totalPages` | `number` | — | **Required.** Total number of pages |
| `onPageChange` | `(page: number) => void` | — | **Required.** Page change callback |
| `showPrevNext` | `boolean` | `true` | Show Previous/Next buttons |
| `siblingCount` | `number` | `1` | Pages to show on each side of current |
| `className` | `string` | — | Additional CSS classes |

## Accessibility

- Uses `<nav>` element with `aria-label="Pagination"`
- Current page has `aria-current="page"`
- Previous/Next buttons have `aria-label`
- Disabled buttons have `disabled` attribute

## Design Guidelines

### When to use

- Tables with many rows
- Search results
- Lists exceeding a single page
- Content archives

### Best practices

- Show total items or page count context
- Maintain consistent items per page
- Consider infinite scroll for mobile
- Keep pagination visible (sticky or near content)
- Disable Previous on first page, Next on last page
