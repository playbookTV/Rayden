"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSection,
  Avatar,
} from "@raydenui/ui";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleValueChange = (value) => {
    router.push(`/${value}`);
  };

  // Map pathname to menu value
  const currentValue = pathname.replace("/", "") || "dashboard";

  return (
    <aside className="w-64 border-r border-grey-200 bg-white">
      <div className="p-4 border-b border-grey-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-grey-900">Rayden App</span>
        </div>
      </div>

      <SidebarMenu
        theme="light"
        className="p-3"
        value={currentValue}
        onValueChange={handleValueChange}
      >
        <SidebarMenuSection>
          <SidebarMenuItem value="dashboard" icon="home">
            Dashboard
          </SidebarMenuItem>
          <SidebarMenuItem value="transactions" icon="card">
            Transactions
          </SidebarMenuItem>
          <SidebarMenuItem value="settings" icon="settings-2">
            Settings
          </SidebarMenuItem>
        </SidebarMenuSection>
      </SidebarMenu>

      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-grey-200">
        <div className="flex items-center gap-3">
          <Avatar size="sm" initials="JD" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-grey-900 truncate">
              John Doe
            </p>
            <p className="text-xs text-grey-500 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
