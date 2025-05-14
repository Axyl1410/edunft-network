import { create } from "zustand";

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
  user: UserInfo | null;
}

// Action types
interface Actions {
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

export const useUserStore = create<States & Actions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
}));
