import { useMemo, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  CommandPaletteBlock,
  type CommandPaletteGroup,
  type CommandPaletteItem,
} from "./CommandPaletteBlock";

const meta: Meta<typeof CommandPaletteBlock> = {
  title: "Blocks/Command Palette",
  component: CommandPaletteBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded", a11y: { test: "error" } },
};

export default meta;
type Story = StoryObj<typeof CommandPaletteBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────── */

const groups: CommandPaletteGroup[] = [
  { id: "go", label: "Go to" },
  { id: "do", label: "Actions" },
  { id: "records", label: "Recent records" },
];

/** Destinations carry an href and no onSelect; actions carry onSelect and no href. */
const items: CommandPaletteItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Workspace summary",
    icon: "home",
    groupId: "go",
    href: "#overview",
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "Everything assigned to your team",
    icon: "check-circle",
    groupId: "go",
    href: "#tasks",
    keywords: ["todo", "work"],
  },
  {
    id: "suppliers",
    label: "Suppliers",
    description: "Carrier and vendor records",
    icon: "building-2",
    groupId: "go",
    href: "#suppliers",
  },
  {
    id: "reports",
    label: "Reports",
    description: "Saved and scheduled reports",
    icon: "chart",
    groupId: "go",
    href: "#reports",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Workspace configuration",
    icon: "settings-1",
    groupId: "go",
    href: "#settings",
  },
  {
    id: "new-task",
    label: "Create a task",
    icon: "plus",
    groupId: "do",
    shortcut: "T",
    onSelect: fn(),
    keywords: ["add", "new"],
  },
  { id: "invite", label: "Invite a teammate", icon: "user-add", groupId: "do", onSelect: fn() },
  {
    id: "export",
    label: "Export this workspace",
    icon: "file-download",
    groupId: "do",
    onSelect: fn(),
  },
  {
    id: "delete-workspace",
    label: "Delete this workspace",
    icon: "bin",
    groupId: "do",
    unavailableReason: "Only an account owner can delete a workspace.",
  },
  {
    id: "r1",
    label: "Northwind Logistics",
    description: "Supplier · updated 2 days ago",
    icon: "file-alt",
    groupId: "records",
    href: "#r/northwind",
  },
  {
    id: "r2",
    label: "Waalhaven safety audit",
    description: "Report · updated yesterday",
    icon: "file-alt",
    groupId: "records",
    href: "#r/waalhaven",
  },
];

const suggestions: CommandPaletteItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Workspace summary",
    icon: "home",
    href: "#overview",
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "Everything assigned to your team",
    icon: "check-circle",
    href: "#tasks",
  },
  { id: "new-task", label: "Create a task", icon: "plus", shortcut: "T", onSelect: fn() },
];

function Frame({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto w-full max-w-[420px]">{children}</div>;
}

/* ─── Default: prompt before a query ──────────────────────────────────
   With no suggestions and an empty query the palette asks for a query. That
   is a different state from "no results", which needs a query to exist.
   ------------------------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        triggerLabel="Search or jump to…"
        onSelect={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Search or jump to/ });

    // `aria-controls` resolves to a real element while the dialog is closed.
    const dialogId = trigger.getAttribute("aria-controls") ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(dialogId)}`)).toBeTruthy();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);

    const dialog = canvas.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();
    await waitFor(() =>
      expect(
        canvas.getByRole("searchbox", { name: "Search destinations and actions" })
      ).toHaveFocus()
    );

    // Before anything is typed, the palette prompts rather than claiming
    // there are no results.
    await expect(canvas.getByText("Type to search")).toBeVisible();
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);
  },
};

/* ─── Full keyboard walk ──────────────────────────────────────────────
   Open, filter, arrow, activate, and confirm that focus comes back to the
   control that opened the dialog.
   ------------------------------------------------------------------- */
function ActivationHarness() {
  const [activated, setActivated] = useState<string | null>(null);
  const localItems = useMemo<CommandPaletteItem[]>(
    () => [
      {
        id: "new-task",
        label: "Create a task",
        icon: "plus",
        groupId: "do",
        onSelect: () => setActivated("Create a task"),
      },
      {
        id: "invite",
        label: "Invite a teammate",
        icon: "user-add",
        groupId: "do",
        onSelect: () => setActivated("Invite a teammate"),
      },
      {
        id: "export",
        label: "Export this workspace",
        icon: "file-download",
        groupId: "do",
        onSelect: () => setActivated("Export this workspace"),
      },
      {
        id: "archive",
        label: "Archive this workspace",
        icon: "box",
        groupId: "do",
        onSelect: () => setActivated("Archive this workspace"),
      },
    ],
    []
  );
  return (
    <Frame>
      {/* The readout sits on a themed ground. Without one it inherits the
          document's dark foreground on Storybook's white canvas, which measured
          1.04:1 — a fixture defect, not a block one, but still unreadable. */}
      <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface p-4">
        <CommandPaletteBlock items={localItems} groups={groups} triggerLabel="Search" />
        <p className="text-body-sm font-semibold text-grey-900">
          {`Activated: ${activated ?? "nothing yet"}`}
        </p>
      </div>
    </Frame>
  );
}

export const KeyboardWalk: Story = {
  render: () => <ActivationHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Search/ });
    await userEvent.click(trigger);

    const search = canvas.getByRole("searchbox", { name: "Search destinations and actions" });
    await userEvent.type(search, "a");

    // The result count is announced, not only drawn.
    const count = canvas.getByRole("status");
    await expect(count).toHaveTextContent(/result/);

    // Down enters the list, and arrow keys walk it.
    await userEvent.keyboard("{ArrowDown}");
    const options = canvas.getAllByRole("option");
    await expect(options[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(options[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(options[0]).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(options[options.length - 1]).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(options[0]).toHaveFocus();

    // Enter activates the focused entry, the dialog closes, and focus is
    // handed back to the trigger rather than dropped on the document.
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Activated: Create a task")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Search/ })).toHaveFocus();
    await expect(canvas.getByRole("button", { name: /Search/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  },
};

/* ─── Filtering to no results ─────────────────────────────────────────
   "No results for …" echoes the query, which is what distinguishes it from
   the prompt and from an unconfigured palette.
   ------------------------------------------------------------------- */
export const NoResults: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        suggestions={suggestions}
        onSelect={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Search/ }));

    // An empty query shows the supplied suggestions, not an empty panel.
    await expect(canvas.getByText("Suggestions")).toBeVisible();
    await expect(canvas.getAllByRole("option")).toHaveLength(3);

    const search = canvas.getByRole("searchbox", { name: "Search destinations and actions" });
    await userEvent.type(search, "qqqq");

    await expect(canvas.getByText("No results for “qqqq”")).toBeVisible();
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);
    await expect(canvas.getByRole("status")).toHaveTextContent("0 results");

    // Escape closes and returns focus.
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("button", { name: /Search/ })).toHaveFocus();
  },
};

