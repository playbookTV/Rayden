"use client";
import { useState } from "react";
import { FileUpload, type FileUploadFileData } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [files, setFiles] = useState<FileUploadFileData[]>(
    state === "populated"
      ? [
          {
            id: "sample",
            name: "demo-brief.md",
            size: 2048,
            type: "text/markdown",
            status: "pending",
          },
        ]
      : []
  );
  return (
    <div style={{ width: "min(100%, 580px)" }}>
      <FileUpload
        title="Stage a document"
        description="TXT or Markdown, up to 1 MB each. Files stay on your device."
        accept=".txt,.md"
        multiple
        maxFiles={3}
        maxSize={1024 * 1024}
        files={files}
        onFilesChange={setFiles}
        onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))}
        disabled={state === "disabled"}
      />
      <p role="status" style={{ marginTop: 24 }}>
        {files.length} files selected locally. No upload is performed; the list shows file metadata
        only.
      </p>
    </div>
  );
}
