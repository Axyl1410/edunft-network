import { FORMA_SKETCHPAD, thirdwebClient } from "@/lib/thirdweb-client";
import { formatAddress } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import axios from "axios";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Blobbie,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useConnectModal,
  useWalletDetailsModal,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const WalletConnectButton = () => {
  const { connect } = useConnectModal();
  const { theme } = useTheme();
  const account = useActiveAccount();
  const detailsModal = useWalletDetailsModal();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  useEffect(() => {
    if (!wallet) {
      return;
    }
    const unsubscribe = wallet.subscribe("accountChanged", (newAccount) => {
      console.log("Account changed via subscribe:", newAccount);
    });
    const unsubscribeChain = wallet.subscribe("chainChanged", (newChain) => {
      console.log("Chain changed via subscribe:", newChain);
    });

    return () => {
      unsubscribe();
      unsubscribeChain();
    };
  }, [wallet]);

  useEffect(() => {
    if (account?.address) {
      axios
        .post("http://localhost:8080/user/login", {
          WalletAddress: account.address,
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to connect to EduNFT", {
            description: error.message,
          });
        });
    }
  }, [account]);

  const wallets = [
    inAppWallet({
      auth: {
        options: ["google", "email", "facebook", "apple", "github"],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  async function handleConnect() {
    await connect({
      client: thirdwebClient,
      chain: FORMA_SKETCHPAD,
      showThirdwebBranding: false,
      theme: theme === "light" ? "light" : "dark",
      size: "compact",
      wallets: wallets,
    });
  }

  async function handleDetail() {
    detailsModal.open({
      client: thirdwebClient,
      chains: [FORMA_SKETCHPAD],
      theme: theme === "light" ? "light" : "dark",
    });
  }

  async function handleSwitch() {
    if (wallet?.switchChain) {
      try {
        await wallet.switchChain(FORMA_SKETCHPAD);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    } else {
      console.warn(
        "Wallet does not support switching chain or wallet is not connected.",
      );
    }
  }

  return (
    <>
      {!account?.address ? (
        <Button onClick={handleConnect} className="cursor-pointer">
          Connect
        </Button>
      ) : activeChain?.id !== FORMA_SKETCHPAD.id ? (
        <Button onClick={handleSwitch} className="cursor-pointer">
          Switch network
        </Button>
      ) : (
        <Button
          variant={"outline"}
          onClick={handleDetail}
          className="flex cursor-pointer items-center"
        >
          <Blobbie address={account.address} className="size-6 rounded-full" />
          {formatAddress(account.address)}
        </Button>
      )}
    </>
  );
};
