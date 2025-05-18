"use client";

import CollectionCard from "@/components/nft/collection-card";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { baseUrl } from "@/lib/client";
import LoadingScreen from "@workspace/ui/components/loading-screen";
import { cn } from "@workspace/ui/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

export const dynamic = "force-dynamic";

interface Collection {
  address: string;
  name: string;
}

interface NFT {
  address: string;
  tokenId: string;
}

export default function Page() {
  const account = useActiveAccount();
  const [data, setData] = useState<{
    owner: Collection[];
    holders: NFT[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    axios
      .get(baseUrl + `/collections/${account.address}/collection`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
    setLoading(false);
    console.log(data);
  }, [account]);

  if (!account) return <LoadingScreen />;

  if (loading)
    return (
      <div className="mt-4">
        <NFTGridLoading />
      </div>
    );

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-8">
            <h1 className="mb-2 text-xl font-semibold">Collection</h1>
            <div
              className={cn(
                "grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
                data?.owner && data.owner.length > 0 && "grid",
              )}
            >
              {data?.owner && data.owner.length > 0 ? (
                (data.owner as unknown as Collection[]).map(
                  (collection: Collection) => (
                    <Link
                      href={`/sell/${collection.address}`}
                      key={collection.address}
                    >
                      <CollectionCard address={collection.address} />
                    </Link>
                  ),
                )
              ) : (
                <p className="w-full text-center text-sm font-bold">
                  No collection
                </p>
              )}
            </div>
          </div>
          <h1 className="mb-2 text-xl font-bold">Other</h1>
          <div
            className={cn(
              "grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
              data?.holders && data.holders.length > 0 && "grid",
            )}
          >
            {data?.holders && data.holders.length > 0 ? (
              data.holders.map((nft: NFT) => (
                <Link href={`/sell/${nft.address}`} key={nft.address}>
                  <CollectionCard address={nft.address} />
                </Link>
              ))
            ) : (
              <p className="w-full text-center text-sm font-bold">
                No collection
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
