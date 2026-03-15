import type { Meta, StoryObj } from "@storybook/react";
import { EmptyStateBlock } from "./EmptyStateBlock";

const meta: Meta<typeof EmptyStateBlock> = {
  title: "Blocks/EmptyState",
  component: EmptyStateBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyStateBlock>;

/* ─── No Tasks ────────────────────────────────────────────────────── */
export const NoTasks: Story = {
  render: () => (
    <div className="p-10 flex items-center justify-center">
      <EmptyStateBlock
        illustration="task-templates"
        title="No tasks to show"
        description={`You don't have any pending tasks for today.\nAdd new tasks to track productivity`}
        action={{ label: "New Task", icon: "plus" }}
      />
    </div>
  ),
};

/* ─── No Results ──────────────────────────────────────────────────── */
export const NoResults: Story = {
  render: () => (
    <div className="p-10 flex items-center justify-center">
      <EmptyStateBlock
        illustration="search"
        illustrationColored={false}
        title="No results found"
        description={`"Access" did not match any results.\nplease try again`}
      />
    </div>
  ),
};

/* ─── Upload Photos (Card) ────────────────────────────────────────── */
export const UploadPhotos: Story = {
  render: () => (
    <div className="p-10 flex items-center justify-center bg-grey-50">
      <EmptyStateBlock
        illustration="gallery"
        variant="card"
        title="Ready to add some photos?"
        description={`Tap the button below to upload and\nshare photos with your community`}
        action={{ label: "Upload Photos", icon: "upload" }}
      />
    </div>
  ),
};
