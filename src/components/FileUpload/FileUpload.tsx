import { forwardRef, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { FileUploadDropZone, type DropZoneState } from "./FileUploadDropZone";
import { FileUploadItem, type FileUploadFileData } from "./FileUploadItem";

// ─── Types ───────────────────────────────────────────────────────
export interface FileUploadProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple file uploads */
  multiple?: boolean;
  /** MIME types to accept, e.g. "image/*,.pdf" */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files (for multiple mode) */
  maxFiles?: number;
  /** Header title, e.g. "Upload Documents" */
  title?: string;
  /** Description shown in the drop zone */
  description?: string;
  /** Controlled file list */
  files: FileUploadFileData[];
  /** Called when files list changes */
  onFilesChange: (files: FileUploadFileData[]) => void;
  /** Called when new files are selected for upload */
  onUpload?: (file: File) => void;
  /** Called when remove/delete is clicked */
  onRemove?: (fileId: string) => void;
  /** Called when retry is clicked */
  onRetry?: (fileId: string) => void;
  /** Called when download is clicked */
  onDownload?: (fileId: string) => void;
  /** Show the header with title and close button */
  showHeader?: boolean;
  /** Close handler for the header */
  onClose?: () => void;
}

// ─── Component ───────────────────────────────────────────────────
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      multiple = false,
      accept,
      maxSize,
      maxFiles,
      title = "Upload Documents",
      description,
      files,
      onFilesChange,
      onUpload,
      onRemove,
      onRetry,
      onDownload,
      showHeader = false,
      onClose,
      className,
      ...rest
    },
    ref
  ) => {
    // Derive drop zone state for single-file mode
    const deriveDropZoneState = (): DropZoneState => {
      if (!multiple && files.length > 0) {
        const file = files[0];
        if (file?.status === "uploading") return "uploading";
        if (file?.status === "complete") return "success";
        if (file?.status === "error") return "error";
      }
      return "default";
    };

    const dropZoneState = deriveDropZoneState();

    // Get uploading file info for drop zone
    const uploadingFile =
      !multiple && files.length > 0 && files[0]?.status === "uploading"
        ? {
            name: files[0].name,
            type: files[0].type,
            progress: files[0].progress ?? 0,
          }
        : undefined;

    const errorMessage =
      !multiple && files.length > 0 && files[0]?.status === "error" ? files[0].error : undefined;

    const handleFilesSelected = useCallback(
      (fileList: FileList) => {
        const filesToProcess = multiple ? Array.from(fileList) : [fileList[0]!];

        // Apply maxFiles limit
        const limit = maxFiles ? Math.max(0, maxFiles - files.length) : filesToProcess.length;
        const accepted = filesToProcess.slice(0, limit);

        for (const file of accepted) {
          // Skip files exceeding maxSize
          if (maxSize && file.size > maxSize) continue;
          onUpload?.(file);
        }
      },
      [multiple, maxFiles, maxSize, files.length, onUpload]
    );

    const handleClear = useCallback(() => {
      if (!multiple && files.length > 0) {
        onRemove?.(files[0]!.id);
      }
    }, [multiple, files, onRemove]);

    const handleRetry = useCallback(() => {
      if (!multiple && files.length > 0) {
        onRetry?.(files[0]!.id);
      }
    }, [multiple, files, onRetry]);

    // In multiple mode, separate completed/in-progress files for display
    const completedFiles = multiple
      ? files.filter((f) => f.status === "complete" || f.status === "error")
      : [];
    const activeFiles = multiple
      ? files.filter((f) => f.status === "uploading" || f.status === "pending")
      : [];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-7 rounded-[10px] bg-white dark:bg-grey-50 p-8 shadow-soft-xs",
          className
        )}
        {...rest}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between">
            <h3 className="text-body-lg font-semibold text-grey-800">{title}</h3>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-md text-grey-400 hover:bg-grey-100 cursor-pointer"
                aria-label="Close"
              >
                <Icon name="multiply" size="md" />
              </button>
            )}
          </div>
        )}

        {/* Drop Zone */}
        <FileUploadDropZone
          state={dropZoneState}
          description={description}
          accept={accept}
          multiple={multiple}
          uploadingFile={uploadingFile}
          errorMessage={errorMessage}
          onFilesSelected={handleFilesSelected}
          onClear={handleClear}
          onRetry={handleRetry}
        />

        {/* Active uploads (multiple mode) */}
        {multiple && activeFiles.length > 0 && (
          <div className="flex flex-col">
            {activeFiles.map((file) => (
              <FileUploadItem
                key={file.id}
                file={file}
                onRemove={onRemove}
                onRetry={onRetry}
                onDownload={onDownload}
              />
            ))}
          </div>
        )}

        {/* Completed files (multiple mode) */}
        {multiple && completedFiles.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-body-md font-medium text-grey-800">Uploaded Files</span>
              <Badge color="orange" type="filled" size="sm">
                {completedFiles.length}
              </Badge>
            </div>
            <div className="flex flex-col">
              {completedFiles.map((file) => (
                <FileUploadItem
                  key={file.id}
                  file={file}
                  onRemove={onRemove}
                  onRetry={onRetry}
                  onDownload={onDownload}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
