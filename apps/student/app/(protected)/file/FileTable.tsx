import { formatBytes, shortenDate } from "@/lib/utils";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Download, Eye, Trash2 } from "lucide-react";

export interface FileData {
  id: string;
  name: string;
  hash: string;
  size: number;
  createdAt: string;
  pinataId: string;
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
                <TableCell className="max-w-xs truncate whitespace-nowrap px-3 py-2">
                  {file.name}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2">
                  {formatBytes(file.size)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2">
                  {shortenDate(file.createdAt)}
                </TableCell>
                <TableCell className="flex gap-2 whitespace-nowrap px-3 py-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={() => {
                          onPreview(file);
                        }}
                      >
                        <span>
                          <Eye className="h-4 w-4" />
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Preview</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={() => {
                          onDownload(file);
                        }}
                      >
                        <span>
                          <Download className="h-4 w-4" />
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          onDelete(file);
                        }}
                        disabled={deletingFileId === file.id}
                      >
                        <span>
                          <Trash2 className="h-4 w-4" />
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
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
