"use client";

import { useState } from "react";
import { Button, Checkbox, Input, Modal } from "@raydenui/ui";

const initialTasks = [
  { label: "Review the new onboarding flow", done: true },
  { label: "Check the mobile experience", done: false },
  { label: "Share with the team", done: false },
];

export function ProductExample() {
  const [tasks, setTasks] = useState(initialTasks);
  const [name, setName] = useState("A little closer to launch");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const complete = tasks.filter((task) => task.done).length;

  return (
    <section
      aria-label="Interactive project example"
      className="not-prose my-6 rounded-xl border border-grey-200 bg-grey-50 p-5 text-grey-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium text-grey-600">Your team workspace</p>
          <h2 className="break-words text-xl font-semibold tracking-tight">{name}</h2>
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            setDraft(name);
            setSaved(false);
            setEditing(true);
          }}
        >
          Edit project
        </Button>
      </div>
      <ul className="my-5 divide-y divide-grey-200">
        {tasks.map((task, index) => (
          <li key={task.label} className="py-3">
            <Checkbox
              label={task.label}
              checked={task.done}
              onChange={(event) => {
                const done = event.target.checked;
                setTasks((current) =>
                  current.map((item, i) => (i === index ? { ...item, done } : item))
                );
              }}
            />
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="text-sm text-grey-600">
        {complete === tasks.length
          ? "All set. Ready for the next step."
          : `${complete} of ${tasks.length} tasks complete`}
        {saved && " · Project name saved"}
      </p>
      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit project"
        description="Give your team's next release a name."
        primaryLabel=""
        secondaryLabel=""
      >
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            setName(draft.trim());
            setSaved(true);
            setEditing(false);
          }}
        >
          <Input
            label="Project name"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            required
            maxLength={80}
            helperText="Up to 80 characters."
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.trim()}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
