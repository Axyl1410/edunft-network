import { Providers } from "@/components/context/providers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import NavAccount from "@/components/layout/nav-acoount";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

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
        suppressHydrationWarning
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <NextTopLoader showAtBottom shadow="none" showSpinner={false} />
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <nav className="border-border sticky top-0 z-10 flex h-[50px] items-center justify-between border border-l-0 px-4 backdrop-blur-sm">
                <NavAccount />
              </nav>
              <div className="h-[calc(100vh-50px)]">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
