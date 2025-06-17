import { Providers } from "@/components/context/providers";
import "@workspace/ui/globals.css";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

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
      <body className="font-sans antialiased">
        <NextTopLoader showAtBottom shadow="none" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
