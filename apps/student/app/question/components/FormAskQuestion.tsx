"use client";

import { useState, useEffect } from "react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { toast } from "sonner";

// Mock user token balance
const MOCK_USER_TOKEN_BALANCE = 200;

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

interface AskQuestionFormProps {
  onClose?: () => void;
  onSubmit?: (data: {
    title: string;
    description: string;
    tags: string[];
    tokens: number;
    tokenExpiry: string | null;
    code?: string;
    files: File[];
    videos: File[];
  }) => void;
}

export default function FormAskQuestion({ onClose, onSubmit }: AskQuestionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tokens, setTokens] = useState(0);
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [similarQuestions, setSimilarQuestions] = useState<typeof MOCK_QUESTIONS>([]);
  const [step, setStep] = useState(1);

  // Step-by-step guidance
  const steps = [
    "Enter a clear and concise title for your question.",
    "Describe your question in detail. Include what you have tried.",
    "Add relevant tags to help others find your question.",
    "Set a token reward and (optionally) an expiry date.",
    "Attach code, files, or videos if needed.",
    "Review similar questions to avoid duplicates.",
    "Submit your question.",
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

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos(Array.from(e.target.files));
    }
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
    if (step === 4 && tokens > MOCK_USER_TOKEN_BALANCE) {
      toast.warning("You do not have enough tokens.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokens > MOCK_USER_TOKEN_BALANCE) {
      toast.warning("You do not have enough tokens.");
      return;
    }
    if (onSubmit) {
      onSubmit({ title, description, tags, tokens, tokenExpiry, code, files, videos });
    }
    toast.success("Question submitted!");
    setTitle("");
    setDescription("");
    setTags([]);
    setTokens(0);
    setTokenExpiry(null);
    setCode("");
    setFiles([]);
    setVideos([]);
    setStep(1);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl">
        <Card className="p-6">
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
              <div className="mb-4">
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
                <label className="block font-semibold mb-1">Description</label>
                <Textarea
                  className="w-full"
                  placeholder="Describe your question in detail. What did you try? What did you expect?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={20}
                  required
                />
              </div>
            )}
            {step === 3 && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Token Reward</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Number of tokens to reward"
                  value={tokens}
                  min={0}
                  max={MOCK_USER_TOKEN_BALANCE}
                  onChange={(e) => setTokens(Number(e.target.value))}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  Your balance: {MOCK_USER_TOKEN_BALANCE} tokens
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
            {step === 5 && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Code (optional)</label>
                <Textarea
                  className="w-full font-mono"
                  placeholder="Paste your code here (optional)..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={6}
                />
                <div className="mt-4">
                  <label className="block font-semibold mb-1">Attach Files (optional)</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full"
                  />
                  {files.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {files.length} file(s) selected
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block font-semibold mb-1">Attach Videos (optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoChange}
                    className="block w-full"
                  />
                  {videos.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {videos.length} video(s) selected
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 6 && (
              <div className="mb-4">
                <div className="font-semibold mb-2">Review similar questions before posting:</div>
                {similarQuestions.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {similarQuestions.map((q) => (
                      <li key={q.id}>
                        <a href={q.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                          {q.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">No similar questions found.</div>
                )}
              </div>
            )}
            {step === 7 && (
              <div className="mb-4 text-green-700 bg-green-50 rounded p-3">
                <strong>All set!</strong> Please review your question and submit.
              </div>
            )}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={handlePrevStep}
                disabled={step === 1}
                variant="secondary"
              >
                Previous
              </Button>
              {step < steps.length ? (
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="w-40">
                  Post Your Question
                </Button>
              )}
            </div>
          </form>
          <div className="mt-6 text-xs text-gray-500">
            <strong>Tips for a great question:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Search for similar questions before posting.</li>
              <li>Be clear and concise in your title and description.</li>
              <li>Include code, screenshots, or videos if relevant.</li>
              <li>Add relevant tags to help others find your question.</li>
              <li>Set a fair token reward and expiry if needed.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}