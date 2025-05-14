"use client";

import { SidebarData } from "@/constant";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar";
import NavFooter from "./nav-footer";
import NavHeader from "./nav-header";
import { NavMain, SidebarMenuItemProps } from "./nav-main";
import { NavProjects } from "./nav-projects";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader className="justify-center border-b">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarData.navMain as SidebarMenuItemProps[]} />
        <Separator />
        <NavProjects projects={SidebarData.more} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
