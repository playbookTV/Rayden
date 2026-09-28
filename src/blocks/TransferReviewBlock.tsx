import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Icon, type IconName } from "../components/Icon";
import { Spinner } from "../components/Spinner";
import {
  FINANCE_FOCUS_RING,
  FinanceDate,
  FinanceErrorPanel,
  FinanceHeader,
  FinanceLoadingNotice,
  FinanceShell,
  FinanceSkeleton,
  formatFinanceDate,
  formatFinanceMoney,
  type FinanceDateValue,
  type FinanceHeadingLevel,
  type FinanceMoneyValue,
  type FinanceStatus,
} from "./finance";

/* ─── Types ──────────────────────────────────────────────────────────── */

/**
 * `pending` means the caller's provider call is in flight. It is not success:
 * the block shows a busy review, never an outcome it invented.
 * `blocked` means confirmation is not currently possible, with a reason.
 */
export type TransferReviewState = "default" | "loading" | "pending" | "error" | "blocked";

export interface TransferReviewParty {
  name: ReactNode;
  /** Handle, IBAN tail, or masked account. Already masked by the caller. */
  reference?: ReactNode;
  /** Bank, wallet, or scheme name. */
  institution?: ReactNode;
  /** Country, branch, or any further display-only detail. */
  detail?: ReactNode;
  avatar?: ReactNode;
  initials?: string;
  icon?: IconName;
}

/** An extra provider line, e.g. a correspondent charge or a purpose code. */
export interface TransferReviewLine {
  id: string;
  label: string;
  /** Minor-unit integer, or `null` for genuinely unknown. */
  amount?: FinanceMoneyValue;
  /** Use instead of `amount` for a non-monetary value. */
  text?: ReactNode;
  /** ISO 4217 code when this line is not in the send currency. */
  currency?: string;
  hint?: ReactNode;
}

export interface TransferReviewRate {
  /** ISO 4217 code the rate converts from. */
  from: string;
  /** ISO 4217 code the rate converts to. */
  to: string;
  /** Units of `to` per one unit of `from`. */
  rate: number;
  /** Maximum fraction digits when printing the rate. @default 4 */
  fractionDigits?: number;
  /** When the rate expires, or how long it is held. */
  validity?: ReactNode;
}

/**
 * Supplied by the caller AFTER its provider reports an outcome, and only then.
 * The block never constructs one. `tone: "pending"` is for an accepted-but-not-
 * settled transfer, which is the honest state for most rails.
 */
export interface TransferReviewResult {
  title: string;
  description?: ReactNode;
  /** Provider reference, shown with tabular figures. */
  reference?: string;
  /** @default "pending" */
  tone?: "success" | "pending";
}

export interface TransferReviewBlockProps {
  /** @default "Review transfer" */
  title?: ReactNode;
  /** @default "h2" */
  headingLevel?: FinanceHeadingLevel;
  /** @default a sentence saying nothing is sent until confirmation */
  description?: ReactNode;
  eyebrow?: ReactNode;
  status?: FinanceStatus;

  recipient: TransferReviewParty;
  /** @default "Recipient" */
  recipientLabel?: string;
  source?: TransferReviewParty;
  /** @default "From" */
  sourceLabel?: string;

  /** Explicit locale keeps server and client formatting identical. @default "en-GB" */
  locale?: string;
  /** Words shown wherever an amount or estimate is `null`. @default "Not available" */
  unknownLabel?: string;

  /**
   * Amount leaving the source account, in minor units of {@link sendCurrency}.
   * `null` renders {@link unknownLabel}. There is no default: an amount the
   * block invented would be the worst possible defect in this block.
   */
  sendAmount: FinanceMoneyValue;
  /** ISO 4217 code for {@link sendAmount}. Required — never inferred. */
  sendCurrency: string;
  /** @default "You send" */
  sendLabel?: string;

  /** Amount arriving, when the rail converts. */
  receiveAmount?: FinanceMoneyValue;
  /** ISO 4217 code for {@link receiveAmount}. */
  receiveCurrency?: string;
  /** @default "Recipient gets" */
  receiveLabel?: string;

