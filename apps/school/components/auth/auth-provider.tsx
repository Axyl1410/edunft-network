"use client";

import { usePost } from "@/hooks/use-query";
import { baseUrl } from "@/lib/client";
import { thirdwebClient } from "@/lib/thirdweb";
import { ReactNode, useEffect, useState } from "react";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { WalletConnectButton } from "../ui/wallet-connect-button";
import { AuthLayout } from "./auth-layout";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { disconnect } = useDisconnect();

  const { mutate: login } = usePost<any, { walletAddress: string }>(
    baseUrl + "/auth/login",
    {
      onSuccess: () => {
        setError(null);
        setIsPending(false);
      },
      onError: (error) => {
        if (error?.message === "401") {
          setError(
            "Tài khoản của bạn chưa được xác thực. Vui lòng liên hệ admin để được xác thực.",
          );
        } else {
          setError("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }
        setIsPending(false);
      },
    },
  );

  useEffect(() => {
    if (account?.address) {
      setIsPending(true);
      login({ walletAddress: account.address });
    }
  }, [account?.address]);

  const handleDisconnect = () => {
    if (wallet) {
      disconnect(wallet);
      setError(null);
    }
  };

  return (
    <>
      {!account?.address || error || isPending ? (
        <AuthLayout
          error={error}
          isPending={isPending}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <>{children}</>
      )}
      <div className="sr-only">
        <ConnectButton client={thirdwebClient} />
      </div>
    </>
  );
}
