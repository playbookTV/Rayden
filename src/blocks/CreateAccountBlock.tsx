import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { isValidEmail } from "../utils/isValidEmail";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Checkbox } from "../components/FormControl";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";

/* ─── Types ──────────────────────────────────────────────────────────── */

/**
 * Heading element used for the block title. Embedding context varies, so the
 * level is a contract rather than a hard-coded `h3`.
 */
export type CreateAccountHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Lifecycle reported by the consuming application.
 *
 * - `idle` — the form is ready for input.
 * - `loading` — the app is still fetching the context the form needs
 *   (invitation, provider configuration). Fields are not shown yet.
 * - `submitting` — the app is creating the account. Every control that could
 *   start a second registration attempt is disabled.
 * - `error` — the app reports a failed attempt. Input is preserved.
 * - `success` — the app has **confirmed** the account exists. The block never
 *   sets this itself.
 */
export type CreateAccountStatus = "idle" | "loading" | "submitting" | "error" | "success";

export interface CreateAccountValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /** True only when the required consent control is checked. */
  consent: boolean;
}

export type CreateAccountFieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmPassword"
  | "consent";

export type CreateAccountFieldErrors = Partial<Record<CreateAccountFieldName, string>>;

export interface CreateAccountPasswordRule {
  id: string;
  /** Shown verbatim in the guidance list. Translate it in the consuming app. */
  label: string;
  test: (password: string) => boolean;
}

export interface CreateAccountLink {
  label: string;
  href: string;
}

export interface CreateAccountBlockProps {
  /** Block title. */
  title?: string;
  /** Supporting sentence under the title. */
  description?: string;
  /** Heading element for {@link title}. @default "h2" */
  headingLevel?: CreateAccountHeadingLevel;
  /**
   * Called only when every field passes local validation and no submission is
   * already in flight. Required: the block never renders a submit control with
   * no configured action.
   */
  onSubmit: (values: CreateAccountValues) => void;
  /** Lifecycle owned by the consuming app. @default "idle" */
  status?: CreateAccountStatus;
  /** Message shown when `status` is `"error"`. */
  errorMessage?: string;
  /** Message shown when `status` is `"success"`. */
  successMessage?: string;
  /**
   * Server-reported errors, merged over local validation. They are shown
   * immediately, without waiting for the field to be touched.
   */
  fieldErrors?: CreateAccountFieldErrors;
  /** Initial field contents. The block owns the draft after first render. */
  defaultValues?: Partial<Omit<CreateAccountValues, "consent">>;
  /** Password guidance. Every rule must pass before submission. */
  passwordRules?: CreateAccountPasswordRule[];
  /** Ask the person to type the password twice. @default true */
  requireConfirmPassword?: boolean;
  /**
   * Consent sentence. Links inside it stay independently operable; the whole
   * sentence is the checkbox's accessible name.
   */
  consentLabel?: ReactNode;
  /** Error shown when consent is missing. */
  consentErrorMessage?: string;
  /** Destination for people who already have an account. Rendered as a link. */
  signIn?: CreateAccountLink;
  /** Submit label. @default "Create account" */
  submitLabel?: string;
  /** Label announced while submitting. @default "Creating account…" */
  submittingLabel?: string;
  /**
   * Registration is unavailable (closed, expired invitation, or the viewer
   * lacks permission). Every control is disabled and the reason is shown.
   */
  disabled?: boolean;
  /** Explanation shown when {@link disabled} is true. */
  disabledMessage?: string;
  /** Field labels, so the block can be translated without forking it. */
  labels?: Partial<
    Record<"firstName" | "lastName" | "email" | "password" | "confirmPassword", string>
  >;
  className?: string;
}

/* ─── Defaults ───────────────────────────────────────────────────────── */

export const defaultCreateAccountPasswordRules: CreateAccountPasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  {
    id: "case",
    label: "An upper and a lower case letter",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { id: "number", label: "At least one number", test: (v) => /\d/.test(v) },
];

const emptyValues: Omit<CreateAccountValues, "consent"> = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

/* ─── Component ──────────────────────────────────────────────────────── */

