"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  ClipboardPaste,
  Copy,
  Download,
  Eye,
  FileIcon,
  Folder,
  Grid,
  List,
  MoreVertical,
  Move,
  Plus,
  Scissors,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FileData {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  isPublic: boolean;
  type: "file" | "folder";
  parentId?: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileBlobs, setFileBlobs] = useState<{ [key: string]: Blob }>({});
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(
    undefined,
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [clipboard, setClipboard] = useState<{
    fileId: string;
    action: "copy" | "cut";
  } | null>(null);

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
        type: "file",
      };
      setFiles([sampleFile]);
      localStorage.setItem("files", JSON.stringify([sampleFile]));
    } else {
      setFiles(storedFiles);
    }
  }, []);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Handle keyboard shortcuts for copy, cut, and paste
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === "c" && selectedFileId) {
          setClipboard({ fileId: selectedFileId, action: "copy" });
        } else if (event.key === "x" && selectedFileId) {
          setClipboard({ fileId: selectedFileId, action: "cut" });
        } else if (event.key === "v" && clipboard) {
          handlePaste(currentFolderId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFileId, clipboard, currentFolderId]);

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
        type: "file",
        parentId: currentFolderId,
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
    if (file.type === "folder") {
      setCurrentFolderId(file.id);
      return;
    }
    const blob = fileBlobs[file.name];
    if (!blob) {
      console.error("File not found");
      alert("File not found. Please re-upload the file.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const fileType = getFileType(file.name);

    if (fileType === "image") {
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else if (fileType === "pdf") {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${file.name}</title>
          <style>
            body { margin: 0; }
            iframe { width: 100%; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${url}"></iframe>
        </body>
        </html>
      `;
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      window.open(htmlUrl, "_blank");
      setTimeout(() => {
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(htmlUrl);
      }, 1000);
    } else if (fileType === "txt") {
      blob.text().then((text) => {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${file.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${file.name}</h1>
            <div>${text}</div>
          </body>
          </html>
        `;
        const textBlob = new Blob([htmlContent], { type: "text/html" });
        const textUrl = URL.createObjectURL(textBlob);
        window.open(textUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(textUrl), 1000);
      });
      URL.revokeObjectURL(url);
    } else if (fileType === "docx" || fileType === "xlsx") {
      alert(
        `Preview not supported for ${fileType.toUpperCase()} files. Please download the file to view it.`,
      );
      URL.revokeObjectURL(url);
    } else {
      alert("Preview not supported for this file type.");
      URL.revokeObjectURL(url);
    }
  };

  const handleDownload = async (file: FileData) => {
    if (file.type === "folder") return;
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
    if (extension === "docx" || extension === "doc") return "docx";
    if (extension === "xlsx" || extension === "xls") return "xlsx";
    if (extension === "txt") return "txt";
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

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: FileData = {
      id: crypto.randomUUID(),
      name: newFolderName.trim(),
      size: "-",
      createdAt: new Date().toLocaleDateString("en-US"),
      isPublic: activeTab === "public",
      type: "folder",
      parentId: currentFolderId,
    };
    setFiles((prev) => {
      const updatedFiles = [...prev, newFolder];
      localStorage.setItem("files", JSON.stringify(updatedFiles));
      return updatedFiles;
    });
    setNewFolderName("");
    setCreateFolderOpen(false);
    setContextMenu(null);
  };

  const handleMoveFile = (fileId: string, targetFolderId?: string) => {
    setFiles((prev) => {
      const newFiles = prev.map((file) =>
        file.id === fileId ? { ...file, parentId: targetFolderId } : file,
      );
      localStorage.setItem("files", JSON.stringify(newFiles));
      return newFiles;
    });
  };

  const handleDeleteFile = (fileId: string) => {
    const hasChildren = files.some((file) => file.parentId === fileId);
    if (hasChildren) {
      alert("Cannot delete a folder that contains files or folders.");
      return;
    }

    setFiles((prev) => {
      const newFiles = prev.filter((file) => file.id !== fileId);
      localStorage.setItem("files", JSON.stringify(newFiles));
      return newFiles;
    });
    setContextMenu(null);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleDragStart = (event: React.DragEvent, fileId: string) => {
    event.dataTransfer.setData("fileId", fileId);
  };

  const handleDrop = (event: React.DragEvent, targetFolderId?: string) => {
    event.preventDefault();
    const fileId = event.dataTransfer.getData("fileId");
    if (fileId && fileId !== targetFolderId) {
      handleMoveFile(fileId, targetFolderId);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const getUniqueName = (name: string, targetFolderId?: string) => {
    let newName = name;
    let counter = 0;
    const baseName = name.includes(".")
      ? name.split(".").slice(0, -1).join(".")
      : name;
    const extension = name.includes(".") ? `.${name.split(".").pop()}` : "";

    while (
      files.some(
        (file) =>
          file.name === newName &&
          file.parentId === targetFolderId &&
          file.id !== clipboard?.fileId,
      )
    ) {
      counter++;
      newName = `${baseName} (Copy ${counter})${extension}`;
    }
    return newName;
  };

  const handleCopy = (fileId: string) => {
    setClipboard({ fileId, action: "copy" });
    setSelectedFileId(fileId);
  };

  const handleCut = (fileId: string) => {
    setClipboard({ fileId, action: "cut" });
    setSelectedFileId(fileId);
  };

  const handlePaste = (targetFolderId?: string) => {
    if (!clipboard) return;

    const sourceFile = files.find((file) => file.id === clipboard.fileId);
    if (!sourceFile) {
      alert("Source file not found.");
      setClipboard(null);
      return;
    }

    if (clipboard.action === "copy") {
      const newFile: FileData = {
        ...sourceFile,
        id: crypto.randomUUID(),
        name: getUniqueName(sourceFile.name, targetFolderId),
        parentId: targetFolderId,
        createdAt: new Date().toLocaleDateString("en-US"),
      };
      setFiles((prev) => {
        const updatedFiles = [...prev, newFile];
        localStorage.setItem("files", JSON.stringify(updatedFiles));
        return updatedFiles;
      });
      if (sourceFile.type === "file" && fileBlobs[sourceFile.name]) {
        const blobContent = fileBlobs[sourceFile.name] as Blob; // Add type assertion
        setFileBlobs((prev) => ({
          ...prev,
          [newFile.name]: blobContent,
        }));
      }
    } else if (clipboard.action === "cut") {
      const newName = getUniqueName(sourceFile.name, targetFolderId);
      setFiles((prev) => {
        const updatedFiles = prev.map((file) =>
          file.id === clipboard.fileId
            ? { ...file, parentId: targetFolderId, name: newName }
            : file,
        );
        localStorage.setItem("files", JSON.stringify(updatedFiles));
        return updatedFiles;
      });

      if (sourceFile.name !== newName && fileBlobs[sourceFile.name]) {
        setFileBlobs((prev) => {
          const blobToMove = prev[sourceFile.name];
          if (blobToMove) {
            // Ensure blob exists in the current state 'prev'
            const updatedBlobs = { ...prev };
            delete updatedBlobs[sourceFile.name]; // Remove old entry
            updatedBlobs[newName] = blobToMove; // Add new entry
            return updatedBlobs;
          }
          return prev; // If blob is not in prev, return prev state to avoid error
        });
      }
      setClipboard(null);
    }
    setContextMenu(null);
  };

  const filteredFiles = files
    .filter((file) => (activeTab === "public" ? file.isPublic : !file.isPublic))
    .filter((file) => file.parentId === currentFolderId);

  const getBreadcrumb = () => {
    const crumbs: { id: string; name: string }[] = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = files.find((file) => file.id === currentId);
      if (folder) {
        crumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  };

  return (
    <div
      className="flex min-h-svh flex-col p-6"
      onContextMenu={handleContextMenu}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">FILES</h1>
          <div className="text-sm text-gray-500">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setCurrentFolderId(undefined)}
            >
              Root
            </span>
            {getBreadcrumb().map((crumb) => (
              <span key={crumb.id}>
                {" / "}
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => setCurrentFolderId(crumb.id)}
                >
                  {crumb.name}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid className="h-5 w-5" />
          </Button>
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
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => setCreateFolderOpen(true)}
              >
                <Folder className="mr-2 h-4 w-4" /> Create Folder
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
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
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
      <div>
        {viewMode === "list" ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
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
                  <TableRow
                    key={file.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, file.id)}
                    onDragOver={
                      file.type === "folder" ? handleDragOver : undefined
                    }
                    onDrop={
                      file.type === "folder"
                        ? (e) => handleDrop(e, file.id)
                        : undefined
                    }
                    onClick={() => setSelectedFileId(file.id)}
                    className={selectedFileId === file.id ? "bg-gray-100" : ""}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {file.type === "folder" ? (
                        <Folder className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <FileIcon className="h-4 w-4 text-gray-400" />
                      )}
                      <span
                        className={
                          file.type === "folder" ? "cursor-pointer" : ""
                        }
                        onClick={() => handlePreview(file)}
                      >
                        {file.name}
                      </span>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedFileId(file.id);
                              setMoveDialogOpen(true);
                            }}
                          >
                            <Move className="mr-2 h-4 w-4" /> Move
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(file.id)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCut(file.id)}>
                            <Scissors className="mr-2 h-4 w-4" /> Cut
                          </DropdownMenuItem>
                          {file.type === "folder" && clipboard && (
                            <DropdownMenuItem
                              onClick={() => handlePaste(file.id)}
                            >
                              <ClipboardPaste className="mr-2 h-4 w-4" /> Paste
                            </DropdownMenuItem>
                          )}
                          {file.type !== "folder" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handlePreview(file)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownload(file)}
                              >
                                <Download className="mr-2 h-4 w-4" /> Download
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex flex-col gap-2 rounded-lg border bg-white p-4 shadow ${
                  selectedFileId === file.id ? "border-blue-500" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, file.id)}
                onDragOver={file.type === "folder" ? handleDragOver : undefined}
                onDrop={
                  file.type === "folder"
                    ? (e) => handleDrop(e, file.id)
                    : undefined
                }
                onClick={() => setSelectedFileId(file.id)}
              >
                <div className="flex items-center gap-2">
                  {file.type === "folder" ? (
                    <Folder className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <FileIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <span
                    className={file.type === "folder" ? "cursor-pointer" : ""}
                    onClick={() => handlePreview(file)}
                  >
                    {file.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{file.size}</div>
                <div className="text-xs text-gray-500">{file.createdAt}</div>
                <div className="truncate text-xs text-gray-400">{file.id}</div>
                <div className="mt-2 flex gap-2">
                  {file.type !== "folder" && (
                    <>
                      <Button size="sm" onClick={() => handlePreview(file)}>
                        <Eye className="mr-1 h-4 w-4" /> Preview
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(file)}>
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </>
                  )}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedFileId(file.id);
                          setMoveDialogOpen(true);
                        }}
                      >
                        <Move className="mr-2 h-4 w-4" /> Move
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(file.id)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCut(file.id)}>
                        <Scissors className="mr-2 h-4 w-4" /> Cut
                      </DropdownMenuItem>
                      {file.type === "folder" && clipboard && (
                        <DropdownMenuItem onClick={() => handlePaste(file.id)}>
                          <ClipboardPaste className="mr-2 h-4 w-4" /> Paste
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {contextMenu && (
        <div
          className="fixed z-50 rounded border bg-white shadow-lg"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> New File
          </div>
          <div
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
            onClick={() => setCreateFolderOpen(true)}
          >
            <Folder className="mr-2 h-4 w-4" /> New Folder
          </div>
          {clipboard && (
            <div
              className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
              onClick={() => handlePaste(currentFolderId)}
            >
              <ClipboardPaste className="mr-2 h-4 w-4" /> Paste
            </div>
          )}
        </div>
      )}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full rounded border p-2"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                if (selectedFileId) handleMoveFile(selectedFileId, undefined);
                setMoveDialogOpen(false);
                setSelectedFileId(null);
              }}
            >
              <Folder className="mr-2 h-4 w-4" /> Root
            </Button>
            {files
              .filter(
                (file) => file.type === "folder" && file.id !== selectedFileId,
              )
              .map((folder) => (
                <Button
                  key={folder.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    if (selectedFileId)
                      handleMoveFile(selectedFileId, folder.id);
                    setMoveDialogOpen(false);
                    setSelectedFileId(null);
                  }}
                >
                  <Folder className="mr-2 h-4 w-4" /> {folder.name}
                </Button>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setMoveDialogOpen(false);
                setSelectedFileId(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
