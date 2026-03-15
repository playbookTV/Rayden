import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";
import { ProgressCircle } from "../ProgressCircle";
import { FileTypeIcon, getFileType } from "./FileUploadIcons";

// ─── Types ───────────────────────────────────────────────────────
export type FileUploadItemStatus =
  | "pending"
  | "uploading"
  | "complete"
  | "error";

export interface FileUploadFileData {
  id: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
  status: FileUploadItemStatus;
  uploadedAt?: Date;
  error?: string;
}

export interface FileUploadItemProps extends HTMLAttributes<HTMLDivElement> {
  file: FileUploadFileData;
  onRemove?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${sizes[i]}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ───────────────────────────────────────────────────
export const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  ({ file, onRemove, onRetry, onDownload, className, ...rest }, ref) => {
    const fileType = getFileType(file.name);

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 py-3 border-b border-grey-100 last:border-b-0",
          className
        )}
        {...rest}
      >
        {/* File icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-grey-200 bg-white">
          <FileTypeIcon type={fileType} />
        </div>

        {/* File info — center section */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-body-sm font-semibold text-grey-800">
            {file.name}
          </span>
          {file.status === "error" ? (
            <span className="text-body-xs font-medium text-error-400">
              {file.error ?? "Failed to upload"}
            </span>
          ) : (
            <span className="text-body-xs text-grey-400">
              {file.status === "complete" && file.uploadedAt
                ? `${formatDate(file.uploadedAt)} \u2022 ${formatFileSize(file.size)}`
                : formatFileSize(file.size)}
            </span>
          )}
        </div>

        {/* Actions — right section */}
        <div className="flex shrink-0 items-center gap-2">
          {file.status === "pending" && (
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-md text-grey-500 hover:bg-grey-100 cursor-pointer"
              aria-label="Upload file"
            >
              <Icon name="upload" size="md" />
            </button>
          )}

          {file.status === "uploading" && (
            <>
              <ProgressCircle
                value={file.progress ?? 0}
                size="xs"
                showText
              />
              <button
                type="button"
                onClick={() => onRemove?.(file.id)}
                className="flex size-7 items-center justify-center rounded-md text-grey-400 hover:bg-grey-100 cursor-pointer"
                aria-label="Cancel upload"
              >
                <Icon name="multiply" size="sm" />
              </button>
            </>
          )}

          {file.status === "complete" && (
            <>
              <button
                type="button"
                onClick={() => onRemove?.(file.id)}
                className="flex size-7 items-center justify-center rounded-md text-grey-600 hover:bg-grey-100 cursor-pointer"
                aria-label="Delete file"
              >
                <Icon name="bin" size="md" />
              </button>
              <button
                type="button"
                onClick={() => onDownload?.(file.id)}
                className="flex size-7 items-center justify-center rounded-md text-grey-600 hover:bg-grey-100 cursor-pointer"
                aria-label="Download file"
              >
                <Icon name="download" size="md" />
              </button>
            </>
          )}

          {file.status === "error" && (
            <button
              type="button"
              onClick={() => onRetry?.(file.id)}
              className="text-body-xs font-semibold text-primary-500 cursor-pointer hover:text-primary-400"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }
);

FileUploadItem.displayName = "FileUploadItem";
