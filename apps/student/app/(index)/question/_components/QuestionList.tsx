"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

interface LocalQuestion {
  id: string;
  title: string;
  description: string;
  tokens: number;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  createdAt: string;
  status: string;
  votes: number;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useActiveAccount();
  const address = account?.address;

  useEffect(() => {
    // Load questions from localStorage
    const loadQuestions = () => {
      const storedQuestions = JSON.parse(
        localStorage.getItem("questions") || "[]",
      );
      setQuestions(
        storedQuestions.sort(
          (a: LocalQuestion, b: LocalQuestion) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      setLoading(false);
    };

    loadQuestions();
    // Listen for changes in localStorage
    window.addEventListener("storage", loadQuestions);
    return () => window.removeEventListener("storage", loadQuestions);
  }, []);

  const handleVote = (questionId: string, type: "up" | "down") => {
    if (!address) {
      toast.error("Please connect your wallet to vote");
      return;
    }

    try {
      // Get user's vote history from localStorage
      const userVotes = JSON.parse(
        localStorage.getItem(`user_votes_${address}`) || "{}",
      );

      // Check if user has already voted on this question
      if (userVotes[questionId]) {
        toast.error("You have already voted on this question");
        return;
      }

      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          // Try to get current votes from API first
          const currentVotes = q.votes || 0;
          const newVotes = currentVotes + (type === "up" ? 1 : -1);

          // Check if votes go below -5
          if (newVotes <= -5) {
            toast.error(
              "This question has received too many downvotes. Please review and remove it.",
            );
            // Notify question owner
            if (q.author.walletAddress === address) {
              toast.warning(
                "Your question has received too many downvotes. Please review and remove it.",
              );
            }
          }

          return { ...q, votes: newVotes };
        }
        return q;
      });

      // Save user's vote
      userVotes[questionId] = type;
      localStorage.setItem(`user_votes_${address}`, JSON.stringify(userVotes));

      // Update questions
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));

      toast.success(
        `Successfully ${type === "up" ? "upvoted" : "downvoted"} the question`,
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (!address) {
      toast.error("Please connect your wallet to remove questions");
      return;
    }

    try {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      // Only allow removal if user is the author or votes are too low
      if (question.author.walletAddress !== address && question.votes > -5) {
        toast.error(
          "You can only remove your own questions or questions with too many downvotes",
        );
        return;
      }

      // Remove question from localStorage
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));

      // Remove votes for this question from all users
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (key.startsWith("user_votes_")) {
          const userVotes = JSON.parse(localStorage.getItem(key) || "{}");
          if (userVotes[questionId]) {
            delete userVotes[questionId];
            localStorage.setItem(key, JSON.stringify(userVotes));
          }
        }
      });

      toast.success("Question removed successfully");
    } catch (error) {
      console.error("Error removing question:", error);
      toast.error("Failed to remove question. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No questions yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Be the first to ask a question!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative flex cursor-pointer flex-row items-stretch rounded-lg border border-gray-200 bg-white px-0 py-0 shadow transition-shadow hover:shadow-lg">
            <div className="flex min-w-[110px] flex-col items-center justify-center border-r border-gray-100 bg-white px-4 py-4">
              <div className="mb-4 flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="mb-2 p-0"
                  style={{ width: 40, height: 40 }}
                  onClick={() => handleVote(question.id, "up")}
                  aria-label="Upvote"
                >
                  <span className="flex items-center justify-center font-bold text-blue-600">
                    <ThumbsUp size={40} />
                  </span>
                </Button>
                <span
                  className={`mb-2 text-xl font-bold ${question.votes < 0 ? "text-red-500" : ""}`}
                >
                  {question.votes}
                </span>
                <Button
                  variant="ghost"
                  className="p-0"
                  style={{ width: 40, height: 40 }}
                  onClick={() => handleVote(question.id, "down")}
                  aria-label="Downvote"
                >
                  <span className="flex items-center justify-center font-bold text-gray-400">
                    <ThumbsDown size={32} />
                  </span>
                </Button>
              </div>
              <div className="mb-2 flex w-full items-center justify-center gap-1 rounded border border-green-400 p-2 text-center text-xs text-green-600">
                <MessageSquare size={16} className="mr-1" />0 answers
              </div>
              <div className="flex w-full items-center justify-center gap-1 text-center text-xs text-gray-500">
                <Eye size={16} className="mr-1" />0 views
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between px-6 py-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between">
                  <Link
                    href={`/question/${question.id}`}
                    className="text-base font-semibold text-blue-700 hover:underline"
                  >
                    {question.title}
                  </Link>
                  {(question.author.walletAddress === address ||
                    question.votes <= -5) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div
                  className="mt-1 line-clamp-2 text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={question.author.avatar}
                    alt={question.author.name}
                    className="h-6 w-6 rounded-full border border-gray-200"
                  />
                  <span className="text-xs text-gray-700">
                    {question.author.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(question.createdAt).toLocaleString()}
                  </span>
                  <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {question.tokens} tokens
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