/* ─── Focus stays inside the dialog ───────────────────────────────── */
export const FocusIsTrapped: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        suggestions={suggestions}
        onSelect={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Search/ }));
    const dialog = canvas.getByRole("dialog", { name: "Command palette" });

    // Tabbing repeatedly never escapes the dialog.
    for (let step = 0; step < 8; step += 1) {
      await userEvent.tab();
      await expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await userEvent.tab({ shift: true });
    await expect(dialog.contains(document.activeElement)).toBe(true);
  },
};

/* ─── Destinations stay links ─────────────────────────────────────────
   A destination is rendered as an anchor inside the result list, so it keeps
   its href, its middle-click behaviour, and its native Enter activation.
   ------------------------------------------------------------------- */
export const DestinationsAreLinks: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        showAllWhenEmpty
        defaultOpen
        onSelect={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole("option");
    const overview = options.find((node) => node.textContent?.startsWith("Overview"));
    await expect(overview?.tagName).toBe("A");
    await expect(overview).toHaveAttribute("href", "#overview");

    // The unavailable entry is marked and explains itself.
    const blocked = options.find((node) => node.textContent?.includes("Delete this workspace"));
    await expect(blocked).toHaveAttribute("aria-disabled", "true");
    const reasonId = blocked?.getAttribute("aria-describedby") ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(reasonId)}`)).toBeTruthy();
  },
};

/* ─── Keyboard shortcut ───────────────────────────────────────────────
   No document listener is registered unless a shortcut is configured, so a
   page holding several palettes does not fight over the same key.
   ------------------------------------------------------------------- */
export const WithShortcut: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        suggestions={suggestions}
        shortcut={{ key: "k", modifier: "mod", hint: "⌘K" }}
        onSelect={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("dialog", { name: "Command palette" })).toBeNull();
    await userEvent.keyboard("{Control>}k{/Control}");
    await expect(canvas.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
  },
};

/* ─── Remote search ───────────────────────────────────────────────────
   The block filters nothing in `external` mode; the consuming application
   owns the query, the loading state, and the results.
   ------------------------------------------------------------------- */
function RemoteHarness() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const results = useMemo<CommandPaletteItem[]>(() => {
    if (!query.trim()) return [];
    return [
      {
        id: "a",
        label: `Server match for “${query}”`,
        description: "Returned by the search service",
        icon: "file-alt",
        href: "#a",
      },
      {
        id: "b",
        label: `Another match for “${query}”`,
        description: "Returned by the search service",
        icon: "file-alt",
        href: "#b",
      },
    ];
  }, [query]);
  return (
    <Frame>
      <CommandPaletteBlock
        filterMode="external"
        items={results}
        status={status}
        defaultOpen
        onQueryChange={(next) => {
          setQuery(next);
          setStatus(next ? "idle" : "idle");
        }}
        onSelect={fn()}
        footer={
          <button
            type="button"
            onClick={() => setStatus((current) => (current === "loading" ? "idle" : "loading"))}
            className="min-h-8 cursor-pointer rounded px-2 text-body-xs font-semibold text-action-primary-text"
          >
            Toggle loading
          </button>
        }
      />
    </Frame>
  );
}

export const RemoteSearch: Story = { render: () => <RemoteHarness /> };

/* ─── Loading ─────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        status="loading"
        defaultOpen
        onSelect={fn()}
      />
    </Frame>
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────── */
export const ErrorWithRetry: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        items={items}
        groups={groups}
        status="error"
        defaultOpen
        errorTitle="Search is unavailable"
        errorDescription="The search service did not respond. Nothing in this workspace has been changed."
        onRetry={fn()}
        onSelect={fn()}
      />
    </Frame>
  ),
};

/* ─── Nothing configured ──────────────────────────────────────────────
   An empty source is not the same as a query with no matches, and it does
   not tell the reader to change their search term.
   ------------------------------------------------------------------- */
export const EmptySource: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock items={[]} defaultOpen onSelect={fn()} />
    </Frame>
  ),
};

/* ─── Large result set ────────────────────────────────────────────────
   Four hundred entries. The list scrolls inside the dialog and nothing
   spills into the page behind it.
   ------------------------------------------------------------------- */
const manyItems: CommandPaletteItem[] = Array.from({ length: 400 }, (_, index) => ({
  id: `item-${index}`,
  label: `Record ${index + 1}`,
  description: `Supplier record number ${index + 1}`,
  icon: "file-alt" as const,
  href: `#record-${index + 1}`,
}));

