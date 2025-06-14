import { baseUrl } from "@/lib/client";
import axios from "axios";

export async function getOwnerAvatarData(address: string) {
  try {
    const response = await axios.get(`${baseUrl}/user/${address}/avatar`);
    if (response.status === 200) {
      const data = response.data;
      if (data.avatar) {
        return data.avatar;
      }
    }
  } catch (error) {
    console.error("Failed to fetch user avatar:", error);
  }
  return null;
}
