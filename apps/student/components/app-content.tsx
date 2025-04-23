import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { Toaster } from "@workspace/ui/components/sonner";
import axios from "axios";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export function AppContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const account = useAccount();

  useEffect(() => {
    if (account.isConnected) {
      axios
        .post("http://localhost:8080/user/login", {
          WalletAddress: account.address,
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to connect to EduNFT", {
            description: error.message,
          });
        });
    }
  }, [account]);

  return (
    <RainbowKitProvider
      modalSize="compact"
      theme={theme === "dark" ? darkTheme() : lightTheme()}
      appInfo={{ appName: "EduNFT" }}
    >
      <Toaster closeButton position="bottom-right" />
      {children}
    </RainbowKitProvider>
  );
}
