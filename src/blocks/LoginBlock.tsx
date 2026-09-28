import { useId, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Checkbox } from "../components/FormControl";
import { Icon } from "../components/Icon";

// ─── Types ───────────────────────────────────────────────────────────
export type LoginBlockVariant = "standard" | "card" | "work-email";

export interface LoginBlockSocialProvider {
  name: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface LoginBlockProps {
  /** Visual variant */
  variant?: LoginBlockVariant;
  /** Form heading */
  title?: string;
  /** Subtitle / description */
  subtitle?: string;
  /** Submit button label */
  submitLabel?: string;
  /**
   * Password recovery handler. Rendered in every variant that supplies it,
   * independently of `showRememberMe`.
   */
  onForgotPassword?: () => void;
  /** Form submit handler. `rememberMe` reflects the visible checkbox. */
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void;
  /**
   * Authentication is in flight.
   *
   * While true the block disables every control that could change the
   * credentials being verified, change remembered-session intent, or start a
   * competing authentication route: email, password, remember-me, password
   * recovery, each social provider, submit, and sign-up. Repeat submits are
   * also ignored, so pressing Enter cannot queue a second request.
   *
   * The password visibility toggle stays enabled: it only changes how the
   * already-entered value is displayed.
   */
  pending?: boolean;
  /** Submit label while `pending` is true. */
  pendingLabel?: string;
  /** Error message shown above the submit button, e.g. a rejected sign-in. */
  error?: string;
  /** Social login providers */
  socialProviders?: LoginBlockSocialProvider[];
  /** Sign-up link handler */
  onSignUp?: () => void;
  /** Sign-up prompt text */
  signUpPrompt?: string;
  /** Sign-up link text */
  signUpLabel?: string;
  /** Show remember me checkbox */
  showRememberMe?: boolean;
  /** Label for the remember-me checkbox. Avoid promising a duration the app cannot honour. */
  rememberMeLabel?: string;
  /** Additional class names */
  className?: string;
}

// ─── Google Icon ──────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M18.17 8.37H17.5V8.33H10V11.67H14.71C14.02 13.61 12.18 15 10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C11.27 5 12.42 5.48 13.3 6.27L15.67 3.9C14.15 2.49 12.18 1.67 10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 9.44 18.28 8.9 18.17 8.37Z"
        fill="#FFC107"
      />
      <path
        d="M2.63 6.12L5.37 8.13C6.12 6.29 7.91 5 10 5C11.27 5 12.42 5.48 13.3 6.27L15.67 3.9C14.15 2.49 12.18 1.67 10 1.67C6.95 1.67 4.31 3.47 2.63 6.12Z"
        fill="#FF3D00"
      />
      <path
        d="M10 18.33C12.13 18.33 14.06 17.55 15.56 16.2L12.96 14.01C12.12 14.63 11.09 15 10 15C7.83 15 5.99 13.62 5.3 11.69L2.58 13.78C4.24 16.51 6.91 18.33 10 18.33Z"
        fill="#4CAF50"
      />
      <path
        d="M18.17 8.37H17.5V8.33H10V11.67H14.71C14.38 12.59 13.79 13.38 13 13.96L13 13.96L15.56 16.2C15.37 16.37 18.33 14.17 18.33 10C18.33 9.44 18.28 8.9 18.17 8.37Z"
        fill="#1976D2"
      />
    </svg>
  );
}

