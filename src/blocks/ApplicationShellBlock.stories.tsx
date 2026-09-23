import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ApplicationShellBlock,
  type AppShellAction,
  type AppShellNavSection,
} from "./ApplicationShellBlock";

const meta: Meta<typeof ApplicationShellBlock> = {
  title: "Blocks/Application Shell",
  component: ApplicationShellBlock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
};

export default meta;
type Story = StoryObj<typeof ApplicationShellBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────────
   Every destination below carries an `href` and no `onClick`. That is the
   case the old header failed: it rebuilt collapsed destinations as buttons
   and invoked `onClick` only, so an href-only destination went nowhere.
   ------------------------------------------------------------------- */

const sections: AppShellNavSection[] = [
  {
    id: "work",
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", href: "#overview", icon: "home", current: true },
      {
        id: "tasks",
        label: "Tasks",
        href: "#tasks",
        icon: "check-circle",
        badge: "8",
        badgeDescription: "8 tasks due this week",
      },
      { id: "records", label: "Records", href: "#records", icon: "file-alt" },
      { id: "calendar", label: "Schedule", href: "#schedule", icon: "calendar" },
    ],
  },
  {
    id: "insight",
    label: "Insight",
    items: [
      { id: "reports", label: "Reports", href: "#reports", icon: "chart" },
      { id: "exports", label: "Exports", href: "#exports", icon: "file-download" },
      {
        id: "forecasting",
        label: "Forecasting",
        icon: "chart-up",
        unavailableReason: "Forecasting is on the Scale plan. Ask an administrator to enable it.",
      },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    items: [
      { id: "people", label: "People", href: "#people", icon: "user-group" },
      { id: "settings", label: "Settings", href: "#settings", icon: "settings-1" },
      {
        id: "status",
        label: "Service status",
        href: "https://example.com/status",
        icon: "server-alt",
        external: true,
      },
    ],
  },
];

const actions: AppShellAction[] = [
  {
    id: "notify",
    label: "Notifications",
    icon: "bell",
    href: "#notifications",
    badge: "3",
    badgeDescription: "3 unread notifications",
  },
  { id: "help", label: "Help and documentation", icon: "question-circle", href: "#help" },
  { id: "account", label: "Your account", icon: "user-circle", href: "#account" },
];

function Brand() {
  return (
    <>
      <span
        aria-hidden="true"
        className="inline-flex size-8 items-center justify-center rounded-lg bg-action-primary text-body-sm font-bold text-white"
      >
        C
      </span>
      <span className="text-body-md font-semibold text-grey-900">Citrionus</span>
    </>
  );
}

/** A plain labelled field, so the shell stories do not depend on another block. */
function SearchField({ label = "Search the workspace" }: Readonly<{ label?: string }>) {
  const [value, setValue] = useState("");
  return (
    <label className="flex w-full min-w-0 flex-col">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        placeholder={label}
        onChange={(event) => setValue(event.target.value)}
        className="min-h-10 w-full min-w-0 rounded-lg border border-surface-border-strong bg-surface px-3 py-2 text-body-sm text-grey-900 placeholder:text-grey-500"
      />
    </label>
  );
}

