"use client";

import ReadMore from "@/components/common/read-more-text";
import { thirdwebClient } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import { Card, CardContent } from "@workspace/ui/components/card";
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
    <Card className="mt-4 flex w-full flex-col gap-4 rounded-xl border bg-white/80 p-4 shadow-sm dark:bg-neutral-900">
      <CardContent className="flex flex-row gap-6 p-0">
        <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-neutral-800">
          {metadata?.image ? (
            <MediaRenderer
              src={metadata.image}
              client={thirdwebClient}
              className="aspect-square rounded-lg object-cover object-center"
              style={{ height: "100%", width: "100%" }}
            />
          ) : (
            <Image
              src={"/default-image.jpg"}
              alt=""
              height={128}
              width={128}
              className="rounded-lg"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-3">
          <p className="truncate text-lg font-bold text-gray-900 dark:text-white">
            {metadata?.name}
          </p>
          <p className="text-sm font-semibold text-gray-500 dark:text-white/80">
            Symbol: {metadata?.symbol || "N/A"}
          </p>
          <div className="relative mt-2 max-h-32 w-full">
            <ReadMore
              text={metadata?.description}
              maxLength={80}
              className="overflow-y-auto break-words pr-2 text-sm text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetadataLoading() {
  return (
    <div className="mt-4 h-[146px] w-full animate-pulse rounded-lg bg-gray-300" />
  );
}
