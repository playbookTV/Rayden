import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { TaskListBlock, type TaskListAssignee, type TaskListTask } from "./TaskListBlock";

const meta: Meta<typeof TaskListBlock> = {
  title: "Blocks/TaskList",
  component: TaskListBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TaskListBlock>;

function Frame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="mx-auto w-full max-w-[900px]">{children}</div>;
}

/** Fixed so due-date wording is deterministic in stories and tests. */
const today = new Date(2026, 8, 22); // 22 September 2026

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
  {
    id: "t5",
    title: "Draft the Q4 capacity plan",
    completed: false,
    dueDate: "2026-11-02",
  },
];

/* ─── Stateful harness ────────────────────────────────────────────── */

function Harness({
  initialTasks = seedTasks,
  withSelection = true,
  canEdit = true,
}: Readonly<{
  initialTasks?: TaskListTask[];
  withSelection?: boolean;
  canEdit?: boolean;
}>) {
  const [tasks, setTasks] = useState<TaskListTask[]>(initialTasks);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [nextId, setNextId] = useState(100);

  return (
    <Frame>
      <TaskListBlock
        tasks={tasks}
        assignees={people}
        today={today}
        canEdit={canEdit}
        description="Work the operations team owns this week."
        selectedIds={withSelection ? selectedIds : undefined}
        onSelectionChange={withSelection ? setSelectedIds : undefined}
        onToggleComplete={(id, completed) =>
          setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed } : task)))
        }
        onAddTask={({ title, assigneeId, dueDate }) => {
          setTasks((prev) => [
            ...prev,
            { id: `new-${nextId}`, title, completed: false, assigneeId, dueDate },
          ]);
          setNextId((value) => value + 1);
        }}
        onDeleteTask={(id) => setTasks((prev) => prev.filter((task) => task.id !== id))}
        onAssignTask={(id, assigneeId) =>
          setTasks((prev) =>
            prev.map((task) =>
              task.id === id ? { ...task, assigneeId: assigneeId || undefined } : task
            )
          )
        }
        onBulkComplete={(ids) =>
          setTasks((prev) =>
            prev.map((task) => (ids.includes(task.id) ? { ...task, completed: true } : task))
          )
        }
        onBulkDelete={(ids) => {
          setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));
          setSelectedIds([]);
        }}
      />
    </Frame>
  );
}

/* ─── Default ─────────────────────────────────────────────────────── */

export const Default: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Showing 5 of 5 tasks.")).toBeVisible();
    // Due-date context is textual, never colour alone.
    await expect(canvas.getByText("Overdue by 3 days")).toBeVisible();
    await expect(canvas.getByText("Due today")).toBeVisible();
    await expect(canvas.getByText("Due in 4 days")).toBeVisible();
  },
};

/* ─── Adding work ─────────────────────────────────────────────────── */
export const AddsATask: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText("New task");

    // An empty title is refused and says why.
    await userEvent.click(canvas.getByRole("button", { name: "Add task" }));
    await expect(canvas.getByText("Give the task a name.")).toBeVisible();

    await userEvent.type(field, "Book the warehouse walkthrough");
    await userEvent.selectOptions(canvas.getByLabelText("Assign to"), "ines");
    await userEvent.click(canvas.getByRole("button", { name: "Add task" }));

    await expect(canvas.getByText("Book the warehouse walkthrough")).toBeVisible();
    await expect(canvas.getByText("Showing 6 of 6 tasks.")).toBeVisible();
    // The field is cleared and keeps focus, ready for the next task.
    await expect(field).toHaveValue("");
    await expect(field).toHaveFocus();
  },
};

/* ─── Completing work ─────────────────────────────────────────────── */
export const CompletesATask: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Publish the revised delivery promise",
    });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // The status counts follow the change.
    await userEvent.click(canvas.getByRole("radio", { name: /Done/ }));
    await expect(canvas.getByText("Showing 2 of 5 tasks.")).toBeVisible();
  },
};

/* ─── A filter that matches nothing ───────────────────────────────── */
/* This must not be confused with "no tasks exist". */
export const FilteredToNoMatches: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Search tasks"), "zzzz-no-such-task");

    await expect(canvas.getByText("No tasks match these filters")).toBeVisible();
    await expect(canvas.queryByText("No tasks yet")).toBeNull();
    await expect(canvas.getByText("Showing 0 of 5 tasks.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
    await expect(canvas.getByText("Showing 5 of 5 tasks.")).toBeVisible();
  },
};

/* ─── Selection state must stay truthful ──────────────────────────── */
/* Partial selection reports `mixed`; changing the filter re-derives the
   header from the rows that are actually on screen. */