  /**
   * `0` is a real fee and prints as a zero amount. `null` means the provider
   * has not returned one. `undefined` omits the row. They are three different
   * statements and the block keeps them apart.
   */
  fee?: FinanceMoneyValue;
  /** ISO 4217 code for {@link fee}. @default {@link sendCurrency} */
  feeCurrency?: string;
  /** @default "Transfer fee" */
  feeLabel?: string;

  /** `null` means no rate was returned. Never fabricated. */
  exchangeRate?: TransferReviewRate | null;
  /** @default "Exchange rate" */
  exchangeRateLabel?: string;

  /** Supplied, never derived: a fee may be deducted from the amount or added to it. */
  totalDebited?: FinanceMoneyValue;
  /** @default "Total to pay" */
  totalDebitedLabel?: string;

  /**
   * Arrival estimate. A real instant is formatted with the locale and zone; a
   * string that is not a date passes through, which is how a caller supplies an
   * inherently fuzzy estimate such as "1–2 business days". `null` is unknown.
   */
  arrival?: FinanceDateValue;
  /** @default "Estimated arrival" */
  arrivalLabel?: string;
  /** IANA zone for {@link arrival}. */
  timeZone?: string;
  formatArrival?: (value: Date) => string;
  /** One line under the estimate, e.g. why it may move. */
  arrivalNote?: ReactNode;

  extraLines?: TransferReviewLine[];
  /** Payment reference or message to the recipient. Display only. */
  reference?: ReactNode;
  /** @default "Reference" */
  referenceLabel?: string;

  /** Provider terms, limits, or regulatory text. Rendered above the actions. */
  disclosure?: ReactNode;

  /** Adds a checkbox the reader must tick before confirmation is possible. */
  requireAcknowledgement?: boolean;
  /** @default "I have checked the recipient details." */
  acknowledgementLabel?: ReactNode;
  onAcknowledgementChange?: (checked: boolean) => void;

  /** The confirmation control is omitted entirely without this handler. */
  onConfirm?: () => void;
  /** @default "Confirm transfer" */
  confirmLabel?: string;
  /** Renders the confirmation control disabled with the reason visible. */
  confirmUnavailableReason?: string;
  onCancel?: () => void;
  /** @default "Cancel" */
  cancelLabel?: string;
  /** Edit affordances. Each is omitted entirely without its handler. */
  onEditAmount?: () => void;
  onEditRecipient?: () => void;
  /** @default "Change amount" */
  editAmountLabel?: string;
  /** @default "Change recipient" */
  editRecipientLabel?: string;

  /** @default "default" */
  state?: TransferReviewState;
  /** @default "Loading transfer details" */
  loadingMessage?: string;
  /** @default "Sending your transfer" — shown while `state` is `pending`. */
  pendingMessage?: string;
  /** @default "This transfer could not be sent" */
  errorTitle?: string;
  errorDescription?: ReactNode;
  /** The retry control is omitted entirely without this handler. */
  onRetry?: () => void;
  /** Why confirmation is blocked. Required in spirit when `state` is `blocked`. */
  blockedTitle?: string;
  blockedDescription?: ReactNode;

  /**
   * The outcome, supplied by the caller once its provider has reported one.
   * The block never sets this itself and never derives it from a click.
   */
  result?: TransferReviewResult;

  /** Lands on the container root, outside the card padding. */
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function TransferReviewBlock({
  title = "Review transfer",
  headingLevel = "h2",
  description = "Nothing is sent until you confirm.",
  eyebrow,
  status,
  recipient,
  recipientLabel = "Recipient",
  source,
  sourceLabel = "From",
  locale = "en-GB",
  unknownLabel = "Not available",
  sendAmount,
  sendCurrency,
  sendLabel = "You send",
  receiveAmount,
  receiveCurrency,
  receiveLabel = "Recipient gets",
  fee,
  feeCurrency,
  feeLabel = "Transfer fee",
  exchangeRate,
  exchangeRateLabel = "Exchange rate",
  totalDebited,
  totalDebitedLabel = "Total to pay",
  arrival,
  arrivalLabel = "Estimated arrival",
  timeZone,
  formatArrival,
  arrivalNote,
  extraLines = [],
  reference,
  referenceLabel = "Reference",
  disclosure,
  requireAcknowledgement = false,
  acknowledgementLabel = "I have checked the recipient details.",
  onAcknowledgementChange,
  onConfirm,
  confirmLabel = "Confirm transfer",
  confirmUnavailableReason,
  onCancel,
  cancelLabel = "Cancel",
  onEditAmount,
  onEditRecipient,
  editAmountLabel = "Change amount",
  editRecipientLabel = "Change recipient",
  state = "default",
  loadingMessage = "Loading transfer details",
  pendingMessage = "Sending your transfer",
  errorTitle = "This transfer could not be sent",
  errorDescription,
  onRetry,
  blockedTitle = "This transfer cannot be confirmed yet",
  blockedDescription,
  result,
  className,
}: TransferReviewBlockProps) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const statusDescriptionId = `${uid}-status`;
  const acknowledgementId = `${uid}-ack`;
  const confirmReasonId = `${uid}-confirm-reason`;
  const resultId = `${uid}-result`;

