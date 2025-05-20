"use client";

import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { Bot, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Chatbox from "./Chatbox";

export default function ChatbotPopup() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed bottom-2 right-2 z-50">
        {open ? (
          <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-neutral-900">
            <button
              className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
              onClick={() => setOpen(false)}
              aria-label="Đóng chat"
              type="button"
            >
              ×
            </button>
            <div className="flex flex-1 flex-col items-center justify-center">
              <Chatbox fullScreen onClose={() => setOpen(false)} />
            </div>
          </div>
        ) : (
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 focus:outline-none"
            onClick={() => setOpen(true)}
            aria-label="Mở chat"
            type="button"
          >
            <Bot className="h-7 w-7 text-white" />
          </button>
        )}
      </div>
    );
  }

  // Desktop: giữ popup nhỏ
  return (
    <motion.div
      initial={{ bottom: 8, right: 8 }}
      style={{ position: "fixed", zIndex: 9999, bottom: 8, right: 8 }}
    >
      {open ? (
        <div className="relative">
          <button
            className="absolute -right-1 -top-1 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
            onClick={() => setOpen(false)}
            aria-label="Đóng chat"
            type="button"
          >
            <X size={16} />
          </button>
          <Chatbox />
        </div>
      ) : (
        <button
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 focus:outline-none"
          onClick={() => setOpen(true)}
          aria-label="Mở chat"
          type="button"
        >
          <Bot className="h-7 w-7 text-white" />
        </button>
      )}
    </motion.div>
  );
}
