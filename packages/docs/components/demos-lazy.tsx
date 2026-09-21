"use client";

// Every docs page used to load all of these eagerly through the global MDX map,
// which put ~2.5 MB of demo code on pages that render none of them. Loading each
// through next/dynamic keeps the demos in their own chunk, fetched only when a
// page actually renders one.
import dynamic from "next/dynamic";

export const AccordionDemo = dynamic(() => import("./demos").then((m) => m.AccordionDemo), {
  ssr: false,
});
export const AccordionMultipleDemo = dynamic(
  () => import("./demos").then((m) => m.AccordionMultipleDemo),
  { ssr: false }
);
export const ActivityItemLinkDemo = dynamic(
  () => import("./demos").then((m) => m.ActivityItemLinkDemo),
  { ssr: false }
);
export const AlertActionDemo = dynamic(() => import("./demos").then((m) => m.AlertActionDemo), {
  ssr: false,
});
export const DropdownMenuDemo = dynamic(() => import("./demos").then((m) => m.DropdownMenuDemo), {
  ssr: false,
});
export const EmptyStateBlockDemo = dynamic(
  () => import("./demos").then((m) => m.EmptyStateBlockDemo),
  { ssr: false }
);
export const EmptyStateBlockSearchDemo = dynamic(
  () => import("./demos").then((m) => m.EmptyStateBlockSearchDemo),
  { ssr: false }
);
export const FileUploadCustomDemo = dynamic(
  () => import("./demos").then((m) => m.FileUploadCustomDemo),
  { ssr: false }
);
export const FileUploadDemo = dynamic(() => import("./demos").then((m) => m.FileUploadDemo), {
  ssr: false,
});
export const FileUploadMultipleDemo = dynamic(
  () => import("./demos").then((m) => m.FileUploadMultipleDemo),
  { ssr: false }
);
export const FileUploadRestrictedDemo = dynamic(
  () => import("./demos").then((m) => m.FileUploadRestrictedDemo),
  { ssr: false }
);
export const LoginBlockDemo = dynamic(() => import("./demos").then((m) => m.LoginBlockDemo), {
  ssr: false,
});
export const LoginBlockStandardDemo = dynamic(
  () => import("./demos").then((m) => m.LoginBlockStandardDemo),
  { ssr: false }
);
export const MetricsCardCtaDemo = dynamic(
  () => import("./demos").then((m) => m.MetricsCardCtaDemo),
  { ssr: false }
);
export const ModalDemo = dynamic(() => import("./demos").then((m) => m.ModalDemo), { ssr: false });
export const ModalSizesDemo = dynamic(() => import("./demos").then((m) => m.ModalSizesDemo), {
  ssr: false,
});
export const NotificationsBlockDemo = dynamic(
  () => import("./demos").then((m) => m.NotificationsBlockDemo),
  { ssr: false }
);
export const PaginationDemo = dynamic(() => import("./demos").then((m) => m.PaginationDemo), {
  ssr: false,
});
export const PaginationPositionsDemo = dynamic(
  () => import("./demos").then((m) => m.PaginationPositionsDemo),
  { ssr: false }
);
export const PaginationSiblingDemo = dynamic(
  () => import("./demos").then((m) => m.PaginationSiblingDemo),
  { ssr: false }
);
export const QuickSendBlockDemo = dynamic(
  () => import("./demos").then((m) => m.QuickSendBlockDemo),
  { ssr: false }
);
export const RecentTransactionsBlockDemo = dynamic(
  () => import("./demos").then((m) => m.RecentTransactionsBlockDemo),
  { ssr: false }
);
export const TabsDemo = dynamic(() => import("./demos").then((m) => m.TabsDemo), { ssr: false });
export const TabsVariantsDemo = dynamic(() => import("./demos").then((m) => m.TabsVariantsDemo), {
  ssr: false,
});
