import pinataClient from "@/lib/pinata-client";

interface uploadFileProps {
  file: File;
  name?: string;
}

export async function uploadPrivateFile({ file, name }: uploadFileProps) {
  try {
    const upload = await pinataClient.upload.private
      .file(file)
      .name(name ?? file.name);
    return upload;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
