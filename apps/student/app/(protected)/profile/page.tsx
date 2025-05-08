"use client";

import { formatAddress } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

export default function ProfilePage() {
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

  useEffect(() => {
    if (account?.address) {
      axios
        .get("http://localhost:8080/user/" + account?.address)
        .then((response) => {
          setForm({
            username: response.data.username || "",
            bio: response.data.bio || "",
            profilePicture: response.data.profilePicture || "",
            banner: response.data.banner || "",
            role: response.data.role || "student",
          });
        })
        .catch((error) => {
          toast.error("Failed to fetch profile data", {
            description: error.message,
          });
        });
    }
  }, [account?.address]);

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
      toast.success("Profile updated!");
      setEdit(false);
      const response = await axios.get(
        "http://localhost:8080/user/" + account.address,
      );
      setForm({
        username: response.data.username || "",
        bio: response.data.bio || "",
        profilePicture: response.data.profilePicture || "",
        banner: response.data.banner || "",
        role: response.data.role || "student",
      });
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

  return (
    <div className="bg-background flex min-h-svh items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Banner + Avatar */}
        <div className="relative">
          <div className="h-40 w-full overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-200 to-indigo-200">
            {form.banner && (
              <img
                src={form.banner}
                alt="Banner"
                className="h-40 w-full object-cover"
              />
            )}
          </div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            {form.profilePicture ? (
              <img
                src={form.profilePicture}
                alt="Avatar"
                className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-lg"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-4xl font-bold shadow-lg">
                {form.username?.[0] || "?"}
              </div>
            )}
          </div>
        </div>
        <Card className="mt-16 rounded-t-none px-6 pb-6 pt-8 shadow-lg">
          <CardContent className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-bold">{form.username}</div>
              <div className="text-muted-foreground break-all text-xs">
                {formatAddress(account.address)}
              </div>
              <div className="bg-accent text-accent-foreground mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium">
                {form.role === "teacher" ? "Giáo viên" : "Học sinh"}
              </div>
            </div>
            {edit ? (
              <div className="mt-6 flex w-full max-w-md flex-col gap-4">
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
              </div>
            ) : (
              <div className="text-muted-foreground mt-6 w-full max-w-md whitespace-pre-line text-center text-base">
                {form.bio || (
                  <span className="text-sm italic text-gray-400">
                    Chưa có giới thiệu.
                  </span>
                )}
              </div>
            )}
            <div className="mt-8 flex gap-2">
              {edit ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setEdit(false)}
                    disabled={loading}
                  >
                    Huỷ
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEdit(true)}>Chỉnh sửa hồ sơ</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
