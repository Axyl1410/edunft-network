"use client";

import {
  deleteFileInDatabase,
  deleteFilePinata,
  getUserFiles,
  retrieveFile,
  saveFile,
  uploadFile,
} from "@/services/file";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { FileUpload } from "@workspace/ui/components/file-upload";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Loading from "@workspace/ui/components/loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { Progress } from "@workspace/ui/components/progress";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Download,
  List,
  Loader2,
  PanelLeftIcon,
  Terminal,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import { FileTable, FileData as FileTableData } from "./FileTable";

interface FileData {
  id: string;
  name: string;
  hash: string;
  size: number;
  createdAt: string;
  pinataId: string;
}

export default function Page() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"pagination" | "list">("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const [listCount, setListCount] = useState(15);
  const filesPerPage = 15;

  const account = useActiveAccount();
  const walletAddress = account?.address;

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<null | "success" | "error">(
    null,
  );

  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    file: FileData | null;
  }>({ open: false, file: null });

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);

  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFile, setDownloadFile] = useState<FileData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    getUserFiles(walletAddress)
      .then((data: FileData[]) => {
        setFiles(data);
      })
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const handlePreview = async (file: FileData) => {
    setPreviewDialogOpen(true);
    setPreviewLoading(true);
    setPreviewFile(file);
    setPreviewUrl(null);
    try {
      const { url } = await retrieveFile(file.hash, "private");
      if (!url) throw new Error("Cannot preview this file");
      setPreviewUrl(url);
    } catch (error) {
      setPreviewUrl(null);
      toast.error("Cannot preview this file");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async (file: FileData) => {
    setDownloadDialogOpen(true);
    setDownloadLoading(true);
    setDownloadFile(file);
    setDownloadUrl(null);
    try {
      const { url } = await retrieveFile(file.hash, "private");
      setDownloadUrl(url);
    } catch (error) {
      setDownloadUrl(null);
      toast.error("Cannot download this file");
    } finally {
      setDownloadLoading(false);
    }
  };

  let displayedFiles: FileData[] = [];
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (viewMode === "pagination") {
    const start = (currentPage - 1) * filesPerPage;
    displayedFiles = filteredFiles.slice(start, start + filesPerPage);
  } else {
    displayedFiles = filteredFiles.slice(0, listCount);
  }

  return (
    <div className="container mx-auto flex flex-col p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FILES</h1>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={viewMode === "pagination" ? "outline" : "ghost"}
            onClick={() => {
              setViewMode("pagination");
              setCurrentPage(1);
            }}
            className="cursor-pointer"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <PanelLeftIcon className="h-5 w-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Pagination view</TooltipContent>
            </Tooltip>
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "outline" : "ghost"}
            onClick={() => {
              setViewMode("list");
              setListCount(15);
            }}
            className="cursor-pointer"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <List className="h-5 w-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>List view</TooltipContent>
            </Tooltip>
          </Button>
          <Dialog
            open={open}
            onOpenChange={(v) => {
              if (!uploading) {
                setOpen(v);
                if (!v) {
                  setSelectedFile(null);
                  setUploadResult(null);
                  setUploadProgress(0);
                  setCustomFileName("");
                }
              }
            }}
          >
            <DialogTrigger asChild>
              <Button disabled={uploading} className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                <DialogDescription>
                  Select a file to upload to the system.
                </DialogDescription>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {uploadResult === "success" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-8 text-center font-semibold text-green-600"
                  >
                    Upload successful!
                  </motion.div>
                ) : uploadResult === "error" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-8 text-center font-semibold text-red-600"
                  >
                    Upload failed. Please try again.
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-4 rounded-xl border border-dashed">
                      <FileUpload onChange={setSelectedFile} />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="customFileName" className="mb-2">
                        File name (optional)
                      </Label>
                      <Input
                        id="customFileName"
                        type="text"
                        value={customFileName}
                        onChange={(e) => setCustomFileName(e.target.value)}
                        placeholder={selectedFile?.name || "Enter file name"}
                      />
                    </div>
                    {uploading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="my-4"
                      >
                        <Progress value={uploadProgress} />
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
              <DialogFooter>
                {uploadResult ? (
                  <Button
                    onClick={() => {
                      setOpen(false);
                      setUploadResult(null);
                      setSelectedFile(null);
                      setUploadProgress(0);
                      setCustomFileName("");
                    }}
                    className="cursor-pointer"
                  >
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={async () => {
                        if (!selectedFile || !walletAddress) return;
                        setUploading(true);
                        setUploadProgress(0);
                        setUploadResult(null);
                        try {
                          // take the extension of the file
                          const ext = selectedFile.name.split(".").pop();
                          let finalName =
                            customFileName.trim() || selectedFile.name;
                          if (
                            customFileName.trim() &&
                            ext &&
                            !finalName
                              .toLowerCase()
                              .endsWith("." + ext.toLowerCase())
                          ) {
                            finalName = finalName + "." + ext;
                          }
                          // 1. Upload to Pinata
                          const pinataRes = await uploadFile({
                            file: selectedFile,
                            name: finalName,
                            type: "private",
                          });
                          // pinataRes is { ...upload, pinataId } for private
                          const pinataId = (pinataRes as { pinataId: string })
                            .pinataId;
                          setUploadProgress(50);
                          // 2. Save file info to API
                          const fileData = {
                            walletAddress,
                            hash: pinataRes.cid,
                            name: finalName,
                            size: selectedFile.size,
                            mimeType: selectedFile.type,
                            network: "private" as "private" | "public",
                            pinataId,
                          };
                          await saveFile(fileData);
                          setUploadProgress(100);
                          // 3. Reload file list
                          const data = await getUserFiles(walletAddress);
                          setFiles(data);
                          setUploadResult("success");
                        } catch (error) {
                          setUploadResult("error");
                        } finally {
                          setUploading(false);
                        }
                      }}
                      disabled={!selectedFile || uploading}
                      className="cursor-pointer"
                    >
                      Upload
                    </Button>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={uploading}
                        className="cursor-pointer"
                        onClick={() => setCustomFileName("")}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mb-4 flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Search by file name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=""
        />
      </div>
      {loading ? (
        <Loading text="Loading..." />
      ) : (
        <>
          <FileTable
            files={displayedFiles as FileTableData[]}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={(file) => {
              setConfirmDelete({ open: true, file });
            }}
            deletingFileId={deletingFileId}
          />
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
              className="mt-4 cursor-pointer"
              onClick={() => setListCount((c) => c + filesPerPage)}
            >
              See more
            </Button>
          )}
          <Dialog
            open={confirmDelete.open}
            onOpenChange={(v) =>
              setConfirmDelete({ open: v, file: v ? confirmDelete.file : null })
            }
          >
            <DialogContent className="max-w-xs p-4">
              <DialogHeader>
                <DialogTitle className="text-base">Confirm delete?</DialogTitle>
              </DialogHeader>
              <div className="text-muted-foreground mb-2 text-sm">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {confirmDelete.file?.name}
                </span>
                ?
              </div>
              <DialogFooter className="flex w-full flex-col gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deletingFileId === confirmDelete.file?.id}
                  onClick={async () => {
                    if (!confirmDelete.file) return;
                    setDeletingFileId(confirmDelete.file.id);
                    setConfirmDelete({ open: false, file: null });
                    try {
                      await deleteFilePinata(
                        [confirmDelete.file.pinataId],
                        "private",
                      );
                      await deleteFileInDatabase(confirmDelete.file.hash);
                      if (walletAddress) {
                        const data = await getUserFiles(walletAddress);
                        setFiles(data);
                      }
                      toast.success("File deleted!");
                    } catch (e) {
                      toast.error("Failed to delete file");
                    } finally {
                      setDeletingFileId(null);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {deletingFileId === confirmDelete.file?.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
                <DialogClose asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingFileId === confirmDelete.file?.id}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  <p className="text-lg font-semibold">
                    Preview file:{" "}
                    <span className="text-sm text-gray-500">
                      {previewFile?.name}
                    </span>
                  </p>
                </DialogTitle>
              </DialogHeader>
              <div className="flex min-h-[300px] items-center justify-center">
                {previewLoading ? (
                  <Loading text="Loading file..." />
                ) : previewUrl ? (
                  previewFile?.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <SkeletonImage
                      src={previewUrl || ""}
                      alt={previewFile?.name}
                      className="max-h-[400px] max-w-full"
                      height={400}
                    />
                  ) : previewFile?.name.match(/\.(pdf)$/i) ? (
                    <iframe
                      src={previewUrl}
                      title={previewFile?.name}
                      className="h-[400px] w-full"
                    />
                  ) : previewFile?.name.match(/\.(mp4|webm)$/i) ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-[400px] max-w-full"
                    />
                  ) : (
                    <p>File format not supported for preview</p>
                  )
                ) : (
                  <div className="text-red-500">Cannot preview this file</div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="cursor-pointer">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={downloadDialogOpen}
            onOpenChange={setDownloadDialogOpen}
          >
            <DialogContent className="max-w-md rounded-2xl p-6 shadow-xl">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Download className="h-5 w-5 text-blue-600" />
                    Download file
                  </div>
                </DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="bg-muted/50 w-full rounded-lg p-3 text-center">
                  <span className="text-base font-medium text-gray-800">
                    {downloadFile?.name || "No file selected"}
                  </span>
                </div>
                <Alert variant="default" className="w-full">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    Download link will expire after 60 seconds.
                  </AlertDescription>
                </Alert>
                {downloadLoading ? (
                  <div className="flex w-full flex-col items-center gap-2">
                    {/* <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" /> */}
                    <Alert variant="default" className="w-full">
                      <AlertDescription>
                        <Loading text="Generating download link..." />
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : downloadUrl ? (
                  <Button
                    className="w-full cursor-pointer rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
                    onClick={async () => {
                      if (!downloadUrl) return;
                      try {
                        const response = await fetch(downloadUrl, {
                          credentials: "omit",
                        });
                        if (!response.ok) throw new Error("Network error");
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = downloadFile?.name || "download";
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        }, 100);
                      } catch (e) {
                        toast.error("Cannot download this file");
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" /> Click here to download
                  </Button>
                ) : (
                  <Alert variant="destructive" className="w-full">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Cannot download this file
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
              <DialogFooter className="flex flex-row justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadFile && handleDownload(downloadFile)}
                  disabled={downloadLoading || !downloadFile}
                  className="cursor-pointer"
                >
                  Get link again
                </Button>
                <DialogClose asChild>
                  <Button className="cursor-pointer">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
