import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { Select, SelectOption } from "./Select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { Modal } from "./Modal";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";
import { Input } from "./Input";
import { Icon } from "./Icon";
import { checkIcon, searchIcon, heartIcon } from "./Icon/icons";

const meta: Meta = { title: "Quality/Shared interaction contracts" };
export default meta;
type Story = StoryObj;

export const SelectNavigation: Story = {
  render: () => (
    <Select label="Destination" defaultValue="disabled">
      <SelectOption value="disabled" disabled>
        Unavailable
      </SelectOption>
      <>
        <SelectOption value="alpha">Alpha</SelectOption>
        <SelectOption value="beta">Beta</SelectOption>
      </>
      <SelectOption value="bravo">Bravo</SelectOption>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("combobox");
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(c.getByRole("option", { name: "Alpha" })).toHaveFocus());
    await userEvent.keyboard("b");
    await expect(c.getByRole("option", { name: "Beta" })).toHaveFocus();
    await userEvent.keyboard("b");
    await expect(c.getByRole("option", { name: "Bravo" })).toHaveFocus();
    await userEvent.keyboard("{Home}{ArrowUp}");
    await expect(c.getByRole("option", { name: "Bravo" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveTextContent("Bravo");
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(c.getByRole("option", { name: "Bravo" })).toHaveFocus());
    await userEvent.keyboard("{Home}{Enter}");
    await expect(trigger).toHaveTextContent("Alpha");
  },
};

export const MenuNavigationAndCancellation: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent
        onKeyDown={(e) => {
          if (e.key === "Home") e.preventDefault();
        }}
      >
        <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
        <DropdownMenuItem>Alpha</DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>Beta</DropdownMenuItem>
        <DropdownMenuItem>Charlie</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(c.getByRole("menuitem", { name: "Charlie" })).toHaveFocus());
    await userEvent.keyboard("{Home}");
    await expect(c.getByRole("menuitem", { name: "Charlie" })).toHaveFocus();
    await userEvent.keyboard("b{Enter}");
    await expect(c.getByRole("menu")).toBeVisible();
    await expect(c.getByRole("menuitem", { name: "Beta" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(c.queryByRole("menu")).toBeNull();
    await expect(trigger).toHaveFocus();
  },
};

export const ControlledMenuDoesNotRefocusOnRerender: Story = {
  render: function ControlledMenu() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    return (
      <DropdownMenu open={open} onOpenChange={(next) => setOpen(next)}>
        <DropdownMenuTrigger>Controlled actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setCount(count + 1);
            }}
          >
            Update {count}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Controlled actions" }));
    await userEvent.click(c.getByRole("menuitem", { name: "Update 0" }));
    await waitFor(() => expect(c.getByRole("menuitem", { name: "Update 1" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await expect(c.queryByRole("menu")).toBeNull();
  },
};

export const TouchAndFocusDismissal: Story = {
  render: () => (
    <div>
      <Select label="Country">
        <SelectOption value="uk">UK</SelectOption>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger>More</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button type="button">Outside</button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("combobox"));
    await fireEvent.pointerDown(c.getByRole("button", { name: "Outside" }), {
      pointerType: "touch",
      pointerId: 1,
    });
    await expect(c.queryByRole("listbox")).toBeNull();
    await userEvent.click(c.getByRole("button", { name: "More" }));
    await waitFor(() => expect(c.getByRole("menuitem")).toHaveFocus());
    await userEvent.tab();
    await expect(c.queryByRole("menu")).toBeNull();
    await expect(c.getByRole("button", { name: "Outside" })).toHaveFocus();
  },
};

export const PopupEscapeStaysInsideModal: Story = {
  render: function PopupInModal() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open parent</button>
        <Modal open={open} onClose={() => setOpen(false)} title="Parent dialog">
          <Select label="Choice">
            <SelectOption value="one">One</SelectOption>
          </Select>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Open parent" }));
    const dialog = await page.findByRole("dialog", { name: "Parent dialog" });
    await userEvent.click(within(dialog).getByRole("combobox"));
    await waitFor(() => expect(within(dialog).getByRole("option")).toHaveFocus());
    if (process.env.NODE_ENV === "test") {
      // Real browser keys exercise native <dialog> cancellation, unlike synthetic user-event.
      const { userEvent: browserUserEvent } = await import("vitest/browser");
      await browserUserEvent.keyboard("{Escape}");
    } else {
      await userEvent.keyboard("{Escape}");
    }
    await expect(dialog).toBeVisible();
    await expect(within(dialog).queryByRole("listbox")).toBeNull();
    await expect(within(dialog).getByRole("combobox")).toHaveFocus();
    if (process.env.NODE_ENV === "test") {
      const { userEvent: browserUserEvent } = await import("vitest/browser");
      await browserUserEvent.keyboard("{Escape}");
    } else {
      fireEvent(dialog, new Event("cancel", { cancelable: true }));
    }
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull());
  },
};

