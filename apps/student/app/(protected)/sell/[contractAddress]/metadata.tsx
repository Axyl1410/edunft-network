"use client";

import ReadMore from "@/components/common/read-more-text";
import { thirdwebClient } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

export function Metadata({ address }: { address: string }) {
  const contract = getThirdwebContract(address);

  if (!contract) notFound();

  const {
    data: metadata,
    isLoading,
    error,
  } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  if (isLoading) return <MetadataLoading />;
  if (error) return <div>Error</div>;

  return (
    <div className="mt-4 flex w-full flex-col gap-4 rounded-lg border border-gray-500/50 bg-white/[.04] p-4 sm:flex-row">
      <div className="align-center h-32 w-32 flex-shrink-0 items-center rounded-lg">
        {metadata?.image ? (
          <MediaRenderer
            src={metadata.image}
            client={thirdwebClient}
            className="aspect-square object-cover object-center"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gray-200">
            <Image src={"/default-image.jpg"} alt="" height={300} width={300} />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-3">
        <p className="truncate text-lg text-black dark:text-white">
          {metadata?.name}
        </p>
        <p className="text-text text-sm font-semibold dark:text-white/80">
          Symbol: {metadata?.symbol || "N/A"}
        </p>
        <div className="relative mt-2 max-h-32 w-full">
          <ReadMore
            text={metadata?.description}
            maxLength={50}
            className="overflow-y-auto break-words pr-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export function MetadataLoading() {
  return (
    <div className="mt-4 h-[146px] w-full animate-pulse rounded-lg bg-gray-300" />
  );
}
