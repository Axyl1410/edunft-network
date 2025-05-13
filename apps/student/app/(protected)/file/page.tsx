"use client";

import { getUserFiles } from "@/services/get-user-files";
import { retrievePrivateFile } from "@/services/retrieve-private-file";
import { saveFile } from "@/services/save-file";
import { uploadPrivateFile } from "@/services/upload-private-file";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { Download, Eye, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

interface FileData {
  id: string;
  name: string;
  hash: string;
  size: string;
  createdAt: string;
}

export default function Page() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"pagination" | "list">("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const [listCount, setListCount] = useState(30);
  const filesPerPage = 30;

  const account = useActiveAccount();
  const walletAddress = account?.address;

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    getUserFiles(walletAddress)
      .then((data: FileData[]) => setFiles(data))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  //todo fix file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !walletAddress) return;
    setUploading(true);
    try {
      // 1. Upload lên Pinata
      const pinataRes = await uploadPrivateFile({
        file: file,
        name: file.name,
      });
      // 2. Lưu thông tin file lên API
      const fileData = {
        name: file.name,
        hash: pinataRes.cid,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        createdAt: new Date().toISOString(),
        walletAddress,
      };
      await saveFile(fileData);
      // 3. Reload danh sách file
      const data = await getUserFiles(walletAddress);
      setFiles(data);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePreview = async (file: FileData) => {
    try {
      const { url } = await retrievePrivateFile(file.hash);
      window.open(url, "_blank");
    } catch (error) {
      alert("Không thể xem file này");
    }
  };

  const handleDownload = async (file: FileData) => {
    try {
      const { url } = await retrievePrivateFile(file.hash);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Không thể tải file này");
    }
  };

  let displayedFiles: FileData[] = [];
  if (viewMode === "pagination") {
    const start = (currentPage - 1) * filesPerPage;
    displayedFiles = files.slice(start, start + filesPerPage);
  } else {
    displayedFiles = files.slice(0, listCount);
  }

  return (
    <div className="container mx-auto flex min-h-svh flex-col p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FILES</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "pagination" ? "outline" : "ghost"}
            onClick={() => {
              setViewMode("pagination");
              setCurrentPage(1);
            }}
          >
            Pagination
          </Button>
          <Button
            variant={viewMode === "list" ? "outline" : "ghost"}
            onClick={() => {
              setViewMode("list");
              setListCount(30);
            }}
          >
            List
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
        </div>
      </div>
      {loading ? (
        <Loading text="Loading..." />
      ) : (
        <>
          <div className="rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {displayedFiles.map((file) => (
                  <tr key={file.id}>
                    <td className="whitespace-nowrap px-6 py-4">{file.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{file.size}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(file.createdAt).toLocaleString()}
                    </td>
                    <td className="flex gap-2 whitespace-nowrap px-6 py-4">
                      <Button size="sm" onClick={() => handlePreview(file)}>
                        <Eye className="mr-1 h-4 w-4" /> Preview
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(file)}>
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {viewMode === "pagination" && files.length > filesPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-disabled={currentPage === 1}
                />
                {Array.from({
                  length: Math.ceil(files.length / filesPerPage),
                }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      isActive={currentPage === idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(files.length / filesPerPage), p + 1),
                    )
                  }
                  aria-disabled={
                    currentPage === Math.ceil(files.length / filesPerPage)
                  }
                />
              </PaginationContent>
            </Pagination>
          )}
          {viewMode === "list" && listCount < files.length && (
            <Button
              className="mt-4"
              onClick={() => setListCount((c) => c + filesPerPage)}
            >
              Xem thêm
            </Button>
          )}
        </>
      )}
    </div>
  );
}
