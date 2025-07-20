"use client";

import { FORMA_SKETCHPAD } from "@/constant";
import { thirdwebClient } from "@/lib/thirdweb";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import Loading from "@workspace/ui/components/loading";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AccountBalance,
  AccountProvider,
  useActiveAccount,
} from "thirdweb/react";

// Mock similar questions
const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "Best practices for state management in React?",
    url: "/question/1",
  },
  {
    id: "2",
    title: "How to implement authentication in React?",
    url: "/question/2",
  },
  {
    id: "3",
    title: "How to optimize performance in React applications?",
    url: "/question/3",
  },
];

const AVAILABLE_TAGS = [
  "QuảnTrịKinhDoanh",
  "KinhDoanhQuốcTế",
  "Marketing",
  "ThươngMạiĐiệnTử",
  "TàiChínhNgânHàng",
  "KếToán",
  "Logistics",
  "CôngNghệTàiChính",
  "CôngNghệThôngTin",
  "KỹThuậtPhầnMềm",
  "MạngMáyTính",
  "TruyềnThôngĐaPhươngTiện",
  "CôngNghệTruyềnThông",
  "ĐồHọaKỹThuậtSố",
  "NgônNgữAnh",
  "ĐôngPhươngHọc",
  "Luật",
  "LuậtKinhTế",
  "QuanHệCôngChúng",
  "DuLịchLữHành",
  "QuảnTrịKháchSạn",
  "DịchVụDuLịch",
  "NguyênLýKếToán",
  "MarketingCănBản",
  "QuảnTrịChiếnLược",
  "LậpTrìnhCơBản",
  "PhápLuậtĐạiCương",
  "GiaoTiếpKinhDoanh",
  "TiếngAnhChuyênNgành",
  "QuảnLýDựÁn",
  "TruyềnThôngSố",
  "PhânTíchDữLiệu",
  "LậpTrìnhHướngĐốiTượng",
  "LậpTrìnhTrựcQuan",
  "KỹNăngMềm",
  "CSDL",
  "QuảnTrịHọc",
  "HQTCSDL",
  "PCLVCN",
  "TriếtHọc",
  "KhoaHọcMáyTính",
];

interface AskQuestionFormProps {
  onClose?: () => void;
  onSubmit?: (data: {
    title: string;
    description: string;
    tags: string[];
    tokens: number;
    tokenExpiry: string | null;
  }) => void;
}

