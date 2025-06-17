"use client";

import { FORMA_SKETCHPAD } from "@/constants";
import { thirdwebClient } from "@/lib/thirdweb";
import React, { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useConnectModal,
  useWalletDetailsModal,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { AccountButton } from "./account-button";
import { ConnectButton } from "./connect-button";
import DisconnectButton from "./disconnect-button";
import { SwitchNetworkButton } from "./switch-network-button";

const WalletConnectButtonComponent = () => {
  const { connect } = useConnectModal();
  const account = useActiveAccount();
  const detailsModal = useWalletDetailsModal();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  useEffect(() => {
    if (!wallet) return;
    const unsubscribeAccount = wallet.subscribe(
      "accountChanged",
      (newAccount) => {
        console.log("Account changed via subscribe:", newAccount);
      },
    );
    const unsubscribeChain = wallet.subscribe("chainChanged", (newChain) => {
      console.log("Chain changed via subscribe:", newChain);
    });
    return () => {
      unsubscribeAccount();
      unsubscribeChain();
    };
  }, [wallet]);

  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["google", "email", "facebook", "apple", "github"] },
      }),
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
      createWallet("io.rabby"),
      createWallet("io.zerion.wallet"),
    ],
    [],
  );

  const handleConnect = useCallback(async () => {
    await connect({
      client: thirdwebClient,
      chain: FORMA_SKETCHPAD,
      showThirdwebBranding: false,
      theme: "light",
      size: "compact",
      wallets: wallets,
    });
  }, [connect, wallets]);

  const handleDetail = useCallback(async () => {
    detailsModal.open({
      client: thirdwebClient,
      chains: [FORMA_SKETCHPAD],
      theme: "light",
      hideSwitchWallet: true,
      hideDisconnect: true,
      footer: () => (
        <>
          <DisconnectButton className="text-md" />
          <span className="text-muted-foreground mt-2 flex w-full justify-center text-sm">
            Made with ❤️ by Axyl team.
          </span>
        </>
      ),
    });
  }, [detailsModal]);

  const handleSwitch = useCallback(async () => {
    if (wallet?.switchChain) {
      try {
        await wallet.switchChain(FORMA_SKETCHPAD);
      } catch (error) {
        toast.error(
          "Failed to switch chain. Please ensure your wallet supports this network.",
        );
      }
    } else {
      toast.error(
        "Your wallet does not support switching chains. Please connect a compatible wallet.",
      );
    }
  }, [wallet]);

  return (
    <>
      {!account?.address ? (
        <ConnectButton onClick={handleConnect} />
      ) : activeChain?.id !== FORMA_SKETCHPAD.id ? (
        <SwitchNetworkButton onClick={handleSwitch} />
      ) : (
        <AccountButton address={account.address} onClick={handleDetail} />
      )}
    </>
  );
};

WalletConnectButtonComponent.displayName = "WalletConnectButton";

export const WalletConnectButton = React.memo(WalletConnectButtonComponent);
