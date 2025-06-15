import { marketplace_address } from "@/constant";
import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Table } from "lucide-react";
import { getContractEvents } from "thirdweb";
import {
  buyerApprovedForListingEvent,
  cancelledListingEvent,
  currencyApprovedForListingEvent,
  newListingEvent,
  newSaleEvent,
  updatedListingEvent,
} from "thirdweb/extensions/marketplace";

export default async function Page() {
  const contract = getThirdwebContract(marketplace_address);

  const events = await getContractEvents({
    contract,
    events: [
      buyerApprovedForListingEvent({}),
      cancelledListingEvent({}),
      currencyApprovedForListingEvent({}),
      newListingEvent({}),
      newSaleEvent({}),
      updatedListingEvent({}),
    ],
  });

  return (
    <div>
      {events && events.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mint Events</h3>
            <span className="text-muted-foreground text-sm">
              {events.length} events found
            </span>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Block Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">Transfer</TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatAddress(e.address)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatAddress(e.transactionHash)}
                    </TableCell>
                    <TableCell>{e.blockNumber.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-center">
          No events found for this marketplace contract.
        </p>
      )}
    </div>
  );
}
