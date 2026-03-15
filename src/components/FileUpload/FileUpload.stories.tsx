import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";
import { FileUploadDropZone } from "./FileUploadDropZone";
import { FileUploadItem } from "./FileUploadItem";
import type { FileUploadFileData } from "./FileUploadItem";

// ─── FileUploadDropZone Stories ──────────────────────────────────
const dropZoneMeta: Meta<typeof FileUploadDropZone> = {
  title: "Elements/FileUpload/DropZone",
  component: FileUploadDropZone,
};

export default dropZoneMeta;
type DropZoneStory = StoryObj<typeof FileUploadDropZone>;

export const Default: DropZoneStory = {
  args: {
    description: "SVG, PNG, JPG or GIF (max 800x400px)",
  },
};

export const Uploading: DropZoneStory = {
  args: {
    state: "uploading",
    uploadingFile: {
      name: "document.pdf",
      type: "application/pdf",
      progress: 65,
    },
  },
};

export const Success: DropZoneStory = {
  args: {
    state: "success",
    onClear: () => {},
  },
};

export const Error: DropZoneStory = {
  args: {
    state: "error",
    errorMessage: "File size exceeds the 10MB limit",
    onRetry: () => {},
  },
};

// ─── FileUploadItem Stories ──────────────────────────────────────
export const FileItemStates: StoryObj = {
  render: () => {
    const files: FileUploadFileData[] = [
      {
        id: "1",
        name: "design-mockup.png",
        size: 2400000,
        type: "image/png",
        status: "pending",
      },
      {
        id: "2",
        name: "quarterly-report.pdf",
        size: 5200000,
        type: "application/pdf",
        status: "uploading",
        progress: 45,
      },
      {
        id: "3",
        name: "financial-data.xls",
        size: 1800000,
        type: "application/vnd.ms-excel",
        status: "complete",
        uploadedAt: new Date("2026-03-10"),
      },
      {
        id: "4",
        name: "backup-archive.gif",
        size: 12000000,
        type: "image/gif",
        status: "error",
        error: "File size exceeds limit",
      },
    ];

    return (
      <div className="flex w-[450px] flex-col rounded-lg border border-grey-200 px-4">
        {files.map((file) => (
          <FileUploadItem
            key={file.id}
            file={file}
            onRemove={() => {}}
            onRetry={() => {}}
            onDownload={() => {}}
          />
        ))}
      </div>
    );
  },
};

// ─── Single File Upload ──────────────────────────────────────────
export const SingleFileUpload: StoryObj = {
  render: () => {
    const SingleUpload = () => {
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

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(interval);
            setFiles([
              {
                ...newFile,
                status: "complete",
                progress: 100,
                uploadedAt: new Date(),
              },
            ]);
          } else {
            setFiles([{ ...newFile, progress }]);
          }
        }, 300);
      };

      return (
        <div className="w-[400px]">
          <FileUpload
            files={files}
            onFilesChange={setFiles}
            onUpload={handleUpload}
            onRemove={() => setFiles([])}
            description="SVG, PNG, JPG or GIF (max 800x400px)"
          />
        </div>
      );
    };

    return <SingleUpload />;
  },
};

// ─── Multiple File Upload ────────────────────────────────────────
export const MultipleFileUpload: StoryObj = {
  render: () => {
    const MultiUpload = () => {
      const [files, setFiles] = useState<FileUploadFileData[]>([
        {
          id: "1",
          name: "design-mockup.png",
          size: 2400000,
          type: "image/png",
          status: "complete",
          uploadedAt: new Date("2026-03-10"),
        },
        {
          id: "2",
          name: "quarterly-report.pdf",
          size: 5200000,
          type: "application/pdf",
          status: "complete",
          uploadedAt: new Date("2026-03-12"),
        },
        {
          id: "3",
          name: "financial-data.xls",
          size: 1800000,
          type: "application/vnd.ms-excel",
          status: "complete",
          uploadedAt: new Date("2026-03-14"),
        },
      ]);

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

        // Simulate upload
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
        }, 300);
      };

      const handleRemove = (fileId: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      };

      return (
        <div className="w-[500px]">
          <FileUpload
            multiple
            showHeader
            title="Upload Documents"
            files={files}
            onFilesChange={setFiles}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onClose={() => {}}
            description="SVG, PNG, JPG or GIF (max 800x400px)"
          />
        </div>
      );
    };

    return <MultiUpload />;
  },
};
