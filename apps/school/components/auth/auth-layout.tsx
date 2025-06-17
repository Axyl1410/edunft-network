"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../ui/login-form";
import { WalletConnectButton } from "../ui/wallet-connect-button";

interface AuthLayoutProps {
  error: string | null;
  isPending: boolean;
  onDisconnect: () => void;
}

export function AuthLayout({
  error,
  isPending,
  onDisconnect,
}: AuthLayoutProps) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Axyl Team.
        </a>

        {error ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Error</CardTitle>
              <CardDescription>Something went wrong</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-destructive/15 text-destructive rounded-md p-4">
                {error}
              </div>
              <Button
                onClick={onDisconnect}
                variant={"outline"}
                className="mt-4 w-full"
              >
                Disconnect
              </Button>
            </CardContent>
          </Card>
        ) : isPending ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Processing</CardTitle>
              <CardDescription>
                Please wait while we process your login
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">Đang xử lý đăng nhập...</div>
            </CardContent>
          </Card>
        ) : (
          <>
            <LoginForm />
          </>
        )}
      </div>
    </div>
  );
}
