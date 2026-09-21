import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { Tabs } from "../components/Tabs/Tabs";
import { Tab } from "../components/Tabs/Tab";
import { Modal } from "../components/Modal/Modal";
import {
  Collapse,
  MotionProvider,
  Pressable,
  Reveal,
  SharedLayout,
  useRaydenMotion,
  type MotionPreset,
} from "./index";

const meta: Meta = { title: "Motion/Pilot", parameters: { layout: "padded" } };
export default meta;
type Story = StoryObj;
const buttonClass =
  "rounded-lg bg-action-primary px-4 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

function PresetStatus({ label = "Effective preset" }: { label?: string }) {
  const { preset } = useRaydenMotion();
  return <output aria-label={label}>{preset}</output>;
}
function Pilot({ preset = "calm" }: { preset?: MotionPreset }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [right, setRight] = useState(false);
  return (
    <MotionProvider preset={preset}>
      <div className="flex max-w-xl flex-col gap-6">
        <p>
          Effective preset: <PresetStatus />
        </p>
        <Tabs motion defaultValue="overview" variant="segmented">
          <Tab value="overview">Overview</Tab>
          <Tab value="disabled" disabled>
            Unavailable
          </Tab>
          <Tab value="details">Details</Tab>
        </Tabs>
        <Pressable className={buttonClass} onClick={() => setOpen(true)}>
          Open motion dialog
        </Pressable>
        <Modal
          motion
          open={open}
          onClose={() => setOpen(false)}
          title="Motion settings"
          primaryLabel="Done"
          onPrimaryClick={() => setOpen(false)}
          secondaryLabel="Cancel"
        >
          <p>
            Portal preset: <PresetStatus label="Portal preset" />
          </p>
          <MotionProvider preset="reduced">
            <PresetStatus label="Nested preset" />
          </MotionProvider>
        </Modal>
        <Pressable className={buttonClass} onClick={() => setShown(!shown)}>
          Toggle reveal
        </Pressable>
        <Reveal present={shown} data-testid="reveal">
          <p>Content enters and exits without changing the reading order.</p>
        </Reveal>
        <Pressable
          className={buttonClass}
          aria-expanded={expanded}
          aria-controls="pilot-disclosure"
          onClick={() => setExpanded(!expanded)}
        >
          Toggle details
        </Pressable>
        <Collapse open={expanded} id="pilot-disclosure">
          <label>
            Optional note <input className="border border-grey-300" />
          </label>
        </Collapse>
        <Pressable className={buttonClass} onClick={() => setRight(!right)}>
          Move marker
        </Pressable>
        <div style={{ position: "relative", height: 32, width: 240 }}>
          <SharedLayout
            layoutKey={String(right)}
            data-testid="layout-marker"
            style={{
              position: "absolute",
              left: right ? 180 : 0,
              width: right ? 60 : 32,
              height: 32,
              borderRadius: 8,
              background: "var(--color-action-primary)",
            }}
          />
        </div>
      </div>
    </MotionProvider>
  );
}
export const Calm: Story = { render: () => <Pilot /> };
export const Snappy: Story = { render: () => <Pilot preset="snappy" /> };
export const Playful: Story = { render: () => <Pilot preset="playful" /> };
export const Reduced: Story = { render: () => <Pilot preset="reduced" /> };

export const KeyboardAndPresence: Story = {
  render: () => <Pilot preset="snappy" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tabs = canvas.getAllByRole("tab");
    tabs[0].focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(tabs[2]).toHaveFocus();
    await expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Home}");
    await expect(tabs[0]).toHaveFocus();
    await expect(
      canvas.getByRole("tablist").querySelector("[data-rayden-tab-indicator]")
    ).toBeVisible();
    const trigger = canvas.getByRole("button", { name: "Open motion dialog" });
    await userEvent.click(trigger);
    const dialog = within(document.body).getByRole("dialog", { name: "Motion settings" });
    await expect(within(dialog).getByLabelText("Portal preset")).toHaveTextContent(
      canvas.getByLabelText("Effective preset").textContent!
    );
    await expect(within(dialog).getByLabelText("Nested preset")).toHaveTextContent("reduced");
    for (let n = 0; n < 5; n++) {
      await userEvent.tab();
      await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    const reopened = within(document.body).getByRole("dialog", { name: "Motion settings" });
    fireEvent.click(reopened);
    await waitFor(() => expect(reopened).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    const disclosure = canvas.getByRole("button", { name: "Toggle details" });
    const region = canvasElement.querySelector("#pilot-disclosure")!;
    await expect(region).toHaveAttribute("inert");
    await userEvent.click(disclosure);
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(region).not.toHaveAttribute("inert");
    canvas.getByRole("textbox", { name: "Optional note" }).focus();
    fireEvent.click(disclosure);
    await expect(disclosure).toHaveFocus();
    await expect(region).toHaveAttribute("inert");
    const reveal = canvas.getByTestId("reveal");
    await userEvent.click(canvas.getByRole("button", { name: "Toggle reveal" }));
    await userEvent.click(canvas.getByRole("button", { name: "Toggle reveal" }));
    await waitFor(() => expect(canvas.getByTestId("reveal")).toBeVisible());
    await expect(canvas.getByTestId("reveal")).not.toHaveAttribute("inert");
    await userEvent.click(canvas.getByRole("button", { name: "Toggle reveal" }));
    await waitFor(() => expect(reveal).not.toBeInTheDocument());
  },
};

