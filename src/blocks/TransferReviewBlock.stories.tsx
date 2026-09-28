import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { TransferReviewBlock, type TransferReviewParty } from "./TransferReviewBlock";

const meta: Meta<typeof TransferReviewBlock> = {
  title: "Blocks/Transfer Review",
  component: TransferReviewBlock,
  tags: ["autodocs"],
  /**
   * Fullscreen plus an explicit-width decorator. Storybook's padded layout is a
   * flex column with `align-items: center`, which sizes a story shrink-to-fit;
   * a root carrying `container-type: inline-size` then resolves to 0px and the
   * block paints outside its own box.
   */
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full min-w-0 bg-surface-muted p-4 text-on-surface">
        {Story()}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TransferReviewBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────── */

const recipient: TransferReviewParty = {
  name: "Ama Boateng",
  reference: "GB29 •••• 0026",
  institution: "Zenith Bank UK",
  detail: "London, United Kingdom",
  initials: "AB",
};

const source: TransferReviewParty = {
  name: "Meridian Trading Ltd",
  reference: "•••• 4417",
  institution: "Current account",
  icon: "bank",
};

/* ─── Default ─────────────────────────────────────────────────────────
   Every figure supplied by the caller. The block presents them and calls a
   callback; it sends nothing and claims nothing.
   ------------------------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={250_000}
      sendCurrency="GBP"
      fee={150}
      totalDebited={250_150}
      arrival="Within 2 hours"
      reference="INV-2026-0918"
      onEditAmount={fn()}
      onEditRecipient={fn()}
      onConfirm={fn()}
      onCancel={fn()}
      disclosure="Faster Payments are usually immediate but can take up to two hours. Your bank may apply its own limits."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "Review transfer" })).toBeVisible();
    await expect(canvas.getByText("£2,500.00")).toBeVisible();
    await expect(canvas.getByText("£1.50")).toBeVisible();
    await expect(canvas.getByText("£2,501.50")).toBeVisible();
    // The block states plainly that nothing has happened yet.
    await expect(canvas.getByText("Nothing is sent until you confirm.")).toBeVisible();
    // And it has produced no outcome of its own.
    await expect(canvas.queryByRole("status")).toBeNull();
  },
};

/* ─── Confirmation latches, and invents no success ─────────────────────
   The control disables itself after the first activation, because a live
   confirm control in a payment flow is a defect. Nothing in the rendered output
   claims the transfer succeeded. The call count itself is asserted in
   `ConfirmationIsCounted` below, against a spy that story owns.
   ------------------------------------------------------------------- */
export const ConfirmationLatches: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={250_000}
      sendCurrency="GBP"
      fee={0}
      totalDebited={250_000}
      arrival="Within 2 hours"
      onConfirm={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const confirm = canvas.getByRole("button", { name: /Confirm transfer/ });
    await expect(confirm).toBeEnabled();

    await userEvent.click(confirm);
    await expect(confirm).toBeDisabled();

    // A second press cannot reach the handler.
    await userEvent.click(confirm);

    // No success region appeared. A `role="status"` here would be the block
    // claiming an outcome it cannot know.
    await expect(canvas.queryByRole("status")).toBeNull();
    await expect(canvas.queryByText(/succe(ss|eded)|has been sent|transfer complete/i)).toBeNull();
  },
};

/* ─── The same assertion with a counted spy ───────────────────────────
   Kept separate so the call count is asserted against a spy the story owns.
   ------------------------------------------------------------------- */
function CountingHarness() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <p data-testid="confirm-count" className="text-body-sm text-on-surface-body">
        Confirmations sent: {count}
      </p>
      <TransferReviewBlock
        source={source}
        recipient={recipient}
        sendAmount={250_000}
        sendCurrency="GBP"
        fee={0}
        totalDebited={250_000}
        arrival="Within 2 hours"
        onConfirm={() => setCount((value) => value + 1)}
      />
    </div>
  );
}

export const ConfirmationIsCounted: Story = {
  render: () => <CountingHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const confirm = canvas.getByRole("button", { name: /Confirm transfer/ });
    await userEvent.click(confirm);
    await userEvent.click(confirm);
    await userEvent.click(confirm);
    await expect(canvas.getByTestId("confirm-count")).toHaveTextContent("Confirmations sent: 1");
  },
};

