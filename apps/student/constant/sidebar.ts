import {
  BookText,
  Bot,
  Calendar,
  FileText,
  HelpCircle,
  Map,
  PenLine,
  Settings,
  UserCircle2,
} from "lucide-react";

export const SidebarData = {
  navMain: [
    {
      title: "Discover",
      url: "/",
      icon: Map,
      isActive: true,
      items: [],
    },

    {
      title: "Files",
      url: "/file",
      icon: FileText,
      items: [],
    },
    {
      title: "Studio",
      url: "#",
      icon: PenLine,
      items: [
        {
          title: "Mint",
          url: "#",
        },
        {
          title: "Collection",
          url: "#",
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
      url: "#",
      icon: BookText,
    },
    {
      name: "Chatbot",
      url: "/chatbot",
      icon: Bot,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};
