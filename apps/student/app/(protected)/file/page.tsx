"use client";

import { formatBytes } from "@/lib/utils";
import {
  deleteFileInDatabase,
  deleteFilePinata,
  getUserFiles,
  retrieveFile,
  saveFile,
  uploadFile,
} from "@/services/file";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Download,
  Eye,
  List,
  Loader2,
  PanelLeftIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<null | "success" | "error">(
    null,
  );

  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    file: FileData | null;
  }>({ open: false, file: null });

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    getUserFiles(walletAddress)
      .then((data: FileData[]) => setFiles(data))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const handlePreview = async (file: FileData) => {
    try {
      const { url } = await retrieveFile(file.hash, "private");
      window.open(url, "_blank");
    } catch (error) {
      alert("Không thể xem file này");
    }
  };

  const handleDownload = async (file: FileData) => {
    try {
      const { url } = await retrieveFile(file.hash, "private");
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
            size="icon"
            variant={viewMode === "pagination" ? "outline" : "ghost"}
            onClick={() => {
              setViewMode("pagination");
              setCurrentPage(1);
            }}
            title="Pagination view"
            className="cursor-pointer"
          >
            <PanelLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "outline" : "ghost"}
            onClick={() => {
              setViewMode("list");
              setListCount(15);
            }}
            title="List view"
            className="cursor-pointer"
          >
            <List className="h-5 w-5" />
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
                  Chọn file để upload lên hệ thống.
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
                    Upload thành công!
                  </motion.div>
                ) : uploadResult === "error" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-8 text-center font-semibold text-red-600"
                  >
                    Upload thất bại. Vui lòng thử lại.
                  </motion.div>
                ) : (
                  <>
                    <FileUpload onChange={setSelectedFile} />
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
                    }}
                  >
                    Đóng
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
                          // 1. Upload lên Pinata
                          const pinataRes = await uploadFile({
                            file: selectedFile,
                            name: selectedFile.name,
                            type: "private",
                          });
                          // pinataRes is { ...upload, pinataId } for private
                          const pinataId = (pinataRes as { pinataId: string })
                            .pinataId;
                          setUploadProgress(50);
                          // 2. Lưu thông tin file lên API
                          const fileData = {
                            walletAddress,
                            hash: pinataRes.cid,
                            name: selectedFile.name,
                            size: selectedFile.size,
                            mimeType: selectedFile.type,
                            network: "private" as "private" | "public",
                            pinataId,
                          };
                          await saveFile(fileData);
                          setUploadProgress(100);
                          // 3. Reload danh sách file
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
                    >
                      Upload
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={uploading}>
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
      {loading ? (
        <Loading text="Loading..." />
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Size
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Created At
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="whitespace-nowrap px-3 py-2">
                      {file.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-2">
                      {formatBytes(file.size)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-2">
                      {new Date(file.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="flex gap-2 whitespace-nowrap px-3 py-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handlePreview(file)}
                        title="Xem"
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownload(file)}
                        title="Tải về"
                        className="cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Dialog
                        open={
                          confirmDelete.open &&
                          confirmDelete.file?.id === file.id
                        }
                        onOpenChange={(v) =>
                          setConfirmDelete({ open: v, file: v ? file : null })
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer text-red-500"
                            onClick={() =>
                              setConfirmDelete({ open: true, file })
                            }
                            disabled={deletingFileId === file.id}
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs p-4">
                          <DialogHeader>
                            <DialogTitle className="text-base">
                              Xác nhận xóa?
                            </DialogTitle>
                          </DialogHeader>
                          <div className="text-muted-foreground mb-2 text-sm">
                            Bạn chắc chắn muốn xóa{" "}
                            <span className="font-semibold">{file.name}</span>?
                          </div>
                          <DialogFooter>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full"
                              disabled={deletingFileId === file.id}
                              onClick={async () => {
                                setDeletingFileId(file.id);
                                setConfirmDelete({ open: false, file: null });
                                try {
                                  await deleteFilePinata(
                                    [file.pinataId],
                                    "private",
                                  );
                                  await deleteFileInDatabase(file.hash);
                                  if (walletAddress) {
                                    const data =
                                      await getUserFiles(walletAddress);
                                    setFiles(data);
                                  }
                                  toast.success("Đã xóa file!");
                                } catch (e) {
                                  toast.error("Xóa file thất bại");
                                } finally {
                                  setDeletingFileId(null);
                                }
                              }}
                            >
                              {deletingFileId === file.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Xóa"
                              )}
                            </Button>
                            <DialogClose asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                disabled={deletingFileId === file.id}
                              >
                                Hủy
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
