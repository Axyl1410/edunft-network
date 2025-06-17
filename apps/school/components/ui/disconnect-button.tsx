import { useUserStore } from "@/store";
import { Button } from "@workspace/ui/components/button";
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
    <Button onClick={handleDisconnect} variant="outline" className={className}>
      Disconnect
    </Button>
  );
}
