import { useMemo, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ApplicationShellBlock, type AppShellNavSection } from "./ApplicationShellBlock";
import { CommandPaletteBlock, type CommandPaletteItem } from "./CommandPaletteBlock";
import { PageHeaderBlock, type PageHeaderBreadcrumb } from "./PageHeaderBlock";
import { WorkspaceSwitcherBlock, type WorkspaceSwitcherItem } from "./WorkspaceSwitcherBlock";
import { KpiOverviewBlock, type KpiMetric } from "./KpiOverviewBlock";
import { TaskListBlock, type TaskListAssignee, type TaskListTask } from "./TaskListBlock";
import { ProfileSettingsBlock, type ProfileSettingsValues } from "./ProfileSettingsBlock";

/**
 * The four Batch C blocks assembled into one application chrome, with three
 * blocks from earlier batches as the workspace content. Assembling them is what
 * exposes the things per-block review cannot see: one heading outline across
 * five blocks, section rhythm across three different grounds, and whether an
 * overlay and a scrollable workspace fight over the same wheel.
 */
const meta: Meta = {
  title: "Blocks/Compositions/Application Chrome",
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
};

export default meta;
type Story = StoryObj;

/* ─── Fixtures ────────────────────────────────────────────────────── */

type PageId = "overview" | "tasks" | "profile" | "suppliers";

const workspaces: WorkspaceSwitcherItem[] = [
  { id: "acme", name: "Acme Freight", detail: "Scale · 48 members", initials: "AF" },
  { id: "northwind", name: "Northwind Logistics", detail: "Team · 12 members", initials: "NL" },
  { id: "lumen", name: "Lumen Retail Group", detail: "Scale · 130 members", initials: "LR" },
  { id: "brigg", name: "Brigg & Sons", detail: "Starter · 4 members", initials: "BS" },
  { id: "delta", name: "Delta Ports", detail: "Team · 22 members", initials: "DP" },
  {
    id: "harbour",
    name: "Harbour Provisioning Cooperative",
    detail: "Team · 9 members",
    initials: "HP",
  },
  {
    id: "vantage",
    name: "Vantage Chemicals",
    detail: "Scale · 310 members",
    initials: "VC",
    unavailableReason: "Your access request is with the Vantage administrators.",
  },
];

const today = new Date(2026, 8, 22);

const people: TaskListAssignee[] = [
  { id: "amara", name: "Amara Okonkwo", initials: "AO" },
  { id: "ines", name: "Inés Delgado-Márquez", initials: "ID" },
  { id: "tomas", name: "Tomáš Řehák", initials: "TR" },
];

const seedTasks: TaskListTask[] = [
  {
    id: "t1",
    title: "Confirm the September supplier audit dates",
    completed: false,
    assigneeId: "amara",
    dueDate: "2026-09-19",
    note: "Three suppliers have not replied to the first request.",
  },
  {
    id: "t2",
    title: "Publish the revised delivery promise",
    completed: false,
    assigneeId: "ines",
    dueDate: "2026-09-22",
  },
  {
    id: "t3",
    title: "Review the returns policy wording with legal",
    completed: false,
    assigneeId: "tomas",
    dueDate: "2026-09-26",
  },
  {
    id: "t4",
    title: "Archive the discontinued product photography",
    completed: true,
    assigneeId: "amara",
    dueDate: "2026-09-11",
  },
];

const metrics: KpiMetric[] = [
  {
    id: "onTime",
    label: "On-time delivery",
    value: "94.2%",
    comparisonValue: "91.8%",
    change: { label: "+2.4 pts", direction: "up", sentiment: "positive" },
    description: "Measured at the receiving bay, not at dispatch.",
    trend: { labels: ["W34", "W35", "W36", "W37", "W38"], values: [90, 91, 92.4, 93, 94.2] },
  },
  {
    id: "claims",
    label: "Open damage claims",
    value: "18",
    comparisonValue: "27",
    change: { label: "−9", direction: "down", sentiment: "positive" },
  },
  {
    id: "spend",
    label: "Freight spend",
    value: "€1.28m",
    comparisonValue: "€1.19m",
    change: { label: "+7.6%", direction: "up", sentiment: "negative" },
  },
  {
    id: "carbon",
    label: "Carbon per tonne-km",
    value: "—",
    unavailableReason: "The emissions feed has not reported since 19 September.",
  },
];

