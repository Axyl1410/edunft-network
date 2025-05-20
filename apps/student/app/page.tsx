"use client";

import CollectionCard from "@/components/nft/collection-card";
import { baseUrl } from "@/lib/client";
import { FORMA_SKETCHPAD, thirdwebClient } from "@/lib/thirdweb";
import { useUserStore } from "@/store";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Loading from "@workspace/ui/components/loading";
import { Skeleton } from "@workspace/ui/components/skeleton";
import axios from "axios";
import { Coins } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AccountBalance,
  AccountProvider,
  Blobbie,
  useActiveAccount,
} from "thirdweb/react";
import type { Event } from "./events/types";

const questions = [
  {
    id: "1",
    title: "Best practices for state management in React?",
    tokens: 100,
    votes: 12,
    tags: ["react", "state-management"],
  },
  {
    id: "2",
    title: "How to implement authentication in React?",
    tokens: 75,
    votes: 8,
    tags: ["react", "authentication"],
  },
];

const maxToken = Math.max(...questions.map((q) => q.tokens));

const collections = [
  {
    address: "0x123...abc",
    name: "EduNFT Bears",
  },
  {
    address: "0x456...def",
    name: "Student Artworks",
  },
];

export default function HomePage() {
  const user = useUserStore((state) => state.user);
  const account = useActiveAccount();

  // Mock badge/tokens nếu chưa có trong user
  const badge = user?.role;

  // Fetch real events
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  useEffect(() => {
    setLoadingEvents(true);
    setErrorEvents(null);
    axios
      .get(`${baseUrl}/events`)
      .then((res) => {
        // Chỉ lấy event sắp diễn ra hoặc đang diễn ra, lấy tối đa 3 event
        const mapped = res.data
          .map((item: any) => ({
            ...item,
            id: item._id || item.id,
            date: item.date ? new Date(item.date) : undefined,
            deadline: item.deadline ? new Date(item.deadline) : undefined,
          }))
          .filter((e: any) => e.status === "upcoming" || e.status === "ongoing")
          .slice(0, 3);
        setEvents(mapped);
      })
      .catch(() => setErrorEvents("Không thể tải sự kiện nổi bật."))
      .finally(() => setLoadingEvents(false));
  }, []);

  const [collections, setCollections] = useState<
    { address: string; name: string }[]
  >([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [errorCollections, setErrorCollections] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) return;
    setLoadingCollections(true);
    setErrorCollections(null);
    axios
      .get(baseUrl + `/collections/${account.address}/collection`)
      .then((res) => {
        setCollections(res.data.owner?.slice(0, 4) || []);
      })
      .catch(() => setErrorCollections("Không thể tải bộ sưu tập NFT của bạn."))
      .finally(() => setLoadingCollections(false));
  }, [account?.address]);

  return (
    <div className="mx-auto w-full max-w-6xl py-4 sm:py-8 md:px-6">
      {/* Welcome & Profile */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          {!account?.address ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center sm:h-12 sm:w-12">
                <Blobbie size={48} address="0x000" className="rounded-full" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <CardTitle className="text-lg font-bold">
                  Welcome to EduNFT!
                </CardTitle>
                <div className="mt-1 text-sm text-gray-500">
                  Please connect your wallet to get started.
                </div>
              </div>
              <div className="mt-4 sm:ml-auto sm:mt-0">
                <Button size="sm" variant="outline" className="cursor-pointer">
                  Connect Wallet
                </Button>
              </div>
            </>
          ) : user && user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username || user.walletAddress || ""}
              className="h-16 w-16 rounded-full border border-gray-200 object-cover sm:h-12 sm:w-12"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center sm:h-12 sm:w-12">
              <Blobbie
                size={48}
                address={user?.walletAddress || "0x000"}
                className="rounded-full"
              />
            </div>
          )}
          {account?.address && (
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-lg font-bold">
                {user ? (
                  `Welcome back, ${user.username || user.walletAddress || ""}!`
                ) : (
                  <Skeleton className="h-6 w-32" />
                )}
              </CardTitle>
              <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary">{badge}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <AccountProvider
                    address={`${account?.address}`}
                    client={thirdwebClient}
                  >
                    <motion.div layout>
                      <AccountBalance
                        chain={FORMA_SKETCHPAD}
                        loadingComponent={<Loading />}
                        fallbackComponent={<div>Failed to load</div>}
                      />
                    </motion.div>
                  </AccountProvider>
                  <p>tokens</p>
                </div>
              </div>
            </div>
          )}
          {account?.address && (
            <div className="mt-4 sm:ml-auto sm:mt-0">
              <Link href="/profile">
                <Button size="sm" variant="outline" className="cursor-pointer">
                  View Profile
                </Button>
              </Link>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/question">
          <Button className="w-full cursor-pointer" variant="default">
            Ask a Question
          </Button>
        </Link>
        <Link href="/events">
          <Button className="w-full cursor-pointer" variant="default">
            Register Event
          </Button>
        </Link>
        <Link href="/buy">
          <Button className="w-full cursor-pointer" variant="default">
            Buy NFT
          </Button>
        </Link>
      </div>

      {/* Featured Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base sm:text-lg">
              Featured Events
            </CardTitle>
            <Link href="/events">
              <Button size="sm" variant="ghost" className="cursor-pointer">
                See all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingEvents ? (
                <div className="py-6 text-center">
                  <Loading text="Đang tải sự kiện..." />
                </div>
              ) : errorEvents ? (
                <div className="py-6 text-center text-red-500">
                  {errorEvents}
                </div>
              ) : events.length === 0 ? (
                <div className="py-6 text-center text-gray-500">
                  Chưa có sự kiện nổi bật.
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="hover:bg-muted flex flex-col items-start gap-2 rounded p-2 transition sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold sm:text-base">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.date ? event.date.toLocaleDateString() : ""} •{" "}
                        {typeof event.location === "object" &&
                        event.location !== null
                          ? event.location.address
                          : event.location}
                      </div>
                    </div>
                    <Badge
                      variant={
                        event.status === "upcoming" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base sm:text-lg">
              Latest Questions
            </CardTitle>
            <Link href="/question">
              <Button size="sm" variant="ghost" className="cursor-pointer">
                See all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="hover:bg-muted flex flex-col items-start gap-2 rounded p-2 transition sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold sm:text-base">
                      {q.title}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {q.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row items-end gap-1 sm:flex-col">
                    <span
                      className={`ml-2 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${q.tokens === maxToken ? "border border-orange-300 bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"} `}
                    >
                      <Coins size={16} className="mr-1" />
                      {q.tokens} tokens
                      {q.tokens === maxToken && (
                        <span
                          role="img"
                          aria-label="hot"
                          className="ml-1 text-orange-500"
                        >
                          🔥
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {q.votes} votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NFT Collections */}
      <div className="mt-6 sm:mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg">
              Featured NFT Collections
            </CardTitle>
            <Link href="/buy">
              <Button size="sm" variant="ghost" className="cursor-pointer">
                See all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
              {!account?.address ? (
                <div className="col-span-full text-center text-gray-500">
                  Vui lòng đăng nhập để xem NFT của bạn.
                </div>
              ) : loadingCollections ? (
                <div className="col-span-full">
                  <Loading text="Đang tải NFT..." />
                </div>
              ) : errorCollections ? (
                <div className="col-span-full text-red-500">
                  {errorCollections}
                </div>
              ) : collections.length === 0 ? (
                <div className="col-span-full text-gray-500">
                  Bạn chưa sở hữu bộ sưu tập NFT nào.
                </div>
              ) : (
                collections.map((col) => (
                  <Link
                    key={col.address}
                    href={`/buy/${col.address}`}
                    className="block"
                  >
                    <CollectionCard address={col.address} name={col.name} />
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
