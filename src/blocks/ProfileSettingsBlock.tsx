import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { isValidEmail } from "../utils/isValidEmail";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type ProfileSettingsHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Lifecycle reported by the consuming application.
 *
 * - `idle` — editable, nothing in flight.
 * - `loading` — the profile is still being read. Fields are not shown yet.
 * - `saving` — a save is in flight. Every field and both footer actions are
 *   disabled so a second save cannot start.
 * - `error` — the save failed. The draft is preserved so nothing is retyped.
 * - `success` — the app has **confirmed** the save. The block never sets this.
 */
export type ProfileSettingsStatus = "idle" | "loading" | "saving" | "error" | "success";

export interface ProfileSettingsValues {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  timeZone: string;
  bio: string;
}

export type ProfileSettingsFieldName = keyof ProfileSettingsValues;

export type ProfileSettingsFieldErrors = Partial<Record<ProfileSettingsFieldName, string>>;

export interface ProfileSettingsAvatar {
  src?: string;
  /** Fallback when `src` is missing or fails to load. */
  initials?: string;
  /** Describes the person, not the act of having a photo. */
  alt?: string;
}

export interface ProfileSettingsTimeZoneOption {
  value: string;
  label: string;
}

export interface ProfileSettingsBlockProps {
  title?: string;
  description?: string;
  /** Heading element for {@link title}. @default "h2" */
  headingLevel?: ProfileSettingsHeadingLevel;
  /**
   * The **saved** profile. Unsaved-change tracking compares the working draft
   * against this value, so the block resets its draft whenever the app reports
   * new saved values.
   */
  value: ProfileSettingsValues;
  /** Required: the Save control is never rendered without an action. */
  onSave: (values: ProfileSettingsValues) => void;
  /** Called after the draft is reset to {@link value}. */
  onCancel?: () => void;
  /** Fires whenever the unsaved-change state flips. */
  onDirtyChange?: (dirty: boolean) => void;
  /** Lifecycle owned by the consuming app. @default "idle" */
  status?: ProfileSettingsStatus;
  errorMessage?: string;
  successMessage?: string;
  /** Server-reported errors, shown immediately. */
  fieldErrors?: ProfileSettingsFieldErrors;
  /**
   * Permission-aware editing. When false every field is read-only, the footer
   * actions are omitted, and {@link readOnlyMessage} explains why.
   * @default true
   */
  canEdit?: boolean;
  readOnlyMessage?: string;
  /**
   * Individual fields the viewer may read but not change, e.g. an email
   * address owned by a directory. Each one gets a visible explanation.
   */
  readOnlyFields?: ProfileSettingsFieldName[];
  /** Explanations keyed by field, shown under a field in {@link readOnlyFields}. */
  readOnlyFieldMessages?: Partial<Record<ProfileSettingsFieldName, string>>;
  avatar?: ProfileSettingsAvatar;
  /**
   * Receives the chosen image. The consuming app owns the upload and must
   * report the result back through {@link avatar} and {@link avatarStatus}.
   * When omitted, no upload control is rendered.
   */
  onAvatarChange?: (file: File) => void;
  /** When omitted, no remove control is rendered. */
  onAvatarRemove?: () => void;
  /** Truthful upload state, owned by the app. @default "idle" */
  avatarStatus?: "idle" | "uploading" | "error";
  avatarErrorMessage?: string;
  /** Replaces the built-in avatar control, e.g. with a `FileUpload`. */
  avatarSlot?: ReactNode;
  /** Accepted image types for the built-in control. @default "image/png,image/jpeg,image/webp" */
  avatarAccept?: string;
  timeZones?: ProfileSettingsTimeZoneOption[];
  /** Maximum bio length. A live counter is shown. @default 280 */
  bioMaxLength?: number;
  labels?: Partial<Record<ProfileSettingsFieldName, string>>;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
}

/* ─── Defaults ───────────────────────────────────────────────────────── */

const defaultLabels: Record<ProfileSettingsFieldName, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  jobTitle: "Job title",
  timeZone: "Time zone",
  bio: "About you",
};

export const defaultProfileTimeZones: ProfileSettingsTimeZoneOption[] = [
  { value: "Europe/London", label: "London (GMT+01:00)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+02:00)" },
  { value: "America/New_York", label: "New York (GMT−04:00)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT−07:00)" },
  { value: "Africa/Lagos", label: "Lagos (GMT+01:00)" },
  { value: "Asia/Singapore", label: "Singapore (GMT+08:00)" },
];

/* ─── Component ──────────────────────────────────────────────────────── */

