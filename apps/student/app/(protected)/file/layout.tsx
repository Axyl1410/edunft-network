"use client";

import { WalletConnectButton } from "@/components/wallet-connect-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAccount } from "wagmi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const account = useAccount();

  if (account.isDisconnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please connect your wallet</CardTitle>
            <CardDescription>
              You need to connect your wallet to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnectButton className="mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
