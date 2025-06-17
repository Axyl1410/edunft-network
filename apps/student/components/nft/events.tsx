/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { FORMASCAN_URL } from "@/constant";
import loadingAnimation from "@/public/loader.json";
import getThirdwebContract from "@/services/get-contract";
import { Button } from "@workspace/ui/components/button";
import Lottie from "lottie-react";
import { motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getContractEvents, prepareEvent } from "thirdweb";

export default function Events({
  tokenId,
  address,
}: {
  tokenId: bigint;
  address: string;
}) {
  const [transferEvents, setTransferEvents] = useState<any[] | null>(null);
  const [displayCount, setDisplayCount] = useState(5);
  const contract = getThirdwebContract(address);

  if (!contract) notFound();

  useEffect(() => {
    async function getEvents() {
      const events = await getContractEvents({
        contract,
        fromBlock: BigInt(1),
        events: [
          prepareEvent({
            signature:
              "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
            filters: { tokenId: tokenId.toString() },
          }),
        ],
      });
      setTransferEvents(events.reverse());
    }
    getEvents();
  }, [address, contract, tokenId]);

  if (transferEvents === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex h-32 items-center justify-center"
      >
        <div className="h-18 w-18">
          <Lottie animationData={loadingAnimation} loop={true} autoplay />
        </div>
      </motion.div>
    );
  }

  if (transferEvents.length === 0) {
    return (
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        No history found
      </motion.h1>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-3 flex flex-col gap-4"
    >
      <div className="divide-y">
        {transferEvents.slice(0, displayCount).map((event, index) => (
          <motion.div
            key={event.transactionHash}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex min-h-[32px] min-w-[128px] flex-1 items-center justify-between gap-1 border-white/20 py-2"
          >
            <div className="flex flex-col gap-1">
              <p className="text-text dark:text-white/60">Event</p>
              <p className="text-text font-semibold dark:text-white">
                Transfer
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text dark:text-white/60">From</p>
              <p className="text-text font-semibold dark:text-white">
                {event.args.from.slice(0, 4)}...{event.args.from.slice(-2)}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text dark:text-white/60">To</p>
              <p className="text-text font-semibold dark:text-white">
                {event.args.to.slice(0, 4)}...{event.args.to.slice(-2)}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Link
                className="h-6 w-6 p-2"
                href={`${FORMASCAN_URL}/tx/${event.transactionHash}`}
                target="_blank"
              >
                ↗
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      {displayCount < transferEvents.length && (
        <Button onClick={() => setDisplayCount(displayCount + 5)}>
          Load More
        </Button>
      )}
    </motion.div>
  );
}
