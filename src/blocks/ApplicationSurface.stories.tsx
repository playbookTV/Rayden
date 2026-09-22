import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { KpiOverviewBlock, type KpiMetric, type KpiPeriod } from "./KpiOverviewBlock";
import { ProfileSettingsBlock, type ProfileSettingsValues } from "./ProfileSettingsBlock";
import { TaskListBlock, type TaskListAssignee, type TaskListTask } from "./TaskListBlock";

/**
 * A signed-in application surface built from three Batch B blocks. Composing
 * them is what exposes inconsistent spacing, competing heading levels, theme
 * drift and nested scrolling — none of which show up in isolated previews.
 */
const meta: Meta = {
  title: "Blocks/Application surface",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const today = new Date(2026, 8, 22);

const period: KpiPeriod = {
  label: "1–21 September 2026",
  comparisonLabel: "1–21 August 2026",
};

const metrics: KpiMetric[] = [
  {
    id: "revenue",
    label: "Net revenue",
    value: "£248,310",
    comparisonValue: "£221,004",
    change: { label: "+12.4%", direction: "up", sentiment: "positive" },
    description: "41 new annual contracts signed in the UK and Ireland.",
    icon: "coins",
  },
  {
    id: "orders",
    label: "Completed orders",
    value: "3,184",
    comparisonValue: "3,266",
    change: { label: "−2.5%", direction: "down", sentiment: "negative" },
    description: "Fewer repeat orders from two wholesale accounts.",
    icon: "cart-check",
  },
  {
    id: "churn",
    label: "Monthly churn",
    value: "1.8%",
    comparisonValue: "2.6%",
    change: { label: "−0.8 pts", direction: "down", sentiment: "positive" },
    description: "Retention calls reached 92% of at-risk accounts.",
    icon: "user-remove",
  },
  {
    id: "response",
    label: "Median first response",
    value: "48 min",
    comparisonValue: "47 min",
    change: { label: "+1 min", direction: "up", sentiment: "neutral" },
    description: "Inside the 60-minute target every week.",
    icon: "stopwatch",
  },
];

const people: TaskListAssignee[] = [
  { id: "amara", name: "Amara Okonkwo", initials: "AO" },
  { id: "ines", name: "Inés Delgado-Márquez", initials: "ID" },
  { id: "tomas", name: "Tomás Řehák", initials: "TR" },
];

const seedTasks: TaskListTask[] = [
  {
    id: "t1",
    title: "Confirm the September supplier audit dates",
    completed: false,
    assigneeId: "amara",
    dueDate: "2026-09-19",
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

const savedProfile: ProfileSettingsValues = {
  firstName: "Amara",
  lastName: "Okonkwo",
  email: "amara.okonkwo@example.com",
  jobTitle: "Operations lead",
  timeZone: "Africa/Lagos",
  bio: "I look after supplier onboarding and keep our delivery promises honest.",
};

function Surface({ style, className }: Readonly<{ style?: CSSProperties; className?: string }>) {
  const [tasks, setTasks] = useState(seedTasks);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [profile, setProfile] = useState(savedProfile);
  const [profileStatus, setProfileStatus] = useState<"idle" | "success">("idle");
  const [periodId, setPeriodId] = useState("sep");
  const [nextId, setNextId] = useState(1);

  return (
    <div className={`min-h-screen bg-surface-muted p-4 md:p-6 ${className ?? ""}`} style={style}>
      {/* One page heading; every block sits at h2 underneath it. */}
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-h5 font-semibold text-grey-900">Operations workspace</h1>
          <p className="text-body-sm text-grey-600">
            Your metrics, your team's work, and your profile in one place.
          </p>
        </header>

        <KpiOverviewBlock
          headingLevel="h2"
          period={period}
          metrics={metrics}
          periodOptions={[
            { id: "sep", label: "This month to date" },
            { id: "aug", label: "Last full month" },
          ]}
          selectedPeriodId={periodId}
          onPeriodChange={setPeriodId}
          onSelectMetric={fn()}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <TaskListBlock
            headingLevel="h2"
            title="This week's work"
            tasks={tasks}
            assignees={people}
            today={today}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onToggleComplete={(id, completed) =>
              setTasks((prev) =>
                prev.map((task) => (task.id === id ? { ...task, completed } : task))
              )
            }
            onAddTask={({ title, assigneeId, dueDate }) => {
              setTasks((prev) => [
                ...prev,
                { id: `new-${nextId}`, title, completed: false, assigneeId, dueDate },
              ]);
              setNextId((value) => value + 1);
            }}
            onDeleteTask={(id) => setTasks((prev) => prev.filter((task) => task.id !== id))}
            onBulkComplete={(ids) =>
              setTasks((prev) =>
                prev.map((task) => (ids.includes(task.id) ? { ...task, completed: true } : task))
              )
            }
          />

          <ProfileSettingsBlock
            headingLevel="h2"
            value={profile}
            avatar={{ initials: "AO", alt: "Amara Okonkwo" }}
            status={profileStatus === "success" ? "success" : "idle"}
            successMessage="Your profile was updated."
            onAvatarChange={fn()}
            onSave={(next) => {
              setProfile(next);
              setProfileStatus("success");
            }}
            onCancel={() => setProfileStatus("idle")}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Default composition ─────────────────────────────────────────── */

export const Default: Story = {
  render: () => <Surface />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Exactly one page-level heading; each block contributes one h2.
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(3);

    // Each block is a named region, so the surface is navigable by landmark.
    const regions = canvas.getAllByRole("region");
    await expect(regions.length).toBeGreaterThanOrEqual(3);

    // The three blocks still work side by side.
    await userEvent.type(canvas.getByLabelText("New task"), "Chase the audit replies");
    await userEvent.click(canvas.getByRole("button", { name: "Add task" }));
    await expect(canvas.getByText("Showing 5 of 5 tasks.")).toBeVisible();

    const jobTitle = canvas.getByLabelText("Job title");
    await userEvent.clear(jobTitle);
    await userEvent.type(jobTitle, "Head of operations");
    await expect(canvas.getByText("You have unsaved changes.")).toBeVisible();

    await userEvent.selectOptions(canvas.getByLabelText("Reporting period"), "aug");
    await expect(canvas.getByLabelText("Reporting period")).toHaveValue("aug");
  },
};

/* ─── Brand override across all three blocks ──────────────────────── */
/* A single semantic surface override must reach every block, with no
   per-block escape hatch. Scoped as an explicit light island, because a
   brand surface value belongs to one mode and Rayden has no paired
   foreground role yet. */
export const BrandedSurface: Story = {
  render: () => (
    <Surface
      className="rayden-light"
      style={
        {
          "--color-surface": "#fbf4ea",
          "--color-surface-muted": "#efe4d4",
          "--color-surface-border": "#e0d3bd",
          "--color-surface-border-strong": "#c8b393",
        } as CSSProperties
      }
    />
  ),
};