function InterruptedModal() {
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const [open, setOpen] = useState(false);
  return (
    <MotionProvider preset="playful">
      <button onClick={() => setOpen(true)}>Open interruptible dialog</button>
      <Modal
        motion
        open={open}
        title="Interruptible"
        onClose={() => setOpen(false)}
        primaryLabel="Close then reopen"
        onPrimaryClick={() => {
          setOpen(false);
          // Reopen during exit, and cancel the timer on unmount.
          timer.current = window.setTimeout(() => setOpen(true), 20);
        }}
        secondaryLabel="Finish"
      />
    </MotionProvider>
  );
}
export const InterruptedExit: Story = {
  render: () => <InterruptedModal />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Open interruptible dialog",
    });
    await userEvent.click(trigger);
    const body = within(document.body);
    await userEvent.click(body.getByRole("button", { name: "Close then reopen" }));
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Interruptible" })).toHaveAttribute(
        "data-state",
        "open"
      )
    );
    // Wait for the cancelled exit's original completion window.
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    const dialog = body.getByRole("dialog", { name: "Interruptible" });
    await expect(dialog).toHaveAttribute("open");
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.click(body.getByRole("button", { name: "Finish" }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

function MountPreferencePilot() {
  const [mounted, setMounted] = useState(false);
  return mounted ? (
    <Pilot preset="playful" />
  ) : (
    <button onClick={() => setMounted(true)}>Mount preference pilot</button>
  );
}
export const LiveReducedMotionPreference: Story = {
  render: () => <MountPreferencePilot />,
  play: async ({ canvasElement }) => {
    // Exercise the native browser MediaQueryList change subscription without changing
    // the user's machine setting. Production browser emulation is a separate check.
    const original = window.matchMedia;
    const listeners = new Set<EventListener>();
    let reduce = false;
    const media = {
      get matches() {
        return reduce;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: (_: string, callback: EventListener) => listeners.add(callback),
      removeEventListener: (_: string, callback: EventListener) => listeners.delete(callback),
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => true,
    } as MediaQueryList;
    window.matchMedia = (query) => (query === media.media ? media : original.call(window, query));
    const canvas = within(canvasElement);
    try {
      // Mount after installing the mock so every subscriber observes the same media query.
      await userEvent.click(canvas.getByRole("button", { name: "Mount preference pilot" }));
      await userEvent.click(canvas.getByRole("button", { name: "Open motion dialog" }));
      const dialog = within(document.body).getByRole("dialog", { name: "Motion settings" });
      reduce = true;
      listeners.forEach((listener) => listener(new Event("change")));
      await waitFor(() => expect(dialog).toHaveAttribute("data-rayden-motion", "reduced"));
      await expect(within(dialog).getByLabelText("Portal preset")).toHaveTextContent("reduced");
      await waitFor(() => expect(dialog.getAnimations({ subtree: true })).toHaveLength(0));
      reduce = false;
      listeners.forEach((listener) => listener(new Event("change")));
      await waitFor(() => expect(dialog).toHaveAttribute("data-rayden-motion", "playful"));
      await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
    } finally {
      window.matchMedia = original;
    }
  },
};

export const PressAndLayout: Story = {
  render: () => <Pilot preset="snappy" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Move marker" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: " " });
    await expect(trigger).toHaveAttribute("data-pressed", "true");
    trigger.blur();
    await waitFor(() => expect(trigger).toHaveAttribute("data-pressed", "false"));
    fireEvent.pointerDown(trigger, { button: 0 });
    await expect(trigger).toHaveAttribute("data-pressed", "true");
    fireEvent.pointerCancel(trigger);
    await expect(trigger).toHaveAttribute("data-pressed", "false");
    const marker = canvas.getByTestId("layout-marker");
    await userEvent.click(trigger);
    await expect(marker.style.left).toBe("180px");
    await userEvent.click(trigger);
    await waitFor(() => expect(marker.getAnimations()).toHaveLength(0));
    await expect(marker.style.left).toBe("0px");
    await expect(marker.getBoundingClientRect().width).toBe(32);
  },
};

function UnmountPilot() {
  const [mounted, setMounted] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <MotionProvider preset="playful">
      <button onClick={() => setOpen(true)}>Open lifecycle dialog</button>
      <button onClick={() => setMounted(false)}>Simulate route change</button>
      {mounted && (
        <Modal motion open={open} onClose={() => setOpen(false)} title="Lifecycle dialog" />
      )}
    </MotionProvider>
  );
}
export const UnmountCleanup: Story = {
  render: () => <UnmountPilot />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originalOverflow = document.body.style.overflow;
    const trigger = canvas.getByRole("button", { name: "Open lifecycle dialog" });
    await userEvent.click(trigger);
    const dialog = within(document.body).getByRole("dialog", { name: "Lifecycle dialog" });
    const animations = dialog.getAnimations({ subtree: true });
    // Programmatic route changes may unmount an open modal despite the background being inert.
    fireEvent.click(canvas.getByRole("button", { name: "Simulate route change" }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(document.body.style.overflow).toBe(originalOverflow);
    animations.forEach((animation) => expect(animation.playState).toBe("idle"));
  },
};
