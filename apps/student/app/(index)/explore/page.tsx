"use client";

import CollectionCard from "@/components/nft/collection-card";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { baseUrl } from "@/lib/client";
import { Collection } from "@/types";
import { cn } from "@workspace/ui/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<Collection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Collection[]>(baseUrl + "/collections/owners")
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div>Error</div>;

  return (
    <div className="my-6">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NFTGridLoading />
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
              data?.length && "grid",
            )}
          >
            {data?.length ? (
              <>
                {data.map((collection: Collection, index) => (
                  <motion.div
                    key={collection.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="w-full"
                  >
                    <Link href={`/explore/${collection.address}`}>
                      <CollectionCard address={collection.address} />
                    </Link>
                  </motion.div>
                ))}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                No collections
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