  // Acknowledgement applies to the details that were actually reviewed, not
  // merely to this mounted component. Compare fields rather than the party or
  // rate object, so ordinary parent rerenders do not clear a valid review.
  const reviewDetails: unknown[] = [
    recipient.name,
    recipient.reference,
    recipient.institution,
    recipient.detail,
    source?.name,
    source?.reference,
    source?.institution,
    source?.detail,
    sendAmount,
    sendCurrency,
    receiveAmount,
    receiveCurrency,
    fee,
    feeCurrency,
    totalDebited,
    exchangeRate?.from,
    exchangeRate?.to,
    exchangeRate?.rate,
    exchangeRate?.validity,
    arrival instanceof Date ? arrival.getTime() : arrival,
    arrivalNote,
    reference,
    disclosure,
    acknowledgementLabel,
    ...extraLines.flatMap((line) => [
      line.id,
      line.label,
      line.amount,
      line.currency,
      line.text,
      line.hint,
    ]),
  ];
  const [acknowledgedDetails, setAcknowledgedDetails] = useState<unknown[] | null>(null);
  const acknowledged =
    acknowledgedDetails !== null &&
    acknowledgedDetails.length === reviewDetails.length &&
    acknowledgedDetails.every((value, index) => Object.is(value, reviewDetails[index]));
  useEffect(() => {
    if (acknowledgedDetails && !acknowledged) {
      setAcknowledgedDetails(null);
      onAcknowledgementChange?.(false);
    }
  }, [acknowledgedDetails, acknowledged, onAcknowledgementChange]);

  /**
   * A confirmation control that stays live after the first activation is a
   * defect in a payment flow, so the block latches on click. The latch is
   * released whenever `state` or `result` changes, which is the caller telling
   * the block what actually happened — so an `error` state lets the reader try
   * again, and a caller that changes nothing leaves the control disabled rather
   * than allowing a second send.
   */
  const [latched, setLatched] = useState(false);
  const lastSignal = useRef<string>(`${state}|${result ? "result" : "none"}`);
  useEffect(() => {
    const signal = `${state}|${result ? "result" : "none"}`;
    if (signal !== lastSignal.current) {
      lastSignal.current = signal;
      setLatched(false);
    }
  }, [state, result]);

  const sendMoney = (value: FinanceMoneyValue, currency = sendCurrency) =>
    formatFinanceMoney(value, { currency, locale, unknownLabel });

  const arrivalValue = formatFinanceDate(arrival, {
    locale,
    timeZone,
    dateStyle: "long",
    unknownLabel,
    format: formatArrival,
  });

  const rateText =
    exchangeRate === null
      ? unknownLabel
      : exchangeRate
        ? `1 ${exchangeRate.from} = ${new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: exchangeRate.fractionDigits ?? 4,
          }).format(exchangeRate.rate)} ${exchangeRate.to}`
        : undefined;

  const unknownAmountPresent =
    sendAmount === null ||
    (receiveAmount === null && receiveCurrency !== undefined) ||
    fee === null ||
    exchangeRate === null;

  const busy = state === "pending" || state === "loading";
  const editingBlocked = busy || latched || Boolean(result);
  const confirmBlocked =
    busy ||
    latched ||
    state === "blocked" ||
    Boolean(result) ||
    Boolean(confirmUnavailableReason) ||
    (requireAcknowledgement && !acknowledged);