function SampleWorkspace({ heading = "Overview" }: Readonly<{ heading?: string }>) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-h6 font-semibold text-grey-900">{heading}</h1>
      <p className="max-w-[60ch] text-body-sm text-grey-500">
        The shell contributes navigation, a top bar, and a workspace landmark. Everything inside
        this area is supplied by the consuming application.
      </p>
      <div className="rounded-xl border border-surface-border bg-surface p-6">
        <p className="text-body-sm text-grey-700">Workspace content goes here.</p>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <p className="text-body-xs text-grey-500">
      Signed in as <span className="font-semibold text-grey-700">amara@citrionus.example</span>
    </p>
  );
}

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navSections={sections}
      actions={actions}
      search={<SearchField />}
      sidebarFooter={<SidebarFooter />}
    >
      <SampleWorkspace />
    </ApplicationShellBlock>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // A labelled navigation landmark. The old header rendered none at all.
    const nav = canvas.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();

    // Every destination is a real anchor carrying its href.
    const overview = within(nav).getByRole("link", { name: /Overview/ });
    await expect(overview).toHaveAttribute("href", "#overview");
    await expect(overview).toHaveAttribute("aria-current", "page");

    // The unavailable destination is disabled and says why, rather than
    // silently doing nothing when clicked.
    const forecasting = within(nav).getByRole("button", { name: /Forecasting/ });
    await expect(forecasting).toBeDisabled();
    const reasonId = forecasting.getAttribute("aria-describedby");
    await expect(reasonId).toBeTruthy();
    await expect(canvasElement.querySelector(`#${CSS.escape(reasonId as string)}`)).toBeTruthy();

    // An external destination opens safely.
    const status = within(nav).getByRole("link", { name: /Service status/ });
    await expect(status).toHaveAttribute("rel", "noreferrer");

    // The skip link points at a real landmark.
    const skip = canvas.getByRole("link", { name: "Skip to main content" });
    const target = skip.getAttribute("href")?.slice(1) ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(target)}`)).toBeTruthy();
  },
};

/* ─── Collapsed arrangement ───────────────────────────────────────────
   288px is narrower than a 320px phone once the story frame is removed, and
   the shell reads its own width, so this is the collapsed arrangement on a
   1440px screen. Nothing is dropped: search, the switcher slot, the actions,
   and every destination stay reachable.
   ------------------------------------------------------------------- */
export const NarrowContainer: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[288px] border-x border-surface-border">
      <ApplicationShellBlock
        brand={<Brand />}
        brandHref="#home"
        navSections={sections}
        actions={actions}
        search={<SearchField />}
        switcher={
          <span className="inline-flex min-h-10 items-center rounded-lg border border-surface-border-strong px-2 text-body-sm font-semibold text-grey-900">
            Acme
          </span>
        }
        sidebarFooter={<SidebarFooter />}
      >
        <SampleWorkspace />
      </ApplicationShellBlock>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Open navigation" });

    // `aria-controls` resolves to an element that is in the document even while
    // the panel is closed. Pointing at an absent id was audit defect B01.
    const panelId = toggle.getAttribute("aria-controls") ?? "";
    const panel = canvasElement.querySelector(`#${CSS.escape(panelId)}`);
    await expect(panel).toBeTruthy();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Search is still present while the navigation is closed.
    await expect(canvas.getByRole("searchbox", { name: "Search the workspace" })).toBeVisible();

    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Destinations are anchors here too, with their href intact.
    const collapsedNav = canvas.getByRole("navigation", { name: /Main/ });
    const tasks = within(collapsedNav).getByRole("link", { name: /Tasks/ });
    await expect(tasks).toHaveAttribute("href", "#tasks");

    // Escape closes the panel and returns focus to the control that opened it.
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("button", { name: "Open navigation" })).toHaveFocus();
  },
};

/* ─── Navigation loading ──────────────────────────────────────────── */
export const NavigationLoading: Story = {
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navStatus="loading"
      navSections={[]}
      actions={actions}
      search={<SearchField />}
    >
      <SampleWorkspace />
    </ApplicationShellBlock>
  ),
};

/* ─── Navigation error ────────────────────────────────────────────── */
export const NavigationError: Story = {
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navStatus="error"
      navSections={[]}
      navErrorMessage="Your navigation could not be loaded. The workspace itself is unaffected."
      onRetryNav={fn()}
      actions={actions}
      search={<SearchField />}
    >
      <SampleWorkspace />
    </ApplicationShellBlock>
  ),
};

/* ─── No destinations ─────────────────────────────────────────────────
   An empty source, not a failure. The sidebar explains itself rather than
   rendering an empty rail, and the workspace still fills the shell.
   ------------------------------------------------------------------- */
export const NoDestinations: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The rail explains itself instead of standing empty, and the toggle that
    // reveals it is still a real disclosure.
    await expect(
      canvas.getAllByText(
        "This workspace has no sections yet. An administrator can add them in Settings."
      ).length
    ).toBeGreaterThan(0);
  },
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navSections={[]}
      navEmptyMessage="This workspace has no sections yet. An administrator can add them in Settings."
      actions={actions}
      search={<SearchField />}
    >
      <SampleWorkspace heading="Nothing configured" />
    </ApplicationShellBlock>
  ),
};