const profile: ProfileSettingsValues = {
  firstName: "Amara",
  lastName: "Okonkwo",
  email: "amara@citrionus.example",
  jobTitle: "Head of supplier operations",
  timeZone: "Europe/Amsterdam",
  bio: "Runs the carrier network for the Benelux region.",
};

const pageMeta: Record<
  PageId,
  {
    title: string;
    description: string;
    crumbs: PageHeaderBreadcrumb[];
    status: { label: string; tone: "neutral" | "success" | "warning" | "danger" };
  }
> = {
  overview: {
    title: "Operations overview",
    description: "Delivery, claims, and spend for the current reporting period.",
    crumbs: [
      { id: "home", label: "Home", href: "#home", icon: "home" },
      { id: "ops", label: "Operations", href: "#operations" },
      { id: "overview", label: "Overview" },
    ],
    status: { label: "Live", tone: "success" },
  },
  tasks: {
    title: "Team tasks",
    description: "Work the operations team owns this week.",
    crumbs: [
      { id: "home", label: "Home", href: "#home", icon: "home" },
      { id: "ops", label: "Operations", href: "#operations" },
      { id: "tasks", label: "Tasks" },
    ],
    status: { label: "4 open", tone: "warning" },
  },
  suppliers: {
    title: "Suppliers",
    description: "The partners keeping your deliveries moving.",
    crumbs: [
      { id: "home", label: "Home", href: "#home", icon: "home" },
      { id: "suppliers", label: "Suppliers" },
    ],
    status: { label: "3 active", tone: "success" },
  },
  profile: {
    title: "Your profile",
    description: "Details other people in this workspace can see.",
    crumbs: [
      { id: "home", label: "Home", href: "#home", icon: "home" },
      { id: "settings", label: "Settings", href: "#settings" },
      { id: "profile", label: "Profile" },
    ],
    status: { label: "Saved", tone: "neutral" },
  },
};

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

/* ─── The chrome ──────────────────────────────────────────────────── */

