"use client";

import { useState, useEffect } from "react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Input } from "@workspace/ui/components/input";
import { toast } from "sonner";
import {
  AccountBalance,
  AccountProvider,
  Blobbie,
  useActiveAccount,
} from "thirdweb/react";
import { FORMA_SKETCHPAD, thirdwebClient } from "@/lib/thirdweb";
import Loading from "@workspace/ui/components/loading";
import { motion } from "motion/react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';

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
  "KhoaHọcMáyTính"
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

export default function FormAskQuestion({ onClose, onSubmit }: AskQuestionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tokens, setTokens] = useState(0);
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);
  const [similarQuestions, setSimilarQuestions] = useState<typeof MOCK_QUESTIONS>([]);
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
      const balanceElement = document.getElementById('user-token-balance');
      if (balanceElement) {
        const balance = parseInt(balanceElement.textContent || '0');
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
        MOCK_QUESTIONS.filter((q) => q.title.toLowerCase().includes(lower))
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
    normalizeString(tag).includes(normalizeString(tagInput))
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
          avatar: "https://via.placeholder.com/40"
        },
        tags,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Store in localStorage for now
      const existingQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      localStorage.setItem('questions', JSON.stringify([...existingQuestions, questionData]));

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
      console.error('Error submitting question:', error);
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
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-2xl"
            aria-label="Close"
            type="button"
          >
            ×
          </button>
          <h2 className="mb-2 text-2xl font-bold">Ask a public question</h2>
          <div className="mb-4 text-sm text-blue-700 bg-blue-50 rounded p-3">
            <strong>Step {step} of {steps.length}:</strong> {steps[step - 1]}
          </div>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="mb-4 space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. How to manage state in React?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <div className="border rounded">
                    <Editor
                      apiKey="dy7n25j6dc5ptz1vvsl9nmxdzobyxut20g2e2debmf99cuvk" // Bạn cần đăng ký key tại https://www.tiny.cloud/
                      value={description}
                      onEditorChange={(content) => setDescription(content)}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                          'bold italic forecolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
                        placeholder: "Describe your question in detail. What did you try? What did you expect?",
                        language: 'vi',
                        language_url: '/langs/vi.js',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Tags</label>
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
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-10">
                          {filteredTags.length > 0 ? (
                            filteredTags.map((tag) => (
                              <button
                                key={tag}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                                onClick={() => handleAddTag(tag)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    tags.includes(tag) ? "text-blue-500" : "text-transparent"
                                  }`}
                                />
                                {tag}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">No tags found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Tags */}
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">Selected Tags:</div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              className="ml-2 text-blue-500 hover:text-blue-700"
                              onClick={() => setTags(tags.filter(t => t !== tag))}
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
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {open ? "Hide available tags" : "Show available tags"}
                        <ChevronsUpDown className="ml-1 h-4 w-4" />
                      </button>
                      
                      {open && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border max-h-60 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handleAddTag(tag)}
                                className={`px-2 py-1 rounded text-sm ${
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
                  <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                    <div className="font-semibold mb-1 text-yellow-700">Similar questions:</div>
                    <ul className="list-disc pl-5 text-sm">
                      {similarQuestions.map((q) => (
                        <li key={q.id}>
                          <a href={q.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
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
                <label className="block font-semibold mb-1">Token Reward</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Number of tokens to reward"
                  value={tokens}
                  min={0}
                  max={userBalance}
                  onChange={(e) => setTokens(Number(e.target.value))}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  Your balance: {userBalance} tokens
                </div>
                <div className="mt-2">
                  <label className="block font-semibold mb-1">Token Expiry (optional)</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2"
                    value={tokenExpiry ?? ""}
                    onChange={(e) => setTokenExpiry(e.target.value || null)}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Leave blank for no expiry.
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="mb-4">
                <div className="font-semibold mb-4 text-lg text-gray-800">Review Your Question</div>
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <img 
                          src="https://via.placeholder.com/40" 
                          alt="Author" 
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        Anonymous
                      </span>
                      <span className="mx-2">•</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
                  </div>

                  {/* Tags */}
                  <div className="px-4 py-3 bg-gray-50 border-t">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="px-4 py-3 bg-gray-50 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">Token Reward:</span>
                        <span className="ml-2 text-blue-600 font-bold">{tokens} tokens</span>
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
                    <div className="font-semibold mb-2 text-gray-800">Similar Questions</div>
                    <div className="space-y-2">
                      {similarQuestions.map((q) => (
                        <a 
                          key={q.id}
                          href={q.url}
                          className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="text-blue-600 font-medium">{q.title}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between mt-6">
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
                <Button 
                  type="submit" 
                  className="w-40"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Post Your Question"}
                </Button>
              )}
            </div>
          </form>
          <div className="mt-6 text-xs text-gray-500">
            <strong>Tips for a great question:</strong>
            <ul className="list-disc pl-5 mt-1">
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