"use client";

import { GetItemLoading } from "@/app/(index)/(protected)/sell/[contractAddress]/get-item";
import getThirdwebContract from "@/services/get-contract";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
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

  if (error) return <div>Error</div>;

  return (
    <motion.div className="my-6">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GetItemLoading />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid-cols-2 place-items-center gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
              NFTs && NFTs.length > 0 && "grid",
            )}
          >
            {NFTs && NFTs.length ? (
              NFTs.map((nft: NFTType, index) => (
                <motion.div
                  key={nft.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="w-full"
                >
                  <Link href={`/explore/${address}/${nft.id}`}>
                    <div className="cursor-pointer rounded-lg border border-gray-500/50 bg-white/[.04] p-4 transition-all hover:border-sky-400">
                      <NFTProvider contract={contract} tokenId={nft.id}>
                        <NFTMedia className="aspect-square max-h-[200px] w-full max-w-[200px] rounded-lg object-cover object-center" />
                        <h2 className="mt-2 max-w-[200px] truncate text-lg font-semibold">
                          {nft.metadata.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          Token ID: {nft.id.toString()}
                        </p>
                        <NFTDescription className="mt-2 line-clamp-2 max-w-[200px] truncate text-sm" />
                      </NFTProvider>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No NFTs
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
