"use client";

import { baseUrl } from "@/lib/client";
import { useUserStore } from "@/store";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Award,
  Ban,
  Bookmark,
  Coins,
  Eye,
  Handshake,
  HelpCircle,
  Info,
  MessageCircle,
  Star,
  ThumbsDownIcon,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import FormAskQuestion from "./components/FormAskQuestion";
import QuestionList from "./components/QuestionList";
import UserStats from "./components/UserStats";

interface Question {
  _id: string;
  title: string;
  description: string;
  tokens: number;
  tags: string[];
  votes: number;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  views: number;
  answers: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Mock data for fallback
const mockQuestions: Question[] = [
  {
    _id: "1",
    title: "Best practices for state management in complex React applications?",
    description:
      "I'm working on a large-scale React application with complex state. What are the recommended approaches for state management?",
    tokens: 100,
    tags: ["react", "state-management", "redux", "context-api"],
    votes: 12,
    author: {
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      name: "Bob Smith",
      avatar:
        "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    },
    answers: [],
    views: 34,
    createdAt: "2024-06-10T09:30:00Z",
    updatedAt: "2024-06-10T09:30:00Z",
    __v: 0,
  },
];

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const user = useUserStore((state) => state.user);
  const account = useActiveAccount();

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${baseUrl}/questions`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);
      setUseMockData(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Using mock data due to API error");
      setQuestions(mockQuestions);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Voting handler
  const handleVote = async (id: string, type: "up" | "down") => {
    if (useMockData) {
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === id
            ? { ...q, votes: q.votes + (type === "up" ? 1 : -1) }
            : q,
        ),
      );
      toast.success("Vote recorded (mock)");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/questions/${id}/vote?type=${type}`,
        {
          method: "PATCH",
        },
      );
      if (!response.ok) throw new Error("Failed to vote");
      const updatedQuestion = await response.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? updatedQuestion : q)),
      );
      toast.success("Vote recorded successfully");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to record vote");
    }
  };

  // Add new question
  const handleAddQuestion = async (data: any) => {
    if (useMockData) {
      const newQuestion: Question = {
        _id: (questions.length + 1).toString(),
        title: data.title,
        description: data.description,
        tokens: data.tokens,
        tags: data.tags,
        votes: 0,
        author: {
          walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          name: "You",
          avatar: "/avatars/default.png",
        },
        answers: [],
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };
      setQuestions((prev) => [newQuestion, ...prev]);
      setShowForm(false);
      toast.success("Your question has been posted! (mock)");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          tokens: data.tokens,
          tags: data.tags,
          author: {
            walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            name: "You",
            avatar: "/avatars/default.png",
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create question");
      const newQuestion = await response.json();
      setQuestions((prev) => [newQuestion, ...prev]);
      setShowForm(false);
      toast.success("Your question has been posted!");
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Failed to post question");
    }
  };

  // Save/Unsave handler
  const [savedQuestions, setSavedQuestions] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("savedQuestions") || "[]");
    }
    return [];
  });

  const handleSaveQuestion = (id: string) => {
    setSavedQuestions((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((qid) => qid !== id);
        toast.success("Removed from saved questions!");
      } else {
        updated = [...prev, id];
        toast.success("Question saved!");
      }
      localStorage.setItem("savedQuestions", JSON.stringify(updated));
      return updated;
    });
  };

  // Sort questions by tokens descending
  const sortedQuestions = [...questions].sort((a, b) => b.tokens - a.tokens);
  const maxToken = sortedQuestions?.[0]?.tokens ?? 0;

  // Calculate stats
  const questionsAsked = questions.length;
  const answersGiven = questions.reduce((sum, q) => sum + q.answers.length, 0);
  const contributions = questionsAsked + answersGiven;
  const tokensEarned = 5;
  const badgeLevel =
    tokensEarned > 1000
      ? "Platinum"
      : tokensEarned > 500
        ? "Gold"
        : tokensEarned > 100
          ? "Silver"
          : "Bronze";

  // Get saved question objects
  const savedQuestionObjects = questions.filter((q) =>
    savedQuestions.includes(q._id),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-svh flex-col p-4">
      <div className="flex font-bold">
        <span className="mr-2 font-bold text-blue-200">
          <Handshake />
        </span>
        Welcome Back, {user?.username || account?.address}!
      </div>
      <UserStats
        questionsAsked={questionsAsked}
        answersGiven={answersGiven}
        tokensEarned={tokensEarned}
        badgeLevel={badgeLevel}
        savedQuestions={savedQuestionObjects}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Token Q&A Arena - Community Edition
          </h1>
          <p className="text-gray-600">
            Ask questions, earn tokens for the best answers
          </p>
          {useMockData && (
            <p className="mt-1 text-sm text-yellow-600">
              Using mock data (API unavailable)
            </p>
          )}
        </div>
        <Button
          size="lg"
          onClick={() => setShowForm(true)}
          className="border border-blue-500 bg-white font-semibold text-blue-500 hover:bg-blue-200"
        >
          Ask Question
        </Button>
      </div>

      {showForm && (
        <FormAskQuestion
          onClose={() => setShowForm(false)}
          onSubmit={handleAddQuestion}
        />
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="space-y-4 md:col-span-9">
          {sortedQuestions.map((question) => (
            <Card
              key={question._id}
              className="relative flex cursor-pointer flex-row items-stretch rounded-lg border border-gray-200 bg-white px-0 py-0 shadow transition-shadow hover:shadow-lg"
            >
              <button
                className="absolute right-3 top-3 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveQuestion(question._id);
                }}
                aria-label={
                  savedQuestions.includes(question._id) ? "Unsave" : "Save"
                }
              >
                <Bookmark
                  size={24}
                  className={
                    savedQuestions.includes(question._id)
                      ? "fill-blue-200 text-blue-500"
                      : "text-gray-400"
                  }
                  fill={
                    savedQuestions.includes(question._id) ? "#bfdbfe" : "none"
                  }
                />
              </button>

              <div className="flex min-w-[110px] flex-col items-center justify-center border-r border-gray-100 bg-white px-4 py-4">
                <div className="mb-4 flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="mb-2 p-0"
                    style={{ width: 40, height: 40 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(question._id, "up");
                    }}
                    aria-label="Upvote"
                  >
                    <span className="flex items-center justify-center font-bold text-blue-600">
                      <ThumbsUp size={40} />
                    </span>
                  </Button>
                  <span className="mb-2 text-xl font-bold">
                    {question.votes}
                  </span>
                  <Button
                    variant="ghost"
                    className="p-0"
                    style={{ width: 40, height: 40 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(question._id, "down");
                    }}
                    aria-label="Downvote"
                  >
                    <span className="flex items-center justify-center font-bold text-gray-400">
                      <ThumbsDownIcon size={32} />
                    </span>
                  </Button>
                </div>
                <div className="mb-2 flex w-full items-center justify-center gap-1 rounded border border-green-400 p-2 text-center text-xs text-green-600">
                  <MessageCircle size={16} className="mr-1" />
                  {question.answers.length} answers
                </div>
                <div className="flex w-full items-center justify-center gap-1 text-center text-xs text-gray-500">
                  <Eye size={16} className="mr-1" />
                  {question.views} views
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between px-6 py-4">
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/question/${question._id}`}
                    className="text-base font-semibold text-blue-700 hover:underline"
                  >
                    {question.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    {question.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                      >
                        <Star size={12} className="text-yellow-400" />
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
                    <span
                      className={`ml-2 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${question.tokens === maxToken ? "border border-orange-300 bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"} `}
                    >
                      <Coins size={16} className="mr-1" />
                      {question.tokens} tokens
                      {question.tokens === maxToken && (
                        <span
                          role="img"
                          aria-label="hot"
                          className="ml-1 text-orange-500"
                        >
                          🔥
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="mt-8">
            {/* <h2 className="text-xl font-bold mb-4">Your Local Questions</h2> */}
            <QuestionList />
          </div>
        </div>

        <div className="w-full flex-shrink-0 md:col-span-3">
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              Rewards Tokens:
            </h2>
            <ul className="mb-4 list-none space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Coins size={18} className="mt-0.5 text-orange-500" />
                <span>
                  <span className="font-medium">Token rewards</span> are set by
                  the asker and given to the best answer.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Award size={18} className="mt-0.5 text-yellow-500" />
                <span>
                  <span className="font-medium">
                    You can only claim tokens if your answer is accepted.
                  </span>
                </span>
              </li>
            </ul>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              Community Guidelines:
            </h2>
            <ul className="mb-4 list-none space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <HelpCircle size={18} className="mt-0.5 text-blue-400" />
                <span>
                  <span className="font-medium">
                    Questions must be clear and specific.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle size={18} className="mt-0.5 text-green-500" />
                <span>
                  <span className="font-medium">
                    Answers should be helpful and relevant.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Ban size={18} className="mt-0.5 text-red-400" />
                <span>
                  <span className="font-medium">
                    No spam, off-topic, or inappropriate content.
                  </span>
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Info size={14} className="text-blue-400" />
              <span className="font-semibold">Note:</span> Breaking the rules
              may result in penalties or loss of tokens.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
