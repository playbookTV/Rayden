"use client";

import { useId, useState } from "react";
import { Button, Modal, Tabs, Tab } from "@raydenui/ui";
import {
  Collapse,
  MotionProvider,
  Pressable,
  Reveal,
  useRaydenMotion,
  type MotionPreset,
} from "@raydenui/ui/motion";

function EffectiveMotion() {
  const { preset, requestedPreset } = useRaydenMotion();
  return (
    <p role="status" className="text-sm text-grey-600">
      Effective motion: {preset}.{" "}
      {preset !== requestedPreset
        ? "Your reduced-motion preference takes priority."
        : "Reduced-motion preferences are respected automatically."}
    </p>
  );
}

export function MotionPilot() {
  const id = useId();
  const [preset, setPreset] = useState<MotionPreset>("calm");
  const [tab, setTab] = useState("overview");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  return (
    <div className="not-prose my-6 w-full rounded-xl border border-grey-200 bg-white p-5 text-grey-900">
      <label htmlFor={`${id}-preset`} className="mb-1 block text-sm font-medium">
        Motion preset
      </label>
      <select
        id={`${id}-preset`}
        value={preset}
        onChange={(event) => setPreset(event.target.value as MotionPreset)}
        className="mb-4 min-h-11 w-full rounded-lg border border-grey-300 bg-white px-3 text-base text-grey-900 sm:max-w-xs"
      >
        {(["calm", "snappy", "playful", "reduced"] as const).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <MotionProvider preset={preset}>
        <EffectiveMotion />
        <div className="mt-5 flex flex-col items-start gap-5">
          <Tabs motion value={tab} onValueChange={setTab} variant="segmented">
            <Tab value="overview">Overview</Tab>
            <Tab value="activity">Activity</Tab>
            <Tab value="settings">Settings</Tab>
          </Tabs>
          <p className="text-sm">
            Selected view: {tab}. Try the arrow keys while a tab is focused.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setOpen(true)}>Open motion modal</Button>
            <Pressable
              onClick={() => setVisible((value) => !value)}
              className="min-h-11 rounded-lg border border-grey-300 px-4 text-sm font-medium"
            >
              {visible ? "Hide" : "Show"} message
            </Pressable>
          </div>
          <Reveal present={visible} className="rounded-lg bg-primary-50 p-4 text-sm text-grey-900">
            Motion can clarify a change without changing how the component works.
          </Reveal>
          <div className="w-full">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`${id}-details`}
              onClick={() => setExpanded((value) => !value)}
              className="min-h-11 rounded-lg border border-grey-300 px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-action-primary-text"
            >
              {expanded ? "Hide" : "Show"} details
            </button>
            <Collapse open={expanded} id={`${id}-details`}>
              <p className="pt-4 text-sm text-grey-600">
                Collapsed content is removed from keyboard navigation. Presets change timing and
                movement; the disclosure remains a disclosure.
              </p>
            </Collapse>
          </div>
        </div>
        <Modal
          motion
          open={open}
          onClose={() => setOpen(false)}
          title="Motion follows the task"
          description="This portal inherits the selected motion preset."
          primaryLabel="Done"
          onPrimaryClick={() => setOpen(false)}
          secondaryLabel="Cancel"
        >
          <p className="text-sm text-grey-700">
            Try Escape, Tab, or either action. Focus returns to the trigger after closing.
          </p>
        </Modal>
      </MotionProvider>
    </div>
  );
}
