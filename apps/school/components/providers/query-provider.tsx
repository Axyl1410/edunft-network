"use client";

import {
  QueryClient as Client,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new Client();

export default function QueryClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