export const NestedTooltipEscape: Story = {
  render: () => (
    <Tooltip
      title="Outer panel"
      content={
        <Tooltip
          title="Inner panel"
          content="Nested help"
          primaryAction={{ label: "Inside", onClick: () => {} }}
        >
          <button>Inner trigger</button>
        </Tooltip>
      }
      primaryAction={{ label: "Outer action", onClick: () => {} }}
    >
      <button>Outer trigger</button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Outer trigger" }));
    await userEvent.click(c.getByRole("button", { name: "Inner trigger" }));
    await expect(c.getByRole("dialog", { name: "Inner panel" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(c.queryByRole("dialog", { name: "Inner panel" })).toBeNull();
    await expect(c.getByRole("dialog", { name: "Outer panel" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(c.queryByRole("dialog", { name: "Outer panel" })).toBeNull();
  },
};

export const MenuActionOpensDialog: Story = {
  render: function MenuDialog() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger>Options</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setOpen(true)}>Rename</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Modal open={open} onClose={() => setOpen(false)} title="Rename item">
          <Input label="New name" />
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Options" }));
    await userEvent.click(c.getByRole("menuitem", { name: "Rename" }));
    const dialog = await page.findByRole("dialog", { name: "Rename item" });
    const input = within(dialog).getByRole("textbox");
    await userEvent.type(input, "New item");
    await expect(input).toHaveFocus();
    await userEvent.keyboard("{Escape}");
  },
};

export const ModalScrollLocksReleaseInEitherOrder: Story = {
  render: function TwoModals() {
    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(false);
    return (
      <>
        <button onClick={() => setFirst(true)}>Open first</button>
        <Modal open={first} onClose={() => setFirst(false)} title="First">
          <button onClick={() => setSecond(true)}>Open second</button>
        </Modal>
        <Modal open={second} onClose={() => setSecond(false)} title="Second">
          <button onClick={() => setFirst(false)}>Close first only</button>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const original = body.style.overflow;
    const page = within(body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open first" }));
    await userEvent.click(await page.findByRole("button", { name: "Open second" }));
    await userEvent.click(await page.findByRole("button", { name: "Close first only" }));
    await expect(body.style.overflow).toBe("hidden");
    await expect(page.getByRole("dialog", { name: "Second" })).toBeVisible();
    await userEvent.click(
      within(page.getByRole("dialog", { name: "Second" })).getByRole("button", {
        name: "Close modal",
      })
    );
    await waitFor(() => expect(body.style.overflow).toBe(original));
  },
};

export const SharedIconSources: Story = {
  render: () => (
    <div>
      <Button icon={checkIcon} iconPosition="leading">
        Static icon
      </Button>
      <Button icon="check" iconPosition="leading">
        Named icon
      </Button>
      <Input label="Search" leadingIcon={searchIcon} />
      <Button icon={<Icon icon={heartIcon} variant="solid" size={32} />} iconPosition="leading">
        Custom icon
      </Button>
      <Icon icon={checkIcon} aria-hidden={false} role="img" aria-label="Complete" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await waitFor(() =>
      expect(c.getByRole("button", { name: "Named icon" }).querySelector("path")).not.toBeNull()
    );
    const custom = c.getByRole("button", { name: "Custom icon" }).querySelector("svg");
    await expect(custom).toHaveAttribute("width", "32");
    await expect(c.getByRole("img", { name: "Complete" })).toBeVisible();
  },
};
