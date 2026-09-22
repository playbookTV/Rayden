import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { WorkspaceSwitcherBlock, type WorkspaceSwitcherItem } from "./WorkspaceSwitcherBlock";

const meta: Meta<typeof WorkspaceSwitcherBlock> = {
  title: "Blocks/Workspace Switcher",
  component: WorkspaceSwitcherBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded", a11y: { test: "error" } },
};

export default meta;
type Story = StoryObj<typeof WorkspaceSwitcherBlock>;

/* ─── Fixtures ────────────────────────────────────────────────────── */

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

/* ─── Default ─────────────────────────────────────────────────────────
   Seven workspaces, so the filter is rendered. Below the threshold it is
   omitted rather than shown over three entries.
   ------------------------------------------------------------------- */
function Harness({
  initial = "acme",
  items = workspaces,
  withFooter = true,
}: Readonly<{ initial?: string; items?: WorkspaceSwitcherItem[]; withFooter?: boolean }>) {
  const [currentId, setCurrentId] = useState(initial);
  const current = items.find((item) => item.id === currentId);
  return (
    <div className="flex max-w-[320px] flex-col gap-4">
      <WorkspaceSwitcherBlock
        current={current}
        workspaces={items}
        triggerHint="Workspace"
        onSelect={setCurrentId}
        footerActions={
          withFooter
            ? [
                { id: "create", label: "Create a workspace", icon: "plus", onClick: fn() },
                {
                  id: "join",
                  label: "Join with an invitation code",
                  icon: "user-add",
                  href: "#join",
                },
              ]
            : []
        }
      />
      <p className="text-body-sm font-semibold text-grey-900">
        {`Current workspace: ${current?.name ?? "none"}`}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Switch workspace/ });

    // `aria-controls` names an element that is in the document while closed.
    const panelId = trigger.getAttribute("aria-controls") ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(panelId)}`)).toBeTruthy();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Opening moves focus to the filter, which is where typing already works.
    const filter = canvas.getByRole("searchbox", { name: "Filter workspaces" });
    await waitFor(() => expect(filter).toHaveFocus());

    // Down from the filter moves into the list; arrow keys walk it.
    await userEvent.keyboard("{ArrowDown}");
    const options = canvas.getAllByRole("option");
    await expect(options[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(options[1]).toHaveFocus();

    // Enter selects, the popover closes, and focus returns to the trigger.
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Current workspace: Northwind Logistics")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /Switch workspace/ })).toHaveFocus();
    await expect(canvas.getByRole("button", { name: /Switch workspace/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  },
};

/* ─── Filtering down to nothing ───────────────────────────────────────
   "No matches" is a different situation from "no workspaces", and the two
   read differently.
   ------------------------------------------------------------------- */
export const FilterToNoMatches: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Switch workspace/ }));

    const filter = canvas.getByRole("searchbox", { name: "Filter workspaces" });
    await userEvent.type(filter, "zzzz");

    await expect(canvas.getByText("No workspace matches that filter")).toBeVisible();
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);

    // Clearing the filter brings every workspace back.
    await userEvent.clear(filter);
    await expect(canvas.getAllByRole("option").length).toBe(workspaces.length);

    // Escape closes and restores focus.
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("button", { name: /Switch workspace/ })).toHaveFocus();
  },
};

/* ─── Permission-aware entry ──────────────────────────────────────────
   A workspace the viewer cannot open stays visible with its reason, rather
   than vanishing without explanation. Activating it does nothing.
   ------------------------------------------------------------------- */
export const PermissionAware: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Switch workspace/ }));

    const blocked = canvas
      .getAllByRole("option")
      .find((node) => node.textContent?.includes("Vantage Chemicals"));
    await expect(blocked).toBeTruthy();
    await expect(blocked).toHaveAttribute("aria-disabled", "true");

    const reasonId = blocked?.getAttribute("aria-describedby") ?? "";
    await expect(canvasElement.querySelector(`#${CSS.escape(reasonId)}`)).toBeTruthy();

    // It cannot be chosen: the current workspace is unchanged.
    await userEvent.click(blocked as HTMLElement);
    await expect(canvas.getByText("Current workspace: Acme Freight")).toBeVisible();
  },
};

/* ─── Short list: no filter ───────────────────────────────────────── */
export const ShortList: Story = {
  render: () => <Harness items={workspaces.slice(0, 3)} />,
};

/* ─── One workspace ───────────────────────────────────────────────────
   The trigger still states which workspace this is, and the list shows the
   single entry rather than pretending there is a choice elsewhere.
   ------------------------------------------------------------------- */
export const SingleWorkspace: Story = {
  render: () => <Harness items={[workspaces[0]]} />,
};

/* ─── No workspaces at all ────────────────────────────────────────── */
export const EmptySource: Story = {
  render: () => (
    <div className="max-w-[320px]">
      <WorkspaceSwitcherBlock
        workspaces={[]}
        triggerHint="Workspace"
        defaultOpen
        onSelect={fn()}
        footerActions={[{ id: "create", label: "Create a workspace", icon: "plus", onClick: fn() }]}
      />
    </div>
  ),
};

/* ─── Loading ─────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <div className="max-w-[320px]">
      <WorkspaceSwitcherBlock
        status="loading"
        workspaces={[]}
        current={workspaces[0]}
        triggerHint="Workspace"
        defaultOpen
        onSelect={fn()}
      />
    </div>
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────── */
export const ErrorWithRetry: Story = {
  render: () => (
    <div className="max-w-[320px]">
      <WorkspaceSwitcherBlock
        status="error"
        workspaces={[]}
        current={workspaces[0]}
        triggerHint="Workspace"
        defaultOpen
        errorMessage="Your workspaces could not be loaded. You are still signed in to Acme Freight."
        onRetry={fn()}
        onSelect={fn()}
      />
    </div>
  ),
};

