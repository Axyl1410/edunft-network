"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarMenuItemProps {
  name: string;
  url: string;
  icon: LucideIcon;
}

export function NavProjects({
  projects,
}: {
  projects: SidebarMenuItemProps[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>More</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
