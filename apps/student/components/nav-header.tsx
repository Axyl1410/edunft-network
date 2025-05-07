import { GalleryVerticalEnd } from "lucide-react";

export default function NavHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md dark:bg-neutral-800">
          <GalleryVerticalEnd size={18} />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">EDU NFT</span>
          <span className="truncate text-xs">Student version</span>
        </div>
      </div>
    </div>
  );
}
