import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  PageHeaderBlock,
  type PageHeaderAction,
  type PageHeaderBreadcrumb,
} from "./PageHeaderBlock";

const meta: Meta<typeof PageHeaderBlock> = {
  title: "Blocks/Page Header",
  component: PageHeaderBlock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
};

export default meta;
type Story = StoryObj<typeof PageHeaderBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────── */

const trail: PageHeaderBreadcrumb[] = [
  { id: "home", label: "Home", href: "#home", icon: "home" },
  { id: "suppliers", label: "Suppliers", href: "#suppliers" },
  { id: "record", label: "Northwind Logistics" },
];

const deepTrail: PageHeaderBreadcrumb[] = [
  { id: "home", label: "Home", href: "#home", icon: "home" },
  { id: "region", label: "Europe", href: "#europe" },
  { id: "country", label: "Netherlands", href: "#nl" },
  { id: "city", label: "Rotterdam", href: "#rotterdam" },
  { id: "site", label: "Waalhaven distribution centre", href: "#site" },
  { id: "bay", label: "Bay 14", href: "#bay" },
  { id: "audit", label: "September safety audit" },
];

const actions: PageHeaderAction[] = [
  { id: "export", label: "Export", icon: "file-download", href: "#export" },
  { id: "share", label: "Share", icon: "share-alt", onClick: fn() },
  { id: "edit", label: "Edit supplier", icon: "pencil-edit", priority: "primary", onClick: fn() },
];

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <PageHeaderBlock
      breadcrumbs={trail}
      title="Northwind Logistics"
      description="A tier-one carrier for the Benelux region. Contract renewal is due in November."
      status={{ label: "Active", tone: "success" }}
      meta={[
        { id: "owner", label: "Relationship owner", value: "Amara Okonkwo", icon: "user-circle" },
        { id: "renewal", label: "Contract renewal", value: "14 November 2026", icon: "calendar" },
        { id: "spend", label: "Spend this year", value: "€1,284,900", icon: "coins" },
      ]}
      actions={actions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The page title is a real heading at the configured level.
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Northwind Logistics" })
    ).toBeVisible();

    // The breadcrumb is a named landmark and its destinations are anchors.
    const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
    await expect(within(nav).getByRole("link", { name: "Suppliers" })).toHaveAttribute(
      "href",
      "#suppliers"
    );

    // The last crumb is the current page: text, not a link.
    await expect(within(nav).queryByRole("link", { name: "Northwind Logistics" })).toBeNull();
    await expect(nav.querySelector('[aria-current="page"]')).toBeTruthy();

    // The export destination stayed an anchor; the edit action is a button.
    await expect(canvas.getByRole("link", { name: /Export/ })).toHaveAttribute("href", "#export");
    await expect(canvas.getByRole("button", { name: /Edit supplier/ })).toBeVisible();
  },
};

/* ─── Deep trail that collapses ───────────────────────────────────────
   Seven levels. The root and the last two stay visible; the middle four are
   mounted but hidden, so the toggle's `aria-controls` resolves to real
   elements and the trail can be collapsed again after it is expanded.
   ------------------------------------------------------------------- */
