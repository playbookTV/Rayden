import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Checkbox } from "../components/FormControl";
import { Divider } from "../components/Divider";
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
  /** Forgot password handler */
  onForgotPassword?: () => void;
  /** Form submit handler */
  onSubmit?: (data: { email: string; password: string }) => void;
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
  /** Additional class names */
  className?: string;
}

// ─── Google Icon ──────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18.17 8.37H17.5V8.33H10V11.67H14.71C14.02 13.61 12.18 15 10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C11.27 5 12.42 5.48 13.3 6.27L15.67 3.9C14.15 2.49 12.18 1.67 10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 9.44 18.28 8.9 18.17 8.37Z" fill="#FFC107"/>
      <path d="M2.63 6.12L5.37 8.13C6.12 6.29 7.91 5 10 5C11.27 5 12.42 5.48 13.3 6.27L15.67 3.9C14.15 2.49 12.18 1.67 10 1.67C6.95 1.67 4.31 3.47 2.63 6.12Z" fill="#FF3D00"/>
      <path d="M10 18.33C12.13 18.33 14.06 17.55 15.56 16.2L12.96 14.01C12.12 14.63 11.09 15 10 15C7.83 15 5.99 13.62 5.3 11.69L2.58 13.78C4.24 16.51 6.91 18.33 10 18.33Z" fill="#4CAF50"/>
      <path d="M18.17 8.37H17.5V8.33H10V11.67H14.71C14.38 12.59 13.79 13.38 13 13.96L13 13.96L15.56 16.2C15.37 16.37 18.33 14.17 18.33 10C18.33 9.44 18.28 8.9 18.17 8.37Z" fill="#1976D2"/>
    </svg>
  );
}

// ─── Twitter / X Icon ────────────────────────────────────────────────
function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15.27 1.58H18.08L11.94 8.66L19.17 18.42H13.51L9.08 12.6L4.01 18.42H1.19L7.79 10.84L0.83 1.58H6.63L10.61 6.88L15.27 1.58ZM14.27 16.68H15.83L5.83 3.18H4.17L14.27 16.68Z" fill="#1DA1F2"/>
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
  className,
}: LoginBlockProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Defaults per variant
  const resolvedTitle =
    title ??
    (variant === "work-email" ? "Sign in with your work email" : "Log In");
  const resolvedSubtitle =
    subtitle ??
    (variant === "work-email"
      ? "Use your work email to sign in to your team workspace"
      : "Enter your credentials to access your account");
  const resolvedSubmitLabel =
    submitLabel ??
    (variant === "work-email" ? "Sign in" : "Log into Account");
  const resolvedSignUpPrompt =
    signUpPrompt ??
    (variant === "work-email" ? "Don't have an account?" : "Are you new here?");
  const resolvedSignUpLabel =
    signUpLabel ??
    (variant === "work-email" ? "Sign up" : "Create Account");
  const resolvedProviders: LoginBlockSocialProvider[] = socialProviders ?? [
    { name: "Google", icon: <GoogleIcon /> },
    { name: "Twitter", icon: <TwitterIcon /> },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  const isWorkEmail = variant === "work-email";
  const isCard = variant === "card";

  // Social buttons rendered as a section
  const socialSection = resolvedProviders.length > 0 && (
    <div className="flex flex-col gap-3">
      {resolvedProviders.map((provider) => (
        <button
          key={provider.name}
          type="button"
          onClick={provider.onClick}
          className="flex items-center justify-center gap-4 w-full rounded-md border-[1.5px] border-grey-300 bg-white p-4 text-base font-semibold text-grey-700 hover:bg-grey-50 transition-colors"
        >
          <span className="shrink-0 size-5">{provider.icon}</span>
          Continue with {provider.name}
        </button>
      ))}
    </div>
  );

  const formContent = (
    <>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[28px] font-semibold text-grey-900 leading-[1.2] tracking-[-0.56px]">
          {resolvedTitle}
        </h2>
        <p className="text-base text-grey-500">{resolvedSubtitle}</p>
      </div>

      {/* Work email: social first, then divider, then form */}
      {isWorkEmail && socialSection && (
        <>
          <div className="mt-10">
            {/* Only Google for work email variant */}
            <button
              type="button"
              onClick={resolvedProviders[0]?.onClick}
              className="flex items-center justify-center gap-4 w-full rounded-md border-[1.5px] border-grey-300 bg-white p-4 text-base font-semibold text-grey-700 hover:bg-grey-50 transition-colors"
            >
              <span className="shrink-0 size-5">
                {resolvedProviders[0]?.icon}
              </span>
              Continue with Google
            </button>
          </div>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-grey-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-grey-500">OR</span>
            </div>
          </div>
        </>
      )}

      {/* Form fields */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col",
          isWorkEmail ? "gap-6" : "gap-8",
          !isWorkEmail && "mt-10"
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <Input
              label={isWorkEmail ? "Email Address" : "EMAIL ADDRESS"}
              placeholder={isWorkEmail ? "" : "Enter Email"}
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              trailingIcon="mail"
            />
            <Input
              label="PASSWORD"
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              trailingIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-grey-400 hover:text-grey-600"
                >
                  <Icon
                    name={showPassword ? "eye" : "eye-slash"}
                    size="sm"
                  />
                </button>
              }
            />
          </div>

          {/* Remember me + Forgot password */}
          {showRememberMe && !isWorkEmail && (
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me for 30 days"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm font-medium text-primary-600"
                >
                  Forgot Password?
                </button>
              )}
            </div>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
        >
          {resolvedSubmitLabel}
        </Button>
      </form>

      {/* Standard/Card: divider + social below form */}
      {!isWorkEmail && socialSection && (
        <>
          <Divider variant="with-label" label="Or" />
          {socialSection}
        </>
      )}

      {/* Sign up link */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-sm text-grey-500">{resolvedSignUpPrompt}</span>
        <button
          type="button"
          onClick={onSignUp}
          className="text-sm font-medium text-primary-600"
        >
          {resolvedSignUpLabel}
        </button>
      </div>
    </>
  );

  // Card variant wraps in a bordered card
  if (isCard) {
    return (
      <div
        className={cn(
          "bg-white border border-grey-300 rounded-[10px] px-7 py-8",
          className
        )}
      >
        <div className="flex flex-col gap-8 w-[400px]">
          {formContent}
        </div>
      </div>
    );
  }

  // Standard / Work-email: no card wrapper
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 w-[400px]",
        className
      )}
    >
      {formContent}
    </div>
  );
}