/* ─── One destination ─────────────────────────────────────────────── */
/* ─── No navigation at all ────────────────────────────────────────────
   Without `navEmptyMessage` there is no rail and no toggle, because a
   disclosure that opens nothing is a control with no action.
   ------------------------------------------------------------------- */
export const NoNavigationRail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: "Open navigation" })).toBeNull();
    await expect(canvas.queryByRole("navigation", { name: "Main" })).toBeNull();
    await expect(canvas.getByRole("main", { name: "Workspace" })).toBeVisible();
  },
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navSections={[]}
      actions={actions}
      search={<SearchField />}
    >
      <SampleWorkspace heading="No navigation" />
    </ApplicationShellBlock>
  ),
};

export const SingleDestination: Story = {
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navSections={[
        {
          id: "only",
          items: [
            { id: "overview", label: "Overview", href: "#overview", icon: "home", current: true },
          ],
        },
      ]}
      search={<SearchField />}
    >
      <SampleWorkspace />
    </ApplicationShellBlock>
  ),
};

/* ─── Translated, long labels ─────────────────────────────────────────
   German compounds and a long workspace name are the case that breaks a
   sidebar built around English two-word labels.
   ------------------------------------------------------------------- */
export const LongTranslatedLabels: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[360px] border-x border-surface-border">
      <ApplicationShellBlock
        brand={<Brand />}
        brandHref="#home"
        navLabel="Hauptnavigation"
        openMenuLabel="Navigation öffnen"
        closeMenuLabel="Navigation schließen"
        skipLinkLabel="Zum Hauptinhalt springen"
        mainLabel="Arbeitsbereich"
        actionsLabel="Konto und Werkzeuge"
        navSections={[
          {
            id: "haupt",
            label: "Arbeitsbereichsverwaltung",
            items: [
              { id: "u", label: "Übersicht", href: "#u", icon: "home", current: true },
              { id: "l", label: "Lieferantenstammdatenverwaltung", href: "#l", icon: "building-2" },
              {
                id: "r",
                label: "Rückerstattungsanforderungen",
                href: "#r",
                icon: "coins",
                badge: "14",
              },
              {
                id: "p",
                label: "Personalbedarfsplanung",
                icon: "user-group",
                unavailableReason: "Diese Ansicht ist für Ihre Rolle nicht freigegeben.",
              },
            ],
          },
        ]}
        actions={[{ id: "b", label: "Benachrichtigungen", icon: "bell", href: "#b" }]}
        search={<SearchField label="Arbeitsbereich durchsuchen" />}
      >
        <SampleWorkspace heading="Übersicht" />
      </ApplicationShellBlock>
    </div>
  ),
};

/* ─── Large navigation ────────────────────────────────────────────────
   Forty destinations across six sections. The sidebar scrolls with the page
   in the default arrangement; nothing is truncated away.
   ------------------------------------------------------------------- */
const bigSections: AppShellNavSection[] = Array.from({ length: 6 }, (_, sectionIndex) => ({
  id: `s${sectionIndex}`,
  label: `Section ${sectionIndex + 1}`,
  items: Array.from({ length: 7 }, (_, itemIndex) => ({
    id: `s${sectionIndex}-i${itemIndex}`,
    label: `Destination ${sectionIndex + 1}.${itemIndex + 1}`,
    href: `#s${sectionIndex}-i${itemIndex}`,
    icon: "file-alt" as const,
  })),
}));

export const LargeNavigation: Story = {
  render: () => (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navSections={bigSections}
      actions={actions}
      search={<SearchField />}
    >
      <SampleWorkspace heading="Forty-two destinations" />
    </ApplicationShellBlock>
  ),
};

