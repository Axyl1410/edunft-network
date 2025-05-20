"use client";

import CollectionCard from "@/components/nft/collection-card";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { baseUrl } from "@/lib/client";
import { cn } from "@workspace/ui/lib/utils";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Collection {
  address: string;
  name: string;
}

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
            "grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
            data?.length && "grid",
          )}
        >
          {data?.length ? (
            <>
              {data.map((collection: Collection) => (
                <Link
                  key={collection.address}
                  href={`/explore/${collection.address}`}
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
