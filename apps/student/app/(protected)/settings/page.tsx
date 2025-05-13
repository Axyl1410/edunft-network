"use client";

import { formatAddress } from "@/lib/utils";
import { useUserStore } from "@/store";
import { Card } from "@workspace/ui/components/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const account = useActiveAccount();
  const { theme, setTheme } = useTheme();

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <div className="flex h-full items-center justify-center px-2 py-4">
      <Card className="w-full max-w-lg rounded-2xl border border-gray-200 p-0 shadow-xl dark:border-gray-800">
        <div className="bg-background/80 dark:bg-secondary/20 rounded-t-2xl border-b px-8 py-6">
          <h1 className="mb-1 text-2xl font-bold">Cài đặt</h1>
          <p className="text-muted-foreground text-sm">
            Tuỳ chỉnh trải nghiệm và thông tin cá nhân của bạn.
          </p>
        </div>
        <div className="space-y-8 px-8 py-6">
          {/* Theme Section */}
          <section>
            <div className="mb-1 flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">Giao diện</span>
            </div>
            <p className="text-muted-foreground mb-3 text-xs">
              Chọn chế độ sáng hoặc tối cho giao diện.
            </p>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="flex flex-row gap-4"
              aria-label="Theme mode"
            >
              <label
                htmlFor="r1"
                className="bg-background hover:bg-accent dark:bg-secondary/20 flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 transition-colors dark:border-gray-600"
              >
                <RadioGroupItem value="light" id="r1" />
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </label>
              <label
                htmlFor="r2"
                className="bg-background hover:bg-accent dark:bg-secondary/20 flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 transition-colors dark:border-gray-600"
              >
                <RadioGroupItem value="dark" id="r2" />
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </label>
            </RadioGroup>
          </section>

          {/* Account Section */}
          <section>
            <div className="mb-1 font-medium">Thông tin tài khoản</div>
            <p className="text-muted-foreground mb-3 text-xs">
              Thông tin cơ bản về tài khoản của bạn.
            </p>
            <div className="bg-muted/50 flex flex-col gap-1 rounded-xl border p-4">
              <div className="text-base font-semibold">
                {user?.username || "Chưa đặt tên"}
              </div>
              <div className="text-muted-foreground text-xs">
                {formatAddress(account?.address || "")}
              </div>
              <div className="mt-1 text-xs italic text-gray-400">
                Vai trò:{" "}
                {user?.role === "teacher"
                  ? "Giáo viên"
                  : user?.role === "admin"
                    ? "Quản trị viên"
                    : "Học sinh"}
              </div>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}
