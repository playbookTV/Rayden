# FileUpload

A complete file upload system with drag-and-drop, progress tracking, and multiple file support.

## Import

```tsx
import { FileUpload, FileUploadDropZone, FileUploadItem } from "@raydenui/ui";
import type {
  FileUploadProps,
  FileUploadDropZoneProps,
  FileUploadItemProps,
  FileUploadFileData
} from "@raydenui/ui";
```

## Usage

### Single File Upload

```tsx
const [files, setFiles] = useState<FileUploadFileData[]>([]);

const handleUpload = (file: File) => {
  const newFile: FileUploadFileData = {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: "uploading",
    progress: 0,
  };
  setFiles([newFile]);

  // Simulate upload...
};

<FileUpload
  files={files}
  onFilesChange={setFiles}
  onUpload={handleUpload}
  onRemove={() => setFiles([])}
  description="SVG, PNG, JPG or GIF (max 800x400px)"
/>
```

### Multiple File Upload

```tsx
<FileUpload
  multiple
  showHeader
  title="Upload Documents"
  files={files}
  onFilesChange={setFiles}
  onUpload={handleUpload}
  onRemove={(fileId) => setFiles((prev) => prev.filter((f) => f.id !== fileId))}
  onClose={() => console.log("close")}
  description="SVG, PNG, JPG or GIF (max 800x400px)"
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  accept="image/*,.pdf"
/>
```

### Drop Zone Only

Use `FileUploadDropZone` for a standalone drop zone:

```tsx
<FileUploadDropZone
  state="default"
  description="Drag and drop files here"
  onFilesSelected={(fileList) => console.log(fileList)}
/>

{/* States */}
<FileUploadDropZone state="uploading" uploadingFile={{ name: "doc.pdf", type: "application/pdf", progress: 45 }} />
<FileUploadDropZone state="success" onClear={() => {}} />
<FileUploadDropZone state="error" errorMessage="File too large" onRetry={() => {}} />
```

### File Item Only

Use `FileUploadItem` to display individual file states:

```tsx
<FileUploadItem
  file={{
    id: "1",
    name: "report.pdf",
    size: 5200000,
    type: "application/pdf",
    status: "complete",
    uploadedAt: new Date(),
  }}
  onRemove={() => {}}
  onDownload={() => {}}
/>
```

## API Reference

### FileUploadProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `FileUploadFileData[]` | — | Controlled file list (required) |
| `onFilesChange` | `(files: FileUploadFileData[]) => void` | — | Called when files change (required) |
| `multiple` | `boolean` | `false` | Allow multiple file uploads |
| `accept` | `string` | — | MIME types to accept, e.g. `"image/*,.pdf"` |
| `maxSize` | `number` | — | Maximum file size in bytes |
| `maxFiles` | `number` | — | Maximum number of files |
| `title` | `string` | `"Upload Documents"` | Header title |
| `description` | `string` | — | Description in the drop zone |
| `showHeader` | `boolean` | `false` | Show header with title and close |
| `onUpload` | `(file: File) => void` | — | Called when files are selected |
| `onRemove` | `(fileId: string) => void` | — | Called when remove is clicked |
| `onRetry` | `(fileId: string) => void` | — | Called when retry is clicked |
| `onDownload` | `(fileId: string) => void` | — | Called when download is clicked |
| `onClose` | `() => void` | — | Close handler for the header |

### FileUploadFileData

```ts
interface FileUploadFileData {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "uploading" | "complete" | "error";
  progress?: number;      // 0-100 for uploading status
  error?: string;         // Error message for error status
  uploadedAt?: Date;      // Completion timestamp
}
```

### FileUploadDropZoneProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `DropZoneState` | `"default"` | Current state |
| `description` | `string` | — | Helper text |
| `accept` | `string` | — | MIME types to accept |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `uploadingFile` | `{ name, type, progress }` | — | File info when uploading |
| `errorMessage` | `string` | — | Error message when in error state |
| `onFilesSelected` | `(files: FileList) => void` | — | Called when files selected |
| `onClear` | `() => void` | — | Called to clear success state |
| `onRetry` | `() => void` | — | Called to retry after error |

### DropZoneState

```ts
type DropZoneState = "default" | "uploading" | "success" | "error";
```

### FileUploadItemProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `FileUploadFileData` | — | File data (required) |
| `onRemove` | `(fileId: string) => void` | — | Remove handler |
| `onRetry` | `(fileId: string) => void` | — | Retry handler |
| `onDownload` | `(fileId: string) => void` | — | Download handler |

## File Type Icons

The component automatically detects file types and shows appropriate icons:

- **Images:** `image/png`, `image/jpeg`, `image/gif`, etc.
- **Documents:** `application/pdf`
- **Spreadsheets:** `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Default:** Generic file icon for other types

## Examples

### With Upload Progress Simulation

```tsx
const handleUpload = (file: File) => {
  const newFile: FileUploadFileData = {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: "uploading",
    progress: 0,
  };
  setFiles((prev) => [...prev, newFile]);

  // Simulate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress >= 100) {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id
            ? { ...f, status: "complete", progress: 100, uploadedAt: new Date() }
            : f
        )
      );
    } else {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id ? { ...f, progress } : f
        )
      );
    }
  }, 200);
};
```
