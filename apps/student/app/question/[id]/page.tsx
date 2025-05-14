"use client";

import { useParams } from "next/navigation";
// import { Avatar } from "@workspace/ui/components/avatar";
// import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/use-wallet";

interface Question {
  id: string;
  title: string;
  content: string;
  tokens: number;
  tags: string[];
  votes: number;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  content: string;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  votes: number;
  isAccepted: boolean;
  createdAt: string;
}

const MOCK_QUESTION: Question = {
  id: "1",
  title: "Best practices for state management in complex React applications?",
  content: "I'm working on a large-scale React application with complex state. What are the recommended approaches for state management?",
  tokens: 100,
  tags: ["react", "state-management", "redux", "context-api"],
  votes: 12,
  author: {
    walletAddress: "0x1234",
    name: "Bob Smith",
    avatar: "/avatars/default.png"
  },
  createdAt: "2024-06-01T10:00:00Z",
  answers: [
    {
      id: "a1",
      content: "For complex React apps, consider using Redux or Zustand for state management. Context API is good for small to medium apps.",
      author: {
        walletAddress: "0x5678",
        name: "Alice Johnson",
        avatar: "/avatars/default.png"
      },
      votes: 5,
      isAccepted: false,
      createdAt: "2024-06-01T12:00:00Z"
    }
  ]
};

const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { address } = useWallet();
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setIsLoading(true);
    setTimeout(() => {
      setQuestion(MOCK_QUESTION);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const fetchQuestionDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/questions/${id}`);
      if (!response.ok) throw new Error("Failed to fetch question");
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      toast.error("Failed to fetch question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    console.log(address);
    if (!address) {
      toast.warning("Please connect your wallet first");
      return;
    }

    try {
      const response = await fetch("/api/vote/addVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          voteType: type,
          hash: id,
        }),
      });

      if (!response.ok) throw new Error("Vote failed");
      await fetchQuestionDetails();
    } catch (error) {
      toast.error("Vote failed");
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.warning("Please connect your wallet first");
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newAnswer,
          walletAddress: address,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit answer");
      setNewAnswer("");
      await fetchQuestionDetails();
      toast.success("Answer submitted successfully");
    } catch (error) {
      toast.error("Failed to submit answer");
    }
  };

  if (isLoading) {
    return <div className="container max-w-4xl py-8">Loading...</div>;
  }

  if (!question) {
    return <div className="container max-w-4xl py-8">Question not found</div>;
  }

  return (
    <div className="container mx-auto flex min-h-svh flex-col p-4">
      <Card className="mb-8 p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => handleVote("upvote")}
              className="px-3"
            >
              <span className="text-xl">↑</span>
            </Button>
            <span className="font-semibold">{question.votes}</span>
            <Button
              variant="ghost"
              onClick={() => handleVote("downvote")}
              className="px-3"
            >
              <span className="text-xl">↓</span>
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold">{question.title}</h1>
              <div className="focus:ring-ring bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-2.5 py-0.5 text-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
                {question.tokens} tokens
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-gray-700">
              {question.content}
            </p>

            <div className="mt-4 flex gap-2">
              {question.tags.map((tag) => (
                <div
                  key={tag}
                  className="focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {tag}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={question.author.avatar}
                    alt={question.author.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    {question.author.name}
                  </span>
                </div>

              </div>
              <span className="text-sm text-gray-600">
                Asked on {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          {question.answers.length} Answers
        </h2>

        {question.answers.map((answer) => (
          <Card key={answer.id} className="mb-4 p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <Button variant="ghost" className="px-3">
                  <span className="text-xl">↑</span>
                </Button>
                <span className="font-semibold">{answer.votes}</span>
                <Button variant="ghost" className="px-3">
                  <span className="text-xl">↓</span>
                </Button>
              </div>

              <div className="flex-1">
                <p className="whitespace-pre-wrap text-gray-700">
                  {answer.content}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={answer.author.avatar}
                      alt={answer.author.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      {answer.author.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {answer.isAccepted && (
                      <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">Accepted Answer</div>
                    )}
                    <span className="text-sm text-gray-600">
                      Answered on{" "}
                      {new Date(answer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Answer</h2>
        <form onSubmit={handleSubmitAnswer}>
          <Textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="mb-4 min-h-[200px]"
          />
          <Button type="submit">Post Your Answer</Button>
        </form>
      </Card>
    </div>
  );
};

export default QuestionDetailPage;
