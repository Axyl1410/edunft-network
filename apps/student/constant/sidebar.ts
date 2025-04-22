import {
  BookText,
  Bot,
  FileText,
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
      items: [
        // {
        //   title: "History",
        //   url: "#",
        // },
        // {
        //   title: "Starred",
        //   url: "#",
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },

    {
      title: "Files",
      url: "/file",
      icon: FileText,
      items: [
        // {
        //   title: "Introduction",
        //   url: "#",
        // },
        // {
        //   title: "Get Started",
        //   url: "#",
        // },
        // {
        //   title: "Tutorials",
        //   url: "#",
        // },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Studio",
      url: "#",
      icon: PenLine,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      icon: UserCircle2,
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
      name: "Models",
      url: "#",
      icon: Bot,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};
