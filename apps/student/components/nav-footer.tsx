import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { formatAddress } from "@/lib/utils";
import { useBearStore } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Blobbie,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";

export default function NavFooter() {
  const account = useActiveAccount();
  const { isMobile } = useSidebar();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  const setUser = useBearStore((state) => state.setUser);
  const clearUser = useBearStore((state) => state.clearUser);
  const user = useBearStore((state) => state.user);

  const handleDisconnect = () => {
    if (wallet) {
      disconnect(wallet);
      clearUser();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              disabled={!account?.address}
            >
              <div className="aspect-square">
                {user?.profilePicture ? (
                  <SkeletonImage
                    src={user.profilePicture}
                    alt="Avatar"
                    width={32}
                    height={32}
                    rounded="rounded-full"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <Blobbie
                    address={account?.address ?? ""}
                    className="h-8 w-8 rounded-full"
                  />
                )}
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-sm font-semibold">
                  {formatAddress(account?.address ?? "")}
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
                {user?.profilePicture ? (
                  <SkeletonImage
                    src={user.profilePicture}
                    alt="Avatar"
                    width={32}
                    height={32}
                    rounded="rounded-full"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <Blobbie
                    address={account?.address ?? ""}
                    className="size-8 rounded-full"
                  />
                )}

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-sm font-semibold">
                    {formatAddress(account?.address ?? "")}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={"/profile"}>
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleDisconnect}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