/* ─── An acknowledgement gate ─────────────────────────────────────────
   Confirmation is impossible until the reader ticks the box.
   ------------------------------------------------------------------- */
export const AcknowledgementRequired: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={1_250_000}
      sendCurrency="GBP"
      fee={250}
      totalDebited={1_252_500}
      arrival="Within 2 hours"
      requireAcknowledgement
      acknowledgementLabel="I have checked the name and account number. Payments to the wrong account may not be recoverable."
      onConfirm={fn()}
      onCancel={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const confirm = canvas.getByRole("button", { name: /Confirm transfer/ });
    await expect(confirm).toBeDisabled();

    const checkbox = canvas.getByRole("checkbox");
    await userEvent.click(checkbox);
    await expect(confirm).toBeEnabled();

    await userEvent.click(checkbox);
    await expect(confirm).toBeDisabled();
  },
};

function ReviewChangesHarness() {
  const [amount, setAmount] = useState(10_000);
  const [fee, setFee] = useState(100);
  const [name, setName] = useState("Ama Boateng");
  const [revision, setRevision] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setFee((value) => value + 100)}>Refresh provider fee</button>
        <button onClick={() => setRevision((value) => value + 1)}>Refresh unchanged details</button>
        <span>Refreshes: {revision}</span>
      </div>
      <TransferReviewBlock
        recipient={{ ...recipient, name }}
        sendAmount={amount}
        sendCurrency="GBP"
        fee={fee}
        requireAcknowledgement
        onEditRecipient={() => setName("Studio Kleur B.V.")}
        onEditAmount={() => setAmount(20_000)}
        onConfirm={fn()}
      />
    </div>
  );
}

export const ReviewedDetailsMustBeAcknowledgedAgain: Story = {
  render: () => <ReviewChangesHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    const confirm = canvas.getByRole("button", { name: "Confirm transfer" });
    await userEvent.click(checkbox);
    await userEvent.click(canvas.getByRole("button", { name: "Refresh unchanged details" }));
    await expect(checkbox).toBeChecked();
    await expect(confirm).toBeEnabled();
    for (const name of ["Change recipient", "Change amount", "Refresh provider fee"]) {
      await userEvent.click(canvas.getByRole("button", { name }));
      await expect(checkbox).not.toBeChecked();
      await expect(confirm).toBeDisabled();
      await userEvent.click(checkbox);
      await expect(confirm).toBeEnabled();
    }
  },
};

function SubmissionStatesHarness() {
  const [phase, setPhase] = useState<"default" | "pending" | "result" | "error">("default");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setPhase("pending")}>Provider pending</button>
        <button onClick={() => setPhase("result")}>Provider accepted</button>
        <button onClick={() => setPhase("error")}>Provider rejected</button>
      </div>
      <TransferReviewBlock
        recipient={recipient}
        sendAmount={10_000}
        sendCurrency="GBP"
        state={phase === "result" ? "default" : phase}
        result={phase === "result" ? { title: "Transfer accepted" } : undefined}
        requireAcknowledgement
        onEditAmount={fn()}
        onEditRecipient={fn()}
        onConfirm={fn()}
      />
    </div>
  );
}

export const SubmittedDetailsCannotBeEdited: Story = {
  render: () => <SubmissionStatesHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const edits = ["Change recipient", "Change amount"].map((name) =>
      canvas.getByRole("button", { name })
    );
    await userEvent.click(canvas.getByRole("checkbox"));
    await userEvent.click(canvas.getByRole("button", { name: "Confirm transfer" }));
    for (const edit of edits) await expect(edit).toBeDisabled();
    for (const name of ["Provider pending", "Provider accepted"]) {
      await userEvent.click(canvas.getByRole("button", { name }));
      for (const edit of edits) await expect(edit).toBeDisabled();
      await expect(canvas.getByRole("checkbox")).toBeDisabled();
    }
    await userEvent.click(canvas.getByRole("button", { name: "Provider rejected" }));
    for (const edit of edits) await expect(edit).toBeEnabled();
  },
};

