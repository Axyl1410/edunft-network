"use client";

import { LoginForm } from "@/components/ui/login-form";
import { GalleryVerticalEnd } from "lucide-react";
import { ReactNode } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: ReactNode }) {
  const account = useActiveAccount();

  if (!account?.address) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Axyl Team.
          </a>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
