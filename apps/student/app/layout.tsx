import { AppSidebar } from "@/components/app-sidebar";
import NavAccount from "@/components/nav-acoount";
import { Providers } from "@/components/providers";
import "@rainbow-me/rainbowkit/styles.css";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "EduNFT",
  description: "EduNFT for student",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <nav className="border-border bg-sidebar/50 sticky top-2.5 z-10 ml-1 mr-3 flex h-14 items-center justify-between rounded-lg border px-4 shadow backdrop-blur-sm">
                <NavAccount />
              </nav>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
