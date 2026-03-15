import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type SortDirection,
} from "./Table";
import { Checkbox } from "../FormControl";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Icon } from "../Icon";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

// ─── Sample data ───────────────────────────────────────────────────
const users = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" as const },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" as const },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "Viewer", status: "Inactive" as const },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "Active" as const },
  { id: "5", name: "Charlie Lee", email: "charlie@example.com", role: "Viewer", status: "Inactive" as const },
];

/* ─── Basic table ─────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-grey-600">{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  color={user.status === "Active" ? "success" : "neutral"}
                  type="accent"
                  size="sm"
                >
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/* ─── With selection (checkboxes) ─────────────────────────────────── */
export const WithSelection: Story = {
  render: () => {
    const SelectionDemo = () => {
      const [selected, setSelected] = useState<Set<string>>(new Set());

      const allSelected = selected.size === users.length;
      const someSelected = selected.size > 0 && !allSelected;

      const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(users.map((u) => u.id)));
      };

      const toggleRow = (id: string) => {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      };

      return (
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow selected={allSelected || someSelected}>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} selected={selected.has(user.id)}>
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selected.has(user.id)}
                      onChange={() => toggleRow(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-grey-600">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      color={user.status === "Active" ? "success" : "neutral"}
                      type="accent"
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    };
    return <SelectionDemo />;
  },
};

/* ─── With sorting ────────────────────────────────────────────────── */
export const WithSorting: Story = {
  render: () => {
    const SortDemo = () => {
      const [sortCol, setSortCol] = useState<string | null>(null);
      const [sortDir, setSortDir] = useState<SortDirection>(null);

      const handleSort = (col: string) => {
        if (sortCol === col) {
          setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
          if (sortDir === "desc") setSortCol(null);
        } else {
          setSortCol(col);
          setSortDir("asc");
        }
      };

      const sorted = [...users].sort((a, b) => {
        if (!sortCol || !sortDir) return 0;
        const aVal = a[sortCol as keyof typeof a];
        const bVal = b[sortCol as keyof typeof b];
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });

      return (
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sortDirection={sortCol === "name" ? sortDir : null}
                  onSort={() => handleSort("name")}
                >
                  Name
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortCol === "email" ? sortDir : null}
                  onSort={() => handleSort("email")}
                >
                  Email
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortCol === "role" ? sortDir : null}
                  onSort={() => handleSort("role")}
                >
                  Role
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-grey-600">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      color={user.status === "Active" ? "success" : "neutral"}
                      type="accent"
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    };
    return <SortDemo />;
  },
};

/* ─── With avatar leading cell ────────────────────────────────────── */
export const WithLeadingAvatar: Story = {
  render: () => (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    type="initials"
                    initials={user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="md"
                  />
                  <div className="flex flex-col">
                    <span className="text-body-sm font-medium text-grey-900">
                      {user.name}
                    </span>
                    <span className="text-body-sm text-grey-600">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  color={user.status === "Active" ? "success" : "neutral"}
                  type="accent"
                  size="sm"
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-body-sm font-semibold text-primary-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-body-sm font-semibold text-grey-400"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/* ─── Full featured: selection + sorting + avatars ─────────────────── */
export const FullFeatured: Story = {
  render: () => {
    const FullDemo = () => {
      const [selected, setSelected] = useState<Set<string>>(new Set());
      const [sortCol, setSortCol] = useState<string | null>("name");
      const [sortDir, setSortDir] = useState<SortDirection>("asc");

      const allSelected = selected.size === users.length;
      const someSelected = selected.size > 0 && !allSelected;

      const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(users.map((u) => u.id)));
      };

      const toggleRow = (id: string) => {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      };

      const handleSort = (col: string) => {
        if (sortCol === col) {
          setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
          setSortCol(col);
          setSortDir("asc");
        }
      };

      const sorted = [...users].sort((a, b) => {
        if (!sortCol || !sortDir) return 0;
        const aVal = a[sortCol as keyof typeof a];
        const bVal = b[sortCol as keyof typeof b];
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });

      return (
        <div className="rounded-xl border border-grey-200 p-6">
          <Table>
            <TableHeader>
              <TableRow selected={allSelected || someSelected}>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                  />
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortCol === "name" ? sortDir : null}
                  onSort={() => handleSort("name")}
                >
                  Member
                </TableHead>
                <TableHead
                  sortable
                  sortDirection={sortCol === "role" ? sortDir : null}
                  onSort={() => handleSort("role")}
                >
                  Role
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((user) => {
                const isSelected = selected.has(user.id);
                return (
                  <TableRow key={user.id} selected={isSelected}>
                    <TableCell className="w-12">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          type="initials"
                          initials={user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                          size="md"
                          status="online"
                        />
                        <div className="flex flex-col">
                          <span className="text-body-sm font-medium text-grey-900">
                            {user.name}
                          </span>
                          <span className="text-body-sm text-grey-600">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge
                        color={user.status === "Active" ? "success" : "neutral"}
                        type="accent"
                        size="sm"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-lg border border-grey-200 bg-white text-grey-500 hover:bg-grey-50"
                      >
                        <Icon name="more-vertical" size="sm" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      );
    };
    return <FullDemo />;
  },
};
