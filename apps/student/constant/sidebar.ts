import {
  BookText,
  Bot,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Map,
  PenLine,
  Settings,
  UserCircle2,
} from "lucide-react";

export const SidebarData = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      items: [],
    },
    {
      title: "Discover",
      url: "#",
      icon: Map,
      items: [
        {
          title: "Buy",
          url: "/buy",
        },
        {
          title: "Sell",
          url: "/sell",
        },
      ],
    },
    {
      title: "Files",
      url: "/file",
      icon: FileText,
      items: [],
    },
    {
      title: "Studio",
      icon: PenLine,
      items: [
        {
          title: "Mint",
          url: "/mint",
        },
        {
          title: "Collection",
          url: "/collection",
        },
      ],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserCircle2,
      items: [],
    },
    {
      title: "Question",
      url: "/question",
      icon: HelpCircle,
      items: [],
    },
    {
      title: "Events",
      url: "/events",
      icon: Calendar,
      items: [],
    },
  ],
  more: [
    {
      name: "Resources",
      url: "/resources",
      icon: BookText,
    },
    {
      name: "Chatbot",
      url: "/chatbot",
      icon: Bot,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};