export const DeepBreadcrumbTrail: Story = {
  render: () => (
    <PageHeaderBlock
      breadcrumbs={deepTrail}
      title="September safety audit"
      description="Seven levels of context, collapsed to keep the trail on one line."
      status={{ label: "In review", tone: "warning" }}
      actions={[
        { id: "download", label: "Download report", icon: "file-download", href: "#report" },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });

    const toggle = within(nav).getByRole("button", { name: "Show 4 hidden levels" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    // `aria-controls` names elements that are genuinely in the document.
    const ids = (toggle.getAttribute("aria-controls") ?? "").split(" ").filter(Boolean);
    await expect(ids.length).toBe(4);
    for (const id of ids) {
      await expect(canvasElement.querySelector(`#${CSS.escape(id)}`)).toBeTruthy();
    }

    // Hidden levels are not reachable before the trail is expanded.
    await expect(within(nav).queryByRole("link", { name: "Rotterdam" })).toBeNull();

    await userEvent.click(toggle);
    await expect(within(nav).getByRole("link", { name: "Rotterdam" })).toHaveAttribute(
      "href",
      "#rotterdam"
    );

    // The same control collapses the trail again.
    const collapse = within(nav).getByRole("button", { name: "Hide 4 levels" });
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(collapse);
    await expect(within(nav).queryByRole("link", { name: "Rotterdam" })).toBeNull();
  },
};

/* ─── Prioritised actions with an overflow group ──────────────────────
   Primary actions always stay inline. Secondary ones beyond the inline
   budget move into a disclosure that is mounted whether it is open or not.
   ------------------------------------------------------------------- */
export const PrioritisedActions: Story = {
  render: () => (
    <PageHeaderBlock
      breadcrumbs={trail}
      title="Northwind Logistics"
      maxInlineActions={2}
      actions={[
        {
          id: "edit",
          label: "Edit supplier",
          icon: "pencil-edit",
          priority: "primary",
          onClick: fn(),
        },
        { id: "export", label: "Export", icon: "file-download", href: "#export" },
        { id: "share", label: "Share", icon: "share-alt", onClick: fn() },
        { id: "duplicate", label: "Duplicate", icon: "copy", onClick: fn() },
        {
          id: "archive",
          label: "Archive supplier",
          icon: "box",
          priority: "overflow",
          onClick: fn(),
        },
        {
          id: "delete",
          label: "Delete supplier",
          icon: "bin",
          priority: "overflow",
          unavailableReason: "Only an account owner can delete a supplier with open invoices.",
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /More actions/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const panelId = toggle.getAttribute("aria-controls") ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(panelId)}`)).toBeTruthy();

    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("button", { name: /Archive supplier/ })).toBeVisible();

    // The unavailable action is disabled and explains itself.
    const remove = canvas.getByRole("button", { name: /Delete supplier/ });
    await expect(remove).toBeDisabled();
    const reasonId = remove.getAttribute("aria-describedby") ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(reasonId)}`)).toBeTruthy();

    // Escape closes the group and hands focus back to the control that opened it.
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("button", { name: /More actions/ })).toHaveFocus();
  },
};

/* ─── Loading ─────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => <PageHeaderBlock state="loading" title="Loading" />,
};

/* ─── Error with recovery ─────────────────────────────────────────── */
export const ErrorWithRetry: Story = {
  render: () => (
    <PageHeaderBlock
      breadcrumbs={trail}
      title="Northwind Logistics"
      state="error"
      status={{ label: "Unknown", tone: "neutral" }}
      errorTitle="Supplier details could not be loaded"
      errorDescription="The supplier service did not respond. Nothing on this record has been changed."
      onRetry={fn()}
    />
  ),
};

/* ─── Read-only viewer ────────────────────────────────────────────────
   Every action the viewer cannot take is disabled with a stated reason,
   rather than being rendered as a control that quietly does nothing.
   ------------------------------------------------------------------- */
export const ReadOnlyViewer: Story = {
  render: () => (
    <PageHeaderBlock
      breadcrumbs={trail}
      title="Northwind Logistics"
      description="You can read this record. Editing is reserved for the relationship owner."
      status={{ label: "Read only", tone: "neutral", description: "Your role is Analyst." }}
      actions={[
        {
          id: "edit",
          label: "Edit supplier",
          icon: "pencil-edit",
          priority: "primary",
          unavailableReason: "Ask Amara Okonkwo, the relationship owner, for edit access.",
        },
        { id: "export", label: "Export", icon: "file-download", href: "#export" },
      ]}
    />
  ),
};

/* ─── Minimal ─────────────────────────────────────────────────────────
   Title only. Omitting a section removes it rather than leaving a gap.
   ------------------------------------------------------------------- */
export const TitleOnly: Story = {
  render: () => <PageHeaderBlock title="Settings" headingLevel="h2" />,
};

/* ─── Narrow container ────────────────────────────────────────────────
   288px on a 1440px screen. The header reads its own container, so the
   action group stacks here while a wide page keeps it on one row.
   ------------------------------------------------------------------- */
export const NarrowContainer: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[288px] border-x border-surface-border">
      <PageHeaderBlock
        breadcrumbs={deepTrail}
        title="September safety audit"
        description="A long title, a deep trail, and four actions inside a phone-width column."
        status={{ label: "In review", tone: "warning" }}
        meta={[
          { id: "owner", label: "Owner", value: "Tomáš Řehák", icon: "user-circle" },
          { id: "due", label: "Due", value: "30 September 2026", icon: "calendar" },
        ]}
        maxInlineActions={1}
        actions={[
          { id: "submit", label: "Submit for approval", priority: "primary", onClick: fn() },
          { id: "export", label: "Export", href: "#export" },
          { id: "share", label: "Share", onClick: fn() },
        ]}
      />
    </div>
  ),
};

