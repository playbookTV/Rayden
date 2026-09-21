"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActivityItem,
  Alert,
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FileUpload,
  Icon,
  MetricsCard,
  Modal,
  Pagination,
  Tab,
  Tabs,
  type FileUploadFileData,
} from "@raydenui/ui";
import { NotificationsBlock } from "../../../src/blocks/NotificationsBlock";
import { LoginBlock } from "../../../src/blocks/LoginBlock";
import { EmptyStateBlock } from "../../../src/blocks/EmptyStateBlock";
import { QuickSendBlock } from "../../../src/blocks/QuickSendBlock";
import { RecentTransactionsBlock } from "../../../src/blocks/RecentTransactionsBlock";

// Pagination demos
export function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
}

export function PaginationPositionsDemo() {
  const [pages, setPages] = useState([1, 5, 10]);
  return (
    <div className="flex w-full flex-col gap-4 items-start">
      {pages.map((page, index) => (
        <Pagination
          key={index}
          aria-label={`Page position example ${index + 1}`}
          currentPage={page}
          totalPages={10}
          onPageChange={(next) =>
            setPages((current) => current.map((value, i) => (i === index ? next : value)))
          }
        />
      ))}
    </div>
  );
}

export function PaginationSiblingDemo() {
  const [page, setPage] = useState(5);
  return <Pagination currentPage={page} totalPages={20} siblingCount={2} onPageChange={setPage} />;
}

// Modal demos
export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
        primaryLabel="Confirm"
        secondaryLabel="Cancel"
        onPrimaryClick={() => setIsOpen(false)}
      >
        <p className="text-grey-600">
          Try Tab, Shift+Tab, or Escape. Focus returns to the button when you close this dialog.
        </p>
      </Modal>
    </>
  );
}

export function ModalSizesDemo() {
  const [size, setSize] = useState<"sm" | "md" | "lg" | null>(null);
  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setSize("sm")}>Small</Button>
        <Button onClick={() => setSize("md")}>Medium</Button>
        <Button onClick={() => setSize("lg")}>Large</Button>
      </div>
      <Modal
        open={size !== null}
        onClose={() => setSize(null)}
        title={`${size?.toUpperCase()} Modal`}
        size={size || "md"}
        primaryLabel="Close"
        onPrimaryClick={() => setSize(null)}
      >
        <p className="text-grey-600">This is a {size} modal.</p>
      </Modal>
    </>
  );
}

// Tabs demos
export function TabsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <Tab value="tab1">Tab 1</Tab>
      <Tab value="tab2">Tab 2</Tab>
      <Tab value="tab3">Tab 3</Tab>
    </Tabs>
  );
}

export function TabsVariantsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="tab1" variant="line">
        <Tab value="tab1">Line Tab</Tab>
        <Tab value="tab2">Tab 2</Tab>
      </Tabs>
      <Tabs defaultValue="tab1" variant="pill">
        <Tab value="tab1">Pill Tab</Tab>
        <Tab value="tab2">Tab 2</Tab>
      </Tabs>
      <Tabs defaultValue="tab1" variant="segmented">
        <Tab value="tab1">Segmented</Tab>
        <Tab value="tab2">Tab 2</Tab>
      </Tabs>
    </div>
  );
}

// Accordion demos
export function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Rayden UI?</AccordionTrigger>
        <AccordionContent>
          Rayden UI is a React component library built with Tailwind CSS.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes! All components follow WAI-ARIA guidelines.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it customizable?</AccordionTrigger>
        <AccordionContent>Absolutely. Use Tailwind classes or CSS variables.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionMultipleDemo() {
  return (
    <Accordion multiple className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>Multiple sections can be open at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>Try opening both sections!</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// DropdownMenu demos
export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-grey-300 bg-white px-3 py-2 text-body-sm font-semibold text-grey-700 hover:border-primary-300 focus:border-primary-500 focus:outline-none transition-colors">
        Open Menu
        <Icon name="chevron-down" size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon="user">Profile</DropdownMenuItem>
        <DropdownMenuItem icon="settings">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// FileUpload demos
export function FileUploadDemo() {
  const [files, setFiles] = useState<FileUploadFileData[]>([]);
  return <FileUpload files={files} onFilesChange={setFiles} />;
}

export function FileUploadRestrictedDemo() {
  const [files, setFiles] = useState<FileUploadFileData[]>([]);
  return (
    <FileUpload
      files={files}
      onFilesChange={setFiles}
      accept=".pdf,.doc,.docx"
      maxSize={10 * 1024 * 1024}
      description="PDF, DOC up to 10MB"
    />
  );
}

export function FileUploadMultipleDemo() {
  const [files, setFiles] = useState<FileUploadFileData[]>([]);
  return (
    <FileUpload
      files={files}
      onFilesChange={setFiles}
      multiple
      maxFiles={5}
      description="Upload up to 5 files"
    />
  );
}

export function FileUploadCustomDemo() {
  const [files, setFiles] = useState<FileUploadFileData[]>([]);
  return (
    <FileUpload
      files={files}
      onFilesChange={setFiles}
      title="Upload Images"
      showHeader
      accept="image/png,image/jpeg"
      maxSize={10 * 1024 * 1024}
      description="PNG, JPG up to 10MB"
    />
  );
}

// ─── Block Demos ─────────────────────────────────────────────────────

export function NotificationsBlockDemo() {
  return (
    <div className="w-full max-w-[460px]">
      <NotificationsBlock
        unreadCount={3}
        items={[
          {
            id: "1",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700 dark:text-grey-200">David</span> left a
                comment on <span className="font-medium text-primary-400">Site redesign</span>
              </>
            ),
            date: "Mar 21, 2024",
            time: "10 mins",
            unread: true,
          },
          {
            id: "2",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=5" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700 dark:text-grey-200">Sarah</span> shared a
                file with you
              </>
            ),
            date: "Mar 20, 2024",
            time: "2 hours",
            unread: true,
          },
          {
            id: "3",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=8" size="sm" />,
            text: (
              <>
                <span className="font-medium text-grey-700 dark:text-grey-200">Mike</span> mentioned
                you in <span className="font-medium text-primary-400">Project Alpha</span>
              </>
            ),
            date: "Mar 19, 2024",
            time: "1 day",
            unread: false,
          },
        ]}
      />
    </div>
  );
}

