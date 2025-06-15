import BackButton from "@/components/common/back-button";
import { readCollectionOwner } from "@/services/read-contract";
import { EditForm } from "./edit-form";
import { OwnerCheck } from "./owner-check";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = await params;
  const owner = await readCollectionOwner(contractAddress);

  return (
    <OwnerCheck owner={owner}>
      <div className="container mx-auto max-w-2xl py-8">
        <BackButton
          to={`/explore/${contractAddress}`}
          variant="ghost"
          className="mb-6"
        >
          Back to Collection
        </BackButton>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Edit Collection</h1>
            <p className="text-muted-foreground">
              Update your collection information
            </p>
          </div>

          <EditForm address={contractAddress} />
        </div>
      </div>
    </OwnerCheck>
  );
}
