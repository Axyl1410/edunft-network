"use client";

import { formatAddress } from "@/lib/utils";
import { Blobbie } from "thirdweb/react";

interface OwnerAvatarProps {
  address: string;
  avatarUrl: string | null;
}

export function OwnerAvatar({ address, avatarUrl }: OwnerAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`Owner: ${formatAddress(address)}`}
        width={40}
        height={40}
        style={{ borderRadius: "50%", border: "1px solid #ccc" }}
        className="h-10 w-10 rounded-full border border-gray-300 dark:border-white/20"
      />
    );
  }

  return (
    <Blobbie
      address={address}
      className="h-10 w-10 rounded-full border border-gray-300 dark:border-white/20"
    />
  );
}
