import * as React from "react";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import QueryClient from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClient>
      <ThemeProvider>
        <ThirdwebProvider>
          <Toaster closeButton position="bottom-right" />
          {children}
        </ThirdwebProvider>
      </ThemeProvider>
    </QueryClient>
  );
}
