import * as React from "react";
import QueryClient from "./query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClient>{children}</QueryClient>;
}
