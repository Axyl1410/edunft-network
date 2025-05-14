import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThirdwebProvider>
        <Toaster closeButton position="bottom-right" />
        {children}
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
