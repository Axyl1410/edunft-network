"use client";

import { ModeToggle } from "@workspace/ui/components/mode-toggle";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { WalletConnectButton } from "./wallet-connect-button";

export default function NavAccount() {
  const { theme } = useTheme();

  return (
    <>
      <div>
        <SidebarTrigger className="!mr-2 cursor-pointer" />
        <div className="inline-flex h-9 w-full cursor-text items-center gap-1.5 whitespace-nowrap rounded-md border bg-white px-5 pl-3.5 pr-2 text-sm backdrop-blur-lg transition-[background-color,box-shadow] duration-150 ease-out lg:w-[360px] dark:bg-neutral-900">
          <div className="dark:text-primary flex min-w-fit items-center">
            <Search size={18} />
          </div>
          <input
            aria-invalid="false"
            placeholder="Search EduNFT"
            data-testid="NavSearch"
            className="outline-hidden pointer-events-none w-full border-0 bg-transparent text-sm [appearance:textfield] md:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <div className="flex min-w-fit items-center">
            <div className="flex size-6 flex-col items-center justify-center rounded border">
              <span className="text-sm leading-normal">/</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <ModeToggle />
        <WalletConnectButton />
      </div>
    </>
  );
}
