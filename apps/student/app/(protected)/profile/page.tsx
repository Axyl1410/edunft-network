"use client";

import usePersistStore from "@/hooks/use-persist-store";
import { formatAddress } from "@/lib/utils";
import { useBearStore } from "@/store";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import axios from "axios";
import { Ban, ShieldOff, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Blobbie, useActiveAccount } from "thirdweb/react";

export default function ProfilePage() {
  const user = usePersistStore(useBearStore, (state) => state.user);
  const setUser = useBearStore((state) => state.setUser);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    bio: "",
    profilePicture: "",
    banner: "",
    role: "student",
  });
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Populate form for editing only
  useEffect(() => {
    if (edit && user && account?.address === user.walletAddress) {
      setForm({
        username: user.username || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        banner: user.banner || "",
        role: user.role || "student",
      });
    }
  }, [edit, user, account?.address]);

  // Fetch user if not in zustand
  useEffect(() => {
    if (!user && account?.address) {
      axios
        .get("http://localhost:8080/user/" + account.address)
        .then((response) => {
          setUser({
            walletAddress: account.address,
            username: response.data.username || "",
            bio: response.data.bio || "",
            profilePicture: response.data.profilePicture || "",
            banner: response.data.banner || "",
            reputation: response.data.reputation || 100,
            violations: response.data.violations || 0,
            bannedUntil: response.data.bannedUntil || null,
            role: response.data.role || "student",
          });
        })
        .catch((error) => {
          toast.error("Failed to fetch profile data", {
            description: error.message,
          });
        });
    }
  }, [user, account?.address, setUser]);

  // Sync form state with zustand user info when dialog opens
  useEffect(() => {
    if (editOpen && user) {
      setForm({
        username: user.username || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        banner: user.banner || "",
        role: user.role || "student",
      });
    }
  }, [editOpen, user]);

  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!account?.address) return;
    setLoading(true);
    try {
      await axios.put("http://localhost:8080/user/" + account.address, {
        ...form,
      });
      setEdit(false);
      const response = await axios.get(
        "http://localhost:8080/user/" + account.address,
      );
      setUser({
        walletAddress: account.address,
        username: response.data.username || "",
        bio: response.data.bio || "",
        profilePicture: response.data.profilePicture || "",
        banner: response.data.banner || "",
        reputation: response.data.reputation || 100,
        violations: response.data.violations || 0,
        bannedUntil: response.data.bannedUntil || null,
        role: response.data.role || "student",
      });
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      toast.error("Failed to update profile", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!account?.address) {
    return (
      <div className="text-muted-foreground flex min-h-svh items-center justify-center">
        Vui lòng kết nối ví để xem profile.
      </div>
    );
  }

  if (!user || user.walletAddress !== account.address) {
    return (
      <div className="text-muted-foreground flex min-h-svh items-center justify-center">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="bg-background flex items-center justify-center px-2">
      <div className="container mx-auto w-full">
        <Card className="mt-4 overflow-hidden rounded-2xl p-0 shadow-lg dark:border-gray-900 dark:bg-gray-950">
          <div className="flex flex-col md:flex-row">
            {/* Left: Banner + Avatar (vertical on mobile, left on desktop) */}
            <div className="flex flex-col items-center bg-gradient-to-b from-blue-200 to-indigo-200 p-0 md:w-1/3 md:px-4 md:py-8 dark:from-gray-900 dark:to-gray-800">
              <div className="relative h-32 w-full md:h-40">
                {user.banner && (
                  <SkeletonImage
                    src={user.banner}
                    alt="Banner"
                    height={"100%"}
                    className="h-full w-full rounded-none object-cover object-center md:rounded-xl md:shadow-md"
                  />
                )}
                <div className="absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-4 md:top-24 md:-translate-y-0 md:translate-x-0">
                  {user.profilePicture ? (
                    <SkeletonImage
                      src={user.profilePicture}
                      alt="Avatar"
                      width={96}
                      height={96}
                      rounded="rounded-full"
                      className="h-24 w-24 border-4 border-white bg-white shadow-lg dark:border-gray-900 dark:bg-gray-900"
                    />
                  ) : (
                    <Blobbie
                      address={user.walletAddress}
                      className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-lg dark:border-gray-900 dark:bg-gray-900"
                    />
                  )}
                </div>
              </div>
              <div className="mt-8 hidden md:block" />
            </div>
            {/* Right: Info + Stats */}
            <div className="flex flex-1 flex-col items-center px-4 py-8 md:items-start md:px-8 md:py-8">
              <div className="flex w-full flex-col md:flex-row md:items-center md:gap-4">
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-1 text-2xl font-bold tracking-tight">
                    {user.username}
                  </div>
                  <div className="text-muted-foreground mb-1 break-all text-xs">
                    {formatAddress(user.walletAddress)}
                  </div>
                  <div className="bg-accent text-accent-foreground mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium">
                    {user.role === "teacher"
                      ? "Giáo viên"
                      : user.role === "admin"
                        ? "Quản trị viên"
                        : "Học sinh"}
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
                    Chưa có giới thiệu.
                  </span>
                )}
              </div>
              <div className="mt-8 flex w-full justify-center gap-2 md:w-auto md:justify-start">
                <Button
                  onClick={() => setEditOpen(true)}
                  variant="ghost"
                  className="border-primary/30 hover:bg-primary/10 border"
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                    <DialogDescription>
                      Cập nhật thông tin cá nhân của bạn.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await handleSave();
                      setEditOpen(false);
                    }}
                    className="mt-2 flex flex-col gap-4"
                  >
                    <div>
                      <Label htmlFor="Username">Tên hiển thị</Label>
                      <Input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="Bio">Giới thiệu</Label>
                      <Input
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ProfilePicture">Ảnh đại diện (URL)</Label>
                      <Input
                        name="profilePicture"
                        value={form.profilePicture}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner">Ảnh bìa (URL)</Label>
                      <Input
                        name="banner"
                        value={form.banner}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Vai trò</Label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border px-2 py-1"
                      >
                        <option value="student">Học sinh</option>
                        <option value="teacher">Giáo viên</option>
                      </select>
                    </div>
                    <DialogFooter className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditOpen(false)}
                        disabled={loading}
                      >
                        Huỷ
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
