import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThirdwebProvider } from "thirdweb/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Toaster closeButton position="bottom-right" />
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </ThemeProvider>
  );
}
