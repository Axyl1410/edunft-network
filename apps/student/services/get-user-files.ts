import { baseUrl } from "@/lib/client";
import axios from "axios";

export async function getUserFiles(walletAddress: string) {
  try {
    const response = await axios.get(baseUrl + `/file/user/${walletAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user files:", error);
    throw error;
  }
}