/* ─── Destinations rather than actions ────────────────────────────────
   A workspace that is genuinely its own address keeps a real `href`, so
   middle-click and open-in-new-tab still work.
   ------------------------------------------------------------------- */
export const WorkspacesAsDestinations: Story = {
  render: () => (
    <div className="max-w-[320px]">
      <WorkspaceSwitcherBlock
        current={{ id: "acme", name: "Acme Freight", detail: "Scale", initials: "AF" }}
        workspaces={[
          { id: "acme", name: "Acme Freight", detail: "Scale", initials: "AF", href: "#w/acme" },
          {
            id: "northwind",
            name: "Northwind Logistics",
            detail: "Team",
            initials: "NL",
            href: "#w/northwind",
          },
          {
            id: "lumen",
            name: "Lumen Retail Group",
            detail: "Scale",
            initials: "LR",
            href: "#w/lumen",
          },
        ]}
        triggerHint="Workspace"
        defaultOpen
        onSelect={fn()}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole("option");
    await expect(options[1]).toHaveAttribute("href", "#w/northwind");
    await expect(options[1].tagName).toBe("A");
  },
};

/* ─── Long names and translated labels ────────────────────────────────
   A 70-character workspace name and German control labels, inside a column
   narrower than a phone.
   ------------------------------------------------------------------- */
export const LongNames: Story = {
  render: () => (
    <div className="max-w-[240px]">
      <WorkspaceSwitcherBlock
        triggerLabel="Arbeitsbereich wechseln"
        triggerHint="Arbeitsbereich"
        panelLabel="Arbeitsbereiche"
        filterLabel="Arbeitsbereiche filtern"
        filterPlaceholder="Zum Filtern tippen"
        noMatchesTitle="Kein Arbeitsbereich entspricht dem Filter"
        noMatchesDescription="Prüfen Sie die Schreibweise oder leeren Sie den Filter."
        resultCountLabel={(count) =>
          count === 1 ? "1 Arbeitsbereich gefunden" : `${count} Arbeitsbereiche gefunden`
        }
        current={{
          id: "one",
          name: "Nordwestdeutsche Hafenlogistikgenossenschaft eG",
          detail: "Unternehmensweit · 1.204 Mitglieder",
          initials: "NH",
        }}
        workspaces={[
          {
            id: "one",
            name: "Nordwestdeutsche Hafenlogistikgenossenschaft eG",
            detail: "Unternehmensweit · 1.204 Mitglieder",
            initials: "NH",
          },
          {
            id: "two",
            name: "Binnenschifffahrtsgesellschaft Rheinland-Pfalz mbH",
            detail: "Team · 31 Mitglieder",
            initials: "BR",
          },
          {
            id: "three",
            name: "Küstenwache Bremerhaven",
            detail: "Starter · 6 Mitglieder",
            initials: "KB",
          },
          {
            id: "four",
            name: "Werft Wilhelmshaven",
            detail: "Team · 44 Mitglieder",
            initials: "WW",
          },
          { id: "five", name: "Elbe Speditionen", detail: "Team · 18 Mitglieder", initials: "ES" },
          {
            id: "six",
            name: "Ostsee Terminal Rostock",
            detail: "Scale · 96 Mitglieder",
            initials: "OT",
          },
        ]}
        defaultOpen
        onSelect={fn()}
        footerActions={[
          { id: "create", label: "Arbeitsbereich erstellen", icon: "plus", onClick: fn() },
        ]}
      />
    </div>
  ),
};

/* ─── Large list ──────────────────────────────────────────────────────
   Sixty workspaces. The list scrolls inside the popover; the filter is the
   way through it.
   ------------------------------------------------------------------- */
const manyWorkspaces: WorkspaceSwitcherItem[] = Array.from({ length: 60 }, (_, index) => ({
  id: `w${index}`,
  name: `Workspace ${index + 1}`,
  detail: `Team · ${3 + index} members`,
  initials: `W${index + 1}`.slice(0, 2),
}));

export const LargeList: Story = {
  render: () => (
    <div className="max-w-[320px]">
      <WorkspaceSwitcherBlock
        current={manyWorkspaces[0]}
        workspaces={manyWorkspaces}
        triggerHint="Workspace"
        defaultOpen
        onSelect={fn()}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const filter = canvas.getByRole("searchbox", { name: "Filter workspaces" });
    await userEvent.type(filter, "Workspace 4");
    // 4, 40–49 — eleven of sixty.
    await expect(canvas.getAllByRole("option")).toHaveLength(11);
  },
};

/* ─── Dark ────────────────────────────────────────────────────────── */
export const DarkIsland: Story = {
  render: () => (
    <div className="dark bg-surface-muted p-4">
      <Harness />
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
      <Harness />
    </div>
  ),
};

export const MissingSelectionHandler: Story = {
  args: { current: workspaces[0], workspaces: workspaces.slice(0, 2) },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /Switch workspace/ }));
    const option = c.getByRole("option", { name: /Northwind/ });
    await expect(option).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(option);
    await expect(c.getByRole("dialog")).toBeVisible();
    await expect(option).toHaveTextContent("Switching to this workspace is not available.");
  },
};