export default function FormAskQuestion({
  onClose,
  onSubmit,
}: AskQuestionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tokens, setTokens] = useState(0);
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);
  const [similarQuestions, setSimilarQuestions] = useState<
    typeof MOCK_QUESTIONS
  >([]);
  const [step, setStep] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const account = useActiveAccount();
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's token balance
  useEffect(() => {
    if (account?.address) {
      // Get balance from AccountBalance component
      const balanceElement = document.getElementById("user-token-balance");
      if (balanceElement) {
        const balance = parseInt(balanceElement.textContent || "0");
        setUserBalance(balance);
      }
    }
  }, [account?.address]);

  // Step-by-step guidance
  const steps = [
    "Enter your question details and select tags.",
    "Set a token reward and (optionally) an expiry date.",
    "Review and submit your question.",
  ];

  // Check for similar questions as user types the title
  useEffect(() => {
    if (title.length > 5) {
      const lower = title.toLowerCase();
      setSimilarQuestions(
        MOCK_QUESTIONS.filter((q) => q.title.toLowerCase().includes(lower)),
      );
    } else {
      setSimilarQuestions([]);
    }
  }, [title]);

  // Function to remove diacritics and convert to lowercase
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filter tags based on input
  const filteredTags = AVAILABLE_TAGS.filter((tag) =>
    normalizeString(tag).includes(normalizeString(tagInput)),
  );

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    setOpen(false);
  };

  const handleNextStep = () => {
    if (step === 1 && !title) {
      toast.warning("Please enter a title.");
      return;
    }
    if (step === 2 && !description) {
      toast.warning("Please enter a description.");
      return;
    }
    if (step === 3 && tags.length === 0) {
      toast.warning("Please add at least one tag.");
      return;
    }
    if (step === 4 && tokens > userBalance) {
      toast.warning("You do not have enough tokens.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokens > userBalance) {
      toast.warning("You do not have enough tokens.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare question data
      const questionData = {
        id: Date.now().toString(), // Temporary ID for local storage
        title,
        description,
        tokens,
        author: {
          walletAddress: account?.address,
          name: "Anonymous",
          avatar: "https://via.placeholder.com/40",
        },
        tags,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      // Store in localStorage for now
      const existingQuestions = JSON.parse(
        localStorage.getItem("questions") || "[]",
      );
      localStorage.setItem(
        "questions",
        JSON.stringify([...existingQuestions, questionData]),
      );

      toast.success("Question submitted successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setTokens(0);
      setTokenExpiry(null);
      setStep(1);

      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to submit question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl">
        <Card className="p-6">
          {/* Hidden balance element */}
          <div id="user-token-balance" className="hidden">
            <AccountProvider
              address={`${account?.address}`}
              client={thirdwebClient}
            >
              <motion.div layout>
                <AccountBalance
                  chain={FORMA_SKETCHPAD}
                  loadingComponent={<Loading />}
                  fallbackComponent={<div>Failed to load</div>}
                />
              </motion.div>
            </AccountProvider>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700"
            aria-label="Close"
            type="button"
          >
            ×
          </button>
          <h2 className="mb-2 text-2xl font-bold">Ask a public question</h2>
          <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-700">
            <strong>
              Step {step} of {steps.length}:
            </strong>{" "}
            {steps[step - 1]}
          </div>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="mb-1 block font-semibold">Title</label>
                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g. How to manage state in React?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold">
                    Description
                  </label>
                  <div className="rounded border">
                    <Editor
                      apiKey={process.env.NEXt_PUBLIC_POST}
                      value={description}
                      onEditorChange={(content) => setDescription(content)}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",

                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }",
                        placeholder:
                          "Describe your question in detail. What did you try? What did you expect?",
                        language: "vi",
                        language_url: "/langs/vi.js",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-semibold">Tags</label>
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="w-full"
                      />
                      {tagInput && (
                        <div className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                          {filteredTags.length > 0 ? (
                            filteredTags.map((tag) => (
                              <button
                                key={tag}
                                className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() => handleAddTag(tag)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    tags.includes(tag)
                                      ? "text-blue-500"
                                      : "text-transparent"
                                  }`}
                                />
                                {tag}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No tags found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Tags */}
                    <div className="mt-2">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected Tags:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                          >
                            {tag}
                            <button
                              type="button"
                              className="ml-2 text-blue-500 hover:text-blue-700"
                              onClick={() =>
                                setTags(tags.filter((t) => t !== tag))
                              }
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Available Tags Container - Collapsible */}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        {open ? "Hide available tags" : "Show available tags"}
                        <ChevronsUpDown className="ml-1 h-4 w-4" />
                      </button>

                      {open && (
                        <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border bg-gray-50 p-3">
                          <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handleAddTag(tag)}
                                className={`rounded px-2 py-1 text-sm ${
                                  tags.includes(tag)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {similarQuestions.length > 0 && (
                  <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 p-2">
                    <div className="mb-1 font-semibold text-yellow-700">
                      Similar questions:
                    </div>
                    <ul className="list-disc pl-5 text-sm">
                      {similarQuestions.map((q) => (
                        <li key={q.id}>
                          <a
                            href={q.url}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {q.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {step === 2 && (
              <div className="mb-4">
                <label className="mb-1 block font-semibold">Token Reward</label>
                <input
                  type="number"
                  className="w-full rounded border px-3 py-2"
                  placeholder="Number of tokens to reward"
                  value={tokens}
                  min={0}
                  max={userBalance}
                  onChange={(e) => setTokens(Number(e.target.value))}
                  required
                />
                <div className="mt-1 text-xs text-gray-500">
                  Your balance: {userBalance} tokens
                </div>
                <div className="mt-2">
                  <label className="mb-1 block font-semibold">
                    Token Expiry (optional)
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded border px-3 py-2"
                    value={tokenExpiry ?? ""}
                    onChange={(e) => setTokenExpiry(e.target.value || null)}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Leave blank for no expiry.
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="mb-4">
                <div className="mb-4 text-lg font-semibold text-gray-800">
                  Review Your Question
                </div>
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                  {/* Header */}
                  <div className="border-b bg-gray-50 p-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <span className="flex items-center">
                        <img
                          src="https://via.placeholder.com/40"
                          alt="Author"
                          className="mr-2 h-6 w-6 rounded-full"
                        />
                        Anonymous
                      </span>
                      <span className="mx-2">•</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>

                  {/* Tags */}
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">
                          Token Reward:
                        </span>
                        <span className="ml-2 font-bold text-blue-600">
                          {tokens} tokens
                        </span>
                      </div>
                      {tokenExpiry && (
                        <div className="text-sm text-gray-600">
                          Expires: {new Date(tokenExpiry).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Similar Questions */}
                {similarQuestions.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 font-semibold text-gray-800">
                      Similar Questions
                    </div>
                    <div className="space-y-2">
                      {similarQuestions.map((q) => (
                        <a
                          key={q.id}
                          href={q.url}
                          className="block rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="font-medium text-blue-600">
                            {q.title}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                onClick={handlePrevStep}
                disabled={step === 1 || isSubmitting}
                variant="secondary"
              >
                Previous
              </Button>
              {step < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="w-40" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Post Your Question"}
                </Button>
              )}
            </div>
          </form>
          <div className="mt-6 text-xs text-gray-500">
            <strong>Tips for a great question:</strong>
            <ul className="mt-1 list-disc pl-5">
              <li>Search for similar questions before posting.</li>
              <li>Be clear and concise in your title and description.</li>
              <li>Add relevant tags to help others find your question.</li>
              <li>Set a fair token reward and expiry if needed.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
