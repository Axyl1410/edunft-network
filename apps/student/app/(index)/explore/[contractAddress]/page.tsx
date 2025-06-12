import BackButton from "@/components/common/back-button";
import { GetItems } from "./get-items";
import { Metadata } from "./metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;

  return (
    <div className="pb-px">
      <div className="mb-4">
        <BackButton to="/explore" variant="ghost" className="mb-2">
          Back to Explore
        </BackButton>
      </div>
      <Metadata address={contractAddress} />
      <GetItems address={contractAddress} />
    </div>
  );
}
