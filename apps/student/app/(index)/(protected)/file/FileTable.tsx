import { formatBytes, shortenDate } from "@/lib/utils";
import { FileData } from "@/types";
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
  Download,
  Eye,
  FileArchive,
  FileAudio2,
  FileCode,
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
  Trash2,
} from "lucide-react";

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) return <FileIcon className="mr-2 h-4 w-4 text-gray-400" />;
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext))
    return <FileImage className="mr-2 h-4 w-4 text-blue-400" />;
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext))
    return <FileVideo className="mr-2 h-4 w-4 text-purple-400" />;
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext))
    return <FileAudio2 className="mr-2 h-4 w-4 text-pink-400" />;
  if (["pdf"].includes(ext))
    return <FileText className="mr-2 h-4 w-4 text-red-400" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <FileArchive className="mr-2 h-4 w-4 text-yellow-500" />;
  if (["txt", "md", "rtf"].includes(ext))
    return <FileText className="mr-2 h-4 w-4 text-gray-500" />;
  if (
    [
      "js",
      "ts",
      "json",
      "html",
      "css",
      "jsx",
      "tsx",
      "py",
      "java",
      "c",
      "cpp",
      "cs",
      "go",
      "rs",
      "php",
      "sh",
    ].includes(ext)
  )
    return <FileCode className="mr-2 h-4 w-4 text-green-500" />;
  return <FileIcon className="mr-2 h-4 w-4 text-gray-400" />;
}

interface FileTableProps {
  files: FileData[];
  onPreview: (file: FileData) => void;
  onDownload: (file: FileData) => void;
  onDelete: (file: FileData) => void;
  deletingFileId: string | null;
}

export function FileTable({
  files,
  onPreview,
  onDownload,
  onDelete,
  deletingFileId,
}: FileTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
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
          {files.length > 0 ? (
            files.map((file, index) => (
              <TableRow key={`${file.id}-${index}`}>
                <TableCell className="flex max-w-xs items-center truncate whitespace-nowrap px-3 py-2">
                  <div> {getFileIcon(file.name)}</div>
                  {file.name}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2">
                  {formatBytes(file.size)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2">
                  {shortenDate(file.createdAt)}
                </TableCell>
                <TableCell className="flex gap-2 whitespace-nowrap px-3 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onPreview(file);
                    }}
                  >
                    <span>
                      <Eye className="h-4 w-4" />
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDownload(file);
                    }}
                  >
                    <span>
                      <Download className="h-4 w-4" />
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => {
                      onDelete(file);
                    }}
                    disabled={deletingFileId === file.id}
                  >
                    <span>
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="no-files">
              <TableCell colSpan={4} className="text-center">
                No files found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
