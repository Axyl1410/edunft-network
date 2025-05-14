"use client";

import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useActiveAccount } from "thirdweb/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();

  if (!account?.address) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please connect your wallet</CardTitle>
            <CardDescription>
              You need to connect your wallet to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