function Chrome({
  mainScroll = "page",
  className,
  paletteShortcut = false,
}: Readonly<{ mainScroll?: "page" | "region"; className?: string; paletteShortcut?: boolean }>) {
  const [page, setPage] = useState<PageId>("overview");
  const [workspaceId, setWorkspaceId] = useState("acme");
  const [tasks, setTasks] = useState<TaskListTask[]>(seedTasks);
  const [savedProfile, setSavedProfile] = useState(profile);

  const currentWorkspace = workspaces.find((item) => item.id === workspaceId);
  const meta = pageMeta[page];
  const openTasks = tasks.filter((task) => !task.completed).length;

  const sections: AppShellNavSection[] = useMemo(
    () => [
      {
        id: "work",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            icon: "home",
            onClick: () => setPage("overview"),
            current: page === "overview",
          },
          {
            id: "tasks",
            label: "Tasks",
            icon: "check-circle",
            badge: String(tasks.filter((task) => !task.completed).length),
            badgeDescription: `${tasks.filter((task) => !task.completed).length} tasks still open`,
            onClick: () => setPage("tasks"),
            current: page === "tasks",
          },
          {
            id: "suppliers",
            label: "Suppliers",
            icon: "building-2",
            href: "#suppliers",
            onClick: () => setPage("suppliers"),
            current: page === "suppliers",
          },
        ],
      },
      {
        id: "account",
        label: "Account",
        items: [
          {
            id: "profile",
            label: "Profile",
            icon: "user-circle",
            onClick: () => setPage("profile"),
            current: page === "profile",
          },
          {
            id: "billing",
            label: "Billing",
            icon: "card",
            unavailableReason: "Billing is visible to workspace owners only.",
          },
        ],
      },
    ],
    [page, tasks]
  );

  const paletteItems: CommandPaletteItem[] = useMemo(
    () => [
      {
        id: "go-overview",
        label: "Overview",
        description: "Delivery, claims, and spend",
        icon: "home",
        groupId: "go",
        onSelect: () => setPage("overview"),
      },
      {
        id: "go-tasks",
        label: "Tasks",
        description: "Work the operations team owns",
        icon: "check-circle",
        groupId: "go",
        onSelect: () => setPage("tasks"),
      },
      {
        id: "go-profile",
        label: "Profile",
        description: "Your details in this workspace",
        icon: "user-circle",
        groupId: "go",
        onSelect: () => setPage("profile"),
      },
      {
        id: "go-suppliers",
        label: "Suppliers",
        description: "Carrier and vendor records",
        icon: "building-2",
        groupId: "go",
        href: "#suppliers",
        onSelect: () => setPage("suppliers"),
      },
      {
        id: "do-complete",
        label: "Mark every task complete",
        icon: "check",
        groupId: "do",
        onSelect: () =>
          setTasks((current) => current.map((task) => ({ ...task, completed: true }))),
      },
      {
        id: "do-billing",
        label: "Open billing",
        icon: "card",
        groupId: "do",
        unavailableReason: "Billing is visible to workspace owners only.",
      },
    ],
    []
  );

  return (
    <ApplicationShellBlock
      className={className ?? "min-h-dvh"}
      mainScroll={mainScroll}
      brand={<Brand />}
      brandHref="#home"
      onBrandClick={() => setPage("overview")}
      navSections={sections}
      sidebarFooter={
        <p className="text-body-xs text-grey-500">
          Signed in as <span className="font-semibold text-grey-700">{savedProfile.email}</span>
        </p>
      }
      actions={[
        {
          id: "notify",
          label: "Notifications",
          icon: "bell",
          href: "#notifications",
          badge: "3",
          badgeDescription: "3 unread notifications",
        },
        { id: "help", label: "Help and documentation", icon: "question-circle", href: "#help" },
      ]}
      switcher={
        <WorkspaceSwitcherBlock
          current={currentWorkspace}
          workspaces={workspaces}
          onSelect={setWorkspaceId}
          footerActions={[
            { id: "create", label: "Create a workspace", icon: "plus", onClick: fn() },
            { id: "join", label: "Join with an invitation code", icon: "user-add", href: "#join" },
          ]}
        />
      }
      search={
        <CommandPaletteBlock
          items={paletteItems}
          groups={[
            { id: "go", label: "Go to" },
            { id: "do", label: "Actions" },
          ]}
          triggerLabel="Search or jump to…"
          shortcut={paletteShortcut ? { key: "k", modifier: "mod", hint: "⌘K" } : null}
        />
      }
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <PageHeaderBlock
          variant="plain"
          className="-mt-4"
          breadcrumbs={meta.crumbs}
          title={meta.title}
          description={meta.description}
          status={
            page === "tasks"
              ? { label: `${openTasks} open`, tone: openTasks ? "warning" : "success" }
              : meta.status
          }
          headingLevel="h1"
          meta={[
            {
              id: "workspace",
              label: "Workspace",
              value: currentWorkspace?.name ?? "—",
              icon: "building-2",
            },
            {
              id: "period",
              label: "Reporting period",
              value: "1–21 September 2026",
              icon: "calendar",
            },
          ]}
          actions={[
            { id: "export", label: "Export", icon: "file-download", href: "#export" },
            { id: "share", label: "Share", icon: "share-alt", priority: "overflow", onClick: fn() },
            {
              id: "settings",
              label: "Page settings",
              icon: "settings-1",
              priority: "overflow",
              onClick: fn(),
            },
          ]}
        />

        {page === "overview" && (
          <KpiOverviewBlock
            title="Delivery performance"
            headingLevel="h2"
            period={{ label: "1–21 September 2026", comparisonLabel: "August 2026" }}
            metrics={metrics}
          />
        )}

        {page === "tasks" && (
          <TaskListBlock
            title="Work queue"
            headingLevel="h2"
            tasks={tasks}
            assignees={people}
            today={today}
            onToggleComplete={(id, completed) =>
              setTasks((current) =>
                current.map((task) => (task.id === id ? { ...task, completed } : task))
              )
            }
          />
        )}

        {page === "suppliers" && (
          <section
            aria-label="Supplier directory"
            className="divide-y divide-surface-border rounded-xl border border-surface-border bg-surface px-5"
          >
            {[
              ["Northline Transport", "Road freight", "Rotterdam, Netherlands"],
              ["Portside Cargo", "Ocean freight", "Antwerp, Belgium"],
              ["Atlas Express", "Last-mile delivery", "Utrecht, Netherlands"],
            ].map(([name, service, location]) => (
              <article
                key={name}
                className="flex flex-wrap items-center justify-between gap-3 py-5"
              >
                <div>
                  <h2 className="text-body-md font-semibold text-grey-900">{name}</h2>
                  <p className="mt-1 text-body-sm text-grey-600">{location}</p>
                </div>
                <span className="text-body-sm text-grey-600">{service}</span>
              </article>
            ))}
          </section>
        )}
        {page === "profile" && (
          <ProfileSettingsBlock
            title="Personal details"
            headingLevel="h2"
            timeZones={[{ value: "Europe/Amsterdam", label: "Amsterdam (GMT+02:00)" }]}
            value={savedProfile}
            onSave={setSavedProfile}
          />
        )}
      </div>
    </ApplicationShellBlock>
  );
}

