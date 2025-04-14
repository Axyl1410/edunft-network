import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { Toaster } from "@workspace/ui/components/sonner";
import { useTheme } from "next-themes";
import * as React from "react";

export function AppContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <RainbowKitProvider
      modalSize="compact"
      theme={theme === "dark" ? darkTheme() : lightTheme()}
    >
      <Toaster closeButton position="top-right" />
      {children}
    </RainbowKitProvider>
  );
}
