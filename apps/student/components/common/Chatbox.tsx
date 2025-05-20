"use client";

import { useUserStore } from "@/store";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Bot, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Blobbie, useActiveAccount } from "thirdweb/react";

const NEBULA_API_URL = "https://nebula-api.thirdweb.com/chat";

interface ChatboxProps {
  fullScreen?: boolean;
  onClose?: () => void;
}

export default function Chatbox({ fullScreen, onClose }: ChatboxProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useActiveAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return;
    setIsLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    try {
      const res = await fetch(NEBULA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": process.env.NEXT_PUBLIC_TW_KEY!,
        },
        body: JSON.stringify({
          message: msg,
          stream: false,
          context: {
            chainIds: ["984123"],
            walletAddress: account?.address || null,
          },
        }),
      });
      if (!res.ok) {
        throw new Error(`Nebula API error: ${res.status}`);
      }
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "nebula", content: data.message },
      ]);
    } catch (e: any) {
      setError(e.message || "Lỗi không xác định");
      setMessages((prev) => [
        ...prev,
        { role: "nebula", content: "Lỗi: " + (e.message || "Không xác định") },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        fullScreen
          ? "fixed inset-0 z-50 flex h-full max-h-full w-full max-w-full flex-col rounded-none border-0 bg-white shadow-none dark:bg-neutral-900"
          : "flex h-[400px] w-[350px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
      )}
    >
      {fullScreen && onClose && (
        <button
          className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
          onClick={onClose}
          aria-label="Đóng chat"
          type="button"
        >
          <X />
        </button>
      )}
      <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-neutral-800">
        <Bot className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-semibold">Nebula Chat</span>
      </header>
      <main
        className={cn(
          "flex flex-1 flex-col gap-2 overflow-y-auto p-2",
          fullScreen && "pb-4",
        )}
      >
        {messages.length === 0 && (
          <div className="text-muted-foreground flex h-full items-center justify-center text-center text-xs">
            Hãy bắt đầu trò chuyện với Nebula!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role !== "user" && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Bot className="h-4 w-4 text-blue-500" />
              </span>
            )}
            <span
              className={cn(
                "max-w-[70%] break-words rounded-2xl px-3 py-2 text-xs",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : msg.role === "nebula"
                    ? "border border-slate-200 bg-slate-100 text-slate-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-slate-100"
                    : "border border-green-200 bg-green-50 text-green-900",
              )}
            >
              {msg.role === "nebula" ? (
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </span>
            {msg.role === "user" && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                {user?.profilePicture ? (
                  <SkeletonImage
                    src={user.profilePicture}
                    alt="Avatar"
                    width={28}
                    height={28}
                    rounded="rounded-full"
                    className="h-7 w-7 rounded-full"
                  />
                ) : (
                  <Blobbie
                    address={account?.address ?? ""}
                    className="h-7 w-7 rounded-full"
                  />
                )}
              </span>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <Loader2 className="h-4 w-4 animate-spin" />{" "}
            <Loading text="Đang trả lời..." />
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      {error && (
        <div className="mx-2 my-2 rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}
      <form
        className="flex gap-2 border-t border-slate-200 bg-white/80 p-2 dark:border-neutral-800 dark:bg-neutral-900/80"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isLoading) sendMessage(input);
          setInput("");
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className={cn(
            "max-h-16 min-h-8 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-2 py-1 text-xs dark:border-neutral-800 dark:bg-neutral-900",
            fullScreen && "min-h-12 px-4 py-3 text-base",
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!isLoading) sendMessage(input);
              setInput("");
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          className={cn(
            "h-8 w-8 self-end rounded-full",
            fullScreen && "h-12 w-12",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
              <path
                fill="currentColor"
                d="M3.293 16.707a1 1 0 0 0 1.414 0l10-10a1 1 0 0 0-1.414-1.414l-10 10a1 1 0 0 0 0 1.414Z"
              />
              <path
                fill="currentColor"
                d="M17 7a1 1 0 0 0-1-1H7a1 1 0 1 0 0 2h7v7a1 1 0 1 0 2 0V7Z"
              />
            </svg>
          )}
        </Button>
      </form>
    </div>
  );
}