/* ─── Long translated labels ──────────────────────────────────────── */
export const LongTranslatedLabels: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[420px] border-x border-surface-border">
      <PageHeaderBlock
        breadcrumbLabel="Brotkrümelnavigation"
        breadcrumbExpandLabel={(count) => `${count} ausgeblendete Ebenen anzeigen`}
        breadcrumbCollapseLabel={(count) => `${count} Ebenen ausblenden`}
        actionsLabel="Seitenaktionen"
        metaLabel="Seitendetails"
        overflowLabel="Weitere Aktionen"
        breadcrumbs={[
          { id: "s", label: "Startseite", href: "#s", icon: "home" },
          { id: "l", label: "Lieferantenstammdaten", href: "#l" },
          { id: "b", label: "Betriebsgenehmigungen", href: "#b" },
          { id: "n", label: "Nachhaltigkeitsbewertung", href: "#n" },
          { id: "a", label: "Arbeitsschutzprüfung September" },
        ]}
        title="Nachhaltigkeitsbewertung für Lieferantenstammdaten"
        description="Ein sehr langer Titel mit zusammengesetzten Wörtern, die umbrechen müssen."
        status={{ label: "In Bearbeitung", tone: "warning" }}
        maxInlineActions={1}
        actions={[
          { id: "g", label: "Zur Genehmigung einreichen", priority: "primary", onClick: fn() },
          { id: "h", label: "Herunterladen", href: "#h" },
          { id: "w", label: "Weiterleiten", onClick: fn() },
        ]}
      />
    </div>
  ),
};

/* ─── Back action with a tab bar below ────────────────────────────────
   `children` carries whatever belongs under the header — here a tab bar the
   consuming application owns.
   ------------------------------------------------------------------- */
function TabsHarness() {
  const [active, setActive] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "contracts", label: "Contracts" },
    { id: "invoices", label: "Invoices" },
  ];
  return (
    <PageHeaderBlock
      backAction={{ label: "Back to suppliers", href: "#suppliers" }}
      title="Northwind Logistics"
      eyebrow="Supplier"
      status={{ label: "Active", tone: "success" }}
      actions={[
        { id: "edit", label: "Edit", icon: "pencil-edit", priority: "primary", onClick: fn() },
      ]}
    >
      <div role="tablist" aria-label="Supplier sections" className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={
              active === tab.id
                ? "min-h-10 cursor-pointer rounded-lg bg-primary-50 px-3 py-2 text-body-sm font-semibold text-action-primary-text"
                : "min-h-10 cursor-pointer rounded-lg px-3 py-2 text-body-sm font-medium text-grey-500 hover:bg-surface-muted hover:text-grey-900"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </PageHeaderBlock>
  );
}

export const WithBackActionAndTabs: Story = {
  render: () => <TabsHarness />,
};

/* ─── Every status tone ───────────────────────────────────────────────
   The tone tints a label that already carries the meaning in words, so the
   distinction never rests on colour alone.
   ------------------------------------------------------------------- */
export const StatusTones: Story = {
  render: () => (
    <div className="flex flex-col">
      <PageHeaderBlock
        title="Draft agreement"
        headingLevel="h2"
        status={{ label: "Draft", tone: "neutral" }}
      />
      <PageHeaderBlock
        title="Signed agreement"
        headingLevel="h2"
        status={{ label: "Signed", tone: "success" }}
      />
      <PageHeaderBlock
        title="Expiring agreement"
        headingLevel="h2"
        status={{ label: "Expires in 9 days", tone: "warning" }}
      />
      <PageHeaderBlock
        title="Terminated agreement"
        headingLevel="h2"
        status={{
          label: "Terminated",
          tone: "danger",
          description: "Ended on 2 August 2026 by mutual consent.",
        }}
      />
    </div>
  ),
};

/* ─── Dark ────────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="dark bg-surface-muted p-4">
      <PageHeaderBlock
        breadcrumbs={trail}
        title="Northwind Logistics"
        description="Surfaces, borders, and every tone follow the semantic roles."
        status={{ label: "Active", tone: "success" }}
        meta={[{ id: "owner", label: "Owner", value: "Amara Okonkwo", icon: "user-circle" }]}
        actions={actions}
      />
    </div>
  ),
};

/* ─── Consumer surface override ───────────────────────────────────────
   Scoped to an explicit light island. A consumer palette is written for one
   mode: the library's grey ramp inverts under `.dark`, but these overrides do
   not, so the same values inside a dark document measured 1.05:1. `.rayden-light`
   pins the light ramp for this subtree, which is what a consumer with a single
   light brand palette actually wants.
   ------------------------------------------------------------------- */
const sageTheme = {
  "--color-surface": "#f6f7f2",
  "--color-surface-muted": "#eceee3",
  "--color-surface-border": "#dfe3d2",
  "--color-surface-border-strong": "#7d8a62",
  "--color-grey-500": "#4c5741",
  "--color-grey-700": "#2f362a",
  "--color-grey-900": "#1b1f18",
} as CSSProperties;

export const CustomSurface: Story = {
  render: () => (
    <div style={sageTheme} className="rayden-light bg-surface-muted p-4">
      <PageHeaderBlock
        breadcrumbs={trail}
        title="Northwind Logistics"
        description="A consumer palette reaches the header ground, its borders, and its text."
        status={{ label: "Active", tone: "success" }}
        actions={actions}
      />
    </div>
  ),
};