export const LargeResultSet: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock items={manyItems} showAllWhenEmpty defaultOpen onSelect={fn()} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("400 results");
    const search = canvas.getByRole("searchbox", { name: "Search destinations and actions" });
    await userEvent.type(search, "Record 39");
    // 39 and 390–399.
    await expect(canvas.getAllByRole("option")).toHaveLength(11);
  },
};

/* ─── Narrow viewport ─────────────────────────────────────────────────
   The dialog is viewport-anchored, so it uses the space it actually has
   rather than the width of the container the trigger sits in.
   ------------------------------------------------------------------- */
export const NarrowContainer: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-[288px] border-x border-surface-border p-2">
      <CommandPaletteBlock
        items={items}
        groups={groups}
        suggestions={suggestions}
        defaultOpen
        onSelect={fn()}
      />
    </div>
  ),
};

/* ─── Long translated labels ──────────────────────────────────────── */
export const LongTranslatedLabels: Story = {
  render: () => (
    <Frame>
      <CommandPaletteBlock
        dialogLabel="Befehlspalette"
        searchLabel="Ziele und Aktionen durchsuchen"
        searchPlaceholder="Suchen oder springen…"
        searchHint="Mit den Pfeiltasten navigieren, mit der Eingabetaste öffnen."
        triggerLabel="Suchen"
        closeLabel="Schließen"
        promptTitle="Zum Suchen tippen"
        promptDescription="Beginnen Sie zu tippen, um eine Seite oder eine Aktion zu finden."
        noResultsTitle={(query) => `Keine Treffer für „${query}“`}
        noResultsDescription="Prüfen Sie die Schreibweise oder verwenden Sie einen kürzeren Suchbegriff."
        resultCountLabel={(count) => (count === 1 ? "1 Treffer" : `${count} Treffer`)}
        groups={[{ id: "g", label: "Verwaltung" }]}
        items={[
          {
            id: "a",
            label: "Lieferantenstammdatenverwaltung öffnen",
            description: "Alle Carrier- und Lieferantendatensätze",
            icon: "building-2",
            groupId: "g",
            href: "#a",
          },
          {
            id: "b",
            label: "Nachhaltigkeitsbewertung erstellen",
            description: "Neue Bewertung für einen Standort",
            icon: "plus",
            groupId: "g",
            onSelect: fn(),
          },
          {
            id: "c",
            label: "Arbeitsschutzprüfungsbericht herunterladen",
            icon: "file-download",
            groupId: "g",
            onSelect: fn(),
          },
        ]}
        showAllWhenEmpty
        defaultOpen
        onSelect={fn()}
      />
    </Frame>
  ),
};

/* ─── Dark ────────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="dark bg-surface-muted p-6">
      <Frame>
        <CommandPaletteBlock
          items={items}
          groups={groups}
          suggestions={suggestions}
          defaultOpen
          onSelect={fn()}
        />
      </Frame>
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
    <div style={sageTheme} className="rayden-light bg-surface-muted p-6">
      <Frame>
        <CommandPaletteBlock
          items={items}
          groups={groups}
          suggestions={suggestions}
          defaultOpen
          onSelect={fn()}
        />
      </Frame>
    </div>
  ),
};

export const UnmodifiedShortcutRespectsTyping: Story = {
  render: () => (
    <div className="space-y-4">
      <label>
        Project name
        <input className="block border p-2" aria-label="Project name" />
      </label>
      <CommandPaletteBlock items={items} shortcut={{ key: "k", modifier: "none" }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByRole("textbox", { name: "Project name" });
    await userEvent.type(field, "bookkeeping");
    await expect(field).toHaveValue("bookkeeping");
    await expect(c.queryByRole("dialog")).not.toBeInTheDocument();
    const trigger = c.getByRole("button", { name: "Search" });
    trigger.focus();
    await userEvent.keyboard("k");
    const search = c.getByRole("searchbox");
    await userEvent.type(search, "tasks");
    await expect(search).toHaveValue("tasks");
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};
