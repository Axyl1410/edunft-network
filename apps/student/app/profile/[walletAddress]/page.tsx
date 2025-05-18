"use client";

import { baseUrl } from "@/lib/client";
import { formatAddress } from "@/lib/utils";
import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Ban, ShieldOff, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Blobbie } from "thirdweb/react";

interface UserProfile {
  walletAddress: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
  banner?: string;
  reputation?: number;
  violations?: number;
  bannedUntil?: string | null;
  role?: string;
}

export default function PublicProfilePage() {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    fetch(`${baseUrl}/user/${walletAddress}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError("User not found or error fetching profile."))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-2">
      <div className="container mx-auto w-full">
        <Card className="mt-4 overflow-hidden rounded-2xl p-0 shadow-lg dark:border-gray-900 dark:bg-gray-950">
          <div className="flex flex-col md:flex-row">
            {/* Left: Banner + Avatar */}
            <div className="flex flex-col items-center bg-gradient-to-b from-blue-200 to-indigo-200 p-0 md:w-1/3 md:px-4 md:py-8 dark:from-gray-900 dark:to-gray-800">
              <div className="relative h-32 w-full md:h-40">
                {loading ? (
                  <Skeleton className="h-full w-full md:rounded-xl" />
                ) : user?.banner ? (
                  <SkeletonImage
                    src={user.banner}
                    alt="Banner"
                    height={"100%"}
                    className="h-full w-full rounded-none object-cover object-center md:rounded-xl md:shadow-md"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 md:rounded-xl" />
                )}
                <div className="absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-4 md:top-24 md:-translate-y-0 md:translate-x-0">
                  {loading ? (
                    <Skeleton className="h-24 w-24 rounded-full border-4 border-white shadow-lg dark:border-gray-900" />
                  ) : user?.profilePicture ? (
                    <SkeletonImage
                      src={user.profilePicture}
                      alt="Avatar"
                      width={96}
                      height={96}
                      rounded="rounded-full"
                      className="h-24 w-24 border-4 border-white bg-white shadow-lg dark:border-gray-900 dark:bg-gray-900"
                    />
                  ) : user ? (
                    <Blobbie
                      address={user.walletAddress}
                      className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-lg dark:border-gray-900 dark:bg-gray-900"
                    />
                  ) : null}
                </div>
              </div>
              <div className="mt-8 hidden md:block" />
            </div>
            {/* Right: Info + Stats */}
            <div className="flex flex-1 flex-col items-center px-4 py-8 md:items-start md:px-8 md:py-8">
              {loading ? (
                <div className="flex w-full flex-col md:flex-row md:items-center md:gap-4">
                  <div className="flex-1 text-center md:text-left">
                    <Skeleton className="mx-auto mb-1 h-6 w-32 md:mx-0" />
                    <Skeleton className="mx-auto mb-1 h-4 w-24 md:mx-0" />
                    <Skeleton className="mx-auto mt-1 h-5 w-20 rounded-full md:mx-0" />
                  </div>
                  <div className="mt-4 flex w-full justify-center md:mt-0 md:w-auto md:justify-end">
                    <div className="bg-muted/60 grid w-full grid-cols-3 gap-4 rounded-xl p-4 shadow-sm md:w-auto dark:bg-gray-900/60">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <Skeleton className="mb-1 h-5 w-5 rounded-full" />
                          <Skeleton className="h-5 w-8" />
                          <Skeleton className="mt-1 h-3 w-12" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="w-full py-8 text-center font-semibold text-red-500">
                  {error}
                </div>
              ) : user ? (
                <>
                  <div className="flex w-full flex-col md:flex-row md:items-center md:gap-4">
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-1 text-2xl font-bold tracking-tight">
                        {user.username || formatAddress(user.walletAddress)}
                      </div>
                      <div className="text-muted-foreground mb-1 break-all text-xs">
                        {formatAddress(user.walletAddress)}
                      </div>
                      <div className="bg-accent text-accent-foreground mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium">
                        {user.role === "teacher"
                          ? "Teacher"
                          : user.role === "admin"
                            ? "Admin"
                            : "Student"}
                      </div>
                    </div>
                    <div className="mt-4 flex w-full justify-center md:mt-0 md:w-auto md:justify-end">
                      <div className="bg-muted/60 grid w-full grid-cols-3 gap-4 rounded-xl p-4 shadow-sm md:w-auto dark:bg-gray-900/60">
                        <div className="flex flex-col items-center">
                          <Star
                            className="mb-1 text-yellow-400 dark:text-yellow-300"
                            size={20}
                          />
                          <span className="text-lg font-semibold">
                            {user.reputation ?? 100}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Reputation
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <ShieldOff
                            className="mb-1 text-rose-400 dark:text-rose-300"
                            size={20}
                          />
                          <span className="text-lg font-semibold">
                            {user.violations ?? 0}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Violations
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Ban
                            className="mb-1 text-gray-400 dark:text-gray-500"
                            size={20}
                          />
                          <span className="text-lg font-semibold">
                            {user.bannedUntil
                              ? new Date(user.bannedUntil).toLocaleDateString()
                              : "-"}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Banned Until
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Always show bio/description */}
                  <div className="text-muted-foreground mx-auto mt-6 w-full max-w-md whitespace-pre-line text-center text-base md:mx-0 md:text-left">
                    {user.bio || (
                      <span className="text-sm italic text-gray-400">
                        No bio yet.
                      </span>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