/* ─── Bounded workspace scroll ────────────────────────────────────────
   `mainScroll="region"` gives the workspace its own scrollbar. It is opt-in
   because the default keeps one scroll region for the whole page, which is
   what stops an overlay and the workspace fighting over the wheel.
   ------------------------------------------------------------------- */
export const BoundedWorkspaceScroll: Story = {
  render: () => (
    <ApplicationShellBlock
      className="h-[520px]"
      mainScroll="region"
      brand={<Brand />}
      brandHref="#home"
      navSections={sections}
      actions={actions}
      search={<SearchField />}
      sidebarFooter={<SidebarFooter />}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-h6 font-semibold text-grey-900">Bounded workspace</h1>
        {Array.from({ length: 24 }, (_, index) => (
          <p key={index} className="text-body-sm text-grey-500">
            Paragraph {index + 1}. The workspace scrolls inside the shell while the top bar and the
            sidebar stay put.
          </p>
        ))}
      </div>
    </ApplicationShellBlock>
  ),
};

/* ─── Dark island ─────────────────────────────────────────────────────
   Explicit dark chrome inside a light document. Surfaces, borders, and text
   all follow the semantic roles, so no colour is pinned to a mode.
   ------------------------------------------------------------------- */
export const DarkIsland: Story = {
  render: () => (
    <div className="dark bg-surface-muted">
      <ApplicationShellBlock
        brand={<Brand />}
        brandHref="#home"
        navSections={sections}
        actions={actions}
        search={<SearchField />}
        sidebarFooter={<SidebarFooter />}
      >
        <SampleWorkspace heading="Dark chrome" />
      </ApplicationShellBlock>
    </div>
  ),
};

/* ─── Consumer surface override ───────────────────────────────────────
   A consumer sets the semantic surface roles and the whole shell follows,
   without a block-specific override. `bg-white dark:bg-grey-50` could not do
   this — that is audit finding B07.

   Scoped to an explicit light island: a consumer palette is written for one
   mode, and the library's grey ramp inverts under `.dark` while these
   overrides do not.

   The muted text role is overridden alongside the grounds, and it has to be.
   The library's default muted foreground is `grey-500` (#667185); on this
   palette's muted ground it measures 4.19:1, below AA. A consumer changing a
   surface has to move its foreground with it — there is no automatic pairing.
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
    <div style={sageTheme} className="rayden-light">
      <ApplicationShellBlock
        brand={<Brand />}
        brandHref="#home"
        navSections={sections}
        actions={actions}
        search={<SearchField />}
        sidebarFooter={<SidebarFooter />}
      >
        <SampleWorkspace heading="Consumer surface" />
      </ApplicationShellBlock>
    </div>
  ),
};

/* ─── Actions driven by callbacks ─────────────────────────────────────
   A destination is an anchor; an action is a button. There is no third kind
   with neither, because the type does not allow one.
   ------------------------------------------------------------------- */
function CallbackHarness({ children }: Readonly<{ children?: ReactNode }>) {
  const [log, setLog] = useState<string[]>([]);
  return (
    <ApplicationShellBlock
      brand={<Brand />}
      brandHref="#home"
      navSections={[
        {
          id: "views",
          label: "Views",
          items: [
            {
              id: "a",
              label: "Board",
              onClick: () => setLog((l) => [...l, "Board"]),
              icon: "grid-2",
            },
            { id: "b", label: "List", onClick: () => setLog((l) => [...l, "List"]), icon: "list" },
          ],
        },
      ]}
      actions={[
        {
          id: "new",
          label: "New record",
          icon: "plus",
          onClick: () => setLog((l) => [...l, "New record"]),
        },
      ]}
      search={<SearchField />}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-h6 font-semibold text-grey-900">Callback destinations</h1>
        <p className="text-body-sm text-grey-500">
          Activated: {log.length === 0 ? "nothing yet" : log.join(", ")}
        </p>
        {children}
      </div>
    </ApplicationShellBlock>
  );
}

export const CallbackDestinations: Story = {
  render: () => <CallbackHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Main" });
    await userEvent.click(within(nav).getByRole("button", { name: "List" }));
    await expect(canvas.getByText("Activated: List")).toBeVisible();
  },
};
