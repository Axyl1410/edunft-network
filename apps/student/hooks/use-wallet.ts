import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const account = useActiveAccount();

  // Automatically update address when account changes
  useEffect(() => {
    setAddress(account?.address ?? null);
  }, [account?.address]);

  const connect = () => {
    // In a real app, connect to wallet provider here
    setAddress(account?.address ?? "");
    console.log("Connected to wallet", account?.address);
  };

  const disconnect = () => {
    setAddress(null);
  };

  return {
    address,
    connect,
    disconnect,
    isConnected: !!address,
  };
}
