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
import Link from "next/link";
import { LoginForm } from "../ui/login-form";

interface AuthLayoutProps {
  error: string | null;
  isPending: boolean;
  onDisconnect: () => void;
  onClearError: () => void;
}

export function AuthLayout({
  error,
  isPending,
  onDisconnect,
  onClearError,
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
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  onClick={onClearError}
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
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
