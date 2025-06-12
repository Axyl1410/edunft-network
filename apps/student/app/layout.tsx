import { Providers } from "@/components/context/providers";
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
