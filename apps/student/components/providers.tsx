"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThirdwebProvider } from "thirdweb/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ThirdwebProvider>
        <Toaster closeButton position="bottom-right" />
        {children}
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
