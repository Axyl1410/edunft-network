"use client";

import CollectionCard from "@/components/nft/collection-card";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { baseUrl } from "@/lib/client";
import { Collection } from "@/types";
import { cn } from "@workspace/ui/lib/utils";
import axios from "axios";
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
      {loading ? (
        <NFTGridLoading />
      ) : (
        <div
          className={cn(
            "grid-cols-2 place-items-center gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
            data?.length && "grid",
          )}
        >
          {data?.length ? (
            <>
              {data.map((collection: Collection) => (
                <Link
                  key={collection.address}
                  href={`/explore/${collection.address}`}
                  className="w-full"
                >
                  <CollectionCard address={collection.address} />
                </Link>
              ))}
            </>
          ) : (
            <div>No collections</div>
          )}
        </div>
      )}
    </div>
  );
}