export function CreateAccountBlock({
  title = "Create your account",
  description = "Set up a free workspace. No card required.",
  headingLevel = "h2",
  onSubmit,
  status = "idle",
  errorMessage,
  successMessage,
  fieldErrors,
  defaultValues,
  passwordRules = defaultCreateAccountPasswordRules,
  requireConfirmPassword = true,
  consentLabel,
  consentErrorMessage = "Please accept the terms before creating an account.",
  signIn,
  submitLabel = "Create account",
  submittingLabel = "Creating account…",
  disabled = false,
  disabledMessage = "Account creation is currently unavailable.",
  labels,
  className,
}: CreateAccountBlockProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const consentId = `${uid}-consent`;
  const consentTextId = `${uid}-consent-text`;
  const consentErrorId = `${uid}-consent-error`;
  const passwordRulesId = `${uid}-password-rules`;
  const passwordErrorId = `${uid}-password-error`;
  const unsavedRegionId = `${uid}-form-status`;

  const [values, setValues] = useState<Omit<CreateAccountValues, "consent">>({
    ...emptyValues,
    ...defaultValues,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<CreateAccountFieldName, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);

  const fieldRefs = useRef<Partial<Record<CreateAccountFieldName, HTMLInputElement | null>>>({});

  const pending = status === "submitting";
  const succeeded = status === "success";
  const loading = status === "loading";
  const locked = disabled || pending || succeeded;

  const ruleResults = useMemo(
    () => passwordRules.map((rule) => ({ ...rule, met: rule.test(values.password) })),
    [passwordRules, values.password]
  );

  const localErrors = useMemo<CreateAccountFieldErrors>(() => {
    const next: CreateAccountFieldErrors = {};
    if (!values.firstName.trim()) next.firstName = "Enter your first name.";
    if (!values.lastName.trim()) next.lastName = "Enter your last name.";
    if (!values.email.trim()) next.email = "Enter your email address.";
    else if (!isValidEmail(values.email.trim()))
      next.email = "Enter an email address such as name@example.com.";
    if (!values.password) next.password = "Choose a password.";
    else if (ruleResults.some((rule) => !rule.met))
      next.password = "Your password does not meet all of the requirements below.";
    if (requireConfirmPassword) {
      if (!confirmPassword) next.confirmPassword = "Type your password again.";
      else if (confirmPassword !== values.password)
        next.confirmPassword = "The two passwords do not match.";
    }
    if (!consent) next.consent = consentErrorMessage;
    return next;
  }, [values, confirmPassword, consent, consentErrorMessage, requireConfirmPassword, ruleResults]);

  const errorFor = useCallback(
    (field: CreateAccountFieldName): string | undefined => {
      const serverError = fieldErrors?.[field];
      if (serverError) return serverError;
      if (!submitAttempted && !touched[field]) return undefined;
      return localErrors[field];
    },
    [fieldErrors, localErrors, submitAttempted, touched]
  );

  const markTouched = useCallback(
    (field: CreateAccountFieldName) => setTouched((prev) => ({ ...prev, [field]: true })),
    []
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Guard duplicate submission: a second attempt while one is in flight is
      // dropped rather than queued.
      if (locked) return;
      setSubmitAttempted(true);
      const order: CreateAccountFieldName[] = [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
        "consent",
      ];
      const firstInvalid = order.find((field) => localErrors[field]);
      if (firstInvalid) {
        fieldRefs.current[firstInvalid]?.focus();
        return;
      }
      onSubmit({ ...values, consent });
    },
    [consent, localErrors, locked, onSubmit, values]
  );

  const Heading = headingLevel;

  const passwordError = errorFor("password");
  const consentError = errorFor("consent");

  const resolvedConsentLabel =
    consentLabel ?? "I agree to the terms of service and privacy policy.";

  return (
    // `@container` makes the block adapt to the column it is placed in, not
    // to the viewport: a 360px settings column at 1440px behaves like a phone.
    <section aria-labelledby={titleId} className={cn("@container w-full", className)}>
      <div className="flex flex-col gap-6 rounded-12 border border-surface-border bg-surface p-4 @min-[420px]:p-6">
        <header className="flex flex-col gap-2">
          <Heading id={titleId} className="text-h6 font-semibold text-grey-900">
            {title}
          </Heading>
          {description && <p className="text-body-sm text-grey-600">{description}</p>}
        </header>

        {disabled && (
          <Alert
            state="information"
            icon="info-circle"
            role="status"
            title={disabledMessage}
            className="bg-surface dark:bg-surface"
          />
        )}

        {status === "error" && errorMessage && (
          <Alert
            state="error"
            icon="info-triangle"
            role="alert"
            title="We could not create your account"
            description={errorMessage}
            className="bg-surface dark:bg-surface"
          />
        )}

        {succeeded && successMessage && (
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
            <Spinner size="md" label="Preparing the sign-up form…" labelPosition="below" />
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 @min-[520px]:grid-cols-2">
              <Input
                id={`${uid}-firstName`}
                ref={(node) => {
                  fieldRefs.current.firstName = node;
                }}
                name="firstName"
                label={labels?.firstName ?? "First name"}
                autoComplete="given-name"
                required
                size="md"
                disabled={locked}
                value={values.firstName}
                error={errorFor("firstName")}
                onChange={(e) => setValues((p) => ({ ...p, firstName: e.target.value }))}
                onBlur={() => markTouched("firstName")}
              />
              <Input
                id={`${uid}-lastName`}
                ref={(node) => {
                  fieldRefs.current.lastName = node;
                }}
                name="lastName"
                label={labels?.lastName ?? "Last name"}
                autoComplete="family-name"
                required
                size="md"
                disabled={locked}
                value={values.lastName}
                error={errorFor("lastName")}
                onChange={(e) => setValues((p) => ({ ...p, lastName: e.target.value }))}
                onBlur={() => markTouched("lastName")}
              />
            </div>

            <Input
              id={`${uid}-email`}
              ref={(node) => {
                fieldRefs.current.email = node;
              }}
              name="email"
              type="email"
              inputMode="email"
              label={labels?.email ?? "Work email"}
              placeholder="name@example.com"
              autoComplete="email"
              required
              size="md"
              disabled={locked}
              value={values.email}
              error={errorFor("email")}
              onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
              onBlur={() => markTouched("email")}
            />

            <div className="flex flex-col gap-2">
              <Input
                id={`${uid}-password`}
                ref={(node) => {
                  fieldRefs.current.password = node;
                }}
                name="password"
                type={revealPassword ? "text" : "password"}
                label={labels?.password ?? "Password"}
                autoComplete="new-password"
                required
                size="md"
                disabled={locked}
                value={values.password}
                // Boolean error: the message and the guidance list are rendered
                // here so a single `aria-describedby` can reference both.
                error={Boolean(passwordError)}
                aria-describedby={[passwordError ? passwordErrorId : null, passwordRulesId]
                  .filter(Boolean)
                  .join(" ")}
                onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
                onBlur={() => markTouched("password")}
                trailingAction={
                  <button
                    type="button"
                    // Stays available while a submission is in flight: it only
                    // changes how an already-entered value is displayed.
                    onClick={() => setRevealPassword((v) => !v)}
                    className="inline-flex cursor-pointer items-center rounded p-1 text-grey-500 hover:text-grey-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
                  >
                    <Icon name={revealPassword ? "eye-slash" : "eye"} size="md" />
                    <span className="sr-only">
                      {revealPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                }
              />
              {passwordError && (
                <p id={passwordErrorId} className="text-body-sm text-feedback-error">
                  {passwordError}
                </p>
              )}
              <ul id={passwordRulesId} role="list" className="flex flex-col gap-1">
                {ruleResults.map((rule) => (
                  <li
                    key={rule.id}
                    className={cn(
                      "flex items-center gap-2 text-body-sm",
                      rule.met ? "text-feedback-success" : "text-grey-600"
                    )}
                  >
                    <Icon name={rule.met ? "check-circle" : "minus-circle"} size="sm" />
                    <span>{rule.label}</span>
                    {/* Status is never carried by colour or icon alone. */}
                    <span className="sr-only">{rule.met ? "— met" : "— not met yet"}</span>
                  </li>
                ))}
              </ul>
            </div>

            {requireConfirmPassword && (
              <Input
                id={`${uid}-confirmPassword`}
                ref={(node) => {
                  fieldRefs.current.confirmPassword = node;
                }}
                name="confirmPassword"
                type={revealPassword ? "text" : "password"}
                label={labels?.confirmPassword ?? "Confirm password"}
                autoComplete="new-password"
                required
                size="md"
                disabled={locked}
                value={confirmPassword}
                error={errorFor("confirmPassword")}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
              />
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <span className="pt-0.5">
                  <Checkbox
                    id={consentId}
                    ref={(node) => {
                      fieldRefs.current.consent = node;
                    }}
                    name="consent"
                    checked={consent}
                    disabled={locked}
                    required
                    aria-labelledby={consentTextId}
                    aria-invalid={consentError ? true : undefined}
                    aria-describedby={consentError ? consentErrorId : undefined}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      markTouched("consent");
                    }}
                  />
                </span>
                {/* A label may contain links: the browser does not forward the
                  activation to the control when the target is interactive. */}
                <label
                  id={consentTextId}
                  htmlFor={consentId}
                  className={cn(
                    "text-body-sm text-grey-700",
                    locked ? "opacity-60" : "cursor-pointer"
                  )}
                >
                  {resolvedConsentLabel}
                </label>
              </div>
              {consentError && (
                <p id={consentErrorId} className="text-body-sm text-feedback-error">
                  {consentError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full"
                disabled={locked}
              >
                {pending ? submittingLabel : submitLabel}
              </Button>
              {/* Politely announces that a submission is in flight. */}
              <output id={unsavedRegionId} className="sr-only">
                {pending ? submittingLabel : ""}
              </output>
              {signIn && (
                <p className="text-center text-body-sm text-grey-600">
                  Already have an account?{" "}
                  <a
                    href={signIn.href}
                    // Submission in flight: stop a second authentication route
                    // from starting, the way the submit control is stopped.
                    aria-disabled={pending || undefined}
                    tabIndex={pending ? -1 : undefined}
                    onClick={(event) => {
                      if (pending) event.preventDefault();
                    }}
                    className={cn(
                      "rounded font-semibold text-action-primary-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text",
                      pending && "pointer-events-none opacity-60"
                    )}
                  >
                    {signIn.label}
                  </a>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
