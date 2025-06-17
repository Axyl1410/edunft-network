"use client";

import { usePost } from "@/hooks/use-query";
import { baseUrl } from "@/lib/client";
import { thirdwebClient } from "@/lib/thirdweb";
import { UserInfo, UserStatus, useUserStore } from "@/store";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
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
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  const { mutate: login } = usePost<UserInfo, { walletAddress: string }>(
    baseUrl + "/auth/login",
    {
      onSuccess: (data) => {
        setError(null);
        setIsPending(false);
        setUser(data);
      },
      onError: (error) => {
        if (error?.message.includes("401")) {
          setError(
            "Tài khoản của bạn đang chờ xác thực. Vui lòng liên hệ admin để được xác thực.",
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
      clearUser();
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Show auth layout if:
  // 1. No wallet connected
  // 2. Login is pending
  // 3. User is not approved AND not on register page
  const shouldShowAuthLayout =
    error ||
    !account?.address ||
    isPending ||
    (user?.status !== UserStatus.APPROVED && pathname !== "/register");

  return (
    <>
      {shouldShowAuthLayout ? (
        <AuthLayout
          error={error}
          isPending={isPending}
          onDisconnect={handleDisconnect}
          onClearError={clearError}
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
