import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Elements/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    footerOrientation: { control: "select", options: ["horizontal", "vertical"] },
    showClose: { control: "boolean" },
    blur: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function DefaultModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-action-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Open Modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Title"
        description="Description"
        primaryLabel="Save"
        secondaryLabel="Cancel"
        onPrimaryClick={() => setOpen(false)}
      >
        <p className="text-sm text-grey-500">
          This is the modal body content. You can place any content here including forms,
          information, or other components.
        </p>
      </Modal>
    </>
  );
}

function VerticalFooterModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-action-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Open Vertical Modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Title"
        description="Description"
        primaryLabel="Save"
        secondaryLabel="Cancel"
        footerOrientation="vertical"
        onPrimaryClick={() => setOpen(false)}
      >
        <p className="text-sm text-grey-500">
          This modal uses vertical button layout in the footer.
        </p>
      </Modal>
    </>
  );
}

function LargeModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-action-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Open Large Modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Large Modal"
        description="This is a larger modal for more complex content."
        size="lg"
        primaryLabel="Confirm"
        secondaryLabel="Cancel"
        onPrimaryClick={() => setOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-grey-500">
            This larger modal can accommodate more content, forms, or detailed information.
          </p>
          <div className="h-32 bg-grey-50 rounded-lg flex items-center justify-center">
            <span className="text-sm text-grey-400">Content area</span>
          </div>
        </div>
      </Modal>
    </>
  );
}

function PrimaryOnlyModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-action-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Open Modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmation"
        description="Are you sure you want to proceed?"
        primaryLabel="Got it"
        onPrimaryClick={() => setOpen(false)}
      />
    </>
  );
}

function NoBlurModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-action-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Open (No Blur)
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="No Blur Overlay"
        description="This modal has no backdrop blur."
        blur={false}
        primaryLabel="Close"
        onPrimaryClick={() => setOpen(false)}
      />
    </>
  );
}

const WarningIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="#F56630"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 5.33v2.67M8 10.67h.01" />
    <path d="M6.86 2.57L1.21 12a1.33 1.33 0 001.14 2h11.3a1.33 1.33 0 001.14-2L9.14 2.57a1.33 1.33 0 00-2.28 0z" />
  </svg>
);

function CustomIconModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-action-primary text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Open Warning Modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Warning"
        description="This action cannot be undone."
        icon={<WarningIcon />}
        primaryLabel="Delete"
        secondaryLabel="Cancel"
        onPrimaryClick={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultModal />,
};

export const VerticalFooter: Story = {
  render: () => <VerticalFooterModal />,
};

export const LargeModal: Story = {
  render: () => <LargeModalDemo />,
};

export const PrimaryOnly: Story = {
  render: () => <PrimaryOnlyModal />,
};

export const NoBlur: Story = {
  render: () => <NoBlurModal />,
};

export const CustomIcon: Story = {
  render: () => <CustomIconModal />,
};

export const FocusManagement: Story = {
  render: () => <DefaultModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Modal" });
    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole("dialog", { name: "Title" });
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    for (let index = 0; index < 5; index++) {
      await userEvent.tab();
      await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await userEvent.tab({ shift: true });
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(trigger).toHaveFocus());
    await waitFor(() => expect(dialog).not.toBeInTheDocument());

    await userEvent.click(trigger);
    const reopened = await within(document.body).findByRole("dialog", { name: "Title" });
    fireEvent(reopened, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(reopened).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    const backdrop = await within(document.body).findByRole("dialog", { name: "Title" });
    fireEvent.click(backdrop);
    await waitFor(() => expect(backdrop).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function DismissalPolicyDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open protected dialog</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Keep your work"
        closeOnEscape={false}
        closeOnOverlay={false}
        primaryLabel="Done"
        onPrimaryClick={() => setOpen(false)}
      />
    </>
  );
}

export const DismissalPolicy: Story = {
  render: () => <DismissalPolicyDemo />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Open protected dialog" });
    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole("dialog", { name: "Keep your work" });
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    fireEvent.click(dialog);
    await expect(dialog).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
