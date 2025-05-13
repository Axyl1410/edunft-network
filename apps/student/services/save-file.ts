import { baseUrl } from "@/lib/client";
import axios from "axios";

export interface SaveFilePayload {
  walletAddress: string;
  hash: string;
  name: string;
  size: number;
  mimeType: string;
  network: "public" | "private";
}

export async function saveFile(fileData: SaveFilePayload) {
  try {
    const response = await axios.post(baseUrl + "/file", fileData);
    return response.data;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}
