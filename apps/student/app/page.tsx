"use client";

import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ModeToggle } from "@workspace/ui/components/mode-toggle";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex items-center justify-center gap-4">
        <ModeToggle />
        <WalletConnectButton />
      </div>
    </div>
  );
}