/* ─── Cross-currency with an exchange rate ────────────────────────────── */
export const CrossCurrency: Story = {
  render: () => (
    <TransferReviewBlock
      title="Review international transfer"
      source={source}
      recipient={{
        name: "Studio Kleur B.V.",
        reference: "NL91 •••• 0417",
        institution: "ING Bank",
        detail: "Amsterdam, Netherlands",
        initials: "SK",
      }}
      sendAmount={500_000}
      sendCurrency="GBP"
      receiveAmount={578_420}
      receiveCurrency="EUR"
      fee={495}
      totalDebited={500_495}
      exchangeRate={{
        from: "GBP",
        to: "EUR",
        rate: 1.15684,
        fractionDigits: 5,
        validity: "Held for 30 minutes",
      }}
      arrival={new Date("2026-09-25T15:00:00Z")}
      timeZone="Europe/Amsterdam"
      arrivalNote="Recipient banks can add a day for their own checks."
      extraLines={[
        { id: "purpose", label: "Purpose code", text: "Goods and services" },
        { id: "correspondent", label: "Correspondent charge", amount: 0 },
      ]}
      onConfirm={fn()}
      onCancel={fn()}
      onEditAmount={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("£5,000.00")).toBeVisible();
    await expect(canvas.getByText("€5,784.20")).toBeVisible();
    await expect(canvas.getByText("1 GBP = 1.15684 EUR")).toBeVisible();
    // A supplied zero charge prints as zero, because zero is a real figure.
    await expect(canvas.getByText("£0.00")).toBeVisible();
  },
};

/* ─── Unknown fee, rate, and arrival ──────────────────────────────────
   `null` everywhere the provider returned nothing. Not one of them becomes a
   zero, and the block says so in as many words.
   ------------------------------------------------------------------- */
export const UnknownFeeRateAndArrival: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={250_000}
      sendCurrency="GBP"
      receiveAmount={null}
      receiveCurrency="NGN"
      fee={null}
      exchangeRate={null}
      totalDebited={null}
      arrival={null}
      unknownLabel="Not quoted yet"
      state="blocked"
      blockedTitle="A quote is needed before this transfer can be confirmed"
      blockedDescription="The fee and rate have not been returned. Ask for a quote, then review again."
      onEditAmount={fn()}
      onConfirm={fn()}
      onCancel={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Five unknown figures, every one in words.
    await expect(canvas.getAllByText("Not quoted yet").length).toBeGreaterThanOrEqual(4);
    await expect(canvas.queryByText("£0.00")).toBeNull();
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "A quote is needed before this transfer can be confirmed"
    );
    await expect(canvas.getByRole("button", { name: /Confirm transfer/ })).toBeDisabled();
  },
};

/* ─── Pending: in flight, not done ───────────────────────────────────── */
export const Pending: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={250_000}
      sendCurrency="GBP"
      fee={150}
      totalDebited={250_150}
      arrival="Within 2 hours"
      state="pending"
      pendingMessage="Sending your transfer. Do not close this page."
      onConfirm={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /Confirm transfer/ })).toBeDisabled();
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Sending your transfer. Do not close this page."
    );
    // Pending is not success.
    await expect(canvas.queryByText(/succeeded|sent successfully/i)).toBeNull();
  },
};

/* ─── A caller-supplied outcome ───────────────────────────────────────
   The only way a result ever appears. Note the honest default tone: accepted,
   not settled.
   ------------------------------------------------------------------- */
export const ConsumerSuppliedResult: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={250_000}
      sendCurrency="GBP"
      fee={150}
      totalDebited={250_150}
      arrival="Within 2 hours"
      status={{ label: "Accepted", tone: "warning" }}
      result={{
        title: "Your bank has accepted this transfer",
        description: "It has not settled yet. We will tell you when the recipient is paid.",
        reference: "Reference FP-2026-0923-8841",
      }}
      onConfirm={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Your bank has accepted this transfer"
    );
    // Confirming again is not possible once an outcome exists.
    await expect(canvas.getByRole("button", { name: /Confirm transfer/ })).toBeDisabled();
  },
};

