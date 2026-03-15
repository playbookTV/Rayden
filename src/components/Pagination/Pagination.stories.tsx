import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const InteractivePagination = ({ totalPages = 30, showPrevNext = true }: { totalPages?: number; showPrevNext?: boolean }) => {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      showPrevNext={showPrevNext}
    />
  );
};

export const Default: Story = {
  render: () => <InteractivePagination />,
};

export const NoPrevNext: Story = {
  render: () => <InteractivePagination showPrevNext={false} />,
};

export const FewPages: Story = {
  render: () => <InteractivePagination totalPages={5} />,
};
