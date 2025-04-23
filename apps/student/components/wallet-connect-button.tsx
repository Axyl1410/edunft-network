import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn, generateColorFromAddress } from "@workspace/ui/lib/utils";

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  className,
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        let onClick = openConnectModal;
        let variant: "default" | "destructive" | "outline" = "default";
        let content: React.ReactNode = "Connect Wallet";

        if (connected) {
          if (chain.unsupported) {
            onClick = openChainModal;
            variant = "destructive";
            content = "Wrong network";
          } else {
            onClick = openAccountModal;
            variant = "outline";
            content = (
              <>
                {account.displayBalance
                  ? `${account.displayBalance} `
                  : "loading..."}
                <div
                  className="!h-6 !w-6 rounded-full"
                  style={{
                    background: generateColorFromAddress(account.address),
                  }}
                />
              </>
            );
          }
        }

        if (!ready) {
          return <Skeleton className="h-9 w-[130px] rounded-md" />;
        }

        return (
          <Button
            onClick={onClick}
            variant={variant}
            className={cn("cursor-pointer transition-colors", className)}
            disabled={!ready}
          >
            {content}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};