export const PartialSelectionReportsMixed: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectAll = canvas.getByRole("checkbox", { name: "Select all 5 shown tasks" });
    await expect(selectAll).not.toBeChecked();
    await expect(selectAll).not.toHaveAttribute("aria-checked", "mixed");

    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Select Draft the Q4 capacity plan" })
    );
    await expect(selectAll).toHaveAttribute("aria-checked", "mixed");
    await expect(canvas.getByText("1 of 5 shown selected")).toBeVisible();

    // Select everything shown.
    await userEvent.click(selectAll);
    await expect(canvas.getByText("5 of 5 shown selected")).toBeVisible();
    await expect(canvas.getByRole("checkbox", { name: "Select all 5 shown tasks" })).toBeChecked();

    // Now change the rows behind the header. Only one completed task is
    // visible, and it was part of the earlier selection, so the header stays
    // truthful for the rows now on screen.
    await userEvent.click(canvas.getByRole("radio", { name: /Done/ }));
    const doneSelectAll = canvas.getByRole("checkbox", { name: "Select all 1 shown task" });
    await expect(doneSelectAll).toBeChecked();

    // Clearing the visible rows must not clear the hidden ones.
    await userEvent.click(doneSelectAll);
    await expect(doneSelectAll).not.toBeChecked();
    await userEvent.click(canvas.getByRole("radio", { name: /All/ }));
    await expect(canvas.getByText("4 of 5 shown selected")).toBeVisible();
    await expect(
      canvas.getByRole("checkbox", { name: "Select all 5 shown tasks" })
    ).toHaveAttribute("aria-checked", "mixed");
  },
};

/* ─── Empty: no tasks exist ───────────────────────────────────────── */
export const NoTasksYet: Story = {
  render: () => <Harness initialTasks={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No tasks yet")).toBeVisible();
    await expect(canvas.queryByText("No tasks match these filters")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Add the first task" }));
    await expect(canvas.getByLabelText("New task")).toHaveFocus();
  },
};

/* ─── One task ────────────────────────────────────────────────────── */
export const SingleTask: Story = {
  render: () => <Harness initialTasks={[seedTasks[1]]} />,
};

/* ─── A large list ────────────────────────────────────────────────── */
export const FiftyTasks: Story = {
  render: () => (
    <Harness
      initialTasks={Array.from({ length: 50 }, (_, index) => ({
        id: `bulk-${index}`,
        title: `Reconcile delivery note ${1000 + index}`,
        completed: index % 4 === 0,
        assigneeId: people[index % people.length].id,
        dueDate: `2026-09-${String((index % 28) + 1).padStart(2, "0")}`,
      }))}
    />
  ),
};

/* ─── Read-only ───────────────────────────────────────────────────── */
export const ReadOnly: Story = {
  render: () => <Harness canEdit={false} withSelection={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("View only")).toBeVisible();
    await expect(canvas.queryByLabelText("New task")).toBeNull();
    await expect(
      canvas.getByRole("checkbox", { name: "Publish the revised delivery promise" })
    ).toBeDisabled();
  },
};

/* ─── Loading ─────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <Frame>
      <TaskListBlock tasks={[]} status="loading" today={today} onToggleComplete={fn()} />
    </Frame>
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────── */
export const LoadFailed: Story = {
  render: () => (
    <Frame>
      <TaskListBlock
        tasks={[]}
        status="error"
        errorMessage="The task service did not respond. Nothing was changed."
        onRetry={fn()}
        today={today}
        onToggleComplete={fn()}
      />
    </Frame>
  ),
};

/* ─── An add that failed ──────────────────────────────────────────── */
export const AddFailed: Story = {
  render: () => (
    <Frame>
      <TaskListBlock
        tasks={seedTasks}
        assignees={people}
        today={today}
        addStatus="error"
        addErrorMessage="That task could not be created. Check your connection and try again."
        onToggleComplete={fn()}
        onAddTask={fn()}
      />
    </Frame>
  ),
};

/* ─── Adding in flight ────────────────────────────────────────────── */
export const AddInFlight: Story = {
  render: () => (
    <Frame>
      <TaskListBlock
        tasks={seedTasks}
        assignees={people}
        today={today}
        addStatus="submitting"
        onToggleComplete={fn()}
        onAddTask={fn()}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("New task")).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Adding…" })).toBeDisabled();
  },
};

/* ─── Without an add handler ──────────────────────────────────────── */
/* No add form is rendered rather than an inert one. */
export const CompletionOnly: Story = {
  render: () => (
    <Frame>
      <TaskListBlock tasks={seedTasks} assignees={people} today={today} onToggleComplete={fn()} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByLabelText("New task")).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Add task" })).toBeNull();
  },
};

/* ─── Long titles and translated names ────────────────────────────── */
export const LongTitles: Story = {
  render: () => (
    <Harness
      initialTasks={[
        {
          id: "long-1",
          title:
            "Überprüfung der Lieferantenvereinbarungen für die Regionen Nordrhein-Westfalen, Baden-Württemberg und Mecklenburg-Vorpommern",
          completed: false,
          assigneeId: "ines",
          dueDate: "2026-09-18",
          note: "Die Rückmeldungen aus dem Einkauf stehen für zwei Regionen noch aus.",
        },
        {
          id: "long-2",
          title: "確認済みの配送スケジュールを関係各所へ共有し、変更点を記録する",
          completed: false,
          assigneeId: "tomas",
          dueDate: "2026-10-30",
        },
      ]}
    />
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* A brand surface value is mode-specific: Rayden has no paired foreground
   role yet, so a light brand surface is scoped as an explicit light island
   (`rayden-light`). Without that scope, a light surface inside a dark
   document would keep the inverted, near-white grey foregrounds. */
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
      <Harness />
    </div>
  ),
};

/* ─── Narrow container ────────────────────────────────────────────── */
/* A 400px column at a desktop viewport. The add row, filter row and each
   task's title/assignee/due-date metadata stack instead of colliding. */
export const NarrowContainer: Story = {
  render: () => (
    <div className="w-[400px] border border-dashed border-surface-border-strong p-2">
      <Harness />
    </div>
  ),
};
