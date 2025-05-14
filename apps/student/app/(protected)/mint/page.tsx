"use client";

import { FileUpload } from "@workspace/ui/components/file-upload";
import { useEffect, useState } from "react";

interface Collection {
  address: string;
  name: string;
}

export default function MintPage() {
  const [files, setFiles] = useState<File>();
  const handleFileUpload = (file: File | null) => {
    if (file) {
      setFiles(file);
    }
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="mx-auto min-h-96 w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
