import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Avatar,
} from "@raydenui/ui";

const transactions = [
  {
    id: "TXN-001",
    customer: { name: "Alice Johnson", email: "alice@example.com" },
    amount: "$250.00",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "TXN-002",
    customer: { name: "Bob Smith", email: "bob@example.com" },
    amount: "$1,200.00",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "TXN-003",
    customer: { name: "Carol White", email: "carol@example.com" },
    amount: "$89.99",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "TXN-004",
    customer: { name: "David Brown", email: "david@example.com" },
    amount: "$450.00",
    status: "completed",
    date: "2024-01-13",
  },
  {
    id: "TXN-005",
    customer: { name: "Eve Davis", email: "eve@example.com" },
    amount: "$75.00",
    status: "failed",
    date: "2024-01-12",
  },
];

const statusColors: Record<string, "success" | "warning" | "error"> = {
  completed: "success",
  pending: "warning",
  failed: "error",
};

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-grey-900">Transactions</h1>
        <p className="text-grey-600 mt-1">View and manage all your transactions.</p>
      </div>

      <div className="bg-white rounded-xl border border-grey-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium">{txn.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      initials={txn.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    />
                    <div>
                      <p className="font-medium text-grey-900">{txn.customer.name}</p>
                      <p className="text-xs text-grey-500">{txn.customer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{txn.amount}</TableCell>
                <TableCell>
                  <Badge color={statusColors[txn.status]}>
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-grey-500">{txn.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
