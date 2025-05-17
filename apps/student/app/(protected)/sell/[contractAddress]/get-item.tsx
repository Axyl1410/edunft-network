"use client";

import { NFTGridLoading } from "@/components/nft/nft-grid";
import getThirdwebContract from "@/services/get-contract";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hex, NFT as NFTType } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import {
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
            "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
            NFTs && NFTs.length > 0 && "",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {NFTs && NFTs.length ? (
            NFTs.map((nft: NFTType) => (
              <Link key={nft.id.toString()} href={`/sell/${address}/${nft.id}`}>
                <Card className="group flex h-full min-h-[320px] w-full flex-col items-center justify-between rounded-xl border bg-white/80 p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:bg-neutral-900 dark:hover:border-blue-500">
                  <CardContent className="flex w-full flex-col items-center gap-2 p-0">
                    <NFTProvider contract={contract} tokenId={nft.id}>
                      <NFTMedia className="aspect-square w-full rounded-lg bg-gray-100 object-cover object-center dark:bg-neutral-800" />
                      <h2 className="mt-2 w-full truncate text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white">
                        {nft.metadata.name}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        Token ID: {nft.id.toString()}
                      </p>
                    </NFTProvider>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex h-full w-full items-center justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-200">
                No NFTs found
              </p>
            </div>
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
