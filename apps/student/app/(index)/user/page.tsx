"use client";

import { baseUrl } from "@/lib/client";
import { Card } from "@workspace/ui/components/card";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get(baseUrl + "/user/all").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">All Users</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user) => (
          <Card
            key={user.walletAddress}
            className="flex cursor-pointer flex-col items-center gap-2 p-4 transition hover:shadow-lg"
            onClick={() => router.push(`/user/${user.walletAddress}`)}
          >
            {user.profilePicture && (
              <SkeletonImage
                src={user.profilePicture}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div className="font-semibold">
              {user.username || user.walletAddress}
            </div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
