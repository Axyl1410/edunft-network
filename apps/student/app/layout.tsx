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
              <div className="bg-sidebar sticky left-0 top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-sm">
                <NavAccount />
              </div>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
