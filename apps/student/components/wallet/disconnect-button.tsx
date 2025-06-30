import { useUserStore } from "@/store";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

interface DisconnectButtonProps {
  className?: string;
}

export default function DisconnectButton({ className }: DisconnectButtonProps) {
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleDisconnect = () => {
    if (wallet) {
      disconnect(wallet);
      clearUser();
    }
  };

  return (
    <div className="group flex w-full">
      <Button
        onClick={handleDisconnect}
        variant="ghost"
        className={cn(
          className,
          "flex w-full items-center justify-start !gap-3 !p-3",
        )}
      >
        <div className="h-6 w-6">
          <LogOutIcon className="!h-6 !w-6 text-[#6f6d78] group-hover:text-[#3385ff]" />
        </div>
        Disconnect
      </Button>
    </div>
  );
}
