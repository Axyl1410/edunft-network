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
      <Metadata address={contractAddress} />
      <GetItems address={contractAddress} />
    </div>
  );
}
