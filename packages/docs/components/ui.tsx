"use client";

import dynamic from "next/dynamic";

// Re-export all Rayden UI components as client components
export {
  // Forms & Inputs
  Button,
  ButtonGroup,
  ButtonGroupItem,
  Input,
  Select,
  SelectOption,
  Checkbox,
  Radio,
  Toggle,
  Chip,
  FileUpload,
  Counter,
  NumberCounter,
  Slider,
  RangeSlider,
  DatePicker,

  // Navigation
  Tabs,
  Tab,
  Breadcrumb,
  Pagination,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSection,
  SidebarMenuSub,
  SidebarMenuSubItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Stepper,
  LinearStepper,
  SegmentedStepper,

  // Data Display
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  AvatarGroup,
  ActivityItem,
  ActivityContent,
  MetricsCard,
  Icon,

  // Feedback
  Alert,
  Badge,
  Banner,
  ProgressBar,
  ProgressCircle,
  Spinner,
  Tooltip,

  // Layout
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Divider,
  Modal,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
} from "@raydenui/ui";

// Charts ship from their own subpath so the optional chart.js peer stays optional.
export { chartColors, hexToRgba, createGradientFill } from "@raydenui/ui/chart";

// Code-split the two heaviest modules so only the pages that use them pay for them.
export const EmptyStateIllustration = dynamic(
  () => import("@raydenui/ui").then((m) => m.EmptyStateIllustration),
  { ssr: false }
);
export const RaydenChart = dynamic(() => import("@raydenui/ui/chart").then((m) => m.RaydenChart), {
  ssr: false,
});