// ─── Twitter / X Icon ────────────────────────────────────────────────
function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15.27 1.58H18.08L11.94 8.66L19.17 18.42H13.51L9.08 12.6L4.01 18.42H1.19L7.79 10.84L0.83 1.58H6.63L10.61 6.88L15.27 1.58ZM14.27 16.68H15.83L5.83 3.18H4.17L14.27 16.68Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────
export function LoginBlock({
  variant = "standard",
  title,
  subtitle,
  submitLabel,
  onForgotPassword,
  onSubmit,
  socialProviders,
  onSignUp,
  signUpPrompt,
  signUpLabel,
  showRememberMe = true,
  rememberMeLabel = "Remember me",
  pending = false,
  pendingLabel = "Signing in…",
  error,
  className,
}: LoginBlockProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const uid = useId();
  const headingId = `${uid}-heading`;
  const passwordId = `${uid}-password`;
  const errorId = `${uid}-error`;
  const isWorkEmail = variant === "work-email";
  const isCard = variant === "card";
  const resolvedTitle = title ?? (isWorkEmail ? "Sign in to your workspace" : "Welcome back");
  const resolvedSubtitle =
    subtitle ??
    (isWorkEmail
      ? "Use your work email to continue to your team."
      : "Enter your details to sign in to your account.");
  const resolvedSubmitLabel = submitLabel ?? "Sign in";
  const resolvedSignUpPrompt = signUpPrompt ?? "Don't have an account?";
  const resolvedSignUpLabel = signUpLabel ?? "Create an account";
  const resolvedProviders: LoginBlockSocialProvider[] = socialProviders ?? [
    { name: "Google", icon: <GoogleIcon /> },
    { name: "Twitter", icon: <TwitterIcon /> },
  ];
  const visibleProviders = isWorkEmail ? resolvedProviders.slice(0, 1) : resolvedProviders;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    onSubmit?.({ email, password, rememberMe });
  };

  const textActionClass =
    "inline-flex min-h-8 items-center rounded text-sm font-semibold text-action-primary-text underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text cursor-pointer";

  const socialSection = visibleProviders.length > 0 && (
    <div className="flex w-full flex-col gap-4">
      {!isWorkEmail && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-surface-border-strong" />
          <span className="shrink-0 text-xs text-on-surface-muted">Or continue with</span>
          <span className="h-px flex-1 bg-surface-border-strong" />
        </div>
      )}
      <div
        className={cn("grid gap-3", !isWorkEmail && visibleProviders.length === 2 && "grid-cols-2")}
      >
        {visibleProviders.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={provider.onClick}
            disabled={pending}
            aria-label={`Continue with ${provider.name}`}
            className="flex min-h-12 min-w-0 items-center justify-center gap-2.5 rounded-lg border border-surface-border-strong bg-surface px-3 py-2.5 text-sm font-medium text-on-surface-body transition-colors hover:bg-grey-50 active:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text cursor-pointer"
          >
            <span className="size-5 shrink-0" aria-hidden="true">
              {provider.icon}
            </span>
            <span className="min-w-0 break-words">
              {isWorkEmail ? `Continue with ${provider.name}` : provider.name}
            </span>
          </button>
        ))}
      </div>
      {isWorkEmail && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-surface-border-strong" />
          <span className="shrink-0 text-xs text-on-surface-muted">Or use your work email</span>
          <span className="h-px flex-1 bg-surface-border-strong" />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-[400px] flex-col gap-6",
        isCard &&
          "max-w-[448px] rounded-2xl border border-surface-border-strong bg-surface p-5 shadow-soft-md sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-2 pb-1">
        <h2
          id={headingId}
          className="text-[28px] font-semibold leading-tight tracking-tight text-on-surface text-balance"
        >
          {resolvedTitle}
        </h2>
        <p className="text-sm leading-relaxed text-on-surface-muted text-pretty">
          {resolvedSubtitle}
        </p>
      </div>

      {isWorkEmail && socialSection}

      <form
        onSubmit={handleSubmit}
        aria-labelledby={headingId}
        aria-describedby={error ? errorId : undefined}
        aria-busy={pending || undefined}
        className="flex w-full min-w-0 flex-col gap-5"
      >
        <Input
          label={isWorkEmail ? "Work email" : "Email address"}
          placeholder={isWorkEmail ? "you@company.com" : "you@example.com"}
          size="md"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          wrapperClassName="gap-2"
        />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <label htmlFor={passwordId} className="text-sm font-medium text-on-surface">
              Password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                disabled={pending}
                className={textActionClass}
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input
            id={passwordId}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            size="md"
            autoComplete="current-password"
            required
            disabled={pending}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            trailingAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="-mr-2 flex size-10 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-action-primary-text cursor-pointer"
              >
                <Icon name={showPassword ? "eye" : "eye-slash"} size="sm" />
              </button>
            }
          />
        </div>

        {showRememberMe && !isWorkEmail && (
          <Checkbox
            label={rememberMeLabel}
            checked={rememberMe}
            disabled={pending}
            onChange={() => setRememberMe(!rememberMe)}
            wrapperClassName={cn(
              "min-h-6 self-start gap-2.5 [&_span]:text-sm [&_span]:font-normal",
              pending && "cursor-not-allowed opacity-50"
            )}
          />
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="rounded-lg bg-error-50 px-3 py-2.5 text-sm leading-relaxed text-feedback-error"
          >
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="h-12 w-full min-w-0 px-4 py-3 text-sm"
          disabled={pending}
          aria-busy={pending || undefined}
        >
          {pending && (
            <span
              aria-hidden="true"
              className="size-4 shrink-0 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
            />
          )}
          {pending ? pendingLabel : resolvedSubmitLabel}
        </Button>
      </form>

      {!isWorkEmail && socialSection}

      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0 text-center">
        <span className="text-sm leading-relaxed text-on-surface-muted">
          {resolvedSignUpPrompt}
        </span>
        <button type="button" onClick={onSignUp} disabled={pending} className={textActionClass}>
          {resolvedSignUpLabel}
        </button>
      </div>
    </div>
  );
}
