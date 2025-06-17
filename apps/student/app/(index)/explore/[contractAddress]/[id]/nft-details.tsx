"use client";

import Events from "@/components/nft/events";
import { thirdwebClientPublic } from "@/lib/thirdweb";
import { formatAddress } from "@/lib/utils";
import { Attribute } from "@/types";
import { Badge } from "lucide-react";
import { motion } from "motion/react";
import { NFT } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { OwnerAvatar } from "./owner-avatar";

interface NFTDetailsProps {
  nft: NFT;
  contractAddress: string;
  ownerAvatarUrl: string | null;
}

export function NFTDetails({
  nft,
  contractAddress,
  ownerAvatarUrl,
}: NFTDetailsProps) {
  return (
    <motion.div
      className="mt-4 flex max-w-full flex-col gap-8 sm:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <MediaRenderer
          client={thirdwebClientPublic}
          src={nft.metadata.image}
          className="!h-auto !w-full rounded-lg bg-white/[.04]"
        />
      </motion.div>

      <motion.div
        className="relative top-0 w-full max-w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h1 className="mb-1 break-words text-3xl font-semibold">
          {nft.metadata.name}
        </h1>
        <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {nft.metadata.description}
        </p>
        <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          #{nft.id.toString()}
        </p>
        <motion.div
          className="mt-1 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {nft.metadata.attributes &&
            (nft.metadata.attributes as unknown as Attribute[]).map(
              (attr: Attribute, index: number) => (
                <Badge key={index}>
                  {attr.trait_type} : {attr.value}
                </Badge>
              ),
            )}
        </motion.div>
        <motion.div
          className="mt-2 flex flex-col border-t pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h1 className="text-lg">history</h1>
          <Events tokenId={nft.id} address={contractAddress} />
        </motion.div>
        <motion.div
          className="mt-2 flex flex-col border-t pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <span> Owner: </span>
          <div className="mt-1 flex items-center gap-3">
            <OwnerAvatar address={nft.owner ?? ""} avatarUrl={ownerAvatarUrl} />
            <p className="text-text font-medium dark:text-white/90">
              {nft.owner ? formatAddress(nft.owner) : "Unknown"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
