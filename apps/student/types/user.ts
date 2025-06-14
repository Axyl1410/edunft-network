export interface UserProfile {
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
