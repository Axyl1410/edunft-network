import { Suspense } from "react";
import { GetItem, GetItemLoading } from "./get-item";
import { Metadata, MetadataLoading } from "./metadata";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;

  return (
    <div className="flex flex-col">
      <Suspense fallback={<MetadataLoading />}>
        <Metadata address={contractAddress} />
      </Suspense>
      <Suspense fallback={<GetItemLoading />}>
        <GetItem address={contractAddress} />
      </Suspense>
    </div>
  );
}
