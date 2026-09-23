import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  SidebarMenu,
  SidebarMenuSection,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./SidebarMenu";
import { ButtonGroup, ButtonGroupItem } from "./ButtonGroup";
import { Avatar } from "./Avatar";
import { Stepper, LinearStepper } from "./Stepper";
import { Tooltip } from "./Tooltip";
import { Modal } from "./Modal";
import { Button } from "./Button";

// Runtime confirmation of the 2026-09-21 sweep reproductions that a source grep
// cannot settle: geometry, ARIA relationships and portal behaviour.
export default {
  title: "Quality/Sweep closures",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
type Story = StoryObj;

export const CollapsedSidebarFlyoutIsReachable: Story = {
  render: () => (
    <div className="h-[420px] p-4">
      <SidebarMenu defaultValue="dashboard" collapsed>
        <SidebarMenuSection showDivider={false}>
          <SidebarMenuItem value="finance" icon="bank" label="Finance">
            Finance
            <SidebarMenuSub>
              <SidebarMenuSubItem value="invoices">Invoices</SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenuSection>
      </SidebarMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("menuitem", { name: "Finance" });
    await userEvent.click(trigger);
    // The sweep measured the flyout clipped inside an 82px overflow-y-auto nav, with
    // its centre unhittable. It is portaled now, so its centre must hit itself.
    const flyout = await waitFor(() => {
      const el = document.querySelector("[role='menu'][aria-label='Finance']") as HTMLElement;
      expect(el).not.toBeNull();
      return el;
    });
    const r = flyout.getBoundingClientRect();
    expect(r.width).toBeGreaterThan(0);
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    expect(flyout.contains(hit)).toBe(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

export const StateIsExposedNotJustColoured: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <ButtonGroup>
        <ButtonGroupItem active>Monthly</ButtonGroupItem>
        <ButtonGroupItem>Yearly</ButtonGroupItem>
      </ButtonGroup>
      <Avatar type="initials" initials="AL" status="online" />
      <Stepper steps={[{ title: "Plan" }, { title: "Build" }]} activeStep={1} />
      <LinearStepper currentStep={2} totalSteps={5} showLabel={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // #35 active was colour-only
    expect(c.getByRole("button", { name: "Monthly" })).toHaveAttribute("aria-pressed", "true");
    expect(c.getByRole("button", { name: "Yearly" })).toHaveAttribute("aria-pressed", "false");
    // #34 presence was a coloured dot with no text
    expect(canvasElement.textContent).toContain("Online");
    // #36 step status, and progress semantics with the label hidden
    expect(canvasElement.textContent).toContain("Current step");
    const bar = c.getByRole("progressbar", { name: "Progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
  },
};

export const TooltipFlipsAwayFromTheViewportEdge: Story = {
  render: () => (
    <div className="p-0">
      {/* Anchored hard against the top edge, where side="top" cannot fit. */}
      <div style={{ position: "fixed", top: 0, left: 120 }}>
        <Tooltip placement="top" defaultOpen content="Edge tooltip">
          <button type="button">Anchor</button>
        </Tooltip>
      </div>
    </div>
  ),
  play: async () => {
    // The sweep reproduced a tooltip rendering above the visible screen.
    await waitFor(() => {
      const panel = document.querySelector("[role='tooltip']") as HTMLElement;
      expect(panel).not.toBeNull();
      expect(panel.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
    });
  },
};

export const OpenModalFollowsATeardownThemeChange: Story = {
  render: function OpenModalThemeChangeDemo() {
    const [dark, setDark] = useState(false);
    return (
      <div className={dark ? "dark" : "rayden-light"}>
        <Modal open onClose={() => {}} title="Still themed">
          <Button onClick={() => setDark(true)}>Switch to dark</Button>
        </Modal>
      </div>
    );
  },
  play: async () => {
    const dialog = await within(document.body).findByRole("dialog", { name: "Still themed" });
    expect(dialog.classList.contains("rayden-light")).toBe(true);
    await userEvent.click(within(dialog).getByRole("button", { name: "Switch to dark" }));
    // The portal copied its theme once on open, so it kept the stale one.
    await waitFor(() => {
      expect(dialog.classList.contains("dark")).toBe(true);
      expect(dialog.classList.contains("rayden-light")).toBe(false);
    });
  },
};
