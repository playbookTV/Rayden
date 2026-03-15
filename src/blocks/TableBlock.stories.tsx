import type { Meta, StoryObj } from "@storybook/react";
import { TableBlock } from "./TableBlock";
import type { TableBlockRow } from "./TableBlock";

const meta: Meta<typeof TableBlock> = {
  title: "Blocks/Table",
  component: TableBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableBlock>;

const sampleRows: TableBlockRow[] = [
  {
    id: "1",
    name: "Emery Torff",
    email: "thekdfisher@email.co...",
    initials: "E",
    amount: "$200,000.00",
    paymentType: "Label",
    date: "Apr 12, 2023",
    time: "09:32AM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "2",
    name: "Maren Dokidis",
    email: "thekdfisher@email.co...",
    initials: "M",
    amount: "$120,000.00",
    paymentType: "Label",
    date: "Apr 12, 2023",
    time: "09:24AM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "3",
    name: "Cooper Siphron",
    email: "thekdfisher@email.co...",
    initials: "C",
    amount: "$150,000.00",
    paymentType: "Label",
    date: "Apr 11, 2023",
    time: "05:46PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "4",
    name: "Marcus Dias",
    email: "thekdfisher@email.co...",
    initials: "M",
    amount: "$900,000.00",
    paymentType: "Label",
    date: "Apr 11, 2023",
    time: "02:32PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "5",
    name: "Ahmad Stanton",
    email: "thekdfisher@email.co...",
    initials: "A",
    amount: "$1,000,000.00",
    paymentType: "Label",
    date: "Apr 10, 2023",
    time: "11:28AM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "6",
    name: "Giana Carder",
    email: "thekdfisher@email.co...",
    initials: "G",
    amount: "$38,000.00",
    paymentType: "Label",
    date: "Apr 09, 2023",
    time: "10:32PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "7",
    name: "Tiana Curtis",
    email: "thekdfisher@email.co...",
    initials: "T",
    amount: "$600,000.00",
    paymentType: "Label",
    date: "Apr 09, 2023",
    time: "02:38AM",
    status: "Label",
    statusColor: "error",
  },
  {
    id: "8",
    name: "Omar Siphron",
    email: "thekdfisher@email.co...",
    initials: "O",
    amount: "$100,000.00",
    paymentType: "Label",
    date: "Apr 08, 2023",
    time: "04:55PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "9",
    name: "Angel Rhiel Madsen",
    email: "thekdfisher@email.co...",
    initials: "A",
    amount: "$9,000.00",
    paymentType: "Label",
    date: "Apr 07, 2023",
    time: "11:44PM",
    status: "Label",
    statusColor: "orange",
  },
  {
    id: "10",
    name: "Lindsey Calzoni",
    email: "thekdfisher@email.co...",
    initials: "L",
    amount: "$400.00",
    paymentType: "Label",
    date: "Apr 06, 2023",
    time: "09:44AM",
    status: "Label",
    statusColor: "orange",
  },
];

/* ─── Default ─────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="p-6">
      <TableBlock
        rows={sampleRows}
        page={3}
        totalPages={6}
        onPageChange={(p) => console.log("Page:", p)}
        onRowAction={(id) => console.log("Action:", id)}
      />
    </div>
  ),
};
