"use client";

import notfound from "@/app/not-found";
import { useActiveAccount } from "thirdweb/react";

interface OwnerCheckProps {
  owner: string;
  children: React.ReactNode;
}

export function OwnerCheck({ owner, children }: OwnerCheckProps) {
  const account = useActiveAccount();

  if (account?.address !== owner) {
    return notfound();
  }

  return <>{children}</>;
}
