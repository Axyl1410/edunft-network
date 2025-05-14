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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Download,
  Eye,
  List,
  Loader2,
  PanelLeftIcon,
  Terminal,
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

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);

  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFile, setDownloadFile] = useState<FileData | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    getUserFiles(walletAddress)
      .then((data: FileData[]) => setFiles(data))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const handlePreview = async (file: FileData) => {
    setPreviewDialogOpen(true);
    setPreviewLoading(true);
    setPreviewFile(file);
    setPreviewUrl(null);
    try {
      const { url } = await retrieveFile(file.hash, "private");
      setPreviewUrl(url);
    } catch (error) {
      setPreviewUrl(null);
      toast.error("Không thể xem file này");
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
      toast.error("Không thể tải file này");
    } finally {
      setDownloadLoading(false);
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
                    <div className="rounded-xl border border-dashed">
                      <FileUpload onChange={setSelectedFile} />
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
                        className="cursor-pointer"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Eye className="h-4 w-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Xem</TooltipContent>
                        </Tooltip>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownload(file)}
                        className="cursor-pointer"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Download className="h-4 w-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Tải về</TooltipContent>
                        </Tooltip>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer text-red-500"
                        onClick={() => setConfirmDelete({ open: true, file })}
                        disabled={deletingFileId === file.id}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Trash2 className="h-4 w-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Xóa</TooltipContent>
                        </Tooltip>
                      </Button>
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
          <Dialog
            open={confirmDelete.open}
            onOpenChange={(v) =>
              setConfirmDelete({ open: v, file: v ? confirmDelete.file : null })
            }
          >
            <DialogContent className="max-w-xs p-4">
              <DialogHeader>
                <DialogTitle className="text-base">Xác nhận xóa?</DialogTitle>
              </DialogHeader>
              <div className="text-muted-foreground mb-2 text-sm">
                Bạn chắc chắn muốn xóa{" "}
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
                      toast.success("Đã xóa file!");
                    } catch (e) {
                      toast.error("Xóa file thất bại");
                    } finally {
                      setDeletingFileId(null);
                    }
                  }}
                >
                  {deletingFileId === confirmDelete.file?.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Xóa"
                  )}
                </Button>
                <DialogClose asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingFileId === confirmDelete.file?.id}
                  >
                    Hủy
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
                    Xem file:{" "}
                    <span className="text-sm text-gray-500">
                      {previewFile?.name}
                    </span>
                  </p>
                </DialogTitle>
              </DialogHeader>
              <div className="flex min-h-[300px] items-center justify-center">
                {previewLoading ? (
                  <Loading text="Đang tải file..." />
                ) : previewUrl ? (
                  previewFile?.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={previewUrl}
                      alt={previewFile?.name}
                      className="max-h-[400px] max-w-full"
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
                    <p>Định dạng file không hỗ trợ xem trước</p>
                  )
                ) : (
                  <div className="text-red-500">Không thể xem file này</div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Đóng</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={downloadDialogOpen}
            onOpenChange={setDownloadDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  <p className="text-lg font-semibold">
                    Tải file:{" "}
                    <span className="text-sm text-gray-500">
                      {downloadFile?.name}
                    </span>
                  </p>
                </DialogTitle>
              </DialogHeader>
              <div className="flex min-h-[100px] flex-col items-center justify-center gap-4">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    Download link sẽ hết hạn sau 30 giây
                  </AlertDescription>
                </Alert>
                {downloadLoading ? (
                  <Loading text="Đang khởi tạo link tải..." />
                ) : downloadUrl ? (
                  <Button
                    className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
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
                        toast.error("Không thể tải file này");
                      }
                    }}
                  >
                    Bấm vào đây để tải về
                  </Button>
                ) : (
                  <div className="text-red-500">Không thể tải file này</div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => downloadFile && handleDownload(downloadFile)}
                  disabled={downloadLoading || !downloadFile}
                >
                  Lấy lại link
                </Button>
                <DialogClose asChild>
                  <Button>Đóng</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
