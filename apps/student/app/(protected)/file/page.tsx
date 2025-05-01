"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Upload,
  Folder,
  FileIcon,
  MoreVertical,
  Eye,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface FileData {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  isPublic: boolean;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileBlobs, setFileBlobs] = useState<{ [key: string]: Blob }>({});

  // Load files from localStorage on client side
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("files") || "[]");
    if (storedFiles.length === 0) {
      const sampleFile: FileData = {
        id: "b1od39md-e7f2-4eb8-a0d0-67c1dd1ff0a",
        name: "Sample File.pdf",
        size: "57.57 KB",
        createdAt: "4/20/2023",
        isPublic: true,
      };
      setFiles([sampleFile]);
      localStorage.setItem("files", JSON.stringify([sampleFile]));
    } else {
      setFiles(storedFiles);
    }
  }, []);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFileBlobs((prev) => ({
        ...prev,
        [file.name]: file,
      }));

      const newFile: FileData = {
        id: crypto.randomUUID(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        createdAt: new Date().toLocaleDateString("en-US"),
        isPublic: activeTab === "public",
      };

      setFiles((prev) => {
        const updatedFiles = [...prev, newFile];
        localStorage.setItem("files", JSON.stringify(updatedFiles));
        return updatedFiles;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handlePreview = (file: FileData) => {
    const blob = fileBlobs[file.name];
    if (!blob) {
      console.error("File not found");
      alert("File not found. Please re-upload the file.");
      return;
    }

    const url = URL.createObjectURL(blob);
    setPreviewTitle(file.name);
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  const handleDownload = async (file: FileData) => {
    try {
      const blob = fileBlobs[file.name];
      if (!blob) throw new Error("File not found");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || ""))
      return "image";
    if (extension === "pdf") return "pdf";
    return "unsupported";
  };

  const toggleFileStatus = (fileId: string) => {
    setFiles((prev) => {
      const newFiles = prev.map((file) =>
        file.id === fileId ? { ...file, isPublic: !file.isPublic } : file,
      );
      localStorage.setItem("files", JSON.stringify(newFiles));
      return newFiles;
    });
  };

  const filteredFiles = files.filter((file) =>
    activeTab === "public" ? file.isPublic : !file.isPublic,
  );

  return (
    <div className="flex min-h-svh flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FILES</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> File Upload
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Folder className="mr-2 h-4 w-4" /> Folder Upload
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <FileIcon className="mr-2 h-4 w-4" /> Import from IPFS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
          />
        </div>
      </div>
      <div className="mb-4 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "public"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("public")}
          >
            PUBLIC
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "private"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("private")}
          >
            PRIVATE
          </button>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>SIZE</TableHead>
              <TableHead>CREATION DATE</TableHead>
              <TableHead>FILE ID</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-gray-400" />
                  <button
                    onClick={() => handlePreview(file)}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {file.name}
                  </button>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.createdAt}</TableCell>
                <TableCell>{file.id}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleFileStatus(file.id)}
                      >
                        Make {file.isPublic ? "Private" : "Public"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePreview(file)}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:h-[90vh] sm:max-w-[90%]">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
          </DialogHeader>
          <div className="h-full min-h-[60vh] w-full">
            {previewUrl ? (
              getFileType(previewTitle) === "image" ? (
                <img
                  src={previewUrl}
                  alt={previewTitle}
                  className="mx-auto max-h-[70vh] max-w-full object-contain"
                />
              ) : getFileType(previewTitle) === "pdf" ? (
                <iframe
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(previewUrl)}`}
                  className="h-full w-full border-none"
                />
              ) : (
                <p className="text-center text-red-500">
                  Preview not supported for this file type.
                </p>
              )
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