export function ProfileSettingsBlock({
  title = "Profile",
  description = "These details appear next to your name across the workspace.",
  headingLevel = "h2",
  value,
  onSave,
  onCancel,
  onDirtyChange,
  status = "idle",
  errorMessage,
  successMessage,
  fieldErrors,
  canEdit = true,
  readOnlyMessage = "You can view this profile but not change it. Ask a workspace administrator for edit access.",
  readOnlyFields,
  readOnlyFieldMessages,
  avatar,
  onAvatarChange,
  onAvatarRemove,
  avatarStatus = "idle",
  avatarErrorMessage,
  avatarSlot,
  avatarAccept = "image/png,image/jpeg,image/webp",
  timeZones = defaultProfileTimeZones,
  bioMaxLength = 280,
  labels,
  saveLabel = "Save changes",
  cancelLabel = "Cancel",
  className,
}: ProfileSettingsBlockProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const bioId = `${uid}-bio`;
  const bioCountId = `${uid}-bio-count`;

  const serializedSaved = JSON.stringify(value);
  const [draft, setDraft] = useState<ProfileSettingsValues>(value);
  const [touched, setTouched] = useState<Partial<Record<ProfileSettingsFieldName, boolean>>>({});
  const [saveAttempted, setSaveAttempted] = useState(false);
  const lastSavedRef = useRef(serializedSaved);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Saved values changed under us (a save landed, or the app swapped profile).
  // Re-sync the draft during render rather than in an effect, so the form never
  // paints one frame of stale content.
  if (lastSavedRef.current !== serializedSaved) {
    lastSavedRef.current = serializedSaved;
    setDraft(value);
    setTouched({});
    setSaveAttempted(false);
  }

  const saving = status === "saving";
  const loading = status === "loading";
  const locked = !canEdit || saving || loading;

  const dirty = useMemo(() => JSON.stringify(draft) !== serializedSaved, [draft, serializedSaved]);

  const dirtyRef = useRef(dirty);
  useEffect(() => {
    if (dirtyRef.current !== dirty) {
      dirtyRef.current = dirty;
      onDirtyChange?.(dirty);
    }
  }, [dirty, onDirtyChange]);

  const localErrors = useMemo<ProfileSettingsFieldErrors>(() => {
    const next: ProfileSettingsFieldErrors = {};
    if (!draft.firstName.trim()) next.firstName = "Enter a first name.";
    if (!draft.lastName.trim()) next.lastName = "Enter a last name.";
    if (!draft.email.trim()) next.email = "Enter an email address.";
    else if (!isValidEmail(draft.email.trim()))
      next.email = "Enter an email address such as name@example.com.";
    if (draft.bio.length > bioMaxLength)
      next.bio = `Shorten this to ${bioMaxLength} characters or fewer.`;
    return next;
  }, [draft, bioMaxLength]);

  const errorFor = useCallback(
    (field: ProfileSettingsFieldName): string | undefined => {
      const serverError = fieldErrors?.[field];
      if (serverError) return serverError;
      if (!saveAttempted && !touched[field]) return undefined;
      return localErrors[field];
    },
    [fieldErrors, localErrors, saveAttempted, touched]
  );

  const isFieldReadOnly = useCallback(
    (field: ProfileSettingsFieldName) => !canEdit || Boolean(readOnlyFields?.includes(field)),
    [canEdit, readOnlyFields]
  );

  const setField = useCallback(
    (field: ProfileSettingsFieldName, next: string) =>
      setDraft((prev) => ({ ...prev, [field]: next })),
    []
  );

  const markTouched = useCallback(
    (field: ProfileSettingsFieldName) => setTouched((prev) => ({ ...prev, [field]: true })),
    []
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Guard duplicate submission and honour the permission contract.
      if (locked || !dirty) return;
      setSaveAttempted(true);
      if (Object.keys(localErrors).length > 0) return;
      onSave(draft);
    },
    [dirty, draft, localErrors, locked, onSave]
  );

  const handleCancel = useCallback(() => {
    if (saving) return;
    setDraft(value);
    setTouched({});
    setSaveAttempted(false);
    onCancel?.();
  }, [onCancel, saving, value]);

  const handleAvatarInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) onAvatarChange?.(file);
      // Allow re-selecting the same file after a failed upload.
      event.target.value = "";
    },
    [onAvatarChange]
  );

  const Heading = headingLevel;
  const label = (field: ProfileSettingsFieldName) => labels?.[field] ?? defaultLabels[field];
  const readOnlyNote = (field: ProfileSettingsFieldName) =>
    isFieldReadOnly(field) && canEdit ? readOnlyFieldMessages?.[field] : undefined;

  const bioError = errorFor("bio");
  const bioReadOnly = isFieldReadOnly("bio");

  return (
    <section aria-labelledby={titleId} className={cn("@container w-full", className)}>
      <div className="flex flex-col gap-6 rounded-12 border border-surface-border bg-surface p-4 @min-[420px]:p-6">
        <header className="flex flex-col gap-2">
          <Heading id={titleId} className="text-h6 font-semibold text-grey-900">
            {title}
          </Heading>
          {description && <p className="text-body-sm text-grey-600">{description}</p>}
        </header>

        {!canEdit && (
          <Alert
            state="information"
            icon="lock"
            role="status"
            title="View only"
            description={readOnlyMessage}
            className="bg-surface dark:bg-surface"
          />
        )}

        {status === "error" && errorMessage && (
          <Alert
            state="error"
            icon="info-triangle"
            role="alert"
            title="Your changes were not saved"
            description={errorMessage}
            className="bg-surface dark:bg-surface"
          />
        )}

        {status === "success" && successMessage && (
          <Alert
            state="success"
            icon="check-circle"
            role="status"
            title={successMessage}
            className="bg-surface dark:bg-surface"
          />
        )}

        {loading ? (
          <div
            aria-busy="true"
            className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-8 border border-dashed border-surface-border-strong p-6"
          >
            <Spinner size="md" label="Loading your profile…" labelPosition="below" />
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* ── Avatar ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 border-b border-surface-border pb-6 @min-[520px]:flex-row @min-[520px]:items-center @min-[520px]:gap-5">
              <Avatar
                type={avatar?.src ? "image" : "initials"}
                size="2xl"
                src={avatar?.src}
                alt={avatar?.alt ?? `${draft.firstName} ${draft.lastName}`.trim()}
                initials={
                  avatar?.initials ??
                  (`${draft.firstName.charAt(0)}${draft.lastName.charAt(0)}`.toUpperCase() || "?")
                }
              />
              <div className="flex min-w-0 flex-col gap-2">
                {avatarSlot ?? (
                  <>
                    {onAvatarChange ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* A real file input, labelled, kept in the tab order. */}
                        <input
                          ref={fileInputRef}
                          id={`${uid}-avatar`}
                          type="file"
                          accept={avatarAccept}
                          disabled={locked || avatarStatus === "uploading"}
                          onChange={handleAvatarInput}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`${uid}-avatar`}
                          className={cn(
                            "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-current px-4 text-sm font-semibold text-action-primary-text",
                            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-action-primary-text",
                            (locked || avatarStatus === "uploading") &&
                              "cursor-not-allowed opacity-50"
                          )}
                        >
                          <Icon name="image-add" size="md" />
                          Change photo
                        </label>
                        {onAvatarRemove && avatar?.src && (
                          <Button
                            type="button"
                            variant="grey"
                            appearance="outlined"
                            size="sm"
                            disabled={locked || avatarStatus === "uploading"}
                            onClick={onAvatarRemove}
                          >
                            Remove photo
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-body-sm text-grey-600">
                        Your photo is managed outside this workspace.
                      </p>
                    )}
                    <p className="text-body-xs text-grey-600">
                      PNG, JPG or WebP. A square image works best.
                    </p>
                    {avatarStatus === "uploading" && (
                      <output className="flex items-center gap-2 text-body-sm text-grey-600">
                        <Spinner size="xs" />
                        Uploading your photo…
                      </output>
                    )}
                    {avatarStatus === "error" && avatarErrorMessage && (
                      <p role="alert" className="text-body-sm text-feedback-error">
                        {avatarErrorMessage}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Name ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 @min-[520px]:grid-cols-2">
              <Input
                id={`${uid}-firstName`}
                name="firstName"
                size="md"
                label={label("firstName")}
                autoComplete="given-name"
                required
                value={draft.firstName}
                readOnly={isFieldReadOnly("firstName")}
                disabled={saving}
                error={errorFor("firstName")}
                helperText={readOnlyNote("firstName")}
                onChange={(e) => setField("firstName", e.target.value)}
                onBlur={() => markTouched("firstName")}
              />
              <Input
                id={`${uid}-lastName`}
                name="lastName"
                size="md"
                label={label("lastName")}
                autoComplete="family-name"
                required
                value={draft.lastName}
                readOnly={isFieldReadOnly("lastName")}
                disabled={saving}
                error={errorFor("lastName")}
                helperText={readOnlyNote("lastName")}
                onChange={(e) => setField("lastName", e.target.value)}
                onBlur={() => markTouched("lastName")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 @min-[520px]:grid-cols-2">
              <Input
                id={`${uid}-email`}
                name="email"
                type="email"
                inputMode="email"
                size="md"
                label={label("email")}
                autoComplete="email"
                required
                value={draft.email}
                readOnly={isFieldReadOnly("email")}
                disabled={saving}
                error={errorFor("email")}
                helperText={readOnlyNote("email")}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => markTouched("email")}
              />
              <Input
                id={`${uid}-jobTitle`}
                name="jobTitle"
                size="md"
                label={label("jobTitle")}
                autoComplete="organization-title"
                value={draft.jobTitle}
                readOnly={isFieldReadOnly("jobTitle")}
                disabled={saving}
                error={errorFor("jobTitle")}
                helperText={readOnlyNote("jobTitle")}
                onChange={(e) => setField("jobTitle", e.target.value)}
                onBlur={() => markTouched("jobTitle")}
              />
            </div>

            {/* ── Time zone ──────────────────────────────────────────── */}
            {isFieldReadOnly("timeZone") ? (
              <Input
                id={`${uid}-timeZone`}
                name="timeZone"
                size="md"
                label={label("timeZone")}
                readOnly
                value={timeZones.find((z) => z.value === draft.timeZone)?.label ?? draft.timeZone}
                helperText={readOnlyNote("timeZone")}
                onChange={() => undefined}
              />
            ) : (
              <div className="flex w-full flex-col gap-1">
                <label
                  htmlFor={`${uid}-timeZone`}
                  className="text-sm font-medium leading-[1.45] text-grey-900"
                >
                  {label("timeZone")}
                </label>
                {/* Native select: one tab stop, full keyboard support, and no
                  popup to trap focus inside a settings form. */}
                <select
                  id={`${uid}-timeZone`}
                  name="timeZone"
                  disabled={saving}
                  value={draft.timeZone}
                  onChange={(e) => setField("timeZone", e.target.value)}
                  className={cn(
                    "h-12 w-full rounded-lg border border-grey-300 bg-surface px-4 text-sm text-grey-900",
                    "transition-colors hover:border-primary-100 focus-visible:border-primary-400",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text",
                    "disabled:cursor-not-allowed disabled:bg-grey-50"
                  )}
                >
                  {timeZones.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ── Bio ────────────────────────────────────────────────── */}
            <div className="flex w-full flex-col gap-1">
              <label htmlFor={bioId} className="text-sm font-medium leading-[1.45] text-grey-900">
                {label("bio")}
              </label>
              <textarea
                id={bioId}
                name="bio"
                rows={4}
                readOnly={bioReadOnly}
                disabled={saving}
                value={draft.bio}
                aria-invalid={bioError ? true : undefined}
                aria-describedby={bioCountId}
                onChange={(e) => setField("bio", e.target.value)}
                onBlur={() => markTouched("bio")}
                className={cn(
                  "w-full resize-y rounded-lg border px-4 py-3 text-sm text-grey-900 transition-colors",
                  "placeholder:text-grey-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text",
                  bioError
                    ? "border-error-400 bg-surface"
                    : bioReadOnly
                      ? "border-grey-300 bg-grey-100"
                      : "border-grey-300 bg-surface hover:border-primary-100 focus-within:border-primary-400",
                  saving && "cursor-not-allowed opacity-70"
                )}
              />
              <p
                id={bioCountId}
                className={cn(
                  "text-sm leading-[1.45]",
                  bioError ? "text-feedback-error" : "text-grey-600"
                )}
              >
                {bioError ?? `${draft.bio.length} of ${bioMaxLength} characters used.`}
              </p>
            </div>

            {/* ── Footer ─────────────────────────────────────────────── */}
            {canEdit && (
              <div className="flex flex-col gap-3 border-t border-surface-border pt-5 @min-[520px]:flex-row @min-[520px]:items-center @min-[520px]:justify-between">
                {/* Unsaved-change tracking, announced politely rather than only
                  implied by an enabled button. */}
                <output className="text-body-sm text-grey-600">
                  {saving
                    ? "Saving your changes…"
                    : dirty
                      ? "You have unsaved changes."
                      : "All changes saved."}
                </output>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="grey"
                    appearance="outlined"
                    size="sm"
                    disabled={!dirty || saving}
                    onClick={handleCancel}
                  >
                    {cancelLabel}
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={!dirty || saving}>
                    {saving ? "Saving…" : saveLabel}
                  </Button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
