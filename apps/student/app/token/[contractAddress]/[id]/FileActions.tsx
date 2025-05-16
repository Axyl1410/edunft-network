"use client";
import { retrieveFile } from "@/services/file";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

export function FileActions({
  externalUrl,
  owner,
}: {
  externalUrl: string;
  owner: string;
}) {
  const account = useActiveAccount();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  if (!account || !externalUrl) return null;
  if (account.address.toLowerCase() !== owner.toLowerCase()) return null;

  return (
    <div className="mt-4 flex gap-2">
      <Button variant="outline" onClick={() => setPreviewOpen(true)}>
        Xem file đính kèm
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          setDownloadLoading(true);
          try {
            const { url } = await retrieveFile(externalUrl, "private");
            const response = await fetch(url, { credentials: "omit" });
            if (!response.ok) throw new Error("Network error");
            const blob = await response.blob();
            const link = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = link;
            a.download = "attachment";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              window.URL.revokeObjectURL(link);
              document.body.removeChild(a);
            }, 100);
          } catch (e) {
            alert("Không thể tải file");
          } finally {
            setDownloadLoading(false);
          }
        }}
        disabled={downloadLoading}
      >
        {downloadLoading ? "Đang tải..." : "Tải file đính kèm"}
      </Button>
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
            <button
              className="absolute right-2 top-2 text-xl"
              onClick={() => setPreviewOpen(false)}
            >
              <X />
            </button>
            <div className="mb-2 font-semibold">Xem file đính kèm</div>
            {externalUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={externalUrl}
                alt="attachment"
                className="mx-auto max-h-96"
              />
            ) : externalUrl.match(/\.(pdf)$/i) ? (
              <iframe
                src={externalUrl}
                title="attachment"
                className="h-96 w-full"
              />
            ) : externalUrl.match(/\.(mp4|webm)$/i) ? (
              <video src={externalUrl} controls className="mx-auto max-h-96" />
            ) : (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Mở file
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
