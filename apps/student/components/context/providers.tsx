import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import PreloaderProvider from "../context/preloader-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PreloaderProvider>
      <ThemeProvider>
        <ThirdwebProvider>
          <Toaster closeButton position="bottom-right" />
          {children}
        </ThirdwebProvider>
      </ThemeProvider>
    </PreloaderProvider>
  );
}