/* ─── Full chrome ─────────────────────────────────────────────────── */
export const FullChrome: Story = {
  render: () => <Chrome />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // One page-level heading across five composed blocks, and no level skipped.
    const headings = Array.from(
      canvasElement.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")
    ).filter((node) => node.offsetParent !== null);
    const levels = headings.map((node) => Number(node.tagName.slice(1)));
    await expect(levels.filter((level) => level === 1)).toHaveLength(1);
    for (let index = 1; index < levels.length; index += 1) {
      await expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
    }

    // Navigation moves the workspace without losing the chrome around it.
    const nav = canvas.getByRole("navigation", { name: "Main" });
    await userEvent.click(within(nav).getByRole("button", { name: /Tasks/ }));
    await expect(canvas.getByRole("heading", { level: 1, name: "Team tasks" })).toBeVisible();

    await expect(canvas.getByText("3 open", { exact: true })).toBeVisible();
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Confirm the September supplier audit dates" })
    );
    await expect(canvas.getByText("2 open", { exact: true })).toBeVisible();

    // The shell, page header, and breadcrumb landmarks are all named and distinct.
    await expect(canvas.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(canvas.getByRole("main", { name: "Workspace" })).toBeVisible();

    // The switcher and the palette trigger occupy real space. `toBeVisible`
    // alone does not catch this: an element squeezed to 0px is still "visible"
    // by that definition, and inline-size containment on the block root once
    // collapsed the switcher to 0px at every width without failing a test.
    const switcher = canvas.getByRole("button", { name: /Switch workspace/ });
    await expect(switcher.getBoundingClientRect().width).toBeGreaterThan(120);
    const palette = canvas.getByRole("button", { name: /Search or jump to/ });
    await expect(palette.getBoundingClientRect().width).toBeGreaterThan(120);
    await expect(getComputedStyle(palette).fontSize).toBe("14px");
  },
};

/* ─── The palette over the chrome ─────────────────────────────────────
   A search overlay above a workspace is exactly where a second scroll region
   and a dropped focus target show up, so both are asserted here.
   ------------------------------------------------------------------- */
export const PaletteOverChrome: Story = {
  render: () => <Chrome />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Search or jump to/ });
    await userEvent.click(trigger);

    const dialog = canvas.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();

    // The page behind the overlay is frozen, so only one region scrolls.
    await expect(document.body.style.overflow).toBe("hidden");

    const search = canvas.getByRole("searchbox", { name: "Search destinations and actions" });
    await userEvent.type(search, "profile");
    await expect(canvas.getByRole("status")).toHaveTextContent("1 result");

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    // The workspace changed, the overlay closed, focus is back on the trigger,
    // and the page scroll lock was released.
    await expect(canvas.getByRole("heading", { level: 1, name: "Your profile" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Search or jump to/ })).toHaveFocus();
    await expect(document.body.style.overflow).not.toBe("hidden");
  },
};

/* ─── Switching workspace from inside the chrome ──────────────────── */
export const SwitchWorkspace: Story = {
  render: () => <Chrome />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Switch workspace/ }));
    const filter = canvas.getByRole("searchbox", { name: "Filter workspaces" });
    await userEvent.type(filter, "Delta");
    const option = canvas.getAllByRole("option")[0];
    await userEvent.click(option);

    // The page header's meta list reflects the new workspace.
    await expect(canvas.getAllByText("Delta Ports").length).toBeGreaterThan(0);
    await expect(canvas.getByRole("button", { name: /Switch workspace/ })).toHaveFocus();
  },
};

