import { GalleryVerticalEnd } from "lucide-react";
import logo from "@/asset/images/Logo_320x320.png";
export default function NavHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md dark:bg-neutral-800">
          {/* <GalleryVerticalEnd size={18} /> */}
          <img src={logo.src} alt="logo" className="w-full h-full" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">EDU NFT</span>
          <span className="truncate text-xs">Student version</span>
        </div>
      </div>
    </div>
  );
}
