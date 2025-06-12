"use client";

import { useUserStore } from "@/store";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import { SkeletonImage } from "@workspace/ui/components/skeleton-image";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Bot, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Blobbie, useActiveAccount } from "thirdweb/react";

export default function ChatbotPage() {
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msg,
          context: {
            walletAddress: account?.address || null,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          `Lỗi: ${errorData.error || `Máy chủ trả về mã lỗi ${res.status}`}`,
        );
        throw new Error(errorData.error || `Server error: ${res.status}`);
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
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex h-screen w-full max-w-3xl flex-1 flex-col">
        <header className="flex flex-col items-center gap-1 py-6">
          <h1 className="text-xl font-bold tracking-tight">Nebula Chat</h1>
          {/* <div className="mt-2 flex gap-2">
            <select
              id="chainId"
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              className="focus:ring-primary rounded-md border bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 dark:bg-neutral-900"
            >
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="Index"
              className="h-8 w-24 px-2 py-1 text-xs"
            />
          </div> */}
        </header>
        <main className="flex flex-1 flex-col">
          <div
            className={cn(
              "flex-1 space-y-3 rounded-2xl border-slate-200 bg-white/80 px-2 py-4 dark:border-neutral-800 dark:bg-neutral-900/80",
              messages.length === 0 ? "justify-center" : "overflow-y-auto",
            )}
          >
            {messages.length === 0 && (
              <div className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
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
                    "max-w-[70%] break-words rounded-2xl px-3 py-2 text-sm",
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
          </div>
          {error && (
            <div className="my-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}
        </main>
        <form
          className="sticky bottom-0 left-0 right-0 z-10 flex gap-2 border-slate-200 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80"
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
            className="max-h-24 min-h-9 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
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
            className="h-10 w-10 self-end rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
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
    </div>
  );
}
