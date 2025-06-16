import { create } from "zustand";

export enum UserStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface UserInfo {
  walletAddress: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface States {
  user: UserInfo | null;
}

interface Actions {
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

export const useUserStore = create<States & Actions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
}));