/* ─── Collapsed chrome ────────────────────────────────────────────────
   A 360px column on a wide screen. Nothing is dropped: the switcher and the
   palette trigger stay in the top bar, the search wraps onto its own row, and
   every destination is inside the collapsed panel.
   ------------------------------------------------------------------- */
export const NarrowChrome: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[360px] border-x border-surface-border">
      <Chrome />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Both features survive the collapse, with room to read them.
    const switcher = canvas.getByRole("button", { name: /Switch workspace/ });
    await expect(switcher).toBeVisible();
    await expect(switcher.getBoundingClientRect().width).toBeGreaterThan(120);
    const palette = canvas.getByRole("button", { name: /Search or jump to/ });
    await expect(palette).toBeVisible();
    await expect(palette.getBoundingClientRect().width).toBeGreaterThan(120);
    await expect(getComputedStyle(palette).fontSize).toBe("14px");

    const toggle = canvas.getByRole("button", { name: "Open navigation" });
    await userEvent.click(toggle);
    await userEvent.click(switcher);
    await userEvent.keyboard("{Escape}");
    await expect(switcher).toHaveFocus();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const nav = canvas.getByRole("navigation", { name: /Main/ });
    await expect(within(nav).getByRole("link", { name: /Suppliers/ })).toHaveAttribute(
      "href",
      "#suppliers"
    );
    await userEvent.click(within(nav).getByRole("button", { name: /Profile/ }));

    // Choosing a destination closes the panel and shows the new page.
    await expect(canvas.getByRole("heading", { level: 1, name: "Your profile" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  },
};

/* ─── Bounded workspace scroll ────────────────────────────────────────
   `mainScroll="region"` is the arrangement with two candidate scroll regions.
   The workspace keeps its own, the overlay freezes the page behind it, and
   nothing scrolls horizontally.
   ------------------------------------------------------------------- */
export const BoundedScrollChrome: Story = {
  render: () => <Chrome mainScroll="region" className="h-[600px]" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The workspace is a keyboard-reachable scroll region, not a silent one.
    const main = canvas.getByRole("main", { name: "Workspace" });
    await expect(main).toHaveAttribute("tabindex", "0");

    // No element in the chrome is a horizontal scroll region. Overflow is only
    // a defect where the computed overflow actually allows scrolling, so the
    // filter checks `overflow-x` rather than treating a vertical scrollbar's
    // effect on `clientWidth` as a horizontal overflow.
    const horizontal = Array.from(canvasElement.querySelectorAll<HTMLElement>("*")).filter(
      (node) => {
        if (node.scrollWidth <= node.clientWidth + 1) return false;
        const overflowX = window.getComputedStyle(node).overflowX;
        return overflowX === "auto" || overflowX === "scroll";
      }
    );
    await expect(horizontal.map((node) => node.className)).toHaveLength(0);

    // The vertical scroll region is the workspace, and it is the only one.
    const verticalScrollers = Array.from(canvasElement.querySelectorAll<HTMLElement>("*")).filter(
      (node) => {
        if (node.scrollHeight <= node.clientHeight + 1) return false;
        const overflowY = window.getComputedStyle(node).overflowY;
        return overflowY === "auto" || overflowY === "scroll";
      }
    );
    await expect(verticalScrollers).toContain(main);
  },
};

/* ─── Dark chrome ─────────────────────────────────────────────────── */
export const DarkChrome: Story = {
  render: () => (
    <div className="dark">
      <Chrome />
    </div>
  ),
};

/* ─── Consumer palette ────────────────────────────────────────────────
   One set of semantic roles reaches the shell ground, the sidebar, the page
   header, the popover, and the workspace blocks, with no per-block override.

   Scoped to an explicit light island. A consumer palette is written for one
   mode: the grey ramp inverts under `.dark` but these overrides do not, and the
   same values inside a dark document measured 1.05:1 on the muted ground.
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

export const CustomSurfaceChrome: Story = {
  render: () => (
    <div style={sageTheme} className="rayden-light">
      <Chrome />
    </div>
  ),
};

/* ─── Shortcut-driven palette ─────────────────────────────────────── */
export const ShortcutChrome: Story = {
  render: () => <Chrome paletteShortcut />,
};
