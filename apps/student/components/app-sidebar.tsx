"use client";

import { SidebarData } from "@/constant";
import { formatAddress } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { generateColorFromAddress } from "@workspace/ui/lib/utils";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAccount } from "wagmi";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const account = useAccount();
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 border-b">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md dark:bg-neutral-800">
              <GalleryVerticalEnd size={16} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Axyl Team</span>
              <span className="truncate text-xs">Student version</span>
            </div>
          </div>
          <div className="bg-secondary truncate rounded-md px-3 py-1.5 text-sm font-semibold">
            EduNFT
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarData.navMain} />
        <Separator />
        <NavProjects projects={SidebarData.more} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div
                    className="bg-primary text-sidebar-primary-foreground flex aspect-square h-8 w-8 items-center justify-center rounded-full dark:bg-neutral-800"
                    style={{
                      background: generateColorFromAddress(
                        account.address ?? "",
                      ),
                    }}
                  />

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-sm font-semibold">
                      {formatAddress(account.address ?? "")}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div
                      className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-full dark:bg-neutral-800"
                      style={{
                        background: generateColorFromAddress(
                          account.address ?? "",
                        ),
                      }}
                    />

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-sm font-semibold">
                        {formatAddress(account.address ?? "")}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
