"use client";

import { GetItemLoading } from "@/app/(protected)/sell/[contractAddress]/get-item";
import getThirdwebContract from "@/services/get-contract";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { notFound } from "next/navigation";
import { NFT as NFTType } from "thirdweb";
import { getNFTs } from "thirdweb/extensions/erc721";
import {
  NFTDescription,
  NFTMedia,
  NFTProvider,
  useReadContract,
} from "thirdweb/react";

export function GetItems({ address }: { address: string }) {
  const contract = getThirdwebContract(address);
  if (!contract) notFound();

  const {
    data: NFTs,
    isLoading,
    error,
  } = useReadContract(getNFTs, {
    contract: contract,
    includeOwners: true,
  });

  if (isLoading) return <GetItemLoading />;
  if (error) return <div>Error</div>;

  return (
    <motion.div className="my-6">
      <AnimatePresence>
        <motion.div
          className={cn(
            "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
            NFTs && NFTs.length > 0 && "grid",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {NFTs && NFTs.length ? (
            NFTs.map((nft: NFTType) => (
              <a key={nft.id.toString()} href={`/explore/${address}/${nft.id}`}>
                <div className="min-h-[400px] cursor-pointer rounded-lg border border-gray-500/50 bg-white/[.04] p-4 transition-all hover:scale-105">
                  <NFTProvider contract={contract} tokenId={nft.id}>
                    <NFTMedia className="aspect-square w-full rounded-lg object-cover object-center" />
                    <h2 className="mt-2 text-lg font-semibold">
                      {nft.metadata.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      Token ID: {nft.id.toString()}
                    </p>
                    <NFTDescription className="mt-2 line-clamp-2 truncate text-sm" />
                  </NFTProvider>
                </div>
              </a>
            ))
          ) : (
            <div>No NFTs</div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
