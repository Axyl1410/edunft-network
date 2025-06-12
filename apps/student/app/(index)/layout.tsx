import ChatbotPopup from "@/components/common/chatbot-popup";
import { AppSidebar } from "@/components/layout/app-sidebar";
import NavAccount from "@/components/layout/nav-acoount";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import "@workspace/ui/globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <nav className="border-border sticky top-2 z-40 ml-2 mr-2 flex h-[50px] items-center justify-between rounded-md border px-4 backdrop-blur-sm md:ml-0">
            <NavAccount />
          </nav>
          <div className="mt-4 min-h-[calc(100vh-50px)] px-2">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <ChatbotPopup />
    </>
  );
}
