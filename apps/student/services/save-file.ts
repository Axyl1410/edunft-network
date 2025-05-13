import { baseUrl } from "@/lib/client";
import axios from "axios";

export async function saveFile(fileData: any) {
  try {
    const response = await axios.post(baseUrl + "/file", fileData);
    return response.data;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}
