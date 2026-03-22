import { forwardRef, useRef, useState, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { ProgressBar } from "../ProgressBar";
import { FileTypeIcon, UploadStateIcon, getFileType } from "./FileUploadIcons";

// ─── Types ───────────────────────────────────────────────────────
export type DropZoneState = "default" | "dragging" | "uploading" | "success" | "error";

export interface FileUploadDropZoneProps extends HTMLAttributes<HTMLDivElement> {
  /** Current visual state */
  state?: DropZoneState;
  /** Description text, e.g. "SVG, PNG, JPG or GIF (max 800x400px)" */
  description?: string;
  /** MIME types to accept */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** File info for uploading state */
  uploadingFile?: { name: string; type: string; progress: number };
  /** Error message for error state */
  errorMessage?: string;
  /** Called when files are dropped or selected */
  onFilesSelected?: (files: FileList) => void;
  /** Called on "Clear Upload" in success state */
  onClear?: () => void;
  /** Called on "Try Again" in error state */
  onRetry?: () => void;
}

// ─── Component ───────────────────────────────────────────────────
export const FileUploadDropZone = forwardRef<HTMLDivElement, FileUploadDropZoneProps>(
  (
    {
      state: controlledState,
      description,
      accept,
      multiple = false,
      uploadingFile,
      errorMessage,
      onFilesSelected,
      onClear,
      onRetry,
      className,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragCounter, setDragCounter] = useState(0);

    // Derive state: if dragging and state is default, show dragging
    const isDragging = dragCounter > 0;
    const state =
      isDragging && (controlledState === "default" || !controlledState)
        ? "dragging"
        : (controlledState ?? "default");

    const handleBrowse = () => inputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected?.(e.target.files);
        // Reset the input so the same file can be re-selected
        e.target.value = "";
      }
    };

    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((c) => c + 1);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((c) => c - 1);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(0);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          onFilesSelected?.(e.dataTransfer.files);
        }
      },
      [onFilesSelected]
    );

    return (
      <div
        ref={ref}
        role="region"
        aria-label="File upload dropzone"
        className={cn(
          "flex flex-col items-center justify-center rounded-xl p-8 transition-colors",
          state === "dragging"
            ? "border-2 border-dashed border-primary-400 bg-primary-50/10"
            : state === "uploading" || state === "success" || state === "error"
              ? "border border-grey-200 bg-white dark:bg-grey-50"
              : "border-2 border-dashed border-grey-300 bg-white dark:bg-grey-50",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...rest}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="sr-only"
          tabIndex={-1}
          aria-label={multiple ? "Choose files to upload" : "Choose file to upload"}
        />

        {/* ─── Default / Dragging State ─── */}
        {(state === "default" || state === "dragging") && (
          <div className="flex flex-col items-center gap-4">
            <UploadStateIcon state="default" size={56} aria-hidden="true" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-body-sm font-medium text-grey-600">
                Click to upload <span className="text-grey-400">or drag and drop</span>
              </p>
              {description && <p className="text-body-xs text-grey-400">{description}</p>}
            </div>
            <Button variant="primary" size="sm" onClick={handleBrowse}>
              Browse Files
            </Button>
          </div>
        )}

        {/* ─── Uploading State ─── */}
        {state === "uploading" && uploadingFile && (
          <div
            className="flex w-full flex-col items-center gap-4"
            aria-live="polite"
            aria-atomic="true"
          >
            <FileTypeIcon type={getFileType(uploadingFile.name)} aria-hidden="true" />
            <div className="flex w-full max-w-xs flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-body-sm font-medium text-grey-700 truncate">
                  {uploadingFile.name}
                </span>
                <span
                  className="text-body-xs font-medium text-grey-500 ml-2 shrink-0"
                  aria-label={`Upload progress: ${Math.round(uploadingFile.progress)} percent`}
                >
                  {Math.round(uploadingFile.progress)}%
                </span>
              </div>
              <ProgressBar value={uploadingFile.progress} size="sm" showPercentage={false} />
            </div>
          </div>
        )}

        {/* ─── Success State ─── */}
        {state === "success" && (
          <div className="flex flex-col items-center gap-4" role="status">
            <UploadStateIcon state="success" size={56} aria-hidden="true" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-body-sm font-semibold text-grey-800">
                Document Uploaded Successfully
              </p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="text-body-xs font-semibold text-primary-500 cursor-pointer hover:text-primary-400"
            >
              Clear Upload
            </button>
          </div>
        )}

        {/* ─── Error State ─── */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4" role="alert">
            <UploadStateIcon state="error" size={56} aria-hidden="true" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-body-sm font-semibold text-grey-800">Failed to Upload</p>
              {errorMessage && <p className="text-body-xs text-grey-400">{errorMessage}</p>}
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="text-body-xs font-semibold text-primary-500 cursor-pointer hover:text-primary-400"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }
);

FileUploadDropZone.displayName = "FileUploadDropZone";
