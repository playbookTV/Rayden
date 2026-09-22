import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { CreateAccountBlock } from "./CreateAccountBlock";

const meta: Meta<typeof CreateAccountBlock> = {
  title: "Blocks/CreateAccount",
  component: CreateAccountBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CreateAccountBlock>;

/** Bounded but shrinkable, so the example is not wider than the block. */
function Frame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="mx-auto w-full max-w-[560px]">{children}</div>;
}

const consent = (
  <>
    I agree to the{" "}
    <a
      href="https://example.com/terms"
      className="rounded font-semibold text-action-primary-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
    >
      terms of service
    </a>{" "}
    and the{" "}
    <a
      href="https://example.com/privacy"
      className="rounded font-semibold text-action-primary-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
    >
      privacy policy
    </a>
    .
  </>
);

/* ─── Default ─────────────────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock
        onSubmit={fn()}
        consentLabel={consent}
        signIn={{ label: "Sign in", href: "https://example.com/sign-in" }}
      />
    </Frame>
  ),
};

/* ─── Field validation ────────────────────────────────────────────── */
/* Submitting an empty form must not reach the app, and every failing field
   must say what is wrong. */
export const ValidationErrors: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock onSubmit={fn()} consentLabel={consent} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));

    await expect(canvas.getByText("Enter your first name.")).toBeVisible();
    await expect(canvas.getByText("Enter your last name.")).toBeVisible();
    await expect(canvas.getByText("Enter your email address.")).toBeVisible();
    await expect(canvas.getByText("Choose a password.")).toBeVisible();
    await expect(
      canvas.getByText("Please accept the terms before creating an account.")
    ).toBeVisible();

    // Focus is moved to the first field that needs attention.
    await expect(canvas.getByLabelText("First name")).toHaveFocus();

    // A malformed address is reported as soon as the field is left.
    const email = canvas.getByLabelText("Work email");
    await userEvent.type(email, "not-an-address");
    await userEvent.tab();
    await expect(
      canvas.getByText("Enter an email address such as name@example.com.")
    ).toBeVisible();
  },
};

/* ─── Password guidance ───────────────────────────────────────────── */
export const PasswordGuidance: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock onSubmit={fn()} consentLabel={consent} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText("Password");

    // Every rule starts unmet and says so in text, not only in colour.
    await expect(canvas.getAllByText("— not met yet")).toHaveLength(3);

    await userEvent.type(password, "Sunrise42");
    await expect(canvas.getAllByText("— met")).toHaveLength(3);

    // The reveal toggle is a named control, not an unlabelled icon.
    const reveal = canvas.getByRole("button", { name: "Show password" });
    await userEvent.click(reveal);
    await expect(password).toHaveAttribute("type", "text");
    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(password).toHaveAttribute("type", "password");
  },
};

/* ─── A complete, valid submission ────────────────────────────────── */
export const SubmitsValidDetails: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock onSubmit={fn()} consentLabel={consent} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("First name"), "Amara");
    await userEvent.type(canvas.getByLabelText("Last name"), "Okonkwo");
    await userEvent.type(canvas.getByLabelText("Work email"), "amara@example.com");
    await userEvent.type(canvas.getByLabelText("Password"), "Sunrise42");
    await userEvent.type(canvas.getByLabelText("Confirm password"), "Sunrise42");

    // Consent is required: the form is still blocked until it is given.
    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));
    await expect(
      canvas.getByText("Please accept the terms before creating an account.")
    ).toBeVisible();

    const consentBox = canvas.getByRole("checkbox");
    await userEvent.click(consentBox);
    await expect(consentBox).toBeChecked();

    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));
    await expect(
      canvas.queryByText("Please accept the terms before creating an account.")
    ).toBeNull();
  },
};

/* ─── Mismatched passwords ────────────────────────────────────────── */
export const PasswordsDoNotMatch: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock onSubmit={fn()} consentLabel={consent} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Password"), "Sunrise42");
    await userEvent.type(canvas.getByLabelText("Confirm password"), "Sunrise43");
    await userEvent.tab();
    await expect(canvas.getByText("The two passwords do not match.")).toBeVisible();
  },
};

/* ─── Submitting ──────────────────────────────────────────────────── */
/* Everything that could start a second registration is disabled, including
   the consent control and the sign-in destination. */
