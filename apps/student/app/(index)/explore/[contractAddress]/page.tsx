import BackButton from "@/components/common/back-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { GetItems } from "./get-items";
import { Metadata } from "./metadata";
import { GetEvents } from "./get-events";

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
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="tokens">
          <GetItems address={contractAddress} />
        </TabsContent>
        <TabsContent value="events">
          <div className="mt-4 rounded-lg border border-gray-500/50 bg-white/[.04] p-4">
            <GetEvents contractAddress={contractAddress} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