  function handleConfirm() {
    if (confirmBlocked) return;
    setLatched(true);
    onConfirm?.();
  }

  function handleAcknowledgement(checked: boolean) {
    setAcknowledgedDetails(checked ? reviewDetails : null);
    onAcknowledgementChange?.(checked);
  }

  function handleEdit(onEdit: () => void) {
    if (editingBlocked) return;
    if (acknowledgedDetails) handleAcknowledgement(false);
    onEdit();
  }

  const header = (
    <FinanceHeader
      id={headingId}
      level={headingLevel}
      title={title}
      description={description}
      eyebrow={eyebrow}
      status={status}
      statusDescriptionId={statusDescriptionId}
    />
  );

  if (state === "loading") {
    return (
      <FinanceShell labelledBy={headingId} busy className={className}>
        {header}
        <FinanceSkeleton rows={4} />
        <FinanceLoadingNotice message={loadingMessage} />
      </FinanceShell>
    );
  }

  /* ── Party summary ────────────────────────────────────────────────── */
  function renderParty(
    party: TransferReviewParty,
    label: string,
    onEdit?: () => void,
    editLabel?: string
  ) {
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <p className="font-medium break-words uppercase text-caption-sm text-on-surface-muted">
          {label}
        </p>
        <div className="flex min-w-0 items-start gap-3">
          {party.avatar ??
            (party.icon ? (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-on-surface-secondary">
                <Icon name={party.icon} size="md" />
              </span>
            ) : (
              <Avatar
                type="initials"
                size="md"
                initials={party.initials ?? "—"}
                className="shrink-0"
              />
            ))}
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="min-w-0 text-body-md font-semibold break-words text-on-surface">
              {party.name}
            </p>
            {party.reference && (
              <p className="min-w-0 text-body-sm break-words tabular-nums text-on-surface-secondary">
                {party.reference}
              </p>
            )}
            {party.institution && (
              <p className="min-w-0 text-body-sm break-words text-on-surface-muted">
                {party.institution}
              </p>
            )}
            {party.detail && (
              <p className="min-w-0 text-body-xs break-words text-on-surface-muted">
                {party.detail}
              </p>
            )}
          </div>
        </div>
        {onEdit && editLabel && (
          <button
            type="button"
            onClick={() => handleEdit(onEdit)}
            disabled={editingBlocked}
            className={cn(
              "inline-flex min-h-11 w-fit max-w-full min-w-0 cursor-pointer items-center gap-1.5 rounded px-0.5 font-semibold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50",
              FINANCE_FOCUS_RING,
              "text-body-sm text-action-primary-text"
            )}
          >
            <Icon name="pencil-edit" size="sm" className="shrink-0" />
            <span className="min-w-0 break-words">{editLabel}</span>
          </button>
        )}
      </div>
    );
  }

  /* ── Money rows ───────────────────────────────────────────────────── */
  interface Row {
    id: string;
    label: string;
    value: string | undefined;
    hint?: ReactNode;
    emphasis?: boolean;
    unknown?: boolean;
  }

  const rows: Row[] = [
    {
      id: "send",
      label: sendLabel,
      value: sendMoney(sendAmount),
      emphasis: true,
      unknown: sendAmount === null,
    },
    {
      id: "fee",
      label: feeLabel,
      value: sendMoney(fee, feeCurrency ?? sendCurrency),
      unknown: fee === null,
    },
    {
      id: "rate",
      label: exchangeRateLabel,
      value: rateText,
      hint: exchangeRate?.validity,
      unknown: exchangeRate === null,
    },
    {
      id: "receive",
      label: receiveLabel,
      value:
        receiveCurrency === undefined
          ? undefined
          : formatFinanceMoney(receiveAmount, {
              currency: receiveCurrency,
              locale,
              unknownLabel,
            }),
      emphasis: true,
      unknown: receiveAmount === null,
    },
    ...extraLines
      .filter((line) => line.text === undefined)
      .map((line) => ({
        id: line.id,
        label: line.label,
        value: sendMoney(line.amount, line.currency ?? sendCurrency),
        hint: line.hint,
        unknown: line.amount === null,
      })),
    {
      id: "total",
      label: totalDebitedLabel,
      value: sendMoney(totalDebited),
      emphasis: true,
      unknown: totalDebited === null,
    },
  ];

  const textLines = extraLines.filter((line) => line.text !== undefined);

  return (
    <FinanceShell labelledBy={headingId} busy={busy} className={className}>
      {header}

      {/* The outcome, only ever the caller's. Placed first so it is the first
          thing read once it exists. */}
      {result && (
        <div
          id={resultId}
          role="status"
          className={cn(
            "flex min-w-0 flex-col gap-1 rounded-lg border px-4 py-3",
            result.tone === "success"
              ? "border-success-200 bg-success-50"
              : "border-warning-200 bg-warning-50"
          )}
        >
          <p
            className={cn(
              "flex min-w-0 items-center gap-2 text-body-sm font-semibold break-words",
              result.tone === "success" ? "text-success-700" : "text-warning-700"
            )}
          >
            <Icon
              name={result.tone === "success" ? "check-circle" : "clock"}
              size="sm"
              className="shrink-0"
            />
            {result.title}
          </p>
          {result.description && (
            <p
              className={cn(
                "text-body-sm break-words",
                result.tone === "success" ? "text-success-700" : "text-warning-700"
              )}
            >
              {result.description}
            </p>
          )}
          {result.reference && (
            <p
              className={cn(
                "text-body-xs break-words tabular-nums",
                result.tone === "success" ? "text-success-700" : "text-warning-700"
              )}
            >
              {result.reference}
            </p>
          )}
        </div>
      )}

      <div className="grid min-w-0 gap-5 @min-[560px]:grid-cols-2 @min-[560px]:gap-6">
        {source && renderParty(source, sourceLabel)}
        {renderParty(recipient, recipientLabel, onEditRecipient, editRecipientLabel)}
      </div>

      <dl className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4">
        {rows.map((row) => {
          if (row.value === undefined) return null;
          return (
            <div
              key={row.id}
              className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
            >
              <dt className="min-w-0 text-body-sm break-words text-on-surface-secondary">
                {row.label}
              </dt>
              <dd
                className={cn(
                  "min-w-0 text-right break-words tabular-nums",
                  row.emphasis
                    ? "text-body-lg font-semibold text-on-surface"
                    : "text-body-sm font-medium text-on-surface-body",
                  row.unknown && "text-on-surface-muted"
                )}
              >
                {row.value}
                {row.hint && (
                  <span className="block text-body-xs font-normal break-words text-on-surface-muted">
                    {row.hint}
                  </span>
                )}
              </dd>
            </div>
          );
        })}

        {textLines.map((line) => (
          <div
            key={line.id}
            className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
          >
            <dt className="min-w-0 text-body-sm break-words text-on-surface-secondary">
              {line.label}
            </dt>
            <dd className="min-w-0 text-right text-body-sm font-medium break-words text-on-surface-body">
              {line.text}
              {line.hint && (
                <span className="block text-body-xs font-normal break-words text-on-surface-muted">
                  {line.hint}
                </span>
              )}
            </dd>
          </div>
        ))}

        {arrivalValue && (
          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <dt className="min-w-0 text-body-sm break-words text-on-surface-secondary">
              {arrivalLabel}
            </dt>
            <dd
              className={cn(
                "min-w-0 text-right text-body-sm font-medium break-words",
                arrival === null ? "text-on-surface-muted" : "text-on-surface-body"
              )}
            >
              <FinanceDate value={arrivalValue} className="break-words" />
              {arrivalNote && (
                <span className="block text-body-xs font-normal break-words text-on-surface-muted">
                  {arrivalNote}
                </span>
              )}
            </dd>
          </div>
        )}

        {reference && (
          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <dt className="min-w-0 text-body-sm break-words text-on-surface-secondary">
              {referenceLabel}
            </dt>
            <dd className="min-w-0 text-right text-body-sm font-medium break-words text-on-surface-body">
              {reference}
            </dd>
          </div>
        )}
      </dl>

      {onEditAmount && (
        <button
          type="button"
          onClick={() => handleEdit(onEditAmount)}
          disabled={editingBlocked}
          className={cn(
            "inline-flex min-h-11 w-fit max-w-full min-w-0 cursor-pointer items-center gap-1.5 rounded px-0.5 font-semibold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50",
            FINANCE_FOCUS_RING,
            "text-body-sm text-action-primary-text"
          )}
        >
          <Icon name="pencil-edit" size="sm" className="shrink-0" />
          <span className="min-w-0 break-words">{editAmountLabel}</span>
        </button>
      )}

      {/* An unknown figure is stated plainly rather than rounded to zero. */}
      {unknownAmountPresent && (
        <p className="flex min-w-0 items-start gap-2 rounded-lg bg-surface-muted px-3 py-2 text-body-xs break-words text-on-surface-secondary">
          <Icon name="info-circle" size="sm" className="mt-0.5 shrink-0" />
          <span className="min-w-0 break-words">
            Some figures are shown as “{unknownLabel}” because the provider has not returned them.
            They are not zero.
          </span>
        </p>
      )}

      {state === "blocked" && (
        <div
          role="alert"
          className="flex min-w-0 flex-col gap-1 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3"
        >
          <p className="text-body-sm font-semibold break-words text-warning-700">{blockedTitle}</p>
          {blockedDescription && (
            <p className="text-body-sm break-words text-warning-700">{blockedDescription}</p>
          )}
        </div>
      )}

      {state === "error" && (
        <FinanceErrorPanel title={errorTitle} description={errorDescription} onRetry={onRetry} />
      )}

      {disclosure && (
        <div className="max-w-[72ch] text-body-xs break-words text-on-surface-muted">
          {disclosure}
        </div>
      )}

      {requireAcknowledgement && (
        <label
          htmlFor={acknowledgementId}
          className="flex min-h-11 min-w-0 cursor-pointer items-center gap-3"
        >
          <input
            id={acknowledgementId}
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => handleAcknowledgement(event.currentTarget.checked)}
            disabled={editingBlocked}
            className={cn(
              "size-5 shrink-0 cursor-pointer rounded border border-control-border accent-action-primary disabled:cursor-not-allowed disabled:opacity-50",
              FINANCE_FOCUS_RING
            )}
          />
          <span className="min-w-0 text-body-sm break-words text-on-surface-body">
            {acknowledgementLabel}
          </span>
        </label>
      )}

      {(onConfirm || onCancel) && (
        <div className="flex min-w-0 flex-col gap-2">
          <div
            role="group"
            aria-label="Transfer decision"
            className="flex min-w-0 flex-col-reverse gap-2 @min-[480px]:flex-row @min-[480px]:items-center @min-[480px]:justify-end"
          >
            {onCancel && (
              <Button
                variant="grey"
                appearance="outlined"
                size="lg"
                onClick={onCancel}
                className="min-h-12 w-full min-w-0 @min-[480px]:w-auto"
              >
                <span className="min-w-0 break-words">{cancelLabel}</span>
              </Button>
            )}
            {onConfirm && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                disabled={confirmBlocked}
                aria-describedby={confirmUnavailableReason ? confirmReasonId : undefined}
                className="min-h-12 w-full min-w-0 @min-[480px]:w-auto"
              >
                <span className="flex min-w-0 items-center gap-2 break-words">
                  {state === "pending" && (
                    <span aria-hidden="true" className="flex shrink-0 items-center">
                      <Spinner size="sm" />
                    </span>
                  )}
                  <span className="min-w-0 break-words">{confirmLabel}</span>
                </span>
              </Button>
            )}
          </div>
          {confirmUnavailableReason && (
            <p
              id={confirmReasonId}
              className="text-body-xs break-words text-on-surface-muted @min-[480px]:text-right"
            >
              {confirmUnavailableReason}
            </p>
          )}
          {state === "pending" && (
            <p
              role="status"
              className="flex min-w-0 items-center gap-2 text-body-sm break-words text-on-surface-secondary @min-[480px]:justify-end"
            >
              <span aria-hidden="true" className="flex shrink-0 items-center">
                <Spinner size="sm" />
              </span>
              <span className="min-w-0 break-words">{pendingMessage}</span>
            </p>
          )}
        </div>
      )}
    </FinanceShell>
  );
}
