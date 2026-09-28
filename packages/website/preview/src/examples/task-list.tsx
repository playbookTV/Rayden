"use client";
import { useState } from "react";
import { TaskListBlock, type TaskListTask } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
const initial: TaskListTask[] = [
  {
    id: "research",
    title: "Review customer interviews",
    completed: true,
    assigneeId: "avery",
    dueDate: "2026-09-23",
  },
  {
    id: "prototype",
    title: "Polish the onboarding prototype",
    completed: false,
    assigneeId: "sam",
    dueDate: "2026-09-24",
    note: "Focus on the first five minutes.",
  },
  {
    id: "handoff",
    title: "Prepare the design handoff",
    completed: false,
    assigneeId: "avery",
    dueDate: "2026-09-28",
  },
];
export default function Example({ state = "default" }: { state?: string }) {
  const [tasks, setTasks] = useState(state === "empty" ? [] : initial);
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <TaskListBlock
        title="A good week, in the making."
        description="A working task list. Changes stay in this preview."
        tasks={tasks}
        today={new Date(2026, 8, 24)}
        assignees={[
          { id: "avery", name: "Avery Morgan", initials: "AM" },
          { id: "sam", name: "Sam Rivera", initials: "SR" },
        ]}
        onToggleComplete={(id, completed) =>
          setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
        }
        onAddTask={(input) =>
          setTasks([...tasks, { ...input, id: crypto.randomUUID(), completed: false }])
        }
        onDeleteTask={(id) => setTasks(tasks.filter((task) => task.id !== id))}
        onAssignTask={(id, assigneeId) =>
          setTasks(tasks.map((task) => (task.id === id ? { ...task, assigneeId } : task)))
        }
        canEdit={state !== "readonly"}
        status={!recovered && (state === "loading" || state === "error") ? state : "idle"}
        errorMessage="Example error: tasks could not load."
        onRetry={() => setRecovered(true)}
      />
    </div>
  );
}