export function LoginBlockDemo() {
  return (
    <div className="w-full max-w-md">
      <LoginBlock
        variant="card"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  );
}

export function LoginBlockStandardDemo() {
  return (
    <div className="w-full max-w-md">
      <LoginBlock
        variant="standard"
        onForgotPassword={() => {}}
        onSubmit={(data) => console.log("Login:", data)}
        onSignUp={() => {}}
      />
    </div>
  );
}

export function EmptyStateBlockDemo() {
  return (
    <EmptyStateBlock
      illustration="task-templates"
      title="No tasks to show"
      description={`You don't have any pending tasks for today.\nAdd new tasks to track productivity`}
      action={{ label: "New Task", icon: "plus" }}
    />
  );
}

export function EmptyStateBlockSearchDemo() {
  return (
    <EmptyStateBlock
      illustration="search"
      illustrationColored={false}
      title="No results found"
      description={`"Access" did not match any results.\nPlease try again`}
    />
  );
}

export function QuickSendBlockDemo() {
  return (
    <div className="w-full max-w-sm">
      <QuickSendBlock
        beneficiaries={[
          {
            id: "1",
            name: "John Doe",
            handle: "johndoe",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=1" size="lg" />,
          },
          {
            id: "2",
            name: "Sarah",
            handle: "sarah_m",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=5" size="lg" />,
          },
          {
            id: "3",
            name: "Mike",
            handle: "mike_t",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=8" size="lg" />,
          },
          {
            id: "4",
            name: "Emma",
            handle: "emma_w",
            avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=9" size="lg" />,
          },
        ]}
        onSelect={(id) => console.log("Selected:", id)}
      />
    </div>
  );
}

export function RecentTransactionsBlockDemo() {
  return (
    <div className="w-full max-w-md">
      <RecentTransactionsBlock
        transactions={[
          {
            id: "1",
            direction: "outgoing",
            name: "Netflix",
            category: "Entertainment",
            amount: "$15.99",
          },
          {
            id: "2",
            direction: "incoming",
            name: "Payroll Inc",
            category: "Salary",
            amount: "$5,000.00",
          },
          {
            id: "3",
            direction: "outgoing",
            name: "Grocery Store",
            category: "Shopping",
            amount: "$89.50",
          },
        ]}
        onSeeAll={() => console.log("View all")}
      />
    </div>
  );
}

// MDX pages are server components, so callbacks cannot be passed to a Preview
// directly. Interactive examples live here as client components instead.
export function MetricsCardCtaDemo() {
  return (
    <MetricsCard
      variation="1"
      label="Total Solar Sales"
      value="$45,823"
      secondaryText="Jun 12th, 2023"
      statusBadge={{ label: "Paid", variant: "success" }}
      cta={{ label: "View Transactions", onClick: () => {} }}
    />
  );
}

export function ActivityItemLinkDemo() {
  return (
    <ActivityItem
      avatar={<Avatar type="initials" initials="AD" size="sm" />}
      text={
        <>
          <span className="font-medium text-grey-700">Ada</span> requested a review
        </>
      }
      time="10 mins"
      link={{ label: "View request", onClick: () => {} }}
      badge="#Marketing-Design"
    />
  );
}

export function AlertActionDemo() {
  return (
    <Alert
      state="error"
      title="Connection Lost"
      primaryAction={{ label: "Retry", onClick: () => {} }}
    >
      Unable to connect to the server. Please try again.
    </Alert>
  );
}