export const Submitting: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock
        onSubmit={fn()}
        status="submitting"
        consentLabel={consent}
        signIn={{ label: "Sign in", href: "https://example.com/sign-in" }}
        defaultValues={{
          firstName: "Amara",
          lastName: "Okonkwo",
          email: "amara@example.com",
        }}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Work email")).toBeDisabled();
    await expect(canvas.getByRole("checkbox")).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Creating account…" })).toBeDisabled();
    await expect(canvas.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  },
};

/* ─── Failure reported by the application ─────────────────────────── */
export const ServerError: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock
        onSubmit={fn()}
        status="error"
        errorMessage="We could not reach the sign-up service. Your details are still here — try again."
        fieldErrors={{ email: "An account already uses this email address." }}
        defaultValues={{
          firstName: "Amara",
          lastName: "Okonkwo",
          email: "amara@example.com",
        }}
        consentLabel={consent}
        signIn={{ label: "Sign in", href: "https://example.com/sign-in" }}
      />
    </Frame>
  ),
};

/* ─── Success confirmed by the application ────────────────────────── */
export const SuccessConfirmed: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock
        onSubmit={fn()}
        status="success"
        successMessage="Your account is ready. Check amara@example.com to confirm the address."
        defaultValues={{
          firstName: "Amara",
          lastName: "Okonkwo",
          email: "amara@example.com",
        }}
        consentLabel={consent}
      />
    </Frame>
  ),
};

/* ─── Loading the sign-up context ─────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock onSubmit={fn()} status="loading" consentLabel={consent} />
    </Frame>
  ),
};

/* ─── Registration unavailable ────────────────────────────────────── */
export const RegistrationClosed: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock
        onSubmit={fn()}
        disabled
        disabledMessage="This invitation expired on 14 September 2026. Ask your administrator for a new one."
        consentLabel={consent}
        signIn={{ label: "Sign in", href: "https://example.com/sign-in" }}
      />
    </Frame>
  ),
};

/* ─── Long, translated labels ─────────────────────────────────────── */
/* German compounds and a long consent sentence must wrap, not clip. */
export const TranslatedLabels: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock
        title="Benutzerkonto erstellen"
        description="Richten Sie einen kostenlosen Arbeitsbereich ein. Keine Zahlungsinformationen erforderlich."
        submitLabel="Benutzerkonto jetzt erstellen"
        submittingLabel="Benutzerkonto wird erstellt…"
        labels={{
          firstName: "Vorname",
          lastName: "Familienname",
          email: "Geschäftliche E-Mail-Adresse",
          password: "Kennwort",
          confirmPassword: "Kennwortbestätigung",
        }}
        passwordRules={[
          { id: "length", label: "Mindestens acht Zeichen", test: (v) => v.length >= 8 },
          {
            id: "case",
            label: "Groß- und Kleinbuchstaben verwenden",
            test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
          },
          { id: "number", label: "Mindestens eine Ziffer", test: (v) => /\d/.test(v) },
        ]}
        consentErrorMessage="Bitte stimmen Sie den Bedingungen zu, bevor Sie fortfahren."
        consentLabel="Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung zu und bin damit einverstanden, gelegentlich Produktinformationen zu erhalten."
        signIn={{ label: "Stattdessen anmelden", href: "https://example.com/sign-in" }}
        onSubmit={fn()}
      />
    </Frame>
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* A brand surface value is mode-specific: Rayden has no paired foreground
   role yet, so a light brand surface is scoped as an explicit light island
   (`rayden-light`). Without that scope, a light surface inside a dark
   document would keep the inverted, near-white grey foregrounds. */
/* The card responds to the semantic surface role without a block override. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="rayden-light w-full bg-surface-muted p-4"
      style={
        {
          "--color-surface": "#f2e9da",
          "--color-surface-border": "#e0d3bd",
          "--color-surface-border-strong": "#c8b393",
        } as CSSProperties
      }
    >
      <Frame>
        <CreateAccountBlock onSubmit={fn()} consentLabel={consent} />
      </Frame>
    </div>
  ),
};

/* ─── Heading contract ────────────────────────────────────────────── */
export const HeadingLevelOne: Story = {
  render: () => (
    <Frame>
      <CreateAccountBlock headingLevel="h1" onSubmit={fn()} consentLabel={consent} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Create your account" })
    ).toBeVisible();
  },
};

/* ─── Narrow container ────────────────────────────────────────────── */
/* A 360px column at a desktop viewport. The block reads its own container,
   so the name row stacks here even though the viewport is wide. */
export const NarrowContainer: Story = {
  render: () => (
    <div className="w-[360px] border border-dashed border-surface-border-strong p-2">
      <CreateAccountBlock onSubmit={fn()} consentLabel={consent} />
    </div>
  ),
};
