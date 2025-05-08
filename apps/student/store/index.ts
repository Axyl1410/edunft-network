import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// State types
interface UserInfo {
  walletAddress: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
  banner?: string;
  reputation?: number;
  violations?: number;
  bannedUntil?: string | null;
  role?: "student" | "teacher" | "admin";
}

interface States {
  bears: number;
  user: UserInfo | null;
}

// Action types
interface Actions {
  increase: () => void;
  decrease: () => void;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

// useBearStore
export const useBearStore = create(
  persist<States & Actions>(
    (set) => ({
      bears: 0,
      user: null,

      increase: () => set((state) => ({ bears: state.bears + 1 })),
      decrease: () => set((state) => ({ bears: state.bears - 1 })),
      setUser: (user) => set(() => ({ user })),
      clearUser: () => set(() => ({ user: null })),
    }),
    {
      name: "bearStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
