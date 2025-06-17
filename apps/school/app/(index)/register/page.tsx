"use client";

import { RegisterForm } from "@/components/ui/register-form";
import { UserStatus, useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function RegisterPage() {
  const account = useActiveAccount();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Only redirect if user is approved
    if (user?.status === UserStatus.APPROVED) {
      router.replace("/");
    }
  }, [user?.status, router]);

  // Only hide content if user is approved
  if (user?.status === UserStatus.APPROVED) {
    return null;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <RegisterForm walletAddress={account?.address} />
      </div>
    </div>
  );
}
