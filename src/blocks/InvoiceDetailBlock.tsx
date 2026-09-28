import { useId, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "../components/Icon";
import {
  FinanceActionRow,
  FinanceDate,
  FinanceEmptyPanel,
  FinanceErrorPanel,
  FinanceHeader,
  FinanceLoadingNotice,
  FinanceShell,
  FinanceSkeleton,
  formatFinanceDate,
  formatFinanceMoney,
  nextFinanceHeadingLevel,
  type FinanceAction,
  type FinanceDateValue,
  type FinanceHeadingLevel,
  type FinanceMoneyValue,
  type FinanceStatus,
} from "./finance";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type InvoiceDetailState = "default" | "loading" | "empty" | "error";

export interface InvoiceLine {
  id: string;
  description: ReactNode;
  /** A second line under the description, e.g. a period or a SKU. */
  detail?: ReactNode;
  /** Decimal quantities are allowed, e.g. 7.5 hours. */
  quantity?: number | null;
  /** Unit in which {@link quantity} is measured, e.g. "hours". */
  quantityUnit?: string;
  /** Minor-unit integer, or `null` when unknown. */
  unitPrice?: FinanceMoneyValue;
  /** Minor-unit integer, or `null` when unknown. Negative is a credit line. */
  amount: FinanceMoneyValue;
}

/** A tax, discount, credit, or any other line applied after the subtotal. */
export interface InvoiceAdjustment {
  id: string;
  label: string;
  /** Minor-unit integer; negative for a credit or discount. `null` is unknown. */
  amount: FinanceMoneyValue;
  /** Rate or basis, e.g. "VAT 21%". */
  detail?: ReactNode;
}

export interface InvoiceParty {
  /** @default "Billed to" / "From" */
  label?: string;
  /** Address or identity lines, in reading order. */
  lines: ReactNode[];
}

export interface InvoiceDetailBlockProps {
  /** @default "Invoice" */
  title?: ReactNode;
  /** @default "h2" */
  headingLevel?: FinanceHeadingLevel;
  description?: ReactNode;
  /** Invoice number, shown above the title and in the metadata list. */
  invoiceNumber?: string;
  status?: FinanceStatus;

  /** ISO 4217 code shared by every amount in this invoice. @default "GBP" */
  currency?: string;
  /** Explicit locale keeps server and client formatting identical. @default "en-GB" */
  locale?: string;
  /** Words shown wherever an amount is `null`. @default "Not available" */
  unknownLabel?: string;
  /** IANA zone for the invoice dates. */
  timeZone?: string;
  formatDate?: (value: Date) => string;

  issuedOn?: FinanceDateValue;
  dueOn?: FinanceDateValue;
  /** @default "Issued" */
  issuedOnLabel?: string;
  /** @default "Due" */
  dueOnLabel?: string;
  /** Further metadata rows, e.g. purchase order, project, tax id. */
  meta?: Array<{ id: string; label: string; value: ReactNode; icon?: IconName }>;

  billedTo?: InvoiceParty;
  billedFrom?: InvoiceParty;

  lines: InvoiceLine[];
  /** @default "Invoice lines" — also names the table and its scroll region. */
  linesLabel?: string;
  /** Column headers, so they can be translated. */
  columnLabels?: {
    description?: string;
    quantity?: string;
    unitPrice?: string;
    amount?: string;
  };
  /**
   * Beyond this many lines the table body is placed in a bounded, focusable,
   * vertically scrolling region so a long invoice cannot lengthen the page
   * without limit. @default 12
   */
  maxVisibleLines?: number;
  /** Height of that scroll region. @default "26rem" */
  scrollRegionMaxHeight?: string;
  /**
   * Wording for an invoice that carries no lines. Distinct from `state="empty"`
   * (no invoice at all) and from a filtered view with no matches, because the
   * caller supplies the words.
   */
  linesEmptyTitle?: string;
  linesEmptyDescription?: ReactNode;
  linesEmptyAction?: FinanceAction;

  subtotal?: FinanceMoneyValue;
  /** @default "Subtotal" */
  subtotalLabel?: string;
  taxes?: InvoiceAdjustment[];
  adjustments?: InvoiceAdjustment[];
  /** Already settled. `undefined` omits the row. */
  amountPaid?: FinanceMoneyValue;
  /** @default "Paid to date" */
  amountPaidLabel?: string;
  /** Supplied, never derived from the lines. `null` renders as unknown. */
  amountDue: FinanceMoneyValue;
  /** @default "Amount due" */
  amountDueLabel?: string;
  /** Accessible name for the totals list. @default "Invoice totals" */
  totalsLabel?: string;
  /** One line under the amount due, e.g. payment terms. */
  amountDueNote?: ReactNode;

  /** The dominant action, e.g. pay. Omitted entirely when absent. */
  primaryAction?: FinanceAction;
  /** Supporting actions, e.g. download, send reminder, dispute. */
  actions?: FinanceAction[];
  /** @default "Invoice actions" */
  actionsLabel?: string;
  /** Terms, remittance details, or notes. Rendered last. */
  note?: ReactNode;

  /** @default "default" */
  state?: InvoiceDetailState;
  /** @default "Loading invoice" */
  loadingMessage?: string;
  /** @default "This invoice could not be loaded" */
  errorTitle?: string;
  errorDescription?: ReactNode;
  /** The retry control is omitted entirely without this handler. */
  onRetry?: () => void;
  /** @default "No invoice selected" */
  emptyTitle?: string;
  emptyDescription?: ReactNode;
  emptyAction?: FinanceAction;

  /** Lands on the container root, outside the card padding. */
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function InvoiceDetailBlock({
  title = "Invoice",
  headingLevel = "h2",
  description,
  invoiceNumber,
  status,
  currency = "GBP",
  locale = "en-GB",
  unknownLabel = "Not available",
  timeZone,
  formatDate,
  issuedOn,
  dueOn,
  issuedOnLabel = "Issued",
  dueOnLabel = "Due",
  meta = [],
  billedTo,
  billedFrom,
  lines,
  linesLabel = "Invoice lines",
  columnLabels,
  maxVisibleLines = 12,
  scrollRegionMaxHeight = "26rem",
  linesEmptyTitle = "This invoice has no lines",
  linesEmptyDescription,
  linesEmptyAction,
  subtotal,
  subtotalLabel = "Subtotal",
  taxes = [],
  adjustments = [],
  amountPaid,
  amountPaidLabel = "Paid to date",
  amountDue,
  amountDueLabel = "Amount due",
  totalsLabel = "Invoice totals",
  amountDueNote,
  primaryAction,
  actions = [],
  actionsLabel = "Invoice actions",
  note,
  state = "default",
  loadingMessage = "Loading invoice",
  errorTitle = "This invoice could not be loaded",
  errorDescription,
  onRetry,
  emptyTitle = "No invoice selected",
  emptyDescription,
  emptyAction,
  className,
}: InvoiceDetailBlockProps) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const statusDescriptionId = `${uid}-status`;
  const linesHeadingId = `${uid}-lines`;
  const SubHeading = nextFinanceHeadingLevel(headingLevel);

  const money = (value: FinanceMoneyValue) =>
    formatFinanceMoney(value, { currency, locale, unknownLabel });

  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 });

  const columns = {
    description: columnLabels?.description ?? "Description",
    quantity: columnLabels?.quantity ?? "Qty",
    unitPrice: columnLabels?.unitPrice ?? "Unit price",
    amount: columnLabels?.amount ?? "Amount",
  };

  const issued = formatFinanceDate(issuedOn, {
    locale,
    timeZone,
    dateStyle: "long",
    unknownLabel,
    format: formatDate,
  });
  const due = formatFinanceDate(dueOn, {
    locale,
    timeZone,
    dateStyle: "long",
    unknownLabel,
    format: formatDate,
  });

  const header = (
    <FinanceHeader
      id={headingId}
      level={headingLevel}
      title={title}
      description={description}
      eyebrow={invoiceNumber}
      status={status}
      statusDescriptionId={statusDescriptionId}
    />
  );

  if (state === "loading") {
    return (
      <FinanceShell labelledBy={headingId} busy className={className}>
        {header}
        <FinanceSkeleton rows={5} />
        <FinanceLoadingNotice message={loadingMessage} />
      </FinanceShell>
    );
  }

  if (state === "error") {
    return (
      <FinanceShell labelledBy={headingId} className={className}>
        {header}
        <FinanceErrorPanel title={errorTitle} description={errorDescription} onRetry={onRetry} />
      </FinanceShell>
    );
  }

  if (state === "empty") {
    return (
      <FinanceShell labelledBy={headingId} className={className}>
        {header}
        <FinanceEmptyPanel
          title={emptyTitle}
          description={emptyDescription}
          icon="receipt"
          action={emptyAction}
        />
      </FinanceShell>
    );
  }

  const metaRows = [
    issued
      ? {
          id: "issued",
          label: issuedOnLabel,
          node: <FinanceDate value={issued} />,
          icon: "calendar" as IconName,
        }
      : undefined,
    due
      ? {
          id: "due",
          label: dueOnLabel,
          node: <FinanceDate value={due} />,
          icon: "calendar-tick" as IconName,
        }
      : undefined,
    invoiceNumber
      ? { id: "number", label: "Invoice number", node: invoiceNumber, icon: "receipt" as IconName }
      : undefined,
    ...meta.map((item) => ({ id: item.id, label: item.label, node: item.value, icon: item.icon })),
  ].filter(Boolean) as Array<{ id: string; label: string; node: ReactNode; icon?: IconName }>;

  const scrolls = lines.length > maxVisibleLines;

  const totals = [
    { id: "subtotal", label: subtotalLabel, amount: subtotal, detail: undefined as ReactNode },
    ...taxes.map((tax) => ({
      id: `tax-${tax.id}`,
      label: tax.label,
      amount: tax.amount,
      detail: tax.detail,
    })),
    ...adjustments.map((item) => ({
      id: `adjustment-${item.id}`,
      label: item.label,
      amount: item.amount,
      detail: item.detail,
    })),
    { id: "paid", label: amountPaidLabel, amount: amountPaid, detail: undefined as ReactNode },
  ].filter((row) => row.amount !== undefined);

  /* ── Lines table ──────────────────────────────────────────────────────
     A real table. There is no visually hidden caption: the table is named by
     the visible heading above it, so no absolutely positioned element sits
     inside a scroll container (audit B03, and the KPI 200%-text overflow that
     the same shape produced).

     Below a 520px container the unit-price column is withdrawn and the unit
     price is shown under the description instead, so the data is never lost.
     At enlarged text sizes the named, keyboard-accessible wrapper contains
     any remaining table overflow without widening the page.
     ------------------------------------------------------------------- */
  const table = (
    <table aria-labelledby={linesHeadingId} className="w-full min-w-0 border-collapse text-left">
      <thead>
        <tr className="border-b border-surface-border-strong">
          <th
            scope="col"
            className="py-2 pr-3 text-body-xs font-semibold break-words text-on-surface-secondary"
          >
            {columns.description}
          </th>
          <th
            scope="col"
            className="py-2 pr-3 text-right text-body-xs font-semibold break-words text-on-surface-secondary"
          >
            {columns.quantity}
          </th>
          <th
            scope="col"
            className="hidden py-2 pr-3 text-right text-body-xs font-semibold break-words text-on-surface-secondary @min-[520px]:table-cell"
          >
            {columns.unitPrice}
          </th>
          <th
            scope="col"
            className="py-2 text-right text-body-xs font-semibold break-words text-on-surface-secondary"
          >
            {columns.amount}
          </th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => {
          const unit = money(line.unitPrice);
          return (
            <tr key={line.id} className="border-b border-surface-border last:border-b-0">
              <th
                scope="row"
                className="py-3 pr-3 text-body-sm font-medium break-words text-on-surface"
              >
                <span className="block min-w-0 break-words">{line.description}</span>
                {line.detail && (
                  <span className="mt-0.5 block min-w-0 text-body-xs font-normal break-words text-on-surface-muted">
                    {line.detail}
                  </span>
                )}
                {unit !== undefined && (
                  <span className="mt-0.5 block min-w-0 text-body-xs font-normal break-words tabular-nums text-on-surface-muted @min-[520px]:hidden">
                    {columns.unitPrice}: {unit}
                  </span>
                )}
              </th>
              <td className="py-3 pr-3 text-right align-top text-body-sm break-words tabular-nums text-on-surface-body">
                {line.quantity === null
                  ? unknownLabel
                  : line.quantity === undefined
                    ? "—"
                    : `${numberFormat.format(line.quantity)}${line.quantityUnit ? ` ${line.quantityUnit}` : ""}`}
              </td>
              <td className="hidden py-3 pr-3 text-right align-top text-body-sm break-words tabular-nums text-on-surface-body @min-[520px]:table-cell">
                {unit ?? "—"}
              </td>
              <td
                className={cn(
                  "py-3 text-right align-top text-body-sm font-semibold break-words tabular-nums",
                  line.amount === null ? "text-on-surface-muted" : "text-on-surface"
                )}
              >
                {money(line.amount)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <FinanceShell labelledBy={headingId} className={className}>
      {header}

      {metaRows.length > 0 && (
        <dl className="grid min-w-0 gap-3 border-t border-surface-border pt-4 @min-[420px]:grid-cols-2 @min-[720px]:grid-cols-3">
          {metaRows.map((row) => (
            <div key={row.id} className="flex min-w-0 flex-col gap-0.5">
              <dt className="flex min-w-0 items-center gap-1.5 text-body-xs font-medium break-words text-on-surface-muted">
                {row.icon && <Icon name={row.icon} size="sm" className="shrink-0" />}
                <span className="min-w-0 break-words">{row.label}</span>
              </dt>
              <dd className="min-w-0 text-body-sm font-medium break-words tabular-nums text-on-surface-body">
                {row.node}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {(billedTo || billedFrom) && (
        <div className="grid min-w-0 gap-4 border-t border-surface-border pt-4 @min-[520px]:grid-cols-2 @min-[520px]:gap-6">
          {[billedFrom, billedTo].map((party, index) =>
            party ? (
              <div key={index === 0 ? "from" : "to"} className="flex min-w-0 flex-col gap-1">
                <p className="font-medium break-words uppercase text-caption-sm text-on-surface-muted">
                  {party.label ?? (index === 0 ? "From" : "Billed to")}
                </p>
                <address className="flex min-w-0 flex-col text-body-sm break-words not-italic text-on-surface-body">
                  {party.lines.map((line, lineIndex) => (
                    <span key={lineIndex} className="min-w-0 break-words">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            ) : null
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4">
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
          <SubHeading
            id={linesHeadingId}
            className="min-w-0 text-body-md font-semibold break-words text-on-surface"
          >
            {linesLabel}
          </SubHeading>
          {lines.length > 0 && (
            <p className="text-body-xs break-words tabular-nums text-on-surface-muted">
              {lines.length === 1 ? "1 line" : `${lines.length} lines`}
            </p>
          )}
        </div>

        {lines.length === 0 ? (
          <FinanceEmptyPanel
            title={linesEmptyTitle}
            description={linesEmptyDescription}
            icon="list"
            action={linesEmptyAction}
          />
        ) : scrolls ? (
          /* Bounded, focusable scroll region so a 40-line invoice cannot grow
             the page without limit. `relative` contains anything positioned. */
          <div
            role="region"
            aria-label={linesLabel}
            tabIndex={0}
            style={{ maxHeight: scrollRegionMaxHeight }}
            className="relative min-w-0 overflow-y-auto rounded-lg border border-surface-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
          >
            <div className="min-w-0 px-3">{table}</div>
          </div>
        ) : (
          <div
            role="group"
            aria-label={linesLabel}
            tabIndex={0}
            className="relative min-w-0 overflow-x-auto rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
          >
            {table}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4 @min-[560px]:items-end">
        <dl
          aria-label={totalsLabel}
          className="flex w-full min-w-0 flex-col gap-2 @min-[560px]:max-w-[22rem]"
        >
          {totals.map((row) => (
            <div
              key={row.id}
              className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
            >
              <dt className="min-w-0 text-body-sm break-words text-on-surface-secondary">
                {row.label}
                {row.detail && (
                  <span className="block text-body-xs break-words text-on-surface-muted">
                    {row.detail}
                  </span>
                )}
              </dt>
              <dd
                className={cn(
                  "min-w-0 text-right text-body-sm font-medium break-words tabular-nums",
                  row.amount === null ? "text-on-surface-muted" : "text-on-surface-body"
                )}
              >
                {money(row.amount)}
              </dd>
            </div>
          ))}
          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-t border-surface-border-strong pt-2">
            <dt className="min-w-0 text-body-md font-semibold break-words text-on-surface">
              {amountDueLabel}
            </dt>
            <dd
              className={cn(
                "min-w-0 text-right font-semibold break-words tabular-nums",
                "text-h6",
                amountDue === null ? "text-on-surface-muted" : "text-on-surface"
              )}
            >
              {money(amountDue)}
            </dd>
          </div>
        </dl>
        {amountDueNote && (
          <p className="max-w-[62ch] text-body-xs break-words text-on-surface-muted @min-[560px]:text-right">
            {amountDueNote}
          </p>
        )}
      </div>

      {(primaryAction || actions.length > 0) && (
        <div className="flex min-w-0 flex-col gap-2 border-t border-surface-border pt-4">
          <FinanceActionRow
            actions={primaryAction ? [primaryAction, ...actions] : actions}
            label={actionsLabel}
          />
        </div>
      )}

      {note && (
        <div className="max-w-[72ch] text-body-xs break-words text-on-surface-muted">{note}</div>
      )}
    </FinanceShell>
  );
}
