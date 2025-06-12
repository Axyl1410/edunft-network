"use client";

import { baseUrl } from "@/lib/client";
import { thirdwebClient } from "@/lib/thirdweb";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import axios from "axios";
import {
  Folder,
  FolderSearch,
  Search,
  Search as SearchIcon,
  User2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { WalletConnectButton } from "../wallet/wallet-connect-button";

export default function NavAccount() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"user" | "collection">("user");
  const router = useRouter();

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      if (searchType === "user") {
        const res = await axios.get(baseUrl + "/user/search", {
          params: { query: search },
        });
        setResults(res.data);
      } else {
        const res = await axios.get(baseUrl + "/collections/search", {
          params: { query: search },
        });
        setResults(res.data);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex">
        <SidebarTrigger className="!mr-2 cursor-pointer" />
        <div
          className="hidden h-9 w-full cursor-text items-center gap-1.5 whitespace-nowrap rounded-md border bg-white px-5 pl-3.5 pr-2 text-sm backdrop-blur-lg transition-[background-color,box-shadow] duration-150 ease-out md:inline-flex lg:w-[360px] dark:bg-neutral-900"
          onClick={() => setSearchOpen(true)}
        >
          <div className="dark:text-primary flex min-w-fit items-center">
            <Search size={18} />
          </div>
          <input
            aria-invalid="false"
            placeholder="Search EduNFT"
            data-testid="NavSearch"
            className="outline-hidden pointer-events-none w-full border-0 bg-transparent text-sm [appearance:textfield] md:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            readOnly
          />
          <div className="flex min-w-fit items-center">
            <div className="flex size-6 flex-col items-center justify-center rounded border">
              <span className="text-sm leading-normal">/</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {/* <ModeToggle /> */}
        <WalletConnectButton />
        <div className="sr-only">
          <ConnectButton client={thirdwebClient} />
        </div>
      </div>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg overflow-hidden">
          <Tabs
            value={searchType}
            onValueChange={(v) => {
              setSearchType(v as "user" | "collection");
              setResults([]);
            }}
            className="w-full"
          >
            <TabsList className="flex w-full border-b bg-transparent">
              <TabsTrigger
                value="user"
                className="flex flex-1 items-center justify-center gap-2 py-3 text-base data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <Users size={18} /> User
              </TabsTrigger>
              <TabsTrigger
                value="collection"
                className="flex flex-1 items-center justify-center gap-2 py-3 text-base data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                <FolderSearch size={18} /> Collection
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 border-b p-4 pb-2">
              <div className="text-gray-400">
                <SearchIcon size={18} />
              </div>
              <Input
                placeholder={
                  searchType === "user"
                    ? "Search by username, bio, wallet address or role"
                    : "Search by collection name or address"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSearch}
                disabled={loading}
              >
                <SearchIcon size={20} />
              </Button>
            </div>
            <TabsContent value="user" className="p-4 pt-2">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg p-2"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 && search ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <User2 size={40} />
                  <div className="mt-2 text-sm">
                    No user found.
                    <br />
                    Try searching by username, bio, wallet address, or role.
                  </div>
                </div>
              ) : (
                <ScrollArea className="max-h-72">
                  <ul className="space-y-1">
                    {results.map((user) => (
                      <li
                        key={user.walletAddress}
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2 transition"
                        onClick={() => {
                          setSearchOpen(false);
                          router.push(`/user/${user.walletAddress}`);
                        }}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.profilePicture}
                            alt={user.username || user.walletAddress}
                          />
                          <AvatarFallback className="h-10 w-10">
                            {(user.username || user.walletAddress)
                              ?.slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">
                            {user.username || user.walletAddress}
                          </div>
                          <div className="truncate text-xs text-gray-500">
                            {user.role}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="collection" className="p-4 pt-2">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg p-2"
                    >
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 && search ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Folder size={40} />
                  <div className="mt-2 text-sm">
                    No collection found.
                    <br />
                    Try searching by name or address.
                  </div>
                </div>
              ) : (
                <ScrollArea className="max-h-72">
                  <ul className="space-y-1">
                    {results.map((col) => (
                      <li
                        key={col.address}
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2 transition"
                        onClick={() => {
                          setSearchOpen(false);
                          router.push(`/explore/${col.address}`);
                        }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 text-gray-500">
                          <Folder size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{col.name}</div>
                          <div className="truncate text-xs text-gray-500">
                            {col.address}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
