import BackButton from "@/components/common/back-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { CollectionDetails } from "./collection-details";
import { GetEvents } from "./get-events";
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

      <Tabs defaultValue="tokens" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr,300px]">
            <CollectionDetails contractAddress={contractAddress} />
            <div className="rounded-lg border border-gray-500/50 p-4">
              <GetEvents contractAddress={contractAddress} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tokens">
          <GetItems address={contractAddress} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
