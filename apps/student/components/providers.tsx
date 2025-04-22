"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { polygonZkEvmCardona } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { AppContent } from "./app-content";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined");
}

const chains = [polygonZkEvmCardona] as const;

const config = getDefaultConfig({
  appName: "EduNFT",
  projectId: projectId,
  chains: chains,
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AppContent>{children}</AppContent>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
