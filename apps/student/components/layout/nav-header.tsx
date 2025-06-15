import logo from "@/public/Logo_320x320.png";
import Image from "next/image";

export default function NavHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
          <Image
            src={logo.src}
            alt="logo"
            className="h-full w-full"
            height={32}
            width={32}
          />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">EDU NFT</span>
          <span className="truncate text-xs">Student version</span>
        </div>
      </div>
    </div>
  );
}