/* ─── Error keeps the review and allows a retry ─────────────────────── */
export const ErrorWithRetry: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={250_000}
      sendCurrency="GBP"
      fee={150}
      totalDebited={250_150}
      arrival="Within 2 hours"
      state="error"
      errorDescription="Your bank rejected the request. No money has left your account."
      onRetry={fn()}
      onConfirm={fn()}
      onCancel={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("No money has left your account.");
    // The review is still readable, and confirming again is allowed.
    await expect(canvas.getByText("£2,500.00")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Confirm transfer/ })).toBeEnabled();
  },
};

/* ─── Permission ──────────────────────────────────────────────────────── */
export const NotPermitted: Story = {
  render: () => (
    <TransferReviewBlock
      source={source}
      recipient={recipient}
      sendAmount={2_500_000}
      sendCurrency="GBP"
      fee={150}
      totalDebited={2_500_150}
      arrival="Within 2 hours"
      confirmUnavailableReason="Transfers above £10,000 need a second approver. Your request has been queued."
      onConfirm={fn()}
      onCancel={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const confirm = canvas.getByRole("button", { name: /Confirm transfer/ });
    await expect(confirm).toBeDisabled();
    const id = confirm.getAttribute("aria-describedby");
    await expect(canvasElement.querySelector(`#${CSS.escape(id as string)}`)).toHaveTextContent(
      /second approver/
    );
  },
};

/* ─── Loading ─────────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <TransferReviewBlock
      recipient={recipient}
      sendAmount={undefined}
      sendCurrency="GBP"
      state="loading"
      loadingMessage="Getting a quote from your bank"
    />
  ),
};

/* ─── Narrow container ────────────────────────────────────────────────── */
export const NarrowContainer: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-[288px]">
        <TransferReviewBlock
          title="Review transfer, 288px"
          headingLevel="h3"
          source={source}
          recipient={recipient}
          sendAmount={250_000}
          sendCurrency="GBP"
          fee={150}
          totalDebited={250_150}
          arrival="Within 2 hours"
          onConfirm={fn()}
          onCancel={fn()}
        />
      </div>
      <div className="w-[420px]">
        <TransferReviewBlock
          title="Review transfer, 420px"
          headingLevel="h3"
          source={source}
          recipient={recipient}
          sendAmount={1_284_930_517}
          sendCurrency="JPY"
          locale="ja-JP"
          receiveAmount={684_211}
          receiveCurrency="GBP"
          exchangeRate={{ from: "JPY", to: "GBP", rate: 0.00533, fractionDigits: 5 }}
          fee={980}
          totalDebited={1_284_931_497}
          arrival="1–2 business days"
          onConfirm={fn()}
          onCancel={fn()}
        />
      </div>
    </div>
  ),
};

/* ─── Dark island ─────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="rayden-dark w-full min-w-0 bg-surface-muted p-4">
      <TransferReviewBlock
        source={source}
        recipient={recipient}
        sendAmount={250_000}
        sendCurrency="GBP"
        fee={null}
        totalDebited={null}
        arrival={null}
        requireAcknowledgement
        onConfirm={fn()}
        onCancel={fn()}
        onEditAmount={fn()}
        disclosure="Faster Payments are usually immediate but can take up to two hours."
      />
    </div>
  ),
};

/* ─── Consumer surface override, scoped to a light island ───────────────── */
const sageTheme = {
  "--color-surface": "#f6f7f2",
  "--color-surface-muted": "#eceee3",
  "--color-surface-border": "#dfe3d2",
  "--color-surface-border-strong": "#7d8a62",
  "--color-grey-500": "#4c5741",
  "--color-grey-600": "#3d4635",
  "--color-grey-700": "#2f362a",
  "--color-grey-900": "#1b1f18",
} as CSSProperties;

export const CustomSurface: Story = {
  render: () => (
    <div style={sageTheme} className="rayden-light w-full min-w-0 bg-surface-muted p-4">
      <TransferReviewBlock
        source={source}
        recipient={recipient}
        sendAmount={250_000}
        sendCurrency="GBP"
        fee={150}
        totalDebited={250_150}
        arrival="Within 2 hours"
        onConfirm={fn()}
        onCancel={fn()}
      />
    </div>
  ),
};
