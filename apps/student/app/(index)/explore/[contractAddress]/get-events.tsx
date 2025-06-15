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
import { AnimatePresence, motion } from "motion/react";
import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const preparedEvent = prepareEvent({
  signature:
    "event TokensMinted(address indexed mintedTo, uint256 indexed tokenIdMinted, string uri)",
});

export function GetEvents({ contractAddress }: { contractAddress: string }) {
  const contract = getThirdwebContract(contractAddress);
  const {
    data: events,
    isLoading,
    isError,
  } = useContractEvents({
    contract,
    events: [preparedEvent],
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-32 items-center justify-center"
      >
        <Loading text="Loading events..." />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-red-500"
      >
        Error loading events
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground text-center"
          >
            No events found for this contract.
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
