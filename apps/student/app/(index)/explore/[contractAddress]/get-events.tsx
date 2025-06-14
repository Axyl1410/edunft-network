"use client";

import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import Loading from "@workspace/ui/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const preparedEvent = prepareEvent({
  signature:
    "event TokensMinted(address indexed mintedTo, uint256 indexed tokenIdMinted, string uri)",
});

export function GetEvents({ contractAddress }: { contractAddress: string }) {
  const contract = getThirdwebContract(contractAddress);
  const {
    data: event,
    isLoading,
    isError,
  } = useContractEvents({
    contract,
    events: [preparedEvent],
  });

  if (isLoading) return <Loading text="Loading events..." />;
  if (isError) return <div>Error loading events</div>;

  return (
    <>
      {event && event.length > 0 ? (
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
              {event.map((e, index) => (
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
      ) : (
        <p>No events found for this contract.</p>
      )}
    </>
  );
}
