"use client";

import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { ReactNode } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function Layout({ children }: { children: ReactNode }) {
  const account = useActiveAccount();

  if (!account?.address) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <WalletConnectButton />
      </div>
    );
  }

  return <>{children}</>;
}
