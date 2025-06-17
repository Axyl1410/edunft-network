"use client";

import { AuthProvider } from "@/components/auth/auth-provider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
