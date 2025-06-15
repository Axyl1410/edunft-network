"use client";

import { Button } from "@workspace/ui/components/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CollectionDetailsProps {
  contractAddress: string;
}

export function CollectionDetails({ contractAddress }: CollectionDetailsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="rounded-lg border border-gray-500/50 p-4">
      <h3 className="mb-4 text-lg font-semibold">Collection Details</h3>
      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm">Contract Address</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm">{contractAddress}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total Events</p>
          <p className="font-semibold">-</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Last Event</p>
          <p className="font-semibold">-</p>
        </div>
      </div>
    </div>
  );
}
