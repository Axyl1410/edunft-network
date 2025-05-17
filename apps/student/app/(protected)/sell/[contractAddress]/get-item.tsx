"use client";

import { NFTGridLoading } from "@/components/nft/nft-grid";
import getThirdwebContract from "@/services/get-contract";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hex, NFT as NFTType } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import {
  NFTDescription,
  NFTMedia,
  NFTProvider,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export function GetItem({ address }: { address: string }) {
  const account = useActiveAccount();
  const contract = getThirdwebContract(address);

  if (!contract) notFound();

  const {
    data: NFTs,
    error,
    isLoading,
  } = useReadContract(getOwnedNFTs, {
    contract: contract,
    owner: account?.address as Hex,
    queryOptions: {
      enabled: !!account?.address,
    },
  });

  if (!account || isLoading) return <GetItemLoading />;
  if (error) return <div>Error</div>;

  return (
    <motion.div className="my-6">
      <AnimatePresence>
        <motion.div
          className={cn(
            "grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
            NFTs && NFTs.length > 0 && "grid",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {NFTs && NFTs.length ? (
            NFTs.map((nft: NFTType) => (
              <Link key={nft.id.toString()} href={`/sell/${address}/${nft.id}`}>
                <motion.div
                  className="min-h-[400px] cursor-pointer rounded-lg border border-gray-500/50 bg-white/[.04] p-4 transition-all hover:scale-105"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
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
                </motion.div>
              </Link>
            ))
          ) : (
            <>
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  No NFTs found
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function GetItemLoading() {
  return (
    <div className="mt-6">
      <NFTGridLoading />
    </div>
  );
}
